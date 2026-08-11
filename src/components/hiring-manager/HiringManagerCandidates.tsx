import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Star, ThumbsDown, ThumbsUp, CheckCircle2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ManagerCandidato } from './hiringManagerMockData';

export function HiringManagerCandidates({ candidatos }: { candidatos: ManagerCandidato[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />Candidatos em Processo
        </CardTitle>
        <CardDescription>Candidatos que precisam da sua avaliação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {candidatos.map((candidato, index) => (
          <motion.div
            key={candidato.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={candidato.foto} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  {candidato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{candidato.nome}</h4>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs',
                      candidato.matchScore >= 90 && 'bg-success/10 text-success',
                      candidato.matchScore >= 80 && candidato.matchScore < 90 && 'bg-warning/10 text-warning',
                      candidato.matchScore < 80 && 'bg-accent/10 text-accent-foreground',
                    )}
                  >
                    <Star className="h-3 w-3 mr-1" />{candidato.matchScore}% match
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{candidato.vaga}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{candidato.etapa}</Badge>
                  <span className="text-xs text-muted-foreground">{candidato.diasNaEtapa}d na etapa</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {candidato.avaliacao === 'pendente' ? (
                <>
                  <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-success hover:bg-success/10">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </>
              ) : candidato.avaliacao === 'positiva' ? (
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle2 className="h-3 w-3 mr-1" />Aprovado
                </Badge>
              ) : (
                <Badge variant="destructive">Reprovado</Badge>
              )}
              <Button size="sm" variant="ghost">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
