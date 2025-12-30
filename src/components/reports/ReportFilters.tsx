import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface ReportFiltersState {
  dateRange: { from: Date; to: Date };
  vagas: string[];
  recrutadores: string[];
  fontes: string[];
  etapas: string[];
}

interface ReportFiltersProps {
  filters: ReportFiltersState;
  onFiltersChange: (filters: ReportFiltersState) => void;
  vagas?: { id: string; titulo: string }[];
  recrutadores?: { id: string; nome: string }[];
}

const presetRanges = [
  { label: "Últimos 7 dias", value: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: "Últimos 30 dias", value: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: "Este mês", value: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: "Último mês", value: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: "Últimos 3 meses", value: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
];

const fonteOptions = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "indeed", label: "Indeed" },
  { id: "indicacao", label: "Indicação" },
  { id: "site", label: "Site Próprio" },
  { id: "outro", label: "Outros" },
];

const etapaOptions = [
  { id: "triagem", label: "Triagem" },
  { id: "entrevista_rh", label: "Entrevista RH" },
  { id: "entrevista_tecnica", label: "Entrevista Técnica" },
  { id: "entrevista_gestor", label: "Entrevista Gestor" },
  { id: "proposta", label: "Proposta" },
  { id: "contratado", label: "Contratado" },
];

export function ReportFilters({ filters, onFiltersChange, vagas = [], recrutadores = [] }: ReportFiltersProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const updateFilters = (partial: Partial<ReportFiltersState>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  const removeFilter = (type: keyof ReportFiltersState, value: string) => {
    if (Array.isArray(filters[type])) {
      updateFilters({
        [type]: (filters[type] as string[]).filter(v => v !== value)
      });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: { from: subDays(new Date(), 30), to: new Date() },
      vagas: [],
      recrutadores: [],
      fontes: [],
      etapas: [],
    });
  };

  const activeFiltersCount = 
    filters.vagas.length + 
    filters.recrutadores.length + 
    filters.fontes.length + 
    filters.etapas.length;

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} ativos</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Date Range */}
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("justify-start text-left font-normal")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "dd/MM/yy", { locale: ptBR })} -{" "}
                    {format(filters.dateRange.to, "dd/MM/yy", { locale: ptBR })}
                  </>
                ) : (
                  format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                )
              ) : (
                <span>Período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-2 border-b">
              <div className="flex flex-wrap gap-1">
                {presetRanges.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      updateFilters({ dateRange: preset.value() });
                      setDatePickerOpen(false);
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange.from}
              selected={{ from: filters.dateRange.from, to: filters.dateRange.to }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  updateFilters({ dateRange: { from: range.from, to: range.to } });
                }
              }}
              numberOfMonths={2}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>

        {/* Vagas */}
        <Select
          value={filters.vagas[0] || "all"}
          onValueChange={(value) => updateFilters({ vagas: value === "all" ? [] : [value] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as vagas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as vagas</SelectItem>
            {vagas.map((vaga) => (
              <SelectItem key={vaga.id} value={vaga.id}>{vaga.titulo}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Recrutadores */}
        <Select
          value={filters.recrutadores[0] || "all"}
          onValueChange={(value) => updateFilters({ recrutadores: value === "all" ? [] : [value] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os recrutadores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os recrutadores</SelectItem>
            {recrutadores.map((rec) => (
              <SelectItem key={rec.id} value={rec.id}>{rec.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Fontes */}
        <Select
          value={filters.fontes[0] || "all"}
          onValueChange={(value) => updateFilters({ fontes: value === "all" ? [] : [value] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as fontes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as fontes</SelectItem>
            {fonteOptions.map((fonte) => (
              <SelectItem key={fonte.id} value={fonte.id}>{fonte.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Etapas */}
        <Select
          value={filters.etapas[0] || "all"}
          onValueChange={(value) => updateFilters({ etapas: value === "all" ? [] : [value] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as etapas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as etapas</SelectItem>
            {etapaOptions.map((etapa) => (
              <SelectItem key={etapa.id} value={etapa.id}>{etapa.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.vagas.map(id => {
            const vaga = vagas.find(v => v.id === id);
            return (
              <Badge key={id} variant="secondary" className="gap-1">
                {vaga?.titulo || id}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('vagas', id)} />
              </Badge>
            );
          })}
          {filters.recrutadores.map(id => {
            const rec = recrutadores.find(r => r.id === id);
            return (
              <Badge key={id} variant="secondary" className="gap-1">
                {rec?.nome || id}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('recrutadores', id)} />
              </Badge>
            );
          })}
          {filters.fontes.map(id => {
            const fonte = fonteOptions.find(f => f.id === id);
            return (
              <Badge key={id} variant="secondary" className="gap-1">
                {fonte?.label || id}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('fontes', id)} />
              </Badge>
            );
          })}
          {filters.etapas.map(id => {
            const etapa = etapaOptions.find(e => e.id === id);
            return (
              <Badge key={id} variant="secondary" className="gap-1">
                {etapa?.label || id}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter('etapas', id)} />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
