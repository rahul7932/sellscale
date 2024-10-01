from fastapi import FastAPI, HTTPException, Depends
import yfinance as yf
from .db.db_controller import create_connection, add_stock
import sqlite3

app = FastAPI()

@app.get('/get_stock_price/{ticker}')
def get_stock_price(ticker: str):
    stock = yf.Ticker(ticker)
    hist = stock.history(period="1d")  # You can adjust the period as needed

    if hist.empty:
        raise HTTPException(status_code=404, detail="Stock data not found")

    last_close = hist.iloc[-1]['Close']
    return {"ticker": ticker, "last_close_price": last_close}

@app.post("/add-stock/")
def api_add_stock(owner_id: int, ticker: str, price_bought_at: float, date_bought_at: str, quantity_bought: int, db: sqlite3.Connection = Depends(create_connection)):
    try:
        stock_id = add_stock(db, owner_id, ticker, price_bought_at, date_bought_at, quantity_bought)
        return {"message": "Stock added successfully", "stock_id": stock_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()