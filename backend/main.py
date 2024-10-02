from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from .db.db_controller import (
    create_connection,
    buy_stock,
    get_first_user_balance,
    sell_stock,
    get_or_create_first_user,
    get_user_stocks
)
import sqlite3

app = FastAPI()
global_user_id = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    global global_user_id
    conn = create_connection()
    if conn:
        global_user_id = get_or_create_first_user(conn)['id']
        conn.close()

@app.post("/buy/{ticker}/{price_bought_at}/{date_bought_at}/{quantity_bought}")
def buy(
    ticker: str,
    price_bought_at: float,
    date_bought_at: str,
    quantity_bought: int,
    db: sqlite3.Connection = Depends(create_connection)
):
    try:
        stock_id = buy_stock(db, global_user_id, ticker, price_bought_at, date_bought_at, quantity_bought)
        return {"message": "Stock purchased successfully", "stock_id": stock_id}
    except ValueError as ve:
        # Handle known errors like insufficient funds or user not found
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Handle unexpected errors and display the actual error message
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        db.close()

@app.post("/sell/{ticker}/{price_sold_at}/{date_sold_at}/{quantity_sold}")
def sell(
    ticker: str,
    price_sold_at: float,
    date_sold_at: str,
    quantity_sold: int,
    db: sqlite3.Connection = Depends(create_connection)
):
    try:
        stock_id = sell_stock(db, global_user_id, ticker, price_sold_at, date_sold_at, quantity_sold)
        return {"message": "Stock sold successfully", "stock_id": stock_id}
    except ValueError as ve:
        # Handle known errors like insufficient stock quantity or stock not found
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Handle unexpected errors and display the actual error message
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        db.close()

@app.get("/stocks")
def get_stocks(db: sqlite3.Connection = Depends(create_connection)):
    try:
        stocks = get_user_stocks(db, global_user_id)
        return {"stocks": stocks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        db.close()

# New endpoint to get stock historical data
@app.get("/stock_history/{ticker}")
def get_stock_history(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1mo")  # You can adjust the period

        if hist.empty:
            raise HTTPException(status_code=404, detail="Stock history not found")

        # Prepare data for charting
        hist.reset_index(inplace=True)
        hist['Date'] = hist['Date'].dt.strftime('%Y-%m-%d')
        history = hist[['Date', 'Close']].to_dict(orient='records')

        return {'history': history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock history: {str(e)}")
    
@app.get("/stock_metrics/{ticker}")
def get_stock_metrics(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        stock_info = stock.info



        metrics = [
            {'label': 'Previous Close', 'value': stock_info.get('previousClose', 'N/A')},
            {'label': 'Open', 'value': stock_info.get('open', 'N/A')},
            {'label': 'Bid', 'value': stock_info.get('bid', 'N/A')},
            {'label': 'Ask', 'value': stock_info.get('ask', 'N/A')},
            {'label': 'Day\'s Range', 'value': f"{stock_info.get('dayLow', 'N/A')} - {stock_info.get('dayHigh', 'N/A')}"},
            {'label': '52 Week Range', 'value': f"{stock_info.get('fiftyTwoWeekLow', 'N/A')} - {stock_info.get('fiftyTwoWeekHigh', 'N/A')}"},
            {'label': 'Volume', 'value': stock_info.get('volume', 'N/A')},
            {'label': 'Avg. Volume', 'value': stock_info.get('averageVolume', 'N/A')},
            {'label': 'Market Cap', 'value': stock_info.get('marketCap', 'N/A')}
        ]

        # Handle None values
        for item in metrics:
            if item['value'] is None:
                item['value'] = 'N/A'

        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock metrics: {str(e)}")
    
@app.get("/sp500_history")
def get_sp500_history():
    try:
        # Fetch the S&P 500 (^GSPC) historical data
        sp500 = yf.Ticker('^GSPC')
        hist = sp500.history(period="1mo")  # Adjust the period as needed (e.g., '1mo', '1y', etc.)

        if hist.empty:
            raise HTTPException(status_code=404, detail="S&P 500 data not found")

        # Prepare the data in the required format
        hist.reset_index(inplace=True)
        hist['Date'] = hist['Date'].dt.strftime('%Y-%m-%d')
        history = hist[['Date', 'Close']].to_dict(orient='records')

        return {'history': history}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching S&P 500 history: {str(e)}")
    
@app.get("/user_balance")
def get_user_balance(db: sqlite3.Connection = Depends(create_connection)):
    """Endpoint to get the balance of the first user"""
    balance = get_first_user_balance(db)
    if balance is not None:
        return {"balance": balance}
    else:
        raise HTTPException(status_code=404, detail="User not found")
    
@app.get("/key_insights/{ticker}")
def get_key_insights(ticker: str):
    """
    Endpoint to get key insights for a specific stock.
    Returns today's price, today's gain (dollars and percent).
    """
    try:
        # Fetch the stock data from Yahoo Finance
        stock = yf.Ticker(ticker)
        stock_info = stock.info

        # Fetch today's price (current price) and previous close price
        todays_data = stock.history(period='1d')
        current_price = todays_data['Close'][0]
        previous_close = stock_info.get('previousClose', None)

        if current_price is None or previous_close is None:
            raise HTTPException(status_code=404, detail=f"Unable to fetch current price or previous close{current_price, previous_close}")

        # Calculate today's dollar gain
        dollar_gain = current_price - previous_close

        # Calculate today's percentage gain
        percentage_gain = (dollar_gain / previous_close) * 100 if previous_close != 0 else 0

        # Prepare the key insights data
        key_insights = {
            'currentPrice': current_price,
            'dollarGain': dollar_gain,
            'percentageGain': percentage_gain
        }

        return key_insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching key insights: {str(e)}")


