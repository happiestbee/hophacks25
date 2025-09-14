import numpy as np
import tensorflow as tf
import os
from typing import List, Tuple
from pathlib import Path

class LSTMPredictor:
    def __init__(self):
        """Initialize the LSTM model for FHA recovery prediction"""
        self.model = None
        self.norm_mean = None
        self.norm_std = None
        self._load_model()
    
    def _load_model(self):
        """Load the LSTM model and normalization parameters"""
        try:
            # Get the path to the LSTM directory
            lstm_dir = Path(__file__).parent / "lstm"
            
            # Load the trained model
            model_path = lstm_dir / "lstmfinal.keras"
            if model_path.exists():
                self.model = tf.keras.models.load_model(str(model_path))
                print(f"✅ LSTM model loaded from {model_path}")
            else:
                print(f"❌ LSTM model file not found at {model_path}")
                return
            
            # Load normalization statistics
            stats_path = lstm_dir / "lstmfinalnorm.npz"
            if stats_path.exists():
                stats = np.load(str(stats_path))
                self.norm_mean = stats['mean']
                self.norm_std = stats['std']
                print(f"✅ LSTM normalization stats loaded from {stats_path}")
            else:
                print(f"❌ LSTM normalization stats not found at {stats_path}")
                return
                
        except Exception as e:
            print(f"❌ Error loading LSTM model: {e}")
            self.model = None
            self.norm_mean = None
            self.norm_std = None
    
    def is_available(self) -> bool:
        """Check if the LSTM model is available for predictions"""
        return self.model is not None and self.norm_mean is not None and self.norm_std is not None
    
    def predict_recovery_probability(self, sequence_data: np.ndarray) -> float:
        """
        Predict the probability of period recovery within 30 days
        
        Args:
            sequence_data (np.ndarray): Array of shape (60, 3) containing:
                - Column 0: Calorie deficit
                - Column 1: Heart rate variability (HRV)
                - Column 2: Body temperature (BBT)
        
        Returns:
            float: Probability of recovery within 30 days (0.0 to 1.0)
        """
        if not self.is_available():
            raise ValueError("LSTM model is not available")
        
        if sequence_data.shape != (60, 3):
            raise ValueError(f"Expected input shape (60, 3), got {sequence_data.shape}")
        
        try:
            # Step A: Normalize the data using training statistics
            normalized_data = (sequence_data - self.norm_mean) / self.norm_std
            
            # Step B: Add batch dimension (1, 60, 3)
            batched_data = np.expand_dims(normalized_data, axis=0)
            
            # Step C: Make prediction
            probability = self.model.predict(batched_data, verbose=0)[0][0]
            
            # Ensure probability is between 0 and 1
            probability = np.clip(probability, 0.0, 1.0)
            
            return float(probability)
            
        except Exception as e:
            raise RuntimeError(f"Error making LSTM prediction: {e}")
    
    def prepare_sequence_from_daily_data(self, daily_data: List[dict]) -> np.ndarray:
        """
        Prepare sequence data from daily tracking records
        
        Args:
            daily_data: List of daily tracking records with calorie_deficit, hrv_avg, body_temperature
            
        Returns:
            np.ndarray: Prepared sequence of shape (60, 3)
        """
        if len(daily_data) < 60:
            raise ValueError(f"Need at least 60 days of data, got {len(daily_data)}")
        
        # Take the most recent 60 days
        recent_data = daily_data[-60:]
        
        sequence = np.zeros((60, 3))
        
        for i, day in enumerate(recent_data):
            # Column 0: Calorie deficit (expenditure - intake)
            calorie_deficit = day.get('calorie_deficit', 0.0)
            
            # Column 1: HRV average
            hrv_avg = day.get('hrv_avg', 0.0)
            
            # Column 2: Body temperature (use body_temperature field from DailyTracking)
            body_temp = day.get('body_temperature') or 98.6
            
            sequence[i] = [calorie_deficit, hrv_avg, body_temp]
        
        return sequence
