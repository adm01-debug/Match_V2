import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Building2, MapPin, DollarSign, Clock, Send, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VagaPublicada, modalidadeLabels, contratoLabels } from './types';

interface Props {
  vaga: VagaPublicada;
  jaCandidatou: boolean;
  onCandidatar: () => void;
}

export const VagaCard = ({ vaga, jaCandidatou, onCandidatar }: Props) => (
  <Card className="hover:shadow-lg transition-all duration-300 group">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{vaga.titulo}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {vaga.departamento}
            </CardDescription>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{modalidadeLabels[vaga.modalidade] || vaga.modalidade}</Badge>
        <Badge variant="secondary">{contratoLabels[vaga.tipo_contrato] || vaga.tipo_contrato}</Badge>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        {vaga.cidade && (
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {vaga.cidade}, {vaga.estado}
          </p>
        )}
        {!vaga.salario_a_combinar && vaga.salario_min && (
          <p className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            R$ {vaga.salario_min.toLocaleString()} - R$ {vaga.salario_max?.toLocaleString()}
          </p>
        )}
        {vaga.data_publicacao && (
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Publicada em {format(new Date(vaga.data_publicacao), 'dd/MM/yyyy', { locale: ptBR })}
          </p>
        )}
      </div>

      {jaCandidatou ? (
        <Button disabled className="w-full" variant="secondary">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Já candidatado
        </Button>
      ) : (
        <Button className="w-full" onClick={onCandidatar}>
          <Send className="h-4 w-4 mr-2" />
          Candidatar-se
        </Button>
      )}
    </CardContent>
  </Card>
);
