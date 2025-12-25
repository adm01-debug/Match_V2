import { memo } from 'react';

// Chart color constants using CSS variables
const CHART_COLORS = {
  primary: 'hsl(var(--chart-1))',
  secondary: 'hsl(var(--chart-2))',
  accent: 'hsl(var(--chart-3))',
  muted: 'hsl(var(--chart-4))',
  highlight: 'hsl(var(--chart-5))',
};
/**
 * @fileoverview EntrevistasChart component
 * @module EntrevistasChart
 */

export const EntrevistasChart = memo(EntrevistasChartBase);
EntrevistasChart.displayName = 'EntrevistasChart';
