from app import app, db

def reset_database():
    """
    Drops all existing database tables and recreates them based on the
    current SQLAlchemy models defined in app.py.

    WARNING: This will permanently delete ALL data in your database.
    Use with caution, primarily during development.
    """
    with app.app_context():
        print("--- Database Reset Started ---")
        print("Dropping all existing database tables...")
        db.drop_all() # THIS WILL DELETE ALL YOUR DATA!
        print("All tables dropped successfully.")
        
        print("Creating all database tables with the current schema...")
        db.create_all()
        print("All tables created successfully.")
        print("--- Database Reset Complete ---")

if __name__ == '__main__':
    #You can add a confirmation prompt here if you want to prevent accidental resets
     user_input = input("Are you sure you want to reset the database? This will delete all data. (yes/no): ").lower()
     if user_input == 'yes':
        reset_database()
     else:
        print("Database reset cancelled.")