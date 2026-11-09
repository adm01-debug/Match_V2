import { Search, Filter, SortAsc, Calendar as CalendarIcon, X } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { statusOptions } from '@/types/candidate';

interface CandidatosFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  skillFilter: string;
  setSkillFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  dateFrom: Date | undefined;
  setDateFrom: (val: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (val: Date | undefined) => void;
  minExperiences: number;
  setMinExperiences: (val: number) => void;
  allSkills: string[];
  activeFiltersCount: number;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  onClearFilters: () => void;
}

export function CandidatosFilters({
  searchTerm, setSearchTerm,
  statusFilter, setStatusFilter,
  skillFilter, setSkillFilter,
  sortBy, setSortBy,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  minExperiences, setMinExperiences,
  allSkills,
  activeFiltersCount,
  showFilters, setShowFilters,
  onClearFilters
}: CandidatosFiltersProps) {
  return (
    <Card variant="glass" className="border-border/30 overflow-visible z-20">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Buscar por nome, email, resumo ou habilidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-background/50 border-border/40 focus:border-primary/50 transition-all rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={activeFiltersCount > 0 ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className={cn("h-11 px-4 gap-2 rounded-xl transition-all", activeFiltersCount > 0 && "border-primary/30")}
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-11 rounded-xl bg-background/50 border-border/40">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Mais recentes</SelectItem>
                <SelectItem value="nome">Nome (A-Z)</SelectItem>
                <SelectItem value="match_score">Maior Match Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      {showFilters && (
        <CardContent className="pt-2 border-t border-border/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Habilidade</label>
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione habilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as habilidades</SelectItem>
                  {allSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Data de Cadastro</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal rounded-xl", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'dd/MM/yy') : 'Início'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} autoFocus locale={ptBR} />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal rounded-xl", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'dd/MM/yy') : 'Fim'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} autoFocus locale={ptBR} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-muted-foreground">Min. Experiências</label>
                <span className="text-xs font-bold text-primary">{minExperiences}</span>
              </div>
              <Slider
                value={[minExperiences]}
                max={10}
                step={1}
                onValueChange={(vals) => setMinExperiences(vals[0] || 0)}
                className="py-4"
              />
            </div>
          </div>
          
          {activeFiltersCount > 0 && (
            <div className="flex justify-end mt-4">
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4 mr-2" />
                Limpar todos os filtros
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}