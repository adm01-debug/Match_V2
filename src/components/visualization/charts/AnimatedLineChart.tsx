import { memo } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

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
