import sqlite3
from sqlite3 import Error

def create_connection(db_file):
    """ Create a database connection to the SQLite database specified by the db_file """
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)
    return None


def add_stock(conn, owner_id, ticker, price_bought_at, date_bought_at, quantity_bought):
    """
    Add a new stock into the stocks table
    :param conn: Connection object
    :param owner_id: ID of the user who owns the stock
    :param ticker: Stock ticker symbol
    :param price_bought_at: Price at which the stock was bought
    :param date_bought_at: Date when the stock was bought
    :param quantity_bought: Quantity of the stock bought
    :return: stock id
    """
    sql = ''' INSERT INTO stocks(owner_id, ticker, price_bought_at, date_bought_at, quantity_bought)
              VALUES(?,?,?,?,?) '''
    cur = conn.cursor()
    cur.execute(sql, (owner_id, ticker, price_bought_at, date_bought_at, quantity_bought))
    conn.commit()
    return cur.lastrowid