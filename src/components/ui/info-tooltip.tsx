/**
 * @fileoverview Informative Hover Cards
 * Rich tooltips with contextual information
 */

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { 
  Info, 
  HelpCircle, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

interface InfoTooltipProps {
  children: ReactNode;
  title?: string;
  description: string;
  variant?: "info" | "help" | "tip" | "warning" | "success";
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

const variantConfig = {
  info: { icon: Info, color: "text-info", bg: "bg-info/10" },
  help: { icon: HelpCircle, color: "text-muted-foreground", bg: "bg-muted" },
  tip: { icon: Lightbulb, color: "text-warning", bg: "bg-warning/10" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" }
};

export function InfoTooltip({
  children,
  title,
  description,
  variant = "info",
  side = "top",
  className
}: InfoTooltipProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className={cn("inline-flex items-center cursor-help", className)}>
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent side={side} className="w-72">
        <div className="flex gap-3">
          <div className={cn("flex-shrink-0 p-2 rounded-lg", config.bg)}>
            <Icon className={cn("h-4 w-4", config.color)} />
          </div>
          <div className="space-y-1">
            {title && (
              <h4 className="text-sm font-semibold">{title}</h4>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

interface MetricTooltipProps {
  children: ReactNode;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  description?: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function MetricTooltip({
  children,
  label,
  value,
  change,
  changeLabel = "vs. período anterior",
  description,
  side = "top"
}: MetricTooltipProps) {
  const getTrendIcon = () => {
    if (!change) return <Minus className="h-3 w-3 text-muted-foreground" />;
    if (change > 0) return <TrendingUp className="h-3 w-3 text-success" />;
    return <TrendingDown className="h-3 w-3 text-destructive" />;
  };

  const getTrendColor = () => {
    if (!change) return "text-muted-foreground";
    return change > 0 ? "text-success" : "text-destructive";
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className="cursor-help">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent side={side} className="w-64">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          
          {change !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              {getTrendIcon()}
              <span className={getTrendColor()}>
                {change > 0 ? "+" : ""}{change}%
              </span>
              <span className="text-muted-foreground text-xs">
                {changeLabel}
              </span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-muted-foreground border-t border-border pt-2">
              {description}
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

interface UserTooltipProps {
  children: ReactNode;
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
  status?: "online" | "offline" | "away" | "busy";
  side?: "top" | "right" | "bottom" | "left";
}

const statusConfig = {
  online: { label: "Online", color: "bg-success" },
  offline: { label: "Offline", color: "bg-muted-foreground" },
  away: { label: "Ausente", color: "bg-warning" },
  busy: { label: "Ocupado", color: "bg-destructive" }
};

export function UserTooltip({
  children,
  name,
  email,
  role,
  avatar,
  status,
  side = "top"
}: UserTooltipProps) {
  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent side={side} className="w-72">
        <div className="flex gap-3">
          <div className="relative flex-shrink-0">
            {avatar ? (
              <img 
                src={avatar} 
                alt={name} 
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {status && (
              <span className={cn(
                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                statusConfig[status].color
              )} />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold truncate">{name}</h4>
            {role && (
              <p className="text-xs text-muted-foreground">{role}</p>
            )}
            {email && (
              <p className="text-xs text-muted-foreground truncate mt-1">
                {email}
              </p>
            )}
            {status && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  statusConfig[status].color
                )} />
                <span className="text-xs text-muted-foreground">
                  {statusConfig[status].label}
                </span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

interface QuickActionsTooltipProps {
  children: ReactNode;
  actions: Array<{
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    variant?: "default" | "destructive";
  }>;
  side?: "top" | "right" | "bottom" | "left";
}

export function QuickActionsTooltip({
  children,
  actions,
  side = "right"
}: QuickActionsTooltipProps) {
  return (
    <HoverCard openDelay={400} closeDelay={200}>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent side={side} className="w-48 p-2">
        <div className="space-y-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                "transition-colors hover:bg-muted",
                action.variant === "destructive" && "text-destructive hover:bg-destructive/10"
              )}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default {
  InfoTooltip,
  MetricTooltip,
  UserTooltip,
  QuickActionsTooltip
};
