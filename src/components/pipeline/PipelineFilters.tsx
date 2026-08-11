/**
 * Advanced Pipeline Filters Component
 * @module components/pipeline/PipelineFilters
 */

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  SlidersHorizontal, 
  X,
  Clock,
  TrendingUp,
  Star,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterState {
  search: string;
  minMatchScore: number;
  maxDaysInStage: number;
  urgentOnly: boolean;
  topCandidatesOnly: boolean;
  sortBy: 'name' | 'matchScore' | 'daysInStage' | 'date';
  sortOrder: 'asc' | 'desc';
}

interface PipelineFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

const defaultFilters: FilterState = {
  search: '',
  minMatchScore: 0,
  maxDaysInStage: 30,
  urgentOnly: false,
  topCandidatesOnly: false,
  sortBy: 'matchScore',
  sortOrder: 'desc'
};

export const PipelineFilters = memo(({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount
}: PipelineFiltersProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const activeFiltersCount = [
    filters.search !== '',
    filters.minMatchScore > 0,
    filters.maxDaysInStage < 30,
    filters.urgentOnly,
    filters.topCandidatesOnly
  ].filter(Boolean).length;

  const handleReset = () => {
    onFiltersChange(defaultFilters);
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-3">
      {/* Main Filter Bar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar candidatos..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9 bg-background"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => updateFilter('search', '')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2">
          <Button
            variant={filters.urgentOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('urgentOnly', !filters.urgentOnly)}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Urgentes
          </Button>
          
          <Button
            variant={filters.topCandidatesOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('topCandidatesOnly', !filters.topCandidatesOnly)}
            className="gap-2"
          >
            <Star className="h-4 w-4" />
            Top Candidatos
          </Button>
        </div>

        {/* Sort Select */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilter('sortBy', value as FilterState['sortBy'])}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="matchScore">Match Score</SelectItem>
            <SelectItem value="daysInStage">Dias na Etapa</SelectItem>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="date">Data de Entrada</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters */}
        <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className={cn(
                'gap-2',
                activeFiltersCount > 0 && 'border-primary'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtros Avançados</h4>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Limpar
                </Button>
              </div>

              <Separator />

              {/* Match Score Range */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Match Score Mínimo
                  </Label>
                  <span className="text-sm font-medium">{filters.minMatchScore}%</span>
                </div>
                <Slider
                  value={[filters.minMatchScore]}
                  onValueChange={([value]) => updateFilter('minMatchScore', value ?? 0)}
                  max={100}
                  step={5}
                  className="py-2"
                />
              </div>

              {/* Days in Stage Range */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Dias na Etapa (máx)
                  </Label>
                  <span className="text-sm font-medium">{filters.maxDaysInStage} dias</span>
                </div>
                <Slider
                  value={[filters.maxDaysInStage]}
                  onValueChange={([value]) => updateFilter('maxDaysInStage', value ?? 30)}
                  max={30}
                  min={1}
                  step={1}
                  className="py-2"
                />
              </div>

              <Separator />

              {/* Toggle Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Sparkles className="h-4 w-4" />
                    Apenas candidatos urgentes
                  </Label>
                  <Switch
                    checked={filters.urgentOnly}
                    onCheckedChange={(checked) => updateFilter('urgentOnly', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Star className="h-4 w-4" />
                    Apenas top candidatos (80%+)
                  </Label>
                  <Switch
                    checked={filters.topCandidatesOnly}
                    onCheckedChange={(checked) => updateFilter('topCandidatesOnly', checked)}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <span className="text-sm text-muted-foreground">
              {filteredCount} de {totalCount} candidatos
            </span>
            
            <div className="h-4 w-px bg-border" />

            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Busca: "{filters.search}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('search', '')}
                />
              </Badge>
            )}

            {filters.minMatchScore > 0 && (
              <Badge variant="secondary" className="gap-1">
                Match ≥ {filters.minMatchScore}%
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('minMatchScore', 0)}
                />
              </Badge>
            )}

            {filters.maxDaysInStage !== undefined && filters.maxDaysInStage < 30 && (
              <Badge variant="secondary" className="gap-1">
                ≤ {filters.maxDaysInStage} dias
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('maxDaysInStage', 30)}
                />
              </Badge>
            )}

            {filters.urgentOnly && (
              <Badge variant="secondary" className="gap-1">
                Urgentes
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('urgentOnly', false)}
                />
              </Badge>
            )}

            {filters.topCandidatesOnly && (
              <Badge variant="secondary" className="gap-1">
                Top Candidatos
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('topCandidatesOnly', false)}
                />
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-6 px-2 text-xs"
            >
              Limpar todos
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PipelineFilters.displayName = 'PipelineFilters';

export default PipelineFilters;
