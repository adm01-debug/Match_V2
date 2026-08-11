import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
                    transition={{ duration: 1.5, ease: "easeInOut" }}
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
