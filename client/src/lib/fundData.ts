// Static fund metadata with live data fetched from API
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
    price: 23.87,
    change: 0.24,
    changePercent: 1.02,
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
    price: 23.22,
    change: 0.24,
    changePercent: 1.04,
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
    price: 233.28,
    change: 2.37,
    changePercent: 1.03,
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
    price: 17.21,
    change: 0.18,
    changePercent: 1.06,
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
    price: 615.19,
    change: 6.10,
    changePercent: 1.00,
    dayLow: 613.54,
    dayHigh: 618.08,
    yearLow: 442.80,
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
    price: 671.91,
    change: 6.71,
    changePercent: 1.01,
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
    price: 329.46,
    change: 3.33,
    changePercent: 1.02,
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
    price: 25.76,
    change: 0.27,
    changePercent: 1.04,
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
    price: 146.03,
    change: 1.46,
    changePercent: 1.01,
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
    price: 81.18,
    change: 0.82,
    changePercent: 1.02,
    dayLow: 80.97,
    dayHigh: 81.54,
    yearLow: 58.60,
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
    price: 619.99,
    change: 6.27,
    changePercent: 1.02,
    dayLow: 619.99,
    dayHigh: 619.99,
    yearLow: 459.80,
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
    price: 160.37,
    change: 1.62,
    changePercent: 1.02,
    dayLow: 160.37,
    dayHigh: 160.37,
    yearLow: 118.56,
    yearHigh: 167.10,
    previousClose: 158.75,
    pe: 26.10,
    volume: 0,
  },
];

// Historical price data for VOO (1 year daily) - used for charts
// Sampled key data points from the full 251-day dataset
export const VOO_HISTORY = [
  { date: "2025-03-17", close: 521.41 },
  { date: "2025-03-24", close: 527.96 },
  { date: "2025-03-31", close: 513.98 },
  { date: "2025-04-02", close: 515.82 },
  { date: "2025-04-04", close: 477.97 },
  { date: "2025-04-07", close: 472.01 },
  { date: "2025-04-08", close: 464.06 },
  { date: "2025-04-09", close: 503.46 },
  { date: "2025-04-10", close: 490.60 },
  { date: "2025-04-14", close: 497.41 },
  { date: "2025-04-21", close: 488.32 },
  { date: "2025-04-22", close: 509.29 },
  { date: "2025-04-25", close: 517.91 },
  { date: "2025-04-28", close: 518.68 },
  { date: "2025-05-05", close: 526.02 },
  { date: "2025-05-12", close: 549.71 },
  { date: "2025-05-16", close: 547.94 },
  { date: "2025-05-19", close: 547.91 },
  { date: "2025-05-23", close: 538.50 },
  { date: "2025-05-27", close: 548.73 },
  { date: "2025-05-30", close: 543.83 },
  { date: "2025-06-06", close: 556.13 },
  { date: "2025-06-13", close: 557.18 },
  { date: "2025-06-17", close: 563.42 },
  { date: "2025-06-20", close: 559.72 },
  { date: "2025-06-25", close: 567.38 },
  { date: "2025-06-30", close: 563.20 },
  { date: "2025-07-03", close: 570.13 },
  { date: "2025-07-07", close: 568.89 },
  { date: "2025-07-11", close: 577.02 },
  { date: "2025-07-14", close: 579.52 },
  { date: "2025-07-18", close: 579.23 },
  { date: "2025-07-21", close: 578.10 },
  { date: "2025-07-25", close: 579.56 },
  { date: "2025-07-28", close: 582.11 },
  { date: "2025-08-01", close: 577.35 },
  { date: "2025-08-04", close: 580.44 },
  { date: "2025-08-08", close: 582.27 },
  { date: "2025-08-11", close: 582.78 },
  { date: "2025-08-15", close: 590.13 },
  { date: "2025-08-18", close: 592.82 },
  { date: "2025-08-22", close: 589.46 },
  { date: "2025-08-25", close: 591.56 },
  { date: "2025-08-29", close: 594.20 },
  { date: "2025-09-02", close: 591.55 },
  { date: "2025-09-05", close: 585.06 },
  { date: "2025-09-08", close: 590.29 },
  { date: "2025-09-12", close: 604.44 },
  { date: "2025-09-15", close: 607.59 },
  { date: "2025-09-19", close: 606.21 },
  { date: "2025-09-22", close: 607.84 },
  { date: "2025-09-26", close: 612.67 },
  { date: "2025-09-30", close: 603.83 },
  { date: "2025-10-03", close: 596.74 },
  { date: "2025-10-06", close: 599.53 },
  { date: "2025-10-10", close: 612.72 },
  { date: "2025-10-13", close: 613.95 },
  { date: "2025-10-17", close: 620.96 },
  { date: "2025-10-20", close: 619.18 },
  { date: "2025-10-24", close: 623.12 },
  { date: "2025-10-27", close: 622.99 },
  { date: "2025-10-31", close: 615.23 },
  { date: "2025-11-03", close: 620.74 },
  { date: "2025-11-07", close: 623.13 },
  { date: "2025-11-10", close: 625.89 },
  { date: "2025-11-14", close: 617.56 },
  { date: "2025-11-17", close: 618.26 },
  { date: "2025-11-21", close: 618.96 },
  { date: "2025-11-25", close: 625.42 },
  { date: "2025-11-28", close: 623.55 },
  { date: "2025-12-01", close: 626.98 },
  { date: "2025-12-05", close: 633.80 },
  { date: "2025-12-08", close: 635.85 },
  { date: "2025-12-12", close: 634.31 },
  { date: "2025-12-15", close: 626.53 },
  { date: "2025-12-19", close: 605.21 },
  { date: "2025-12-22", close: 617.44 },
  { date: "2025-12-26", close: 622.36 },
  { date: "2025-12-29", close: 620.38 },
  { date: "2025-12-31", close: 617.65 },
  { date: "2026-01-02", close: 617.38 },
  { date: "2026-01-06", close: 621.86 },
  { date: "2026-01-08", close: 612.98 },
  { date: "2026-01-10", close: 615.87 },
  { date: "2026-01-13", close: 609.57 },
  { date: "2026-01-14", close: 616.84 },
  { date: "2026-01-16", close: 624.78 },
  { date: "2026-01-17", close: 627.27 },
  { date: "2026-01-21", close: 631.30 },
  { date: "2026-01-23", close: 634.15 },
  { date: "2026-01-24", close: 641.81 },
  { date: "2026-01-27", close: 623.37 },
  { date: "2026-01-29", close: 630.77 },
  { date: "2026-01-31", close: 626.06 },
  { date: "2026-02-03", close: 616.87 },
  { date: "2026-02-05", close: 625.76 },
  { date: "2026-02-07", close: 621.90 },
  { date: "2026-02-10", close: 618.55 },
  { date: "2026-02-12", close: 623.30 },
  { date: "2026-02-14", close: 629.50 },
  { date: "2026-02-19", close: 632.77 },
  { date: "2026-02-21", close: 628.15 },
  { date: "2026-02-24", close: 623.48 },
  { date: "2026-02-25", close: 619.76 },
  { date: "2026-02-27", close: 610.70 },
  { date: "2026-02-28", close: 613.49 },
  { date: "2026-03-03", close: 610.22 },
  { date: "2026-03-04", close: 603.63 },
  { date: "2026-03-05", close: 615.14 },
  { date: "2026-03-06", close: 610.30 },
  { date: "2026-03-07", close: 616.22 },
  { date: "2026-03-10", close: 608.67 },
  { date: "2026-03-11", close: 612.94 },
  { date: "2026-03-12", close: 612.50 },
  { date: "2026-03-13", close: 609.09 },
  { date: "2026-03-16", close: 615.19 },
];

