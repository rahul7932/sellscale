import sqlite3
from sqlite3 import Error

def create_connection(db_file):
    """ Create a database connection to the SQLite database specified by db_file """
    conn = None  # Initialize conn here to ensure it's in the correct scope
    try:
        conn = sqlite3.connect(db_file)
        print(f"SQLite DB created at {db_file}")
        return conn  # Return connection only if successful
    except Error as e:
        print(e)
    return None  # Return None if the connection failed

def create_tables(conn):
    """ create a table from the create_table_sql statement """
    if conn is not None:  # Check if the connection is successfully created
        try:
            c = conn.cursor()
            c.execute("""
                CREATE TABLE IF NOT EXISTS user_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    balance REAL
                );
            """)

            c.execute("""
                CREATE TABLE IF NOT EXISTS stocks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    owner_id INTEGER,
                    ticker TEXT,
                    price_bought_at REAL,
                    date_bought_at TEXT,
                    quantity_bought INTEGER,
                    FOREIGN KEY (owner_id) REFERENCES users (id)
                );
            """)
            conn.commit()
            print("Table created successfully")
        except Error as e:
            print(e)
        finally:
            conn.close()  # Ensure connection is closed
    else:
        print("Error! cannot create the database connection.")

if __name__ == '__main__':
    db_path = "db/sellscalehood.db"  # Adjust the path as necessary
    conn = create_connection(db_path)  # Create a database connection
    if conn:
        create_tables(conn)  # Pass the connection to create_tables
