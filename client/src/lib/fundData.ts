// Static fund metadata with live data fetched from API
import { FUND_HISTORIES, FUND_RSI, type PricePoint, type RsiPoint } from "./fundHistories";

export type { PricePoint, RsiPoint };
export { FUND_HISTORIES, FUND_RSI };

export interface FundInfo {
  ticker: string;
  name: string;
  type: "ETF" | "Mutual Fund";
  category: "S&P 500" | "Total Market" | "Large Cap Zero" | "Total Market Zero";
  expenseRatio: number;
  provider: string;
  minInvestment: string;
  price: number;
  change: number;
  changePercent: number;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
  previousClose: number;
  pe: number | null;
  volume: number;
}

export const FUNDS: FundInfo[] = [
  {
    ticker: "FNILX",
    name: "Fidelity ZERO Large Cap Index",
    type: "Mutual Fund",
    category: "Large Cap Zero",
    expenseRatio: 0.0,
    provider: "Fidelity",
    minInvestment: "$0",
    price: 23.54,
    change: -0.06,
    changePercent: -0.25,
    dayLow: 23.87,
    dayHigh: 23.87,
    yearLow: 17.73,
    yearHigh: 24.86,
    previousClose: 23.63,
    pe: null,
    volume: 0,
  },
  {
    ticker: "FZROX",
    name: "Fidelity ZERO Total Market Index",
    type: "Mutual Fund",
    category: "Total Market Zero",
    expenseRatio: 0.0,
    provider: "Fidelity",
    minInvestment: "$0",
    price: 22.93,
    change: -0.05,
    changePercent: -0.22,
    dayLow: 23.22,
    dayHigh: 23.22,
    yearLow: 17.18,
    yearHigh: 24.19,
    previousClose: 22.98,
    pe: null,
    volume: 0,
  },
  {
    ticker: "FXAIX",
    name: "Fidelity 500 Index Fund",
    type: "Mutual Fund",
    category: "S&P 500",
    expenseRatio: 0.015,
    provider: "Fidelity",
    minInvestment: "$0",
    price: 230.06,
    change: -0.62,
    changePercent: -0.27,
    dayLow: 233.28,
    dayHigh: 233.28,
    yearLow: 173.01,
    yearHigh: 242.52,
    previousClose: 230.91,
    pe: null,
    volume: 0,
  },
  {
    ticker: "SWPPX",
    name: "Schwab S&P 500 Index Fund",
    type: "Mutual Fund",
    category: "S&P 500",
    expenseRatio: 0.02,
    provider: "Schwab",
    minInvestment: "$0",
    price: 16.97,
    change: -0.05,
    changePercent: -0.29,
    dayLow: 17.21,
    dayHigh: 17.21,
    yearLow: 12.79,
    yearHigh: 17.89,
    previousClose: 17.03,
    pe: 26.95,
    volume: 0,
  },
  {
    ticker: "VOO",
    name: "Vanguard S&P 500 ETF",
    type: "ETF",
    category: "S&P 500",
    expenseRatio: 0.03,
    provider: "Vanguard",
    minInvestment: "1 share",
    price: 601.92,
    change: -4.83,
    changePercent: -0.8,
    dayLow: 613.54,
    dayHigh: 618.08,
    yearLow: 442.8,
    yearHigh: 641.81,
    previousClose: 609.09,
    pe: 26.96,
    volume: 8285787,
  },
  {
    ticker: "IVV",
    name: "iShares Core S&P 500 ETF",
    type: "ETF",
    category: "S&P 500",
    expenseRatio: 0.03,
    provider: "iShares",
    minInvestment: "1 share",
    price: 655.66,
    change: -5.27,
    changePercent: -0.8,
    dayLow: 670.14,
    dayHigh: 675.05,
    yearLow: 484.0,
    yearHigh: 700.97,
    previousClose: 665.20,
    pe: 26.53,
    volume: 6670458,
  },
  {
    ticker: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "ETF",
    category: "Total Market",
    expenseRatio: 0.03,
    provider: "Vanguard",
    minInvestment: "1 share",
    price: 322.67,
    change: -2.77,
    changePercent: -0.85,
    dayLow: 328.57,
    dayHigh: 330.97,
    yearLow: 236.42,
    yearHigh: 344.42,
    previousClose: 326.13,
    pe: 26.10,
    volume: 3726293,
  },
  {
    ticker: "SCHB",
    name: "Schwab U.S. Broad Market ETF",
    type: "ETF",
    category: "Total Market",
    expenseRatio: 0.03,
    provider: "Schwab",
    minInvestment: "1 share",
    price: 25.23,
    change: -0.2,
    changePercent: -0.81,
    dayLow: 25.70,
    dayHigh: 25.88,
    yearLow: 18.52,
    yearHigh: 26.94,
    previousClose: 25.50,
    pe: 25.81,
    volume: 12089918,
  },
  {
    ticker: "ITOT",
    name: "iShares Core S&P Total U.S. Stock Market ETF",
    type: "ETF",
    category: "Total Market",
    expenseRatio: 0.03,
    provider: "iShares",
    minInvestment: "1 share",
    price: 142.71,
    change: -1.22,
    changePercent: -0.85,
    dayLow: 145.64,
    dayHigh: 146.69,
    yearLow: 105.0,
    yearHigh: 152.71,
    previousClose: 144.57,
    pe: 26.03,
    volume: 5678610,
  },
  {
    ticker: "SPTM",
    name: "SPDR Portfolio S&P 1500 Composite ETF",
    type: "ETF",
    category: "Total Market",
    expenseRatio: 0.03,
    provider: "State Street",
    minInvestment: "1 share",
    price: 79.47,
    change: -0.68,
    changePercent: -0.84,
    dayLow: 80.97,
    dayHigh: 81.54,
    yearLow: 58.6,
    yearHigh: 84.81,
    previousClose: 80.36,
    pe: 26.12,
    volume: 931872,
  },
  {
    ticker: "VFIAX",
    name: "Vanguard 500 Index Admiral Shares",
    type: "Mutual Fund",
    category: "S&P 500",
    expenseRatio: 0.04,
    provider: "Vanguard",
    minInvestment: "$3,000",
    price: 611.46,
    change: -1.65,
    changePercent: -0.27,
    dayLow: 619.99,
    dayHigh: 619.99,
    yearLow: 459.8,
    yearHigh: 644.58,
    previousClose: 613.72,
    pe: 26.97,
    volume: 0,
  },
  {
    ticker: "VTSAX",
    name: "Vanguard Total Stock Market Admiral",
    type: "Mutual Fund",
    category: "Total Market",
    expenseRatio: 0.04,
    provider: "Vanguard",
    minInvestment: "$3,000",
    price: 158.4,
    change: -0.31,
    changePercent: -0.2,
    dayLow: 160.37,
    dayHigh: 160.37,
    yearLow: 118.56,
    yearHigh: 167.1,
    previousClose: 158.75,
    pe: 26.10,
    volume: 0,
  },
];

