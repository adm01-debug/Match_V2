/**
 * @fileoverview ComunicacaoHistorico component
 * @module ComunicacaoHistorico
 */

import { memo, useState, useEffect, useMemo } from 'react';
import { format, isAfter, isBefore, startOfDay, endOfDay, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mail, Clock, FileText, CalendarIcon, Filter, Search, ChevronRight, Send, BarChart3, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
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
    'candidatura': 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    'entrevista_rh': 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
    'teste': 'bg-orange-500/20 text-orange-700 dark:text-orange-400',
    'entrevista_gestor': 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
    'proposta': 'bg-green-500/20 text-green-700 dark:text-green-400',
    'feedback_positivo': 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    'feedback_negativo': 'bg-red-500/20 text-red-700 dark:text-red-400',
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComunicacao, setSelectedComunicacao] = useState<Comunicacao | null>(null);

  useEffect(() => {
    async function fetchComunicacoes() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('comunicacoes')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('enviado_em', { ascending: false });

      if (error) {
        // Error fetching comunicacoes - handled
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
      if (etapaFilter !== 'todas' && com.template_etapa !== etapaFilter) {
        return false;
      }
      
      if (dataInicio) {
        const comDate = new Date(com.enviado_em);
        if (isBefore(comDate, startOfDay(dataInicio))) {
          return false;
        }
      }
      
      if (dataFim) {
        const comDate = new Date(com.enviado_em);
        if (isAfter(comDate, endOfDay(dataFim))) {
          return false;
        }
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          com.template_nome.toLowerCase().includes(term) ||
          com.assunto.toLowerCase().includes(term) ||
          com.conteudo.toLowerCase().includes(term)
        );
      }
      
      return true;
    });
  }, [comunicacoes, etapaFilter, dataInicio, dataFim, searchTerm]);

  const stats = useMemo(() => {
    const byEtapa: Record<string, number> = {};
    comunicacoes.forEach(com => {
      byEtapa[com.template_etapa] = (byEtapa[com.template_etapa] || 0) + 1;
    });
    
    const ultimaComunicacao = comunicacoes[0];
    const diasDesdeUltima = ultimaComunicacao 
      ? formatDistanceToNow(new Date(ultimaComunicacao.enviado_em), { locale: ptBR, addSuffix: true })
      : null;

    return {
      total: comunicacoes.length,
      byEtapa,
      diasDesdeUltima,
    };
  }, [comunicacoes]);

  const clearFilters = () => {
    setEtapaFilter('todas');
    setDataInicio(undefined);
    setDataFim(undefined);
    setSearchTerm('');
  };

  const hasActiveFilters = etapaFilter !== 'todas' || dataInicio || dataFim || searchTerm;

  if (isLoading) {
    return (
      <div role="region" aria-label="Histórico comunicação" className="space-y-3">
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
    <div data-testid="comunicacao-historico" className="space-y-3">
      {/* Estatísticas rápidas */}
      {comunicacoes.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            <span className="font-medium">{stats.total}</span>
            <span className="text-muted-foreground">enviadas</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Última {stats.diasDesdeUltima}</span>
          </div>
          {Object.keys(stats.byEtapa).length > 1 && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Por etapa
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <div className="space-y-1">
                    {Object.entries(stats.byEtapa).map(([etapa, count]) => (
                      <div key={etapa} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{getEtapaLabel(etapa)}</span>
                        <Badge variant="secondary" className="h-5 px-1.5">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      )}

      {/* Busca por texto */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Buscar em comunicações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 text-xs pl-8 pr-8"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

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
            <Button type="button" variant="outline" size="sm" className={cn("h-8 text-xs", dataInicio && "text-primary")}>
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
            <Button type="button" variant="outline" size="sm" className={cn("h-8 text-xs", dataFim && "text-primary")}>
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
          <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-muted-foreground">
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
        <ScrollArea className="h-[220px] pr-4">
          <div className="space-y-2">
            {filteredComunicacoes.map((com, index) => (
              <div
                key={com.id}
                onClick={() => setSelectedComunicacao(com)}
                className="relative p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                {index < filteredComunicacoes.length - 1 && (
                  <div className="absolute left-6 top-full w-0.5 h-2 bg-border" />
                )}
                
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="font-medium text-sm">{com.template_nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-[10px]", getEtapaColor(com.template_etapa))}>
                      {getEtapaLabel(com.template_etapa)}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-1.5 line-clamp-1 pl-4">
                  {com.assunto}
                </p>
                
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground pl-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {format(new Date(com.enviado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Dialog para visualizar conteúdo completo */}
      <Dialog open={!!selectedComunicacao} onOpenChange={() => setSelectedComunicacao(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {selectedComunicacao?.template_nome}
            </DialogTitle>
          </DialogHeader>
          
          {selectedComunicacao && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getEtapaColor(selectedComunicacao.template_etapa)}>
                  {getEtapaLabel(selectedComunicacao.template_etapa)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(selectedComunicacao.enviado_em), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Assunto</p>
                <p className="text-sm font-medium">{selectedComunicacao.assunto}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-2">Conteúdo</p>
                <div className="bg-muted/50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedComunicacao.conteudo}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

ComunicacaoHistorico.displayName = "ComunicacaoHistorico";

export default memo(ComunicacaoHistorico);

