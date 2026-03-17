import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sun,
  Moon,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  ShieldCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import {
  FUNDS,
  FUND_HISTORIES,
  FUND_RSI,
  calculateDipSignals,
  getCurrentSignal,
  type FundInfo,
} from "@/lib/fundData";
import { useTheme } from "@/components/ThemeProvider";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

const SIGNAL_COLORS = {
  strong_buy: { bg: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/30", label: "Strong Buy" },
  buy: { bg: "bg-blue-500/15", text: "text-blue-500", border: "border-blue-500/30", label: "Buy the Dip" },
  neutral: { bg: "bg-amber-500/15", text: "text-amber-500", border: "border-amber-500/30", label: "Neutral" },
  caution: { bg: "bg-red-500/15", text: "text-red-500", border: "border-red-500/30", label: "Caution" },
};

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatPct(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function formatVolume(n: number) {
  if (n === 0) return "N/A";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function formatExpenseRatio(er: number) {
  if (er === 0) return "0.00%";
  return `${er.toFixed(er < 0.01 ? 3 : 2)}%`;
}

function annualCostPer10k(er: number) {
  return formatPrice((er / 100) * 10000);
}

// Fund Selector Dropdown
function FundSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (ticker: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px] h-8 text-xs" data-testid="fund-selector">
        <SelectValue placeholder="Select fund" />
      </SelectTrigger>
      <SelectContent>
        {FUNDS.map((f) => (
          <SelectItem key={f.ticker} value={f.ticker} className="text-xs">
            <span className="font-medium">{f.ticker}</span>
            <span className="text-muted-foreground ml-1.5">
              {f.type === "ETF" ? "ETF" : "MF"} · {formatExpenseRatio(f.expenseRatio)}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// KPI Card Component
function KpiCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card className="border-border/50" data-testid={`kpi-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="tabular-nums text-lg font-semibold">{value}</div>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
            {trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Signal Badge
function SignalBadge({ signal }: { signal: keyof typeof SIGNAL_COLORS }) {
  const cfg = SIGNAL_COLORS[signal];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
      {signal === "strong_buy" && <CheckCircle className="h-3 w-3" />}
      {signal === "buy" && <Target className="h-3 w-3" />}
      {signal === "neutral" && <Info className="h-3 w-3" />}
      {signal === "caution" && <AlertTriangle className="h-3 w-3" />}
      {cfg.label}
    </span>
  );
}

// Fund Row Component
function FundRow({ fund, rank }: { fund: FundInfo; rank: number }) {
  const isPositive = fund.change >= 0;
  return (
    <tr
      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
      data-testid={`fund-row-${fund.ticker}`}
    >
      <td className="py-3 px-4 text-xs text-muted-foreground tabular-nums">{rank}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{fund.ticker}</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {fund.type}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{fund.name}</div>
      </td>
      <td className="py-3 px-4">
        <Badge variant="secondary" className="text-[10px]">{fund.category}</Badge>
      </td>
      <td className="py-3 px-4">
        <span className={`text-sm font-semibold tabular-nums ${fund.expenseRatio === 0 ? "text-emerald-500" : ""}`}>
          {formatExpenseRatio(fund.expenseRatio)}
        </span>
        <div className="text-[10px] text-muted-foreground mt-0.5">
          {annualCostPer10k(fund.expenseRatio)}/yr per $10K
        </div>
      </td>
      <td className="py-3 px-4 tabular-nums text-sm font-medium">{formatPrice(fund.price)}</td>
      <td className="py-3 px-4">
        <div className={`flex items-center gap-1 text-sm font-medium tabular-nums ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
          {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {formatPct(fund.changePercent)}
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground tabular-nums">{formatPrice(fund.yearLow)}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground tabular-nums">{formatPrice(fund.yearHigh)}</td>
      <td className="py-3 px-4">
        {/* 52-week range bar */}
        <div className="w-24 relative">
          <div className="h-1.5 bg-muted rounded-full">
            <div
              className="h-full bg-primary rounded-full relative"
              style={{
                width: `${Math.min(100, Math.max(0, ((fund.price - fund.yearLow) / (fund.yearHigh - fund.yearLow)) * 100))}%`,
              }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
            </div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-xs text-muted-foreground">{fund.provider}</td>
      <td className="py-3 px-4 text-xs text-muted-foreground">{fund.minInvestment}</td>
    </tr>
  );
}

// Expense Ratio Chart
function ExpenseChart({ funds }: { funds: FundInfo[] }) {
  const data = funds.map((f) => ({
    ticker: f.ticker,
    expenseRatio: f.expenseRatio,
    annualCost: (f.expenseRatio / 100) * 10000,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis dataKey="ticker" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(v) => `${v}%`}
          domain={[0, "auto"]}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number) => [`${value.toFixed(3)}%`, "Expense Ratio"]}
        />
        <Bar dataKey="expenseRatio" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                entry.expenseRatio === 0
                  ? "hsl(160, 60%, 45%)"
                  : entry.expenseRatio <= 0.02
                    ? "hsl(210, 76%, 50%)"
                    : entry.expenseRatio <= 0.03
                      ? "hsl(210, 60%, 60%)"
                      : "hsl(220, 40%, 65%)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Price Chart with SMA - now accepts selectedTicker
function PriceChart({ selectedTicker }: { selectedTicker: string }) {
  const priceHistory = FUND_HISTORIES[selectedTicker] ?? [];
  const signals = calculateDipSignals(priceHistory);
  const chartData = priceHistory.slice(19).map((d, i) => ({
    date: d.date,
    price: d.close,
    sma20: signals[i]?.sma20 ?? d.close,
    signal: signals[i]?.signal,
  }));

  if (chartData.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No price data available for {selectedTicker}.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(210, 76%, 50%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(210, 76%, 50%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(v) => {
            const d = new Date(v + "T00:00:00");
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }}
          interval={Math.floor(chartData.length / 8)}
        />
        <YAxis
          domain={["auto", "auto"]}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelFormatter={(v) => {
            const d = new Date(v + "T00:00:00");
            return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
          }}
          formatter={(value: number, name: string) => [
            `$${value.toFixed(2)}`,
            name === "price" ? `${selectedTicker} Price` : "20-Day SMA",
          ]}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="hsl(210, 76%, 50%)"
          strokeWidth={2}
          fill="url(#priceGradient)"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="sma20"
          stroke="hsl(43, 74%, 49%)"
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// RSI Chart - now accepts selectedTicker
function RsiChart({ selectedTicker }: { selectedTicker: string }) {
  const rsiData = FUND_RSI[selectedTicker] ?? [];
  const data = [...rsiData].reverse();

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No RSI data available for {selectedTicker}.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(v) => {
            const d = new Date(v + "T00:00:00");
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }}
          interval={Math.floor(data.length / 6)}
        />
        <YAxis
          domain={[20, 80]}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          ticks={[30, 40, 50, 60, 70]}
        />
        <ReferenceLine y={30} stroke="hsl(160, 60%, 45%)" strokeDasharray="3 3" strokeOpacity={0.8} />
        <ReferenceLine y={70} stroke="hsl(0, 72%, 51%)" strokeDasharray="3 3" strokeOpacity={0.8} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number) => [value.toFixed(1), "RSI (14)"]}
        />
        <Line
          type="monotone"
          dataKey="rsi"
          stroke="hsl(262, 52%, 55%)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Dip Signal Timeline - now accepts selectedTicker
function DipTimeline({ selectedTicker }: { selectedTicker: string }) {
  const priceHistory = FUND_HISTORIES[selectedTicker] ?? [];
  const signals = calculateDipSignals(priceHistory);
  const buySignals = signals.filter((s) => s.signal === "strong_buy" || s.signal === "buy");

  if (buySignals.length === 0) {
    return <p className="text-sm text-muted-foreground">No dip signals detected in the past year for {selectedTicker}.</p>;
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
      {buySignals.slice(-10).reverse().map((s) => (
        <div key={s.date} className={`flex items-start gap-3 p-3 rounded-lg ${SIGNAL_COLORS[s.signal].bg} border ${SIGNAL_COLORS[s.signal].border}`}>
          <div className="mt-0.5">
            <SignalBadge signal={s.signal} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium tabular-nums">{formatPrice(s.close)}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(s.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{s.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// 10-Year Cost Comparison
function CostComparison({ funds }: { funds: FundInfo[] }) {
  const investment = 100000;
  const annualReturn = 0.10;
  const years = [1, 5, 10, 20, 30];

  const data = years.map((yr) => {
    const row: Record<string, number | string> = { year: `${yr}yr` };
    funds.slice(0, 6).forEach((f) => {
      const er = f.expenseRatio / 100;
      const withFees = investment * Math.pow(1 + annualReturn - er, yr);
      const noFees = investment * Math.pow(1 + annualReturn, yr);
      row[f.ticker] = Math.round(noFees - withFees);
    });
    return row;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Period</th>
            {funds.slice(0, 6).map((f) => (
              <th key={f.ticker} className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">
                {f.ticker} ({formatExpenseRatio(f.expenseRatio)})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.year as string} className="border-b border-border/50">
              <td className="py-2 px-3 font-medium text-xs">{row.year}</td>
              {funds.slice(0, 6).map((f) => (
                <td key={f.ticker} className="py-2 px-3 text-right tabular-nums text-xs">
                  {row[f.ticker] === 0 ? (
                    <span className="text-emerald-500 font-medium">$0</span>
                  ) : (
                    <span className="text-red-400">-{formatPrice(row[f.ticker] as number)}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-muted-foreground mt-2 px-3">
        Assumes $100K initial investment, 10% annual return. Shows cumulative cost of fees vs. zero-fee fund.
      </p>
    </div>
  );
}

// Main Dashboard
export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"expenseRatio" | "price" | "changePercent">("expenseRatio");
  const [selectedTicker, setSelectedTicker] = useState<string>("VOO");

  const sortedFunds = useMemo(() => {
    let filtered = FUNDS;
    if (categoryFilter !== "all") {
      filtered = FUNDS.filter((f) => f.category === categoryFilter);
    }
    return [...filtered].sort((a, b) => {
      if (sortBy === "expenseRatio") return a.expenseRatio - b.expenseRatio;
      if (sortBy === "price") return b.price - a.price;
      return b.changePercent - a.changePercent;
    });
  }, [categoryFilter, sortBy]);

  const currentSignal = getCurrentSignal(selectedTicker);
  const avgExpenseRatio = FUNDS.reduce((s, f) => s + f.expenseRatio, 0) / FUNDS.length;
  const cheapestFund = FUNDS.reduce((a, b) => (a.expenseRatio < b.expenseRatio ? a : b));
  const bestPerformer = FUNDS.reduce((a, b) => (a.changePercent > b.changePercent ? a : b));
  const selectedFund = FUNDS.find((f) => f.ticker === selectedTicker);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="IndexPulse Logo">
              <rect width="32" height="32" rx="8" fill="hsl(210, 76%, 42%)" />
              <path d="M8 22L12 12L18 18L24 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="8" r="2" fill="white" />
            </svg>
            <div>
              <h1 className="text-base font-bold tracking-tight">IndexPulse</h1>
              <p className="text-[10px] text-muted-foreground">Low-Cost Index Fund Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Updated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8"
              data-testid="theme-toggle"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Market Signal Banner */}
        <Card className={`border ${SIGNAL_COLORS[currentSignal.signal].border} ${SIGNAL_COLORS[currentSignal.signal].bg}`}>
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${SIGNAL_COLORS[currentSignal.signal].bg}`}>
                  <ShieldCheck className={`h-6 w-6 ${SIGNAL_COLORS[currentSignal.signal].text}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">Market Signal</span>
                    <SignalBadge signal={currentSignal.signal} />
                    <span className="text-xs text-muted-foreground font-medium">for {selectedTicker}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedFund ? selectedFund.name : "Select a fund below"}
                  </p>
                </div>
              </div>
              <div className="flex-1 sm:text-right">
                <ul className="space-y-0.5">
                  {currentSignal.reasons.map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5 sm:justify-end">
                      <span className={`w-1 h-1 rounded-full ${SIGNAL_COLORS[currentSignal.signal].text} bg-current`} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="Lowest Cost"
            value={`${cheapestFund.ticker} (${formatExpenseRatio(cheapestFund.expenseRatio)})`}
            subtext={`${annualCostPer10k(cheapestFund.expenseRatio)}/yr per $10K`}
            icon={Target}
            trend="down"
          />
          <KpiCard
            label="Avg Expense Ratio"
            value={formatExpenseRatio(avgExpenseRatio)}
            subtext={`Across ${FUNDS.length} tracked funds`}
            icon={BarChart3}
          />
          <KpiCard
            label="Best Daily Mover"
            value={`${bestPerformer.ticker} ${formatPct(bestPerformer.changePercent)}`}
            subtext={`${formatPrice(bestPerformer.price)}`}
            icon={TrendingUp}
            trend="up"
          />
          <KpiCard
            label="RSI (14-Day)"
            value={currentSignal.rsi.toFixed(1)}
            subtext={currentSignal.rsi < 30 ? "Oversold" : currentSignal.rsi > 70 ? "Overbought" : currentSignal.rsi < 40 ? "Approaching oversold" : "Neutral zone"}
            icon={BarChart3}
            trend={currentSignal.rsi < 40 ? "down" : currentSignal.rsi > 60 ? "up" : "neutral"}
          />
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="price" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="price" data-testid="tab-price">Price & SMA</TabsTrigger>
            <TabsTrigger value="rsi" data-testid="tab-rsi">RSI</TabsTrigger>
            <TabsTrigger value="expenses" data-testid="tab-expenses">Expense Comparison</TabsTrigger>
            <TabsTrigger value="cost" data-testid="tab-cost">Cost Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="price">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <FundSelector value={selectedTicker} onChange={setSelectedTicker} />
                    <div>
                      <CardTitle className="text-sm font-semibold">{selectedTicker} Price History</CardTitle>
                      <p className="text-xs text-muted-foreground">1-year daily close with 20-day SMA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-[hsl(210,76%,50%)] rounded" />
                      Price
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-[hsl(43,74%,49%)] rounded border-dashed" style={{ borderBottom: "1.5px dashed hsl(43,74%,49%)", height: 0 }} />
                      20-Day SMA
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PriceChart selectedTicker={selectedTicker} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rsi">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <FundSelector value={selectedTicker} onChange={setSelectedTicker} />
                    <div>
                      <CardTitle className="text-sm font-semibold">RSI (14-Day) — {selectedTicker}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Below 30 = oversold (buy signal) / Above 70 = overbought (caution)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 rounded" style={{ background: "hsl(160, 60%, 45%)" }} />
                      Oversold (30)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 rounded" style={{ background: "hsl(0, 72%, 51%)" }} />
                      Overbought (70)
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RsiChart selectedTicker={selectedTicker} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Expense Ratio Comparison</CardTitle>
                <p className="text-xs text-muted-foreground">Annual fee as percentage of assets under management</p>
              </CardHeader>
              <CardContent>
                <ExpenseChart funds={sortedFunds} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cost">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Cumulative Fee Impact on $100K</CardTitle>
                <p className="text-xs text-muted-foreground">How much fees cost you over time vs. a zero-fee fund</p>
              </CardHeader>
              <CardContent>
                <CostComparison funds={sortedFunds} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dip Signal Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <FundSelector value={selectedTicker} onChange={setSelectedTicker} />
                  <div>
                    <CardTitle className="text-sm font-semibold">Buy-the-Dip Signals</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Recent dip opportunities for {selectedTicker} based on SMA deviation and drawdown
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DipTimeline selectedTicker={selectedTicker} />
              </CardContent>
            </Card>
          </div>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Signal Methodology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="font-semibold text-emerald-500 mb-1">Strong Buy</div>
                  <p className="text-muted-foreground">RSI below 30, or price 5%+ below 20-day SMA, or 8%+ drawdown from recent high</p>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="font-semibold text-blue-500 mb-1">Buy the Dip</div>
                  <p className="text-muted-foreground">RSI below 40, or price 2-5% below 20-day SMA, or 4-8% drawdown</p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="font-semibold text-amber-500 mb-1">Neutral</div>
                  <p className="text-muted-foreground">Price within normal range of moving average, RSI between 40-60</p>
                </div>
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="font-semibold text-red-500 mb-1">Caution</div>
                  <p className="text-muted-foreground">RSI above 70, or price 3%+ above 20-day SMA — consider waiting for a pullback</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                These signals are for educational purposes only and do not constitute financial advice. Always do your own research before investing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Fund Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Fund Comparison — Ranked by Expense Ratio
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {sortedFunds.length} funds tracked across {new Set(FUNDS.map((f) => f.provider)).size} providers
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {["all", "S&P 500", "Total Market", "Large Cap Zero", "Total Market Zero"].map((cat) => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setCategoryFilter(cat)}
                    data-testid={`filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {cat === "all" ? "All" : cat}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="fund-table">
                <thead className="bg-muted/30 sticky top-0">
                  <tr className="border-b border-border">
                    <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">#</th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Fund</th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground" onClick={() => setSortBy("expenseRatio")}>
                      Expense Ratio {sortBy === "expenseRatio" ? "▲" : ""}
                    </th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground" onClick={() => setSortBy("price")}>
                      Price {sortBy === "price" ? "▼" : ""}
                    </th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground" onClick={() => setSortBy("changePercent")}>
                      Today {sortBy === "changePercent" ? "▼" : ""}
                    </th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">52W Low</th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">52W High</th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Range</th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Provider</th>
                    <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Min</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFunds.map((fund, i) => (
                    <FundRow key={fund.ticker} fund={fund} rank={i + 1} />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="pt-4 pb-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground leading-relaxed max-w-md">
            Data sourced from financial APIs. Expense ratios per fund prospectuses. This tool is for educational and informational purposes only. Not financial advice. Past performance does not guarantee future results.
          </p>
          <PerplexityAttribution />
        </footer>
      </main>
    </div>
  );
}
