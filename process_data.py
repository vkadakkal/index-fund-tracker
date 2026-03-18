#!/usr/bin/env python3
"""Process fetched market data and update TypeScript files for IndexPulse."""

import json
import os
from datetime import datetime, timezone

DATA_DIR = "/home/user/workspace/index-fund-tracker/data"
CLIENT_LIB = "/home/user/workspace/index-fund-tracker/client/src/lib"

ETF_TICKERS = ["VOO", "VTI", "IVV", "SCHB", "ITOT", "SPTM"]
MF_TICKERS = ["FXAIX", "SWPPX", "VFIAX", "VTSAX", "FNILX", "FZROX"]
ALL_TICKERS = ETF_TICKERS + MF_TICKERS

# Mutual fund -> ETF mapping for price data
MF_ETF_MAP = {
    "FXAIX": "VOO", "SWPPX": "VOO", "VFIAX": "VOO", "FNILX": "VOO",
    "VTSAX": "VTI", "FZROX": "VTI",
}

# Quote data extracted from the API response
QUOTES = {
    "VOO": {"price": 613.69, "change": -3.20, "changesPercentage": -0.52, "yearLow": 442.80, "yearHigh": 641.81, "previousClose": 616.89},
    "VTI": {"price": 328.88, "change": -1.69, "changesPercentage": -0.51, "yearLow": 236.42, "yearHigh": 344.42, "previousClose": 330.57},
    "IVV": {"price": 668.50, "change": -3.49, "changesPercentage": -0.52, "yearLow": 484.00, "yearHigh": 700.97, "previousClose": 671.99},
    "SCHB": {"price": 25.70, "change": -0.15, "changesPercentage": -0.60, "yearLow": 18.52, "yearHigh": 26.94, "previousClose": 25.86},
    "ITOT": {"price": 145.44, "change": -0.74, "changesPercentage": -0.51, "yearLow": 105.00, "yearHigh": 152.71, "previousClose": 146.19},
    "SPTM": {"price": 81.02, "change": -0.41, "changesPercentage": -0.50, "yearLow": 58.60, "yearHigh": 84.81, "previousClose": 81.42},
    "FXAIX": {"price": 233.87, "change": 0.59, "changesPercentage": 0.25, "yearLow": 173.01, "yearHigh": 242.52, "previousClose": 233.28},
    "SWPPX": {"price": 17.25, "change": 0.04, "changesPercentage": 0.23, "yearLow": 12.79, "yearHigh": 17.89, "previousClose": 17.21},
    "VFIAX": {"price": 621.56, "change": 1.57, "changesPercentage": 0.25, "yearLow": 459.80, "yearHigh": 644.58, "previousClose": 619.99},
    "VTSAX": {"price": 160.88, "change": 0.51, "changesPercentage": 0.32, "yearLow": 118.56, "yearHigh": 167.10, "previousClose": 160.37},
    "FNILX": {"price": 23.93, "change": 0.06, "changesPercentage": 0.25, "yearLow": 17.73, "yearHigh": 24.86, "previousClose": 23.87},
    "FZROX": {"price": 23.29, "change": 0.07, "changesPercentage": 0.30, "yearLow": 17.18, "yearHigh": 24.19, "previousClose": 23.22},
}

def sample_points(results, target=100):
    """Sample price data to approximately target points."""
    if len(results) <= target:
        return results
    step = len(results) / target
    sampled = []
    i = 0.0
    while int(i) < len(results):
        sampled.append(results[int(i)])
        i += step
    # Always include last point
    if sampled[-1] != results[-1]:
        sampled.append(results[-1])
    return sampled

