import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle2, Users, BarChart3 } from 'lucide-react';

interface Props {
  totalProvas: number;
  totalQuestoes: number;
  totalAplicacoes: number;
  mediaAprovacao: number;
}

export const TestsStats = ({ totalProvas, totalQuestoes, totalAplicacoes, mediaAprovacao }: Props) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <p className="text-2xl font-bold">{totalProvas}</p>
            <p className="text-xs text-muted-foreground">Provas</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <div>
            <p className="text-2xl font-bold">{totalQuestoes}</p>
            <p className="text-xs text-muted-foreground">Questões</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent-foreground" />
          <div>
            <p className="text-2xl font-bold">{totalAplicacoes}</p>
            <p className="text-xs text-muted-foreground">Aplicações</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-warning" />
          <div>
            <p className="text-2xl font-bold">{mediaAprovacao.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Média Geral</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