// RSI data (last 50 data points) from Massive API
export const VOO_RSI = [
  { date: "2026-03-16", rsi: 39.51 },
  { date: "2026-03-13", rsi: 40.40 },
  { date: "2026-03-12", rsi: 33.49 },
  { date: "2026-03-11", rsi: 35.63 },
  { date: "2026-03-10", rsi: 42.75 },
  { date: "2026-03-07", rsi: 43.33 },
  { date: "2026-03-06", rsi: 44.20 },
  { date: "2026-03-05", rsi: 38.47 },
  { date: "2026-03-04", rsi: 45.20 },
  { date: "2026-03-03", rsi: 48.35 },
  { date: "2026-02-28", rsi: 43.50 },
  { date: "2026-02-27", rsi: 48.81 },
  { date: "2026-02-26", rsi: 48.55 },
  { date: "2026-02-25", rsi: 51.39 },
  { date: "2026-02-24", rsi: 55.07 },
  { date: "2026-02-21", rsi: 50.15 },
  { date: "2026-02-20", rsi: 45.36 },
  { date: "2026-02-19", rsi: 51.81 },
  { date: "2026-02-18", rsi: 46.88 },
  { date: "2026-02-14", rsi: 48.54 },
  { date: "2026-02-13", rsi: 45.01 },
  { date: "2026-02-12", rsi: 43.76 },
  { date: "2026-02-11", rsi: 43.33 },
  { date: "2026-02-10", rsi: 52.63 },
  { date: "2026-02-07", rsi: 52.73 },
  { date: "2026-02-06", rsi: 54.57 },
  { date: "2026-02-05", rsi: 51.97 },
  { date: "2026-02-04", rsi: 38.78 },
  { date: "2026-02-03", rsi: 46.39 },
  { date: "2026-01-31", rsi: 50.18 },
  { date: "2026-01-30", rsi: 57.65 },
  { date: "2026-01-29", rsi: 53.65 },
  { date: "2026-01-28", rsi: 56.59 },
  { date: "2026-01-27", rsi: 58.53 },
  { date: "2026-01-24", rsi: 58.67 },
  { date: "2026-01-23", rsi: 56.12 },
  { date: "2026-01-22", rsi: 52.74 },
  { date: "2026-01-21", rsi: 52.47 },
  { date: "2026-01-17", rsi: 49.05 },
  { date: "2026-01-16", rsi: 40.37 },
  { date: "2026-01-14", rsi: 56.60 },
  { date: "2026-01-13", rsi: 57.48 },
  { date: "2026-01-10", rsi: 55.44 },
  { date: "2026-01-09", rsi: 60.38 },
  { date: "2026-01-08", rsi: 62.58 },
  { date: "2026-01-07", rsi: 61.56 },
  { date: "2026-01-06", rsi: 57.07 },
  { date: "2026-01-03", rsi: 57.23 },
  { date: "2026-01-02", rsi: 60.14 },
  { date: "2025-12-31", rsi: 56.35 },
];

// Calculate dip analysis
export function calculateDipSignals(priceHistory: typeof VOO_HISTORY) {
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

// Get current market signal
export function getCurrentSignal(rsiData: typeof VOO_RSI, priceHistory: typeof VOO_HISTORY) {
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
  if (latest) {
    const fund = FUNDS.find((f) => f.ticker === "VOO");
    if (fund) {
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
  }

  return { signal: overallSignal, reasons, rsi: latestRsi, dipData: latestDip };
}
