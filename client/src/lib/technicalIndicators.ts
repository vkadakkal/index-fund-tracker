// Technical indicator computation from price data
import type { PricePoint } from "./fundHistories";

export interface BollingerBand {
  date: string;
  upper: number;
  middle: number;
  lower: number;
}

export interface ParabolicSarPoint {
  date: string;
  sar: number;
  trend: "up" | "down";
}

export interface SupportResistanceLevel {
  price: number;
  type: "support" | "resistance";
  strength: number; // 1-3, how many times tested
}

/**
 * Bollinger Bands: 20-period SMA ± 2× standard deviation
 */
export function computeBollingerBands(
  prices: PricePoint[],
  period = 20,
  multiplier = 2
): BollingerBand[] {
  if (prices.length < period) return [];

  const bands: BollingerBand[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const window = prices.slice(i - period + 1, i + 1);
    const closes = window.map((p) => p.close);
    const mean = closes.reduce((s, v) => s + v, 0) / period;
    const variance =
      closes.reduce((s, v) => s + (v - mean) ** 2, 0) / period;
    const stdDev = Math.sqrt(variance);

    bands.push({
      date: prices[i].date,
      upper: Math.round((mean + multiplier * stdDev) * 100) / 100,
      middle: Math.round(mean * 100) / 100,
      lower: Math.round((mean - multiplier * stdDev) * 100) / 100,
    });
  }
  return bands;
}

/**
 * Parabolic SAR (Stop and Reverse)
 * Uses acceleration factor starting at 0.02, incrementing by 0.02, max 0.20
 */
export function computeParabolicSar(
  prices: PricePoint[],
  afStart = 0.02,
  afStep = 0.02,
  afMax = 0.2
): ParabolicSarPoint[] {
  if (prices.length < 3) return [];

  const result: ParabolicSarPoint[] = [];

  // Initialize: first trend is "up" if second close > first close
  let trend: "up" | "down" = prices[1].close > prices[0].close ? "up" : "down";
  let af = afStart;
  let ep = trend === "up" ? prices[1].close : prices[1].close;
  let sar =
    trend === "up"
      ? Math.min(prices[0].close, prices[1].close)
      : Math.max(prices[0].close, prices[1].close);

  // Use high/low approximations from close (since we only have close data)
  // We approximate high/low as close ± 0.5% of close
  const getHigh = (p: PricePoint) => p.close * 1.003;
  const getLow = (p: PricePoint) => p.close * 0.997;

  result.push({ date: prices[0].date, sar, trend });
  result.push({ date: prices[1].date, sar, trend });

  for (let i = 2; i < prices.length; i++) {
    const high = getHigh(prices[i]);
    const low = getLow(prices[i]);
    const prevHigh = getHigh(prices[i - 1]);
    const prevLow = getLow(prices[i - 1]);

    // Calculate new SAR
    let newSar = sar + af * (ep - sar);

    if (trend === "up") {
      // SAR cannot be above the two previous lows
      newSar = Math.min(newSar, prevLow, getLow(prices[Math.max(0, i - 2)]));

      if (low < newSar) {
        // Reversal to downtrend
        trend = "down";
        newSar = ep; // SAR becomes the extreme point
        ep = low;
        af = afStart;
      } else {
        if (high > ep) {
          ep = high;
          af = Math.min(af + afStep, afMax);
        }
      }
    } else {
      // SAR cannot be below the two previous highs
      newSar = Math.max(newSar, prevHigh, getHigh(prices[Math.max(0, i - 2)]));

      if (high > newSar) {
        // Reversal to uptrend
        trend = "up";
        newSar = ep;
        ep = high;
        af = afStart;
      } else {
        if (low < ep) {
          ep = low;
          af = Math.min(af + afStep, afMax);
        }
      }
    }

    sar = newSar;
    result.push({
      date: prices[i].date,
      sar: Math.round(sar * 100) / 100,
      trend,
    });
  }

  return result;
}

/**
 * Support and Resistance levels using local min/max detection
 * Identifies price levels where the price has bounced or reversed multiple times
 */
export function computeSupportResistance(
  prices: PricePoint[],
  lookback = 5,
  tolerance = 0.015 // 1.5% tolerance for clustering
): SupportResistanceLevel[] {
  if (prices.length < lookback * 2 + 1) return [];

  const pivots: { price: number; type: "high" | "low" }[] = [];

  // Find local highs and lows
  for (let i = lookback; i < prices.length - lookback; i++) {
    const window = prices.slice(i - lookback, i + lookback + 1);
    const current = prices[i].close;
    const isLocalHigh = window.every((p) => p.close <= current);
    const isLocalLow = window.every((p) => p.close >= current);

    if (isLocalHigh) pivots.push({ price: current, type: "high" });
    if (isLocalLow) pivots.push({ price: current, type: "low" });
  }

  // Cluster nearby pivots into support/resistance levels
  const levels: SupportResistanceLevel[] = [];
  const used = new Set<number>();

  for (let i = 0; i < pivots.length; i++) {
    if (used.has(i)) continue;

    const cluster = [pivots[i]];
    used.add(i);

    for (let j = i + 1; j < pivots.length; j++) {
      if (used.has(j)) continue;
      if (
        Math.abs(pivots[j].price - pivots[i].price) / pivots[i].price <
        tolerance
      ) {
        cluster.push(pivots[j]);
        used.add(j);
      }
    }

    if (cluster.length >= 2) {
      const avgPrice =
        cluster.reduce((s, p) => s + p.price, 0) / cluster.length;
      const hasLow = cluster.some((c) => c.type === "low");
      const hasHigh = cluster.some((c) => c.type === "high");

      // If both highs and lows cluster at this level, it's stronger
      const type: "support" | "resistance" = hasLow ? "support" : "resistance";

      levels.push({
        price: Math.round(avgPrice * 100) / 100,
        type: hasLow && hasHigh ? "support" : type,
        strength: Math.min(3, cluster.length),
      });
    }
  }

  // Sort by price and limit to most relevant levels
  return levels.sort((a, b) => a.price - b.price).slice(0, 6);
}
