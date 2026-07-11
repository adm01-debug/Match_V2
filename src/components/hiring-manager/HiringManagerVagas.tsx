import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Briefcase, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ManagerVaga } from './hiringManagerMockData';

export function HiringManagerVagas({ vagas }: { vagas: ManagerVaga[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />Minhas Vagas
        </CardTitle>
        <CardDescription>Vagas sob sua responsabilidade</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {vagas.map((vaga, index) => (
          <motion.div
            key={vaga.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'p-4 rounded-xl border-2 transition-all',
              vaga.urgente ? 'border-warning/30 bg-warning/5' : 'border-border hover:border-primary/30',
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{vaga.titulo}</h4>
                  {vaga.urgente && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />Urgente
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{vaga.departamento}</p>
              </div>
              <Badge variant="outline">{vaga.diasAberta} dias aberta</Badge>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-3">
              <div className="text-center">
                <p className="text-2xl font-bold">{vaga.totalCandidatos}</p>
                <p className="text-xs text-muted-foreground">Candidatos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{vaga.emProcesso}</p>
                <p className="text-xs text-muted-foreground">Em Processo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{vaga.contratados}</p>
                <p className="text-xs text-muted-foreground">Contratados</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{vaga.meta}</p>
                <p className="text-xs text-muted-foreground">Meta</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{vaga.contratados}/{vaga.meta}</span>
              </div>
              <Progress value={(vaga.contratados / vaga.meta) * 100} className="h-2" />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
