#!/usr/bin/env python3
"""
Migration script to add total_calories field to daily_tracking table.
This field will track the total calorie intake from logged meals.
"""

import sqlite3
import os
from pathlib import Path

def migrate_add_total_calories():
    """Add total_calories field to the daily_tracking table"""
    
    # Database path
    db_path = Path(__file__).parent / "fha_recovery.db"
    
    if not db_path.exists():
        print(f"Database not found at {db_path}")
        return
    
    print(f"Adding total_calories field to daily_tracking table at {db_path}")
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if total_calories column already exists
        cursor.execute("PRAGMA table_info(daily_tracking)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        if 'total_calories' in column_names:
            print("✅ total_calories field already exists in daily_tracking table")
            return
        
        print(f"Current columns: {column_names}")
        
        # Add the total_calories column
        cursor.execute("""
            ALTER TABLE daily_tracking 
            ADD COLUMN total_calories INTEGER DEFAULT 0
        """)
        
        # Commit changes
        conn.commit()
        print("✅ Successfully added total_calories field to daily_tracking table!")
        
        # Show updated table structure
        cursor.execute("PRAGMA table_info(daily_tracking)")
        new_columns = cursor.fetchall()
        print(f"Updated columns: {[col[1] for col in new_columns]}")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_add_total_calories()
