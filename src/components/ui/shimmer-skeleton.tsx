import { cn } from "@/lib/utils";
import { memo } from "react";

interface ShimmerSkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card" | "kpi" | "table-row" | "avatar" | "button";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

export const ShimmerSkeleton = memo(function ShimmerSkeleton({
  className,
  variant = "text",
  width,
  height,
  lines = 1,
}: ShimmerSkeletonProps) {
  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  const baseClass = cn("bg-muted rounded", shimmerClass);

  switch (variant) {
    case "circular":
      return (
        <div
          className={cn(baseClass, "rounded-full", className)}
          style={{ 
            width: style.width ?? 40, 
            height: style.height ?? 40 
          }}
        />
      );

    case "rectangular":
      return (
        <div
          className={cn(baseClass, "rounded-lg", className)}
          style={{ 
            width: style.width ?? "100%", 
            height: style.height ?? 120 
          }}
        />
      );

    case "avatar":
      return (
        <div className={cn("flex items-center gap-3", className)}>
          <div className={cn(baseClass, "rounded-full w-10 h-10 flex-shrink-0")} />
          <div className="flex-1 space-y-2">
            <div className={cn(baseClass, "h-4 w-3/4")} />
            <div className={cn(baseClass, "h-3 w-1/2")} />
          </div>
        </div>
      );

    case "button":
      return (
        <div
          className={cn(baseClass, "rounded-md", className)}
          style={{ 
            width: style.width ?? 80, 
            height: style.height ?? 36 
          }}
        />
      );

    case "kpi":
      return (
        <div className={cn("p-6 rounded-xl border bg-card space-y-4", className)}>
          <div className="flex items-center justify-between">
            <div className={cn(baseClass, "h-4 w-24")} />
            <div className={cn(baseClass, "rounded-full w-10 h-10")} />
          </div>
          <div className={cn(baseClass, "h-8 w-20")} />
          <div className={cn(baseClass, "h-3 w-32")} />
        </div>
      );

    case "card":
      return (
        <div className={cn("p-4 rounded-lg border bg-card space-y-3", className)}>
          <div className={cn(baseClass, "h-5 w-3/4")} />
          <div className={cn(baseClass, "h-4 w-full")} />
          <div className={cn(baseClass, "h-4 w-5/6")} />
          <div className="flex gap-2 pt-2">
            <div className={cn(baseClass, "h-6 w-16 rounded-full")} />
            <div className={cn(baseClass, "h-6 w-16 rounded-full")} />
          </div>
        </div>
      );

    case "table-row":
      return (
        <div className={cn("flex items-center gap-4 p-3 border-b", className)}>
          <div className={cn(baseClass, "rounded-full w-8 h-8")} />
          <div className={cn(baseClass, "h-4 flex-1")} />
          <div className={cn(baseClass, "h-4 w-20")} />
          <div className={cn(baseClass, "h-4 w-16")} />
          <div className={cn(baseClass, "h-6 w-6 rounded")} />
        </div>
      );

    case "text":
    default:
      return (
        <div className={cn("space-y-2", className)} style={style}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                baseClass,
                "h-4",
                i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
              )}
            />
          ))}
        </div>
      );
  }
});

// Componentes de conveniência
export const ShimmerKPI = memo(function ShimmerKPI({ className }: { className?: string }) {
  return <ShimmerSkeleton variant="kpi" className={className} />;
});

export const ShimmerCard = memo(function ShimmerCard({ className }: { className?: string }) {
  return <ShimmerSkeleton variant="card" className={className} />;
});

export const ShimmerAvatar = memo(function ShimmerAvatar({ className }: { className?: string }) {
  return <ShimmerSkeleton variant="avatar" className={className} />;
});

export const ShimmerTableRow = memo(function ShimmerTableRow({ className }: { className?: string }) {
  return <ShimmerSkeleton variant="table-row" className={className} />;
});

export const ShimmerText = memo(function ShimmerText({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string 
}) {
  return <ShimmerSkeleton variant="text" lines={lines} className={className} />;
});

// Grid de KPIs
export const ShimmerKPIGrid = memo(function ShimmerKPIGrid({ 
  count = 4,
  className 
}: { 
  count?: number;
  className?: string 
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerKPI key={i} />
      ))}
    </div>
  );
});

// Lista de cards
export const ShimmerCardList = memo(function ShimmerCardList({ 
  count = 3,
  className 
}: { 
  count?: number;
  className?: string 
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </div>
  );
});

// Tabela completa
export const ShimmerTable = memo(function ShimmerTable({ 
  rows = 5,
  className 
}: { 
  rows?: number;
  className?: string 
}) {
  const shimmerBase = cn("bg-muted rounded", shimmerClass);
  
  return (
    <div className={cn("rounded-lg border", className)}>
      <div className="flex items-center gap-4 p-3 bg-muted/50 border-b">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={cn(shimmerBase, "h-4 flex-1")} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <ShimmerTableRow key={i} />
      ))}
    </div>
  );
});
