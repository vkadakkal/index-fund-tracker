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
    """Compute RSI from price close data. prices = list of {"date": ..., "c": ...}."""
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
        
        date_str = prices[i + 1]["date"]
        rsi_values.append({"date": date_str, "rsi": round(rsi, 2)})
    
    # Return last N points, reversed (newest first)
    return list(reversed(rsi_values[-last_n:]))

def main():
    # Load quotes
    quotes_path = os.path.join(DATA_DIR, "quotes.json")
    with open(quotes_path) as f:
        QUOTES = json.load(f)
    
    # 1. Load and process price data for all tickers
    fund_histories = {}
    raw_prices = {}  # Keep full data for RSI computation
    
    for ticker in ETF_TICKERS:
        fpath = os.path.join(DATA_DIR, f"{ticker}_prices.json")
        with open(fpath) as f:
            data = json.load(f)
        results = data.get("results", [])
        raw_prices[ticker] = results
        sampled = sample_points(results)
        points = [{"date": r["date"], "close": round(r["c"], 2)} for r in sampled]
        fund_histories[ticker] = points
    
    # Map mutual fund histories from ETF equivalents
    for mf, etf in MF_ETF_MAP.items():
        fund_histories[mf] = fund_histories[etf]
    
    # 2. Compute RSI for all tickers from price data
    fund_rsi = {}
    
    for ticker in ETF_TICKERS:
        fund_rsi[ticker] = compute_rsi(raw_prices[ticker], period=14, last_n=50)
    
    # Mutual funds use their ETF equivalent's price data for RSI
    for mf, etf in MF_ETF_MAP.items():
        fund_rsi[mf] = compute_rsi(raw_prices[etf], period=14, last_n=50)
    
    # 3. Generate fundHistories.ts
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
    
    # 4. Update fundData.ts with fresh quote data
    funddata_path = os.path.join(CLIENT_LIB, "fundData.ts")
    with open(funddata_path, 'r') as f:
        content = f.read()
    
    import re
    for ticker, q in QUOTES.items():
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