// Calculate dip analysis
export function calculateDipSignals(priceHistory: PricePoint[]) {
  if (priceHistory.length < 20) return [];

  const signals: Array<{
    date: string;
    close: number;
    signal: "strong_buy" | "buy" | "neutral" | "caution";
    reason: string;
    sma20: number;
    dipPercent: number;
  }> = [];

  for (let i = 19; i < priceHistory.length; i++) {
    const window = priceHistory.slice(i - 19, i + 1);
    const sma20 = window.reduce((s, d) => s + d.close, 0) / 20;
    const current = priceHistory[i];
    const dipPercent = ((current.close - sma20) / sma20) * 100;

    // Look at recent high
    const recent30 = priceHistory.slice(Math.max(0, i - 29), i + 1);
    const recentHigh = Math.max(...recent30.map((d) => d.close));
    const drawdown = ((current.close - recentHigh) / recentHigh) * 100;

    let signal: "strong_buy" | "buy" | "neutral" | "caution" = "neutral";
    let reason = "";

    if (dipPercent < -5 || drawdown < -8) {
      signal = "strong_buy";
      reason = `${drawdown.toFixed(1)}% below recent high. Major dip — strong buy opportunity.`;
    } else if (dipPercent < -2 || drawdown < -4) {
      signal = "buy";
      reason = `${dipPercent.toFixed(1)}% below 20-day avg. Moderate dip — consider buying.`;
    } else if (dipPercent > 3) {
      signal = "caution";
      reason = `${dipPercent.toFixed(1)}% above 20-day avg. Elevated — consider waiting.`;
    } else {
      reason = "Near moving average. Normal range.";
    }

    signals.push({
      date: current.date,
      close: current.close,
      signal,
      reason,
      sma20: Math.round(sma20 * 100) / 100,
      dipPercent: Math.round(dipPercent * 100) / 100,
    });
  }

  return signals;
}

// Get current market signal for a specific fund
export function getCurrentSignal(ticker: string) {
  const rsiData = FUND_RSI[ticker] ?? [];
  const priceHistory = FUND_HISTORIES[ticker] ?? [];
  const fund = FUNDS.find((f) => f.ticker === ticker);

  const latestRsi = rsiData[0]?.rsi ?? 50;
  const signals = calculateDipSignals(priceHistory);
  const latestDip = signals[signals.length - 1];

  let overallSignal: "strong_buy" | "buy" | "neutral" | "caution" = "neutral";
  const reasons: string[] = [];

  // RSI analysis
  if (latestRsi < 30) {
    overallSignal = "strong_buy";
    reasons.push(`RSI at ${latestRsi.toFixed(1)} — oversold territory`);
  } else if (latestRsi < 40) {
    if (overallSignal !== "strong_buy") overallSignal = "buy";
    reasons.push(`RSI at ${latestRsi.toFixed(1)} — approaching oversold`);
  } else if (latestRsi > 70) {
    overallSignal = "caution";
    reasons.push(`RSI at ${latestRsi.toFixed(1)} — overbought territory`);
  } else {
    reasons.push(`RSI at ${latestRsi.toFixed(1)} — neutral zone`);
  }

  // Dip analysis
  if (latestDip) {
    if (latestDip.signal === "strong_buy") overallSignal = "strong_buy";
    else if (latestDip.signal === "buy" && overallSignal !== "strong_buy")
      overallSignal = "buy";
    else if (latestDip.signal === "caution" && overallSignal === "neutral")
      overallSignal = "caution";
    reasons.push(latestDip.reason);
  }

  // 52-week range analysis
  const latest = priceHistory[priceHistory.length - 1];
  if (latest && fund) {
    const range = fund.yearHigh - fund.yearLow;
    const position = ((latest.close - fund.yearLow) / range) * 100;
    if (position < 20) {
      reasons.push(`Near 52-week low (${position.toFixed(0)}% of range)`);
      if (overallSignal === "neutral") overallSignal = "buy";
    } else if (position > 90) {
      reasons.push(`Near 52-week high (${position.toFixed(0)}% of range)`);
      if (overallSignal === "neutral") overallSignal = "caution";
    } else {
      reasons.push(`At ${position.toFixed(0)}% of 52-week range`);
    }
  }

  return { signal: overallSignal, reasons, rsi: latestRsi, dipData: latestDip };
}
