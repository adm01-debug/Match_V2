import { memo } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

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
