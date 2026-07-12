import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown, ArrowRight, ChevronUp, ChevronDown, type LucideIcon } from "lucide-react";


export type TrendDirection = "up" | "down" | "neutral";

interface TrendInfo {
  trend: TrendDirection;
  change: number;
  percentChange: number;
  color: string;
  bgColor: string;
  Icon: LucideIcon;
}

export function getTrendInfo(
  value: number,
  previousValue: number,
  iconSet: "trending" | "arrow" | "chevron" = "trending"
): TrendInfo {
  const diff = value - previousValue;
  const pct = previousValue !== 0 ? (diff / previousValue) * 100 : 0;

  const icons = {
    trending: { up: TrendingUp, down: TrendingDown, neutral: Minus },
    arrow: { up: ArrowUp, down: ArrowDown, neutral: ArrowRight },
    chevron: { up: ChevronUp, down: ChevronDown, neutral: Minus },
  }[iconSet];

  if (diff > 0) {
    return {
      trend: "up",
      change: diff,
      percentChange: pct,
      color: "text-success",
      bgColor: "bg-success/10",
      Icon: icons.up,
    };
  }
  if (diff < 0) {
    return {
      trend: "down",
      change: Math.abs(diff),
      percentChange: Math.abs(pct),
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      Icon: icons.down,
    };
  }
  return {
    trend: "neutral",
    change: 0,
    percentChange: 0,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    Icon: icons.neutral,
  };
}
