/**
 * @fileoverview Premium EntrevistasStats component
 * @module EntrevistasStats
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Clock, TrendingUp, Users, Sparkles } from 'lucide-react';
import { useEntrevistasStats } from '@/hooks/useEntrevistas';

function EntrevistasStatsComponent() {
  const { data: stats, isLoading, error } = useEntrevistasStats();

  if (isLoading) {
    return (
      <Card variant="premium" role="article" aria-label="Estatísticas de entrevistas">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            Entrevistas - Taxa de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card variant="premium">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            Entrevistas - Taxa de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 rounded-full bg-muted/50 mb-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Erro ao carregar estatísticas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
    >
      <Card variant="premium" hover="lift">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Users className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <CardTitle className="text-base font-semibold">Taxa de Conversão</CardTitle>
                <p className="text-xs text-muted-foreground">Análise de entrevistas</p>
              </div>
            </div>
            <Badge variant="glass-primary" size="sm" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Taxa de Aprovação */}
          <motion.div 
            data-testid="entrevistas-stats" 
            className="space-y-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <span className="text-sm font-medium">Taxa de Aprovação</span>
              </div>
              <Badge variant="glow-success" size="sm">
                {stats.taxaAprovacao}%
              </Badge>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden bg-muted/50">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-success to-success rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.taxaAprovacao}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Taxa de Reprovação */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-destructive/10">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
                <span className="text-sm font-medium">Taxa de Reprovação</span>
              </div>
              <Badge variant="destructive" size="sm">
                {stats.taxaReprovacao}%
              </Badge>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden bg-muted/50">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-destructive to-destructive rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.taxaReprovacao}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              />
            </div>
          </motion.div>

          {/* Estatísticas Resumidas */}
          <motion.div 
            className="grid grid-cols-3 gap-3 pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
              <motion.div 
                className="text-2xl font-bold text-success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' as const }}
              >
                {stats.aprovados}
              </motion.div>
              <div className="text-xs text-muted-foreground font-medium">Aprovados</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
              <motion.div 
                className="text-2xl font-bold text-destructive"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' as const }}
              >
                {stats.reprovados}
              </motion.div>
              <div className="text-xs text-muted-foreground font-medium">Reprovados</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
              <motion.div 
                className="text-2xl font-bold text-warning"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' as const }}
              >
                {stats.pendentes}
              </motion.div>
              <div className="text-xs text-muted-foreground font-medium">Pendentes</div>
            </div>
          </motion.div>

          {/* Nota Média e Entrevistas Futuras */}
          <motion.div 
            className="grid grid-cols-2 gap-3 pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{stats.notaMedia}/10</div>
                <div className="text-xs text-muted-foreground">Nota Média</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <div className="p-2 rounded-lg bg-accent/10">
                <Clock className="h-4 w-4 text-accent" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{stats.agendadas + stats.confirmadas}</div>
                <div className="text-xs text-muted-foreground">Agendadas</div>
              </div>
            </div>
          </motion.div>

          {/* Total */}
          <div className="text-center pt-3 border-t border-border/50">
            <span className="text-sm text-muted-foreground">
              Total de <span className="font-semibold text-foreground">{stats.realizadas}</span> entrevistas realizadas
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

EntrevistasStatsComponent.displayName = "EntrevistasStats";

export const EntrevistasStats = memo(EntrevistasStatsComponent);
export default EntrevistasStats;
