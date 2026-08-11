import { memo } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

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
