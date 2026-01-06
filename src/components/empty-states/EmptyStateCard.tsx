/**
 * @fileoverview EmptyStateCard - Componente reutilizável para estados vazios
 * Com ilustrações SVG e CTAs claros
 */

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateCardProps {
  illustration: ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: 'default' | 'minimal' | 'card';
}

export function EmptyStateCard({
  illustration,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  variant = 'default',
}: EmptyStateCardProps) {
  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      variant === 'minimal' ? 'py-8' : 'py-12 px-6',
      className
    )}>
      {/* Ilustração com animação suave */}
      <div className="mb-6 animate-fade-in">
        {illustration}
      </div>

      {/* Título */}
      <h3 className={cn(
        "font-semibold text-foreground mb-2",
        variant === 'minimal' ? 'text-base' : 'text-lg'
      )}>
        {title}
      </h3>

      {/* Descrição */}
      <p className={cn(
        "text-muted-foreground max-w-md mb-6",
        variant === 'minimal' ? 'text-xs' : 'text-sm'
      )}>
        {description}
      </p>

      {/* Ações */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {primaryAction && (
            <Button onClick={primaryAction.onClick} className="gap-2">
              {primaryAction.icon && <primaryAction.icon className="h-4 w-4" />}
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    );
  }

  return content;
}

EmptyStateCard.displayName = 'EmptyStateCard';

export default EmptyStateCard;
