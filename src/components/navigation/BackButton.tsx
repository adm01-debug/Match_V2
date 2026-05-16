/**
 * @fileoverview BackButton Component
 * @description Botão de voltar inteligente com histórico e animações
 */

import { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface BackButtonProps {
  className?: string;
  fallbackPath?: string;
  variant?: 'ghost' | 'outline' | 'default';
  showLabel?: boolean;
}

export const BackButton = memo(function BackButton({
  className,
  fallbackPath = '/',
  variant = 'ghost',
  showLabel = true,
}: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Se o histórico estiver vazio ou for a primeira página, vai para o fallback
    if (window.history.length <= 2) {
      navigate(fallbackPath);
    } else {
      navigate(-1);
    }
  };

  // Não mostrar botão de voltar na home
  if (location.pathname === '/' || location.pathname === '/portal/dashboard') {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={variant}
            size="sm"
            onClick={handleBack}
            className={cn(
              "gap-1 h-9 px-2 text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50 rounded-lg",
              className
            )}
            aria-label="Voltar para a página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
            {showLabel && <span className="text-sm font-medium pr-1">Voltar</span>}
          </Button>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>Voltar (Alt + ←)</p>
      </TooltipContent>
    </Tooltip>
  );
});

BackButton.displayName = 'BackButton';
