import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import type { ReportFilter } from '@/services/reportingService';

interface ReportFiltersProps {
  filters: ReportFilter[];
  onFiltersChange: (filters: ReportFilter[]) => void;
  availableFields: { value: string; label: string }[];
}

export function ReportFilters({ filters, onFiltersChange, availableFields }: ReportFiltersProps) {
  const [newField, setNewField] = useState('');
  const [newOperator, setNewOperator] = useState<ReportFilter['operator']>('eq');
  const [newValue, setNewValue] = useState('');

  const addFilter = () => {
    if (!newField || !newValue) return;
    const label = availableFields.find(f => f.value === newField)?.label || newField;
    onFiltersChange([...filters, { field: newField, operator: newOperator, value: newValue, label }]);
    setNewField('');
    setNewValue('');
  };

  const removeFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  const operators = [
    { value: 'eq', label: 'Igual a' },
    { value: 'neq', label: 'Diferente de' },
    { value: 'gt', label: 'Maior que' },
    { value: 'lt', label: 'Menor que' },
    { value: 'like', label: 'Contém' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                {filter.label} {filter.operator} {String(filter.value)}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(i)} />
              </Badge>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Select value={newField} onValueChange={setNewField}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Campo" />
            </SelectTrigger>
            <SelectContent>
              {availableFields.map(f => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={newOperator} onValueChange={(v) => setNewOperator(v as ReportFilter['operator'])}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operators.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Valor"
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            className="w-[140px]"
          />
          <Button size="sm" onClick={addFilter} disabled={!newField || !newValue}>
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReportFilters;
