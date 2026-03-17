# IndexPulse — Low-Cost Index Fund Tracker

A comprehensive dashboard that tracks S&P 500 and Total Market index funds with the lowest expense ratios, and suggests optimal buying opportunities when the market dips.

## Features

- **12 funds tracked** across Fidelity, Vanguard, Schwab, iShares, and State Street
- **Buy-the-dip signals** based on RSI (14-day), 20-day SMA deviation, and drawdown analysis
- **Expense ratio comparison** with visual charts
- **Cumulative fee impact calculator** — see how fees compound over 1–30 years
- **Interactive price chart** with 1-year history and moving average overlay
- **RSI chart** with oversold/overbought reference lines
- **Sortable/filterable fund table** by category (S&P 500, Total Market, Zero-fee)
- **Dark/light mode** toggle

## Funds Tracked

| Fund | Type | Expense Ratio | Provider |
|------|------|--------------|----------|
| FNILX | Mutual Fund | 0.00% | Fidelity |
| FZROX | Mutual Fund | 0.00% | Fidelity |
| FXAIX | Mutual Fund | 0.015% | Fidelity |
| SWPPX | Mutual Fund | 0.02% | Schwab |
| VOO | ETF | 0.03% | Vanguard |
| IVV | ETF | 0.03% | iShares |
| VTI | ETF | 0.03% | Vanguard |
| SCHB | ETF | 0.03% | Schwab |
| ITOT | ETF | 0.03% | iShares |
| SPTM | ETF | 0.03% | State Street |
| VFIAX | Mutual Fund | 0.04% | Vanguard |
| VTSAX | Mutual Fund | 0.04% | Vanguard |

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui + Recharts
- **Deployment**: GitHub Pages via GitHub Actions

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/public/`.

## Disclaimer

This tool is for educational and informational purposes only. Not financial advice. Past performance does not guarantee future results.
