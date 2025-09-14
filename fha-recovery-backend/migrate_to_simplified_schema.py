#!/usr/bin/env python3
"""
Migration script to update daily_tracking table to simplified schema.
This script will drop old columns and keep only the simplified BBT tracking fields.
"""

import sqlite3
import os
from pathlib import Path

def migrate_database():
    """Migrate the database to the simplified schema"""
    
    # Database path
    db_path = Path(__file__).parent / "fha_recovery.db"
    
    if not db_path.exists():
        print(f"Database not found at {db_path}")
        return
    
    print(f"Migrating database at {db_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if table exists and get current columns
        cursor.execute("PRAGMA table_info(daily_tracking)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        print(f"Current columns: {column_names}")
        
        # Define the columns we want to keep (simplified schema)
        keep_columns = [
            'id', 'user_id', 'tracking_date', 
            'body_temperature', 'heart_rate_variability', 'calories_expended',
            'menstrual_flow', 'cycle_day', 'daily_notes',
            'created_at', 'updated_at'
        ]
        
        # Create new table with simplified schema
        cursor.execute("""
            CREATE TABLE daily_tracking_new (
                id INTEGER PRIMARY KEY,
                user_id VARCHAR NOT NULL,
                tracking_date DATE NOT NULL,
                body_temperature FLOAT,
                heart_rate_variability FLOAT,
                calories_expended INTEGER,
                menstrual_flow VARCHAR,
                cycle_day INTEGER,
                daily_notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME
            )
        """)
        
        # Copy data from old table to new table (only the columns that exist in both)
        existing_keep_columns = [col for col in keep_columns if col in column_names]
        columns_str = ', '.join(existing_keep_columns)
        
        if existing_keep_columns:
            cursor.execute(f"""
                INSERT INTO daily_tracking_new ({columns_str})
                SELECT {columns_str} FROM daily_tracking
            """)
            print(f"Copied data for columns: {existing_keep_columns}")
        
        # Drop old table and rename new table
        cursor.execute("DROP TABLE daily_tracking")
        cursor.execute("ALTER TABLE daily_tracking_new RENAME TO daily_tracking")
        
        # Create indexes
        cursor.execute("CREATE INDEX ix_daily_tracking_user_id ON daily_tracking (user_id)")
        cursor.execute("CREATE INDEX ix_daily_tracking_tracking_date ON daily_tracking (tracking_date)")
        cursor.execute("CREATE INDEX ix_daily_tracking_id ON daily_tracking (id)")
        
        # Commit changes
        conn.commit()
        print("✅ Database migration completed successfully!")
        
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
    migrate_database()
