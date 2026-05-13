import { memo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VagasListFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  departamentoFilter: string;
  setDepartamentoFilter: (v: string) => void;
  prioridadeFilter: string;
  setPrioridadeFilter: (v: string) => void;
  departamentos: string[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export const VagasListFilters = memo(function VagasListFilters({
  searchTerm, setSearchTerm,
  departamentoFilter, setDepartamentoFilter,
  prioridadeFilter, setPrioridadeFilter,
  departamentos, clearFilters, hasActiveFilters
}: VagasListFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar vaga..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>
      <div className="flex flex-wrap gap-3">
        <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Departamento" /></SelectTrigger>
          <SelectContent><SelectItem value="todos">Todos</SelectItem>{departamentos.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Prioridade" /></SelectTrigger>
          <SelectContent><SelectItem value="todas">Todas</SelectItem><SelectItem value="urgente">Urgente</SelectItem><SelectItem value="alta">Alta</SelectItem><SelectItem value="media">Média</SelectItem><SelectItem value="baixa">Baixa</SelectItem></SelectContent>
        </Select>
        {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearFilters}><X className="h-4 w-4 mr-1" />Limpar</Button>}
      </div>
    </div>
  );
});
