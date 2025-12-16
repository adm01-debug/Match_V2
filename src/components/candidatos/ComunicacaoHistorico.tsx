import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mail, Clock, User, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface Comunicacao {
  id: string;
  template_nome: string;
  template_etapa: string;
  assunto: string;
  conteudo: string;
  enviado_em: string;
  enviado_por: string | null;
}

interface ComunicacaoHistoricoProps {
  candidatoId: string;
}

const getEtapaColor = (etapa: string) => {
  const colors: Record<string, string> = {
    'candidatura': 'bg-blue-500/20 text-blue-700',
    'entrevista_rh': 'bg-purple-500/20 text-purple-700',
    'teste': 'bg-orange-500/20 text-orange-700',
    'entrevista_gestor': 'bg-indigo-500/20 text-indigo-700',
    'proposta': 'bg-green-500/20 text-green-700',
    'feedback_positivo': 'bg-emerald-500/20 text-emerald-700',
    'feedback_negativo': 'bg-red-500/20 text-red-700',
  };
  return colors[etapa] || 'bg-muted text-muted-foreground';
};

const getEtapaLabel = (etapa: string) => {
  const labels: Record<string, string> = {
    'candidatura': 'Candidatura',
    'entrevista_rh': 'Entrevista RH',
    'teste': 'Teste',
    'entrevista_gestor': 'Entrevista Gestor',
    'proposta': 'Proposta',
    'feedback_positivo': 'Feedback Positivo',
    'feedback_negativo': 'Feedback Negativo',
  };
  return labels[etapa] || etapa;
};

export function ComunicacaoHistorico({ candidatoId }: ComunicacaoHistoricoProps) {
  const [comunicacoes, setComunicacoes] = useState<Comunicacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchComunicacoes() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('comunicacoes')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('enviado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar comunicações:', error);
      } else {
        setComunicacoes(data || []);
      }
      setIsLoading(false);
    }

    if (candidatoId) {
      fetchComunicacoes();
    }
  }, [candidatoId]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 border rounded-lg space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (comunicacoes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Mail className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Nenhuma comunicação enviada</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-3">
        {comunicacoes.map((com) => (
          <div
            key={com.id}
            className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{com.template_nome}</span>
              </div>
              <Badge className={getEtapaColor(com.template_etapa)}>
                {getEtapaLabel(com.template_etapa)}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              <FileText className="h-3 w-3 inline mr-1" />
              {com.assunto}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(com.enviado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
