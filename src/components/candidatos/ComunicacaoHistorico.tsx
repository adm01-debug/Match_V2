import { useState, useEffect, useMemo } from 'react';
import { format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mail, Clock, FileText, CalendarIcon, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

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

const etapas = [
  { value: 'todas', label: 'Todas as etapas' },
  { value: 'candidatura', label: 'Candidatura' },
  { value: 'entrevista_rh', label: 'Entrevista RH' },
  { value: 'teste', label: 'Teste' },
  { value: 'entrevista_gestor', label: 'Entrevista Gestor' },
  { value: 'proposta', label: 'Proposta' },
  { value: 'feedback_positivo', label: 'Feedback Positivo' },
  { value: 'feedback_negativo', label: 'Feedback Negativo' },
];

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
  const found = etapas.find(e => e.value === etapa);
  return found?.label || etapa;
};

export function ComunicacaoHistorico({ candidatoId }: ComunicacaoHistoricoProps) {
  const [comunicacoes, setComunicacoes] = useState<Comunicacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [etapaFilter, setEtapaFilter] = useState('todas');
  const [dataInicio, setDataInicio] = useState<Date | undefined>();
  const [dataFim, setDataFim] = useState<Date | undefined>();

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

  const filteredComunicacoes = useMemo(() => {
    return comunicacoes.filter((com) => {
      // Filtro por etapa
      if (etapaFilter !== 'todas' && com.template_etapa !== etapaFilter) {
        return false;
      }
      
      // Filtro por data início
      if (dataInicio) {
        const comDate = new Date(com.enviado_em);
        if (isBefore(comDate, startOfDay(dataInicio))) {
          return false;
        }
      }
      
      // Filtro por data fim
      if (dataFim) {
        const comDate = new Date(com.enviado_em);
        if (isAfter(comDate, endOfDay(dataFim))) {
          return false;
        }
      }
      
      return true;
    });
  }, [comunicacoes, etapaFilter, dataInicio, dataFim]);

  const clearFilters = () => {
    setEtapaFilter('todas');
    setDataInicio(undefined);
    setDataFim(undefined);
  };

  const hasActiveFilters = etapaFilter !== 'todas' || dataInicio || dataFim;

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

  return (
    <div className="space-y-3">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={etapaFilter} onValueChange={setEtapaFilter}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <Filter className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Etapa" />
          </SelectTrigger>
          <SelectContent>
            {etapas.map((etapa) => (
              <SelectItem key={etapa.value} value={etapa.value}>
                {etapa.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-8 text-xs", dataInicio && "text-primary")}>
              <CalendarIcon className="h-3 w-3 mr-1" />
              {dataInicio ? format(dataInicio, "dd/MM/yy") : "De"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dataInicio}
              onSelect={setDataInicio}
              locale={ptBR}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("h-8 text-xs", dataFim && "text-primary")}>
              <CalendarIcon className="h-3 w-3 mr-1" />
              {dataFim ? format(dataFim, "dd/MM/yy") : "Até"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dataFim}
              onSelect={setDataFim}
              locale={ptBR}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-muted-foreground">
            Limpar
          </Button>
        )}
      </div>

      {/* Lista de comunicações */}
      {filteredComunicacoes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Mail className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            {comunicacoes.length === 0 
              ? "Nenhuma comunicação enviada" 
              : "Nenhuma comunicação encontrada com os filtros aplicados"}
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[250px] pr-4">
          <div className="space-y-3">
            {filteredComunicacoes.map((com) => (
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
      )}
    </div>
  );
}
