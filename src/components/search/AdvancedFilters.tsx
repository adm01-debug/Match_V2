import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Filter, X, Save, History, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'multiSelect';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface FilterValue {
  [key: string]: string | string[] | Date | [Date, Date] | number | undefined;
}

interface AdvancedFiltersProps {
  filters: FilterConfig[];
  values: FilterValue;
  onChange: (values: FilterValue) => void;
  onSaveFilter?: (name: string, values: FilterValue) => void;
  savedFilters?: { name: string; values: FilterValue }[];
  onLoadFilter?: (values: FilterValue) => void;
}

export function AdvancedFilters({
  filters,
  values,
  onChange,
  onSaveFilter,
  savedFilters = [],
  onLoadFilter,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  const activeFiltersCount = Object.values(values).filter(v => v !== undefined && v !== '').length;

  const updateFilter = (id: string, value: FilterValue[keyof FilterValue]) => {
    onChange({ ...values, [id]: value || undefined });
  };

  const clearFilters = () => {
    onChange({});
  };

  const handleSaveFilter = () => {
    if (filterName && onSaveFilter) {
      onSaveFilter(filterName, values);
      setFilterName('');
    }
  };

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.id];

    switch (filter.type) {
      case 'text':
        return (
          <Input
            placeholder={filter.placeholder || filter.label}
            value={(value as string) || ''}
            onChange={(e) => updateFilter(filter.id, e.target.value)}
          />
        );

      case 'select':
        return (
          <Select value={(value as string) || ''} onValueChange={(v) => updateFilter(filter.id, v)}>
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder || filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value as Date, 'PPP', { locale: ptBR }) : filter.placeholder || 'Selecione'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value as Date}
                onSelect={(date) => updateFilter(filter.id, date)}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={filter.placeholder || filter.label}
            value={(value as number) || ''}
            onChange={(e) => updateFilter(filter.id, e.target.value ? Number(e.target.value) : undefined)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filtros Avançados</h4>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" /> Limpar
              </Button>
            )}
          </div>

          {filters.map((filter) => (
            <div key={filter.id} className="space-y-1">
              <label className="text-sm font-medium">{filter.label}</label>
              {renderFilter(filter)}
            </div>
          ))}

          {onSaveFilter && (
            <div className="pt-4 border-t space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do filtro"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
                <Button size="sm" onClick={handleSaveFilter} disabled={!filterName}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {savedFilters.length > 0 && onLoadFilter && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2 flex items-center gap-1">
                <History className="h-4 w-4" /> Filtros Salvos
              </p>
              <div className="flex flex-wrap gap-1">
                {savedFilters.map((sf) => (
                  <Badge
                    key={sf.name}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => onLoadFilter(sf.values)}
                  >
                    {sf.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AdvancedFilters;
