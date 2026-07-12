/**
 * @fileoverview AlertasInteligentes component with motion
 * @module AlertasInteligentes
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, UserX, Calendar, AlertCircle, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alerta {
  id: string;
  tipo: 'urgente' | 'atencao' | 'info';
  categoria: 'candidato' | 'prazo' | 'processo' | 'meta';
  titulo: string;
  descricao: string;
  quantidade?: number;
  tempoRestante?: string;
}

interface AlertasInteligentesProps {
  acoesPendentes: {
    tipo: string;
    quantidade: number;
    descricao: string;
    alerta: boolean;
  }[];
  vagasUrgentes: {
    titulo: string;
    diasAberta: number;
    prioridade: string;
  }[];
}

const tipoConfig = {
  urgente: {
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30',
    badgeClass: 'bg-destructive text-destructive-foreground',
  },
  atencao: {
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    badgeClass: 'bg-warning text-warning-foreground',
  },
  info: {
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/30',
    badgeClass: 'bg-info text-info-foreground',
  },
};

const categoriaIcon = {
  candidato: UserX,
  prazo: Clock,
  processo: Calendar,
  meta: AlertCircle,
};

function generateAlertas(
  acoesPendentes: AlertasInteligentesProps['acoesPendentes'],
  vagasUrgentes: AlertasInteligentesProps['vagasUrgentes']
): Alerta[] {
  const alertas: Alerta[] = [];

  const feedbackPendente = acoesPendentes.find(a => a.tipo === 'feedback');
  if (feedbackPendente && feedbackPendente.quantidade > 5) {
    alertas.push({
      id: 'feedback-urgente',
      tipo: 'urgente',
      categoria: 'candidato',
      titulo: 'Candidatos aguardando feedback',
      descricao: `${feedbackPendente.quantidade} candidatos há mais de 3 dias sem retorno.`,
      quantidade: feedbackPendente.quantidade,
    });
  }

  const vagasMuitoAbertas = vagasUrgentes.filter(v => v.diasAberta > 15);
  if (vagasMuitoAbertas.length > 0) {
    alertas.push({
      id: 'vagas-abertas',
      tipo: 'atencao',
      categoria: 'prazo',
      titulo: 'Vagas abertas há muito tempo',
      descricao: `${vagasMuitoAbertas.length} vaga(s) abertas há mais de 15 dias.`,
      quantidade: vagasMuitoAbertas.length,
    });
  }

  const vagasUrgentesCount = vagasUrgentes.filter(v => v.prioridade === 'urgente').length;
  if (vagasUrgentesCount > 0) {
    alertas.push({
      id: 'vagas-urgentes',
      tipo: 'urgente',
      categoria: 'processo',
      titulo: 'Vagas com prioridade urgente',
      descricao: `${vagasUrgentesCount} vaga(s) precisam de atenção imediata.`,
      quantidade: vagasUrgentesCount,
    });
  }

  const propostaPendente = acoesPendentes.find(a => a.tipo === 'proposta');
  if (propostaPendente && propostaPendente.quantidade > 0) {
    alertas.push({
      id: 'propostas',
      tipo: 'atencao',
      categoria: 'candidato',
      titulo: 'Propostas aguardando resposta',
      descricao: `${propostaPendente.quantidade} candidato(s) ainda não responderam.`,
      quantidade: propostaPendente.quantidade,
    });
  }

  return alertas.slice(0, 4);
}

function AlertasInteligentesComponent({ acoesPendentes, vagasUrgentes }: AlertasInteligentesProps) {
  const alertas = generateAlertas(acoesPendentes, vagasUrgentes);

  if (alertas.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
      >
        <Card role="article" aria-label="Alertas inteligentes">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <motion.div 
              data-testid="alertas-inteligentes" 
              className="p-3 rounded-full bg-success/10 mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="h-6 w-6 text-success" />
            </motion.div>
            <p className="font-medium text-foreground">Tudo em dia!</p>
            <p className="text-sm text-muted-foreground">Nenhum alerta no momento.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div 
                className="relative"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <Bell className="h-5 w-5 text-primary" />
                <motion.span 
                  className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-destructive border-2 border-background flex items-center justify-center text-[9px] font-bold text-destructive-foreground"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {alertas.length}
                </motion.span>
              </motion.div>
              <CardTitle className="text-base font-semibold">Alertas Inteligentes</CardTitle>
            </div>
            <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="text-xs h-7">
                Ver todos
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {alertas.map((alerta, index) => {
            const config = tipoConfig[alerta.tipo];
            const Icon = categoriaIcon[alerta.categoria];

            return (
              <motion.div
                key={alerta.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, type: 'spring' as const, stiffness: 300 }}
                whileHover={{ x: 4, boxShadow: '0 4px 12px -4px hsl(var(--primary) / 0.1)' }}
                className={cn(
                  "p-3 rounded-lg border transition-all cursor-pointer group",
                  config.bgColor,
                  config.borderColor
                )}
              >
                <div className="flex items-start gap-3">
                  <motion.div 
                    className={cn("p-1.5 rounded-lg shrink-0", config.bgColor)}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{alerta.titulo}</span>
                      {alerta.quantidade && (
                        <Badge className={cn("text-[10px] px-1.5 py-0", config.badgeClass)}>
                          {alerta.quantidade}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {alerta.descricao}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}

AlertasInteligentesComponent.displayName = "AlertasInteligentes";

export const AlertasInteligentes = memo(AlertasInteligentesComponent);
export default AlertasInteligentes;
