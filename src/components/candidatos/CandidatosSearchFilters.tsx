import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, SortAsc, Calendar as CalendarIcon, X, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const statusOptions = [
  { value: 'todos', label: 'Todos os Status' },
  { value: 'novo', label: 'Novo' },
  { value: 'em_triagem', label: 'Em Triagem' },
  { value: 'entrevista', label: 'Entrevista' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'reprovado', label: 'Reprovado' },
  { value: 'banco_talentos', label: 'Banco de Talentos' },
];

interface CandidatosSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  skillFilter: string;
  onSkillFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  dateFrom: Date | undefined;
  onDateFromChange: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  onDateToChange: (date: Date | undefined) => void;
  minExperiences: number;
  onMinExperiencesChange: (value: number) => void;
  allSkills: string[];
  activeFiltersCount: number;
}

export function CandidatosSearchFilters({
  searchTerm, onSearchChange,
  statusFilter, onStatusFilterChange,
  skillFilter, onSkillFilterChange,
  sortBy, onSortByChange,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
  minExperiences, onMinExperiencesChange,
  allSkills, activeFiltersCount,
}: CandidatosSearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card variant="glass" className="overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-border/50 focus:bg-background transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-[160px] h-11 bg-background/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant={showFilters ? "secondary" : "outline"} 
                size="icon"
                className="h-11 w-11 shrink-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              <Select value={sortBy} onValueChange={onSortByChange}>
                <SelectTrigger className="w-[160px] h-11 bg-background/50">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Mais recentes</SelectItem>
                  <SelectItem value="match_score">Maior Match Score</SelectItem>
                  <SelectItem value="nome">Nome (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Habilidade</label>
                    <Select value={skillFilter} onValueChange={onSkillFilterChange}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Filtrar por skill" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas as skills</SelectItem>
                        {allSkills.slice(0, 50).map(skill => (
                          <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Cadastrado a partir de</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background/50", !dateFrom && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                          {dateFrom && (<X className="ml-auto h-4 w-4 hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDateFromChange(undefined); }} />)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={dateFrom} onSelect={onDateFromChange} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Cadastrado até</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background/50", !dateTo && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                          {dateTo && (<X className="ml-auto h-4 w-4 hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDateToChange(undefined); }} />)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={dateTo} onSelect={onDateToChange} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Experiências mínimas: <span className="font-bold text-foreground">{minExperiences === 0 ? "Todas" : minExperiences}</span>
                    </label>
                    <div className="flex items-center gap-3 h-10 px-3 border rounded-lg bg-background/50">
                      <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Slider value={[minExperiences]} onValueChange={(value) => onMinExperiencesChange(value[0] ?? 0)} max={10} step={1} className="flex-1" />
                      <span className="text-sm font-medium w-6 text-right">{minExperiences}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
