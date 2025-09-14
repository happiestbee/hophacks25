#!/usr/bin/env python3
"""
Migration script to update daily_tracking table schema.
Replace calories_expended with calorie_deficit column.
"""

import sqlite3
import os
from pathlib import Path

def migrate_to_calorie_deficit():
    """Migrate the daily_tracking table to use calorie_deficit instead of calories_expended"""
    
    # Database path
    db_path = Path(__file__).parent / "fha_recovery.db"
    
    if not db_path.exists():
        print(f"Database not found at {db_path}")
        return
    
    print(f"Migrating daily_tracking table at {db_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if table exists and get current columns
        cursor.execute("PRAGMA table_info(daily_tracking)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        print(f"Current columns: {column_names}")
        
        # Create new table with calorie_deficit instead of calories_expended
        cursor.execute("""
            CREATE TABLE daily_tracking_new (
                id INTEGER PRIMARY KEY,
                user_id VARCHAR NOT NULL,
                tracking_date DATE NOT NULL,
                body_temperature FLOAT,
                heart_rate_variability FLOAT,
                calorie_deficit INTEGER,
                daily_notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME
            )
        """)
        
        # Copy data from old table to new table (excluding calories_expended)
        if 'daily_tracking' in [name[0] for name in cursor.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]:
            cursor.execute("""
                INSERT INTO daily_tracking_new (
                    id, user_id, tracking_date, body_temperature, heart_rate_variability,
                    daily_notes, created_at, updated_at
                )
                SELECT 
                    id, user_id, tracking_date, body_temperature, heart_rate_variability,
                    daily_notes, created_at, updated_at
                FROM daily_tracking
            """)
            print("Copied existing data (calories_expended column removed)")
        
        # Drop old table and rename new table
        cursor.execute("DROP TABLE daily_tracking")
        cursor.execute("ALTER TABLE daily_tracking_new RENAME TO daily_tracking")
        
        # Create indexes
        cursor.execute("CREATE INDEX ix_daily_tracking_user_id ON daily_tracking (user_id)")
        cursor.execute("CREATE INDEX ix_daily_tracking_tracking_date ON daily_tracking (tracking_date)")
        cursor.execute("CREATE INDEX ix_daily_tracking_id ON daily_tracking (id)")
        
        # Commit changes
        conn.commit()
        print("✅ Database migration to calorie_deficit completed successfully!")
        
        # Show final table structure
        cursor.execute("PRAGMA table_info(daily_tracking)")
        new_columns = cursor.fetchall()
        print(f"New columns: {[col[1] for col in new_columns]}")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_to_calorie_deficit()
