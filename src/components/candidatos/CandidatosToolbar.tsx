import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, RefreshCw, UserCheck, UserX } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { SavedFiltersDropdown } from '@/components/SavedFiltersDropdown';
import { AdvancedFilters } from '@/components/search/AdvancedFilters';
import type { FilterConfig, FilterValue } from '@/components/search/AdvancedFilters';
import { DataImporter } from '@/components/DataImporter';
import { BulkActionsBar } from '@/components/BulkActionsBar';
import { candidatoSchema, matchFilterConfigs } from '@/lib/matchSchemas';
import { exportToExcel } from '@/lib/excelImporter';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { TablesInsert } from '@/integrations/supabase/types';

interface CandidatosToolbarProps {
  onSearch: (term: string) => void;
  onFiltersChange: (filters: FilterValue) => void;
  onRefresh: () => void;
  onNewClick: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAvancar: () => void;
  onBulkReprovar: () => void;
  currentFilters: Record<string, unknown>;
  data?: Record<string, unknown>[];
}

export const CandidatosToolbar = memo(function CandidatosToolbar({ 
  onSearch, 
  onFiltersChange, 
  onRefresh, 
  onNewClick, 
  selectedCount, 
  onClearSelection, 
  onBulkAvancar, 
  onBulkReprovar, 
  currentFilters, 
  data = [] 
}: CandidatosToolbarProps) {
  const [filterValues, setFilterValues] = useState<FilterValue>({});

  const handleImport = async (candidatos: TablesInsert<'candidatos'>[]) => {
    const { error } = await supabase.from('candidatos').insert(candidatos);
    if (error) throw error;
    toast.success(`${candidatos.length} candidatos importados!`);
    onRefresh();
  };

  const handleExport = () => {
    if (data.length === 0) { 
      toast.warning('Nenhum dado'); 
      return; 
    }
    exportToExcel(data, [
      { key: 'nome', label: 'Nome' },
      { key: 'email', label: 'E-mail' },
      { key: 'status', label: 'Status' },
    ], 'candidatos', 'Candidatos');
    toast.success('Exportado!');
  };

  const handleFilterChange = (values: FilterValue) => {
    setFilterValues(values);
    onFiltersChange(values);
  };

  // Prepare filter configs with correct id field
  const filterConfigs: FilterConfig[] = matchFilterConfigs.candidatos.map(f => ({
    ...f,
    id: f.key,
  }));

  return (
    <div className="space-y-3">
      {selectedCount > 0 && (
        <BulkActionsBar 
          selectionCount={selectedCount} 
          onClear={onClearSelection} 
          actions={[
            { 
              id: 'avancar', 
              label: 'Avançar Etapa', 
              icon: UserCheck,
            },
            { 
              id: 'reprovar', 
              label: 'Reprovar', 
              icon: UserX,
              variant: 'destructive',
              confirm: {
                title: 'Reprovar candidatos',
                description: 'Tem certeza que deseja reprovar os candidatos selecionados?'
              }
            },
          ]}
          onAction={async (actionId) => {
            if (actionId === 'avancar') onBulkAvancar();
            if (actionId === 'reprovar') onBulkReprovar();
          }}
        />
      )}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <SearchInput 
            onChange={onSearch} 
            placeholder="Buscar candidato..." 
            className="w-64" 
          />
          <AdvancedFilters 
            filters={filterConfigs} 
            values={filterValues} 
            onChange={handleFilterChange}
          />
          <SavedFiltersDropdown 
            entityType="candidatos" 
            currentFilters={currentFilters} 
            onApplyFilter={(f) => { 
              const values: FilterValue = {};
              Object.entries(f).forEach(([k, v]) => {
                values[k] = v as string;
              });
              setFilterValues(values); 
              onFiltersChange(values); 
            }} 
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <DataImporter 
            schema={candidatoSchema} 
            onImport={handleImport as (data: unknown[]) => Promise<void>}
            entityName="Candidatos" 
            trigger={
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            }
          />
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={onNewClick}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default CandidatosToolbar;
