import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, BarChart3, MessageSquare, Award } from 'lucide-react';
import type { ManagerEntrevista } from './hiringManagerMockData';
import { progressData } from './hiringManagerMockData';

export function HiringManagerSidebar({ entrevistas }: { entrevistas: ManagerEntrevista[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />Próximas Entrevistas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {entrevistas.map((entrevista, index) => (
            <motion.div
              key={entrevista.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{entrevista.candidato}</span>
                <Badge variant="outline" className="text-xs">{entrevista.tipo}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{entrevista.vaga}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(entrevista.data, 'dd/MM', { locale: ptBR })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />{entrevista.hora}
                </span>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />Progresso Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="candidatos" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="Candidatos" />
                <Area type="monotone" dataKey="entrevistas" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.3} name="Entrevistas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />Enviar Feedback
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />Agendar Entrevista
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Award className="h-4 w-4 mr-2" />Fazer Proposta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
