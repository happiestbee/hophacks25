#!/usr/bin/env python3
"""
Migration script to update health_profiles table schema.
Changes last_menstrual_period (text) to days_since_last_period (integer).
"""

import sqlite3
import os
from pathlib import Path

def migrate_health_profiles():
    """Migrate the health_profiles table to use days_since_last_period"""
    
    # Database path
    db_path = Path(__file__).parent / "fha_recovery.db"
    
    if not db_path.exists():
        print(f"Database not found at {db_path}")
        return
    
    print(f"Migrating health_profiles table at {db_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if table exists and get current columns
        cursor.execute("PRAGMA table_info(health_profiles)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        print(f"Current columns: {column_names}")
        
        # Create new table with updated schema
        cursor.execute("""
            CREATE TABLE health_profiles_new (
                id INTEGER PRIMARY KEY,
                user_id VARCHAR UNIQUE NOT NULL,
                days_since_last_period INTEGER,
                allergies TEXT,
                dietary_restrictions TEXT,
                current_medications TEXT,
                current_supplements TEXT,
                primary_wellness_goal TEXT,
                survey_completed BOOLEAN DEFAULT 0 NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME
            )
        """)
        
        # Copy data from old table to new table
        # Note: We'll set days_since_last_period to NULL for existing records
        # since we can't reliably convert text dates to days
        if 'health_profiles' in [name for name in cursor.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]:
            cursor.execute("""
                INSERT INTO health_profiles_new (
                    id, user_id, days_since_last_period, allergies, dietary_restrictions,
                    current_medications, current_supplements, primary_wellness_goal,
                    survey_completed, created_at, updated_at
                )
                SELECT 
                    id, user_id, NULL as days_since_last_period, allergies, dietary_restrictions,
                    current_medications, current_supplements, primary_wellness_goal,
                    survey_completed, created_at, updated_at
                FROM health_profiles
            """)
            print("Copied existing data (last_menstrual_period converted to NULL)")
        
        # Drop old table and rename new table
        cursor.execute("DROP TABLE IF EXISTS health_profiles")
        cursor.execute("ALTER TABLE health_profiles_new RENAME TO health_profiles")
        
        # Create indexes
        cursor.execute("CREATE UNIQUE INDEX ix_health_profiles_user_id ON health_profiles (user_id)")
        cursor.execute("CREATE INDEX ix_health_profiles_id ON health_profiles (id)")
        
        # Commit changes
        conn.commit()
        print("✅ Health profiles migration completed successfully!")
        
        # Show final table structure
        cursor.execute("PRAGMA table_info(health_profiles)")
        new_columns = cursor.fetchall()
        print(f"New columns: {[col[1] for col in new_columns]}")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_health_profiles()