def compute_rsi(prices, period=14, last_n=50):
    """Compute RSI from price close data."""
    if len(prices) < period + 1:
        return []
    
    deltas = [prices[i]["c"] - prices[i-1]["c"] for i in range(1, len(prices))]
    
    # Initial average gain/loss
    gains = [max(d, 0) for d in deltas[:period]]
    losses = [max(-d, 0) for d in deltas[:period]]
    avg_gain = sum(gains) / period
    avg_loss = sum(losses) / period
    
    rsi_values = []
    
    for i in range(period, len(deltas)):
        delta = deltas[i]
        gain = max(delta, 0)
        loss = max(-delta, 0)
        avg_gain = (avg_gain * (period - 1) + gain) / period
        avg_loss = (avg_loss * (period - 1) + loss) / period
        
        if avg_loss == 0:
            rsi = 100
        else:
            rs = avg_gain / avg_loss
            rsi = 100 - (100 / (1 + rs))
        
        # The timestamp corresponds to the (i+1)th price point
        t = prices[i + 1]["t"]
        date_str = datetime.fromtimestamp(t / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
        rsi_values.append({"date": date_str, "rsi": round(rsi, 2)})
    
    # Return last N points, reversed to match API format (newest first)
    return list(reversed(rsi_values[-last_n:]))

def main():
    # 1. Load and process price data for all tickers
    fund_histories = {}
    
    for ticker in ETF_TICKERS:
        fpath = os.path.join(DATA_DIR, f"{ticker}_prices.json")
        with open(fpath) as f:
            data = json.load(f)
        results = data.get("results", [])
        sampled = sample_points(results)
        points = []
        for r in sampled:
            date_str = datetime.fromtimestamp(r["t"] / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
            points.append({"date": date_str, "close": round(r["c"], 2)})
        fund_histories[ticker] = points
    
    # Map mutual fund histories from ETF equivalents
    for mf, etf in MF_ETF_MAP.items():
        fund_histories[mf] = fund_histories[etf]
    
    # 2. Load RSI data for ETFs
    fund_rsi = {}
    
    for ticker in ETF_TICKERS:
        fpath = os.path.join(DATA_DIR, f"{ticker}_rsi.json")
        with open(fpath) as f:
            data = json.load(f)
        values = data.get("results", {}).get("values", [])
        rsi_points = []
        for v in values:
            date_str = datetime.fromtimestamp(v["timestamp"] / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
            rsi_points.append({"date": date_str, "rsi": round(v["value"], 2)})
        fund_rsi[ticker] = rsi_points
    
    # 3. Compute RSI for mutual funds from ETF price data
    for mf, etf in MF_ETF_MAP.items():
        fpath = os.path.join(DATA_DIR, f"{etf}_prices.json")
        with open(fpath) as f:
            data = json.load(f)
        results = data.get("results", [])
        fund_rsi[mf] = compute_rsi(results, period=14, last_n=50)
    
    # 4. Generate fundHistories.ts
    ts_lines = []
    ts_lines.append('export interface PricePoint { date: string; close: number; }')
    ts_lines.append('export interface RsiPoint { date: string; rsi: number; }')
    ts_lines.append('')
    ts_lines.append('export const FUND_HISTORIES: Record<string, PricePoint[]> = {')
    
    for ticker in ALL_TICKERS:
        points = fund_histories.get(ticker, [])
        points_str = json.dumps(points)
        ts_lines.append(f'  "{ticker}": {points_str},')
    
    ts_lines.append('};')
    ts_lines.append('')
    ts_lines.append('export const FUND_RSI: Record<string, RsiPoint[]> = {')
    
    for ticker in ALL_TICKERS:
        points = fund_rsi.get(ticker, [])
        points_str = json.dumps(points)
        ts_lines.append(f'  "{ticker}": {points_str},')
    
    ts_lines.append('};')
    ts_lines.append('')
    
    histories_path = os.path.join(CLIENT_LIB, "fundHistories.ts")
    with open(histories_path, 'w') as f:
        f.write('\n'.join(ts_lines))
    print(f"Written {histories_path}")
    
    # 5. Update fundData.ts with fresh quote data
    funddata_path = os.path.join(CLIENT_LIB, "fundData.ts")
    with open(funddata_path, 'r') as f:
        content = f.read()
    
    # Update each fund's price, change, changePercent, yearLow, yearHigh
    for ticker, q in QUOTES.items():
        # Update price
        import re
        
        # Find the fund entry and update fields
        # Pattern: { ticker: "VOO", ... price: NUMBER, ...}
        # We'll update price, change, changePercent, yearLow, yearHigh
        
        # Match the fund block for this ticker
        pattern = rf'(ticker:\s*"{ticker}"[^}}]*?price:\s*)[\d.]+' 
        content = re.sub(pattern, rf'\g<1>{q["price"]}', content)
        
        pattern = rf'(ticker:\s*"{ticker}"[^}}]*?change:\s*)-?[\d.]+'
        content = re.sub(pattern, rf'\g<1>{q["change"]}', content)
        
        pattern = rf'(ticker:\s*"{ticker}"[^}}]*?changePercent:\s*)-?[\d.]+'
        content = re.sub(pattern, rf'\g<1>{q["changesPercentage"]}', content)
        
        pattern = rf'(ticker:\s*"{ticker}"[^}}]*?yearLow:\s*)[\d.]+'
        content = re.sub(pattern, rf'\g<1>{q["yearLow"]}', content)
        
        pattern = rf'(ticker:\s*"{ticker}"[^}}]*?yearHigh:\s*)[\d.]+'
        content = re.sub(pattern, rf'\g<1>{q["yearHigh"]}', content)
    
    with open(funddata_path, 'w') as f:
        f.write(content)
    print(f"Updated {funddata_path}")
    
    # Print summary
    print(f"\nSummary:")
    print(f"  Price histories: {len(fund_histories)} funds")
    for t in ALL_TICKERS:
        print(f"    {t}: {len(fund_histories.get(t, []))} points")
    print(f"  RSI data: {len(fund_rsi)} funds")
    for t in ALL_TICKERS:
        print(f"    {t}: {len(fund_rsi.get(t, []))} points")
    
    # Print VOO signal info
    voo = QUOTES["VOO"]
    print(f"\n  VOO: ${voo['price']} ({voo['change']:+.2f}, {voo['changesPercentage']:+.2f}%)")
    print(f"  52-week range: ${voo['yearLow']} - ${voo['yearHigh']}")
    voo_rsi = fund_rsi.get("VOO", [])
    if voo_rsi:
        latest_rsi = voo_rsi[0]["rsi"]
        print(f"  Latest RSI: {latest_rsi}")

if __name__ == "__main__":
    main()
