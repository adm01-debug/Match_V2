import { memo, useState } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

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
            label={showLabels ? ({ name, percent }: { name: string; percent: number }) => 
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
