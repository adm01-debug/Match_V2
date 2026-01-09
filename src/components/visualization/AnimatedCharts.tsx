/**
 * @fileoverview Premium Animated Chart components with smooth transitions
 * @module AnimatedCharts
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface AnimatedAreaChartProps {
  data: ChartDataPoint[];
  dataKey?: string;
  color?: string;
  gradientId?: string;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  className?: string;
}

export const AnimatedAreaChart = memo(function AnimatedAreaChart({
  data,
  dataKey = "value",
  color = "hsl(var(--primary))",
  gradientId = "areaGradient",
  height = 200,
  showGrid = true,
  showAxis = true,
  showTooltip = true,
  animated = true,
  className,
}: AnimatedAreaChartProps) {
  return (
    <motion.div
      className={cn("w-full", className)}
      initial={animated ? { opacity: 0, y: 20 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
          )}
          {showAxis && (
            <>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
            </>
          )}
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px hsl(var(--foreground) / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
          )}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            animationDuration={animated ? 1500 : 0}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

interface AnimatedBarChartProps {
  data: ChartDataPoint[];
  dataKey?: string;
  colors?: string[];
  height?: number;
  layout?: "horizontal" | "vertical";
  showGrid?: boolean;
  showAxis?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  radius?: number;
  className?: string;
}

export const AnimatedBarChart = memo(function AnimatedBarChart({
  data,
  dataKey = "value",
  colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--info))"],
  height = 200,
  layout = "horizontal",
  showGrid = true,
  showAxis = true,
  showTooltip = true,
  animated = true,
  radius = 4,
  className,
}: AnimatedBarChartProps) {
  return (
    <motion.div
      className={cn("w-full", className)}
      initial={animated ? { opacity: 0, y: 20 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              horizontal={layout === "horizontal"}
              vertical={layout === "vertical"}
            />
          )}
          {showAxis && (
            <>
              <XAxis
                type={layout === "vertical" ? "number" : "category"}
                dataKey={layout === "horizontal" ? "name" : undefined}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                type={layout === "horizontal" ? "number" : "category"}
                dataKey={layout === "vertical" ? "name" : undefined}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
            </>
          )}
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px hsl(var(--foreground) / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
            />
          )}
          <Bar
            dataKey={dataKey}
            radius={[radius, radius, radius, radius]}
            animationDuration={animated ? 1000 : 0}
            animationEasing="ease-out"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

interface AnimatedPieChartProps {
  data: ChartDataPoint[];
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
  showLabels?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  className?: string;
}

export const AnimatedPieChart = memo(function AnimatedPieChart({
  data,
  colors = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--info))",
    "hsl(var(--warning))",
    "hsl(var(--success))",
  ],
  innerRadius = 60,
  outerRadius = 80,
  height = 250,
  showLabels = false,
  showTooltip = true,
  showLegend = true,
  animated = true,
  className,
}: AnimatedPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <motion.div
      className={cn("w-full", className)}
      initial={animated ? { opacity: 0, scale: 0.9 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px hsl(var(--foreground) / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          )}
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            animationDuration={animated ? 1000 : 0}
            animationEasing="ease-out"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            label={showLabels ? ({ name, percent }) => 
              `${name}: ${(percent * 100).toFixed(0)}%` : undefined
            }
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={colors[index % colors.length]}
                style={{
                  filter: activeIndex === index ? "brightness(1.1)" : undefined,
                  transform: activeIndex === index ? "scale(1.05)" : undefined,
                  transformOrigin: "center",
                  transition: "all 0.2s ease-out",
                }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

interface AnimatedLineChartProps {
  data: ChartDataPoint[];
  lines?: { key: string; color: string; name?: string }[];
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showDots?: boolean;
  animated?: boolean;
  className?: string;
}

export const AnimatedLineChart = memo(function AnimatedLineChart({
  data,
  lines = [{ key: "value", color: "hsl(var(--primary))" }],
  height = 200,
  showGrid = true,
  showAxis = true,
  showTooltip = true,
  showLegend = false,
  showDots = true,
  animated = true,
  className,
}: AnimatedLineChartProps) {
  return (
    <motion.div
      className={cn("w-full", className)}
      initial={animated ? { opacity: 0, y: 20 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
          )}
          {showAxis && (
            <>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
            </>
          )}
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px hsl(var(--foreground) / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          )}
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name || line.key}
              stroke={line.color}
              strokeWidth={2}
              dot={showDots ? { r: 4, fill: line.color } : false}
              activeDot={{ r: 6, fill: line.color }}
              animationDuration={animated ? 1500 : 0}
              animationEasing="ease-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  sparklineData?: number[];
  icon?: React.ReactNode;
  color?: string;
  animated?: boolean;
  className?: string;
}

export const StatCard = memo(function StatCard({
  title,
  value,
  change,
  changeLabel,
  sparklineData,
  icon,
  color = "hsl(var(--primary))",
  animated = true,
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${color}20` }}
            >
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <motion.div
                className="text-2xl font-bold"
                initial={animated ? { opacity: 0 } : undefined}
                animate={animated ? { opacity: 1 } : undefined}
                transition={{ delay: 0.2 }}
              >
                {value}
              </motion.div>
              {change !== undefined && (
                <div
                  className={cn(
                    "flex items-center text-xs mt-1",
                    isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  <span>{isPositive ? "+" : ""}{change}%</span>
                  {changeLabel && (
                    <span className="text-muted-foreground ml-1">
                      {changeLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
            {sparklineData && sparklineData.length > 0 && (
              <div className="ml-4">
                <svg width="60" height="24" className="overflow-visible">
                  <motion.path
                    d={`M ${sparklineData
                      .map((v, i) => {
                        const x = (i / (sparklineData.length - 1)) * 60;
                        const max = Math.max(...sparklineData);
                        const min = Math.min(...sparklineData);
                        const range = max - min || 1;
                        const y = 22 - ((v - min) / range) * 20;
                        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    initial={animated ? { pathLength: 0 } : undefined}
                    animate={animated ? { pathLength: 1 } : undefined}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </svg>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

AnimatedAreaChart.displayName = "AnimatedAreaChart";
AnimatedBarChart.displayName = "AnimatedBarChart";
AnimatedPieChart.displayName = "AnimatedPieChart";
AnimatedLineChart.displayName = "AnimatedLineChart";
StatCard.displayName = "StatCard";
