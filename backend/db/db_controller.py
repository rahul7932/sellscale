import sqlite3
from sqlite3 import Error
import yfinance as yf

def create_connection():
    db_file = "db/sellscalehood.db"
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except sqlite3.Error as e:
        print(e)
    return conn

def get_or_create_first_user(conn):
    """
    Get the first user from the user_data table or create one if the table is empty.
    :param conn: Connection object to the database
    :return: A dictionary containing the user's data
    """
    cursor = conn.cursor()

    # Attempt to fetch the first user
    cursor.execute("SELECT * FROM user_data LIMIT 1;")
    user = cursor.fetchone()

    if user:
        print("First user fetched:", user)
        return {"id": user[0], "name": user[1], "balance": user[2]}
    else:
        # If no user, add one
        cursor.execute("INSERT INTO user_data (name, balance) VALUES (?, ?)", ('Rahul Kumar', 100000))
        conn.commit()
        print("No users found. Added Rahul Kumar with balance 100,000.")

        # Fetch and return the newly created user
        cursor.execute("SELECT * FROM user_data WHERE id = last_insert_rowid();")
        new_user = cursor.fetchone()
        return {"id": new_user[0], "name": new_user[1], "balance": new_user[2]}

def buy_stock(conn, owner_id, ticker, price_bought_at, date_bought_at, quantity_bought):
    """
    Attempt to purchase stock and update user balance within a transaction.
    :param conn: Connection object
    :param owner_id: ID of the user who owns the stock
    :param ticker: Stock ticker symbol
    :param price_bought_at: Price at which the stock was bought
    :param date_bought_at: Date when the stock was bought
    :param quantity_bought: Quantity of the stock bought
    :return: ID of the stock record
    """
    total_cost = price_bought_at * quantity_bought
    cur = conn.cursor()
    
    try:
        # Start a transaction
        cur.execute("BEGIN;")
        
        # Check if the user has enough balance
        cur.execute("SELECT balance FROM user_data WHERE id = ?", (owner_id,))
        balance = cur.fetchone()
        if balance is None:
            raise ValueError("User not found.")
        
        current_balance = balance[0]
        if current_balance < total_cost:
            raise ValueError("Insufficient funds.")
        
        # Deduct the amount from the user's balance
        new_balance = current_balance - total_cost
        cur.execute("UPDATE user_data SET balance = ? WHERE id = ?", (new_balance, owner_id))
        
        # Check if the user already owns this stock
        cur.execute("""
            SELECT id, quantity_bought, price_bought_at FROM stocks WHERE owner_id = ? AND ticker = ?
        """, (owner_id, ticker))
        existing_stock = cur.fetchone()

        if existing_stock:
            # Update the existing stock record
            stock_id = existing_stock[0]
            existing_quantity = existing_stock[1]
            existing_price = existing_stock[2]

            # Calculate the new average price
            total_quantity = existing_quantity + quantity_bought
            total_price = (existing_price * existing_quantity) + (price_bought_at * quantity_bought)
            average_price = total_price / total_quantity

            cur.execute("""
                UPDATE stocks SET quantity_bought = ?, price_bought_at = ? WHERE id = ?
            """, (total_quantity, average_price, stock_id))
        else:
            # Insert the new stock record
            cur.execute(""" 
                INSERT INTO stocks(owner_id, ticker, price_bought_at, date_bought_at, quantity_bought)
                VALUES(?,?,?,?,?)
            """, (owner_id, ticker, price_bought_at, date_bought_at, quantity_bought))
            stock_id = cur.lastrowid
        
        # Commit the transaction
        conn.commit()
        return stock_id
    except Exception as e:
        # Rollback the transaction on error
        conn.rollback()
        raise e

def sell_stock(conn, owner_id, ticker, price_sold_at, date_sold_at, quantity_sold):
    """
    Attempt to sell stock and update user balance within a transaction.
    :param conn: Connection object
    :param owner_id: ID of the user who owns the stock
    :param ticker: Stock ticker symbol
    :param price_sold_at: Price at which the stock was sold
    :param date_sold_at: Date when the stock was sold
    :param quantity_sold: Quantity of the stock sold
    :return: ID of the stock record
    """
    total_revenue = price_sold_at * quantity_sold
    cur = conn.cursor()
    
    try:
        # Start a transaction
        cur.execute("BEGIN;")
        
        # Check if the user owns enough of the stock
        cur.execute("""
            SELECT id, quantity_bought FROM stocks WHERE owner_id = ? AND ticker = ?
        """, (owner_id, ticker))
        stock = cur.fetchone()
        if stock is None:
            raise ValueError("Stock not found in user's holdings.")
        
        stock_id, quantity_owned = stock
        if quantity_owned < quantity_sold:
            raise ValueError("Insufficient stock quantity to sell.")
        
        # Update the stock quantity
        remaining_quantity = quantity_owned - quantity_sold
        if remaining_quantity == 0:
            # Delete the stock record if no shares are left
            cur.execute("DELETE FROM stocks WHERE id = ?", (stock_id,))
        else:
            # Update the stock record with the reduced quantity
            cur.execute("""
                UPDATE stocks SET quantity_bought = ? WHERE id = ?
            """, (remaining_quantity, stock_id))
        
        # Add the revenue to the user's balance
        cur.execute("SELECT balance FROM user_data WHERE id = ?", (owner_id,))
        balance = cur.fetchone()[0]
        new_balance = balance + total_revenue
        cur.execute("UPDATE user_data SET balance = ? WHERE id = ?", (new_balance, owner_id))
        
        # Commit the transaction
        conn.commit()
        return stock_id
    except Exception as e:
        # Rollback the transaction on error
        conn.rollback()
        raise e

def get_user_stocks(conn, owner_id):
    """
    Retrieve all stocks owned by the user, including current prices.
    :param conn: Connection object
    :param owner_id: ID of the user
    :return: List of dictionaries representing the stocks
    """
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT ticker, price_bought_at, date_bought_at, quantity_bought
            FROM stocks
            WHERE owner_id = ?
        """, (owner_id,))
        rows = cur.fetchall()
        stocks = []
        for row in rows:
            ticker = row[0]
            stock = {
                'ticker': ticker,
                'price_bought_at': row[1],
                'date_bought_at': row[2],
                'quantity_bought': row[3],
            }
            stocks.append(stock)
        return stocks
    except Exception as e:
        raise e

