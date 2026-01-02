import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, RefreshCw, UserCheck, UserX } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { SavedFiltersDropdown } from '@/components/SavedFiltersDropdown';
import { AdvancedFilters, FilterValue, FilterConfig } from '@/components/AdvancedFilters';
import { DataImporter } from '@/components/DataImporter';
import { BulkActionsBar } from '@/components/BulkActionsBar';
import { candidatoSchema, matchImportTemplates, matchFilterConfigs } from '@/lib/matchSchemas';
import { exportToExcel } from '@/lib/excelImporter';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CandidatosToolbarProps {
  onSearch: (term: string) => void;
  onFiltersChange: (filters: FilterValue[]) => void;
  onRefresh: () => void;
  onNewClick: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAvancar: () => void;
  onBulkReprovar: () => void;
  currentFilters: Record<string, unknown>;
  data?: unknown[];
}

export const CandidatosToolbar = memo(function CandidatosToolbar({ onSearch, onFiltersChange, onRefresh, onNewClick, selectedCount, onClearSelection, onBulkAvancar, onBulkReprovar, currentFilters, data = [] }: CandidatosToolbarProps) {
  const [filterValues, setFilterValues] = useState<FilterValue[]>([]);

  const handleImport = async (candidatos: unknown[]) => {
    const { error } = await supabase.from('candidatos').insert(candidatos);
    if (error) throw error;
    toast.success(`${candidatos.length} candidatos importados!`);
    onRefresh();
  };

  const handleExport = () => {
    if (data.length === 0) { toast.warning('Nenhum dado'); return; }
    exportToExcel(data as Record<string, unknown>[], [
      { key: 'nome' as const, label: 'Nome' },
      { key: 'email' as const, label: 'E-mail' },
      { key: 'etapa' as const, label: 'Etapa' },
      { key: 'avaliacao' as const, label: 'Avaliação' },
    ], 'candidatos', 'Candidatos');
    toast.success('Exportado!');
  };

  const bulkActions = [
    { key: 'avancar', label: 'Avançar Etapa', icon: <UserCheck className="h-4 w-4" />, onClick: onBulkAvancar },
    { key: 'reprovar', label: 'Reprovar', icon: <UserX className="h-4 w-4" />, variant: 'destructive' as const, onClick: onBulkReprovar },
  ];

  return (
    <div className="space-y-3">
      {selectedCount > 0 && <BulkActionsBar selectedCount={selectedCount} onClearSelection={onClearSelection} actions={bulkActions} />}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <SearchInput onSearch={onSearch} placeholder="Buscar candidato..." className="w-64" />
          <AdvancedFilters filters={matchFilterConfigs.candidatos as FilterConfig[]} values={filterValues} onChange={(v) => { setFilterValues(v); onFiltersChange(v); }} />
          <SavedFiltersDropdown entityType="candidatos" currentFilters={currentFilters} onApplyFilter={(f) => { const values = Object.entries(f).map(([k,v]) => ({ key: k, operator: 'eq' as const, value: v })); setFilterValues(values); onFiltersChange(values); }} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="h-4 w-4" /></Button>
          <DataImporter schema={candidatoSchema} columns={matchImportTemplates.candidatos} onImport={handleImport} templateName="candidatos" title="Importar Candidatos" trigger={<Button variant="outline" size="sm"><Upload className="h-4 w-4" /></Button>} onSuccess={onRefresh} />
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4" /></Button>
          <Button size="sm" onClick={onNewClick}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
});
export default CandidatosToolbar;
