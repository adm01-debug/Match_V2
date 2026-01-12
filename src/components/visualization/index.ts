/**
 * @fileoverview Premium Data Visualization components export
 * @module visualization
 */

// Sparkline components
export {
  Sparkline,
  SparkBar,
  SparklineTrend,
  TrendIndicator, // Backward compatibility alias
  MiniProgress,
} from "./Sparkline";

// Heatmap components
export {
  Heatmap,
  CalendarHeatmap,
  ActivityIndicator,
} from "./Heatmap";

// Candidate Heatmap
export { CandidateHeatmap } from "./CandidateHeatmap";

// Animated chart components
export {
  AnimatedAreaChart,
  AnimatedBarChart,
  AnimatedPieChart,
  AnimatedLineChart,
  StatCard,
} from "./AnimatedCharts";

// Trend indicator components
export {
  TrendBadge,
  ComparisonIndicator,
  MetricChange,
  GoalProgress,
  StreakCounter,
} from "./TrendIndicators";
