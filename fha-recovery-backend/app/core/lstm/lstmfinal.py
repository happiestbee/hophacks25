import numpy as np
import tensorflow as tf

loaded_model = tf.keras.models.load_model('lstmfinal.keras')
stats = np.load('lstmfinalnorm.npz')
mean = stats['mean']
std = stats['std']

def predict_fha_recovery(patient_sequence, model, norm_mean, norm_std):
    """
    Args:
        patient_sequence (np.array): A NumPy array of shape (180, 3) for one patient.
        model: The loaded Keras model.
        norm_mean (np.array): The mean vector from the training data.
        norm_std (np.array): The standard deviation vector from the training data.
    """
    # Step A: Normalize the data using the *original* training stats
    patient_norm = (patient_sequence - norm_mean) / norm_std
    
    # Step B: Reshape the data to include a batch dimension (1, 60, 3)
    patient_reshaped = np.expand_dims(patient_norm, axis=0)
    
    # Step C: Make the prediction
    probability = model.predict(patient_reshaped)[0][0]
    
    return probability

seq = input("Input patience sequence data in the shape (60, 3), where the 3 variables are calorie deficit, hrv, and bbt, respectively.")
print(predict_fha_recovery(seq, model, mean, std))
