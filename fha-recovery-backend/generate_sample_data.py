#!/usr/bin/env python3
"""
Script to generate 60 days of realistic daily tracking data for stevenwang770@gmail.com
This creates realistic patterns for BBT, HRV, calories, and menstrual cycle tracking.
"""

import sqlite3
import random
import math
from datetime import datetime, date, timedelta
from pathlib import Path

def generate_realistic_data():
    """Generate 60 days of realistic daily tracking data"""
    
    # Database path
    db_path = Path(__file__).parent / "fha_recovery.db"
    
    if not db_path.exists():
        print(f"Database not found at {db_path}")
        return
    
    print(f"Generating sample data for database at {db_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        user_id = "stevenwang770@gmail.com"
        start_date = datetime.now() - timedelta(days=59)  # 60 days including today
        
        # Menstrual cycle parameters (28-day cycle)
        cycle_start_day = 15  # Day 15 of our 60-day period had period start
        cycle_length = 28
        
        print(f"Generating data for user: {user_id}")
        print(f"Date range: {start_date.date()} to {datetime.now().date()}")
        
        for day_offset in range(60):
            current_date = start_date + timedelta(days=day_offset)
            tracking_date = current_date.date()
            
            # Generate realistic BBT for FHA user
            # FHA users typically have lower, more erratic temperatures due to hormonal disruption
            base_temp = 97.2  # Lower baseline for FHA
            # More erratic patterns, less cyclical variation
            temp_variation = random.uniform(-0.4, 0.3)
            daily_variation = random.uniform(-0.2, 0.2)
            body_temperature = round(base_temp + temp_variation + daily_variation, 1)
            
            # Generate realistic HRV for FHA user
            # FHA users often have lower HRV due to stress and hormonal disruption
            base_hrv = 35  # Lower baseline for FHA
            daily_hrv_variation = random.uniform(-12, 15)
            heart_rate_variability = max(15, min(80, 
                round(base_hrv + daily_hrv_variation, 1)))
            
            # Generate realistic calorie deficit for FHA recovery
            # Target around 400 calorie deficit for gradual recovery
            base_deficit = 400  # Target deficit for FHA recovery
            deficit_variation = random.uniform(-200, 200)  # Variation around target
            calorie_deficit = int(base_deficit + deficit_variation)
            
            # Generate occasional notes for FHA recovery (25% chance)
            daily_notes = None
            if random.random() < 0.25:
                notes_options = [
                    "Focusing on rest and recovery",
                    "Eating more to support metabolism",
                    "Feeling less anxious about food",
                    "Energy levels improving slowly",
                    "Prioritizing sleep quality",
                    "Gentle movement today",
                    "Practicing self-compassion",
                    "Temperature felt warmer today",
                    "Appetite returning gradually",
                    "Stress levels manageable"
                ]
                daily_notes = random.choice(notes_options)
            
            # Insert or update the daily tracking entry (no menstrual data for FHA)
            cursor.execute("""
                INSERT OR REPLACE INTO daily_tracking (
                    user_id, tracking_date, body_temperature, heart_rate_variability,
                    calorie_deficit, daily_notes, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                tracking_date,
                body_temperature,
                heart_rate_variability,
                calorie_deficit,
                daily_notes,
                current_date.isoformat(),
                current_date.isoformat()
            ))
            
            # Print progress every 10 days
            if (day_offset + 1) % 10 == 0:
                print(f"Generated {day_offset + 1}/60 days of data...")
        
        # Commit all changes
        conn.commit()
        
        # Verify data was inserted
        cursor.execute("""
            SELECT COUNT(*) FROM daily_tracking 
            WHERE user_id = ? AND tracking_date >= ?
        """, (user_id, (datetime.now() - timedelta(days=59)).date()))
        
        count = cursor.fetchone()[0]
        print(f"\n✅ Successfully generated {count} days of realistic tracking data!")
        
        # Show sample of generated data
        cursor.execute("""
            SELECT tracking_date, body_temperature, heart_rate_variability, 
                   calorie_deficit, daily_notes
            FROM daily_tracking 
            WHERE user_id = ? 
            ORDER BY tracking_date DESC 
            LIMIT 5
        """, (user_id,))
        
        print("\n📊 Sample of recent data:")
        print("Date       | Temp  | HRV  | Deficit | Notes")
        print("-" * 65)
        
        for row in cursor.fetchall():
            date_str, temp, hrv, deficit, notes = row
            temp = temp or 0.0
            hrv = hrv or 0.0
            deficit = deficit or 0
            notes_str = (notes[:20] + "...") if notes and len(notes) > 20 else (notes or "")
            print(f"{date_str} | {temp:4.1f}°F | {hrv:4.1f}ms | {deficit:4d} | {notes_str}")
        
    except Exception as e:
        print(f"❌ Error generating data: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    generate_realistic_data()
