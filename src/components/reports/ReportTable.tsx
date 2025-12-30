import { useState, useMemo, useCallback, useId } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Columns, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface ReportTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  className?: string;
  getRowKey?: (row: T, index: number) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

export function ReportTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 10,
  selectable = false,
  onSelectionChange,
  className,
  getRowKey,
  emptyMessage = 'Nenhum dado encontrado',
  isLoading = false,
}: ReportTableProps<T>) {
  const tableId = useId();
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    new Set(columns.map((c) => c.key))
  );
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Generate unique key for each row
  const getUniqueKey = useCallback((row: T, index: number): string => {
    if (getRowKey) return getRowKey(row, index);
    if ('id' in row) return String(row.id);
    return `row-${tableId}-${index}`;
  }, [getRowKey, tableId]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const cellValue = String(row[key] ?? '').toLowerCase();
        return cellValue.includes(value.toLowerCase());
      });
    });
  }, [data, filters]);

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const comparison = String(aVal).localeCompare(String(bVal), 'pt-BR', { numeric: true });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  
  // Ensure currentPage is valid
  const validCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedData = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, validCurrentPage, pageSize]);

  // Reset page when filters change
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handleSort = useCallback((key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(prev => {
        if (prev === 'asc') return 'desc';
        if (prev === 'desc') {
          setSortKey(null);
          return null;
        }
        return 'asc';
      });
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  }, [sortKey]);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const indices = paginatedData.map((_, i) => (validCurrentPage - 1) * pageSize + i);
      setSelectedRows(new Set(indices));
      onSelectionChange?.(paginatedData);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  }, [paginatedData, validCurrentPage, pageSize, onSelectionChange]);

  const handleSelectRow = useCallback((index: number, checked: boolean) => {
    const globalIndex = (validCurrentPage - 1) * pageSize + index;
    setSelectedRows(prev => {
      const newSelection = new Set(prev);
      if (checked) {
        newSelection.add(globalIndex);
      } else {
        newSelection.delete(globalIndex);
      }
      onSelectionChange?.(sortedData.filter((_, i) => newSelection.has(i)));
      return newSelection;
    });
  }, [validCurrentPage, pageSize, sortedData, onSelectionChange]);

  const toggleColumnVisibility = useCallback((key: keyof T, checked: boolean) => {
    setVisibleColumns(prev => {
      const newVisible = new Set(prev);
      if (checked) {
        newVisible.add(key);
      } else {
        newVisible.delete(key);
      }
      return newVisible;
    });
  }, []);

  const getSortIcon = (key: keyof T) => {
    if (sortKey !== key) return <ArrowUpDown className="h-4 w-4" aria-hidden="true" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" aria-hidden="true" />;
    return <ArrowDown className="h-4 w-4" aria-hidden="true" />;
  };

  const visibleColumnsArray = columns.filter((c) => visibleColumns.has(c.key));
  const allSelected = selectedRows.size === paginatedData.length && paginatedData.length > 0;
  const someSelected = selectedRows.size > 0 && selectedRows.size < paginatedData.length;

  const startItem = sortedData.length === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(validCurrentPage * pageSize, sortedData.length);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {columns.filter((c) => c.filterable).map((col) => (
            <div key={String(col.key)} className="relative">
              <Search 
                className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
                aria-hidden="true"
              />
              <Input
                placeholder={`Filtrar ${col.label}...`}
                value={filters[String(col.key)] || ''}
                onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                className="pl-8 w-40"
                aria-label={`Filtrar por ${col.label}`}
              />
            </div>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Selecionar colunas visíveis">
              <Columns className="h-4 w-4 mr-2" aria-hidden="true" />
              Colunas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((col) => (
              <DropdownMenuCheckboxItem
                key={String(col.key)}
                checked={visibleColumns.has(col.key)}
                onCheckedChange={(checked) => toggleColumnVisibility(col.key, !!checked)}
              >
                {col.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table aria-label="Tabela de relatório" aria-busy={isLoading}>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    ref={(el) => {
                      if (el) (el as HTMLButtonElement).indeterminate = someSelected;
                    }}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar todas as linhas"
                  />
                </TableHead>
              )}
              {visibleColumnsArray.map((col) => (
                <TableHead 
                  key={String(col.key)} 
                  style={{ width: col.width }}
                  className={col.align ? `text-${col.align}` : ''}
                >
                  {col.sortable ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort(col.key)} 
                      className="-ml-3"
                      aria-label={`Ordenar por ${col.label}`}
                    >
                      {col.label}
                      {getSortIcon(col.key)}
                    </Button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell 
                  colSpan={visibleColumnsArray.length + (selectable ? 1 : 0)} 
                  className="text-center py-8"
                >
                  <div className="animate-pulse text-muted-foreground">Carregando...</div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={visibleColumnsArray.length + (selectable ? 1 : 0)} 
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const rowKey = getUniqueKey(row, (validCurrentPage - 1) * pageSize + index);
                const globalIndex = (validCurrentPage - 1) * pageSize + index;
                return (
                  <TableRow key={rowKey}>
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(globalIndex)}
                          onCheckedChange={(checked) => handleSelectRow(index, checked as boolean)}
                          aria-label={`Selecionar linha ${index + 1}`}
                        />
                      </TableCell>
                    )}
                    {visibleColumnsArray.map((col) => (
                      <TableCell 
                        key={`${rowKey}-${String(col.key)}`}
                        className={col.align ? `text-${col.align}` : ''}
                      >
                        {col.render 
                          ? col.render(row[col.key], row, index) 
                          : String(row[col.key] ?? '-')
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
        <div className="text-sm text-muted-foreground" aria-live="polite">
          {sortedData.length === 0 
            ? 'Nenhum registro'
            : `Mostrando ${startItem}-${endItem} de ${sortedData.length}`
          }
        </div>
        <nav className="flex items-center gap-2" aria-label="Paginação">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage((p) => p - 1)} 
            disabled={validCurrentPage === 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="text-sm" aria-current="page">
            Página {validCurrentPage} de {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage((p) => p + 1)} 
            disabled={validCurrentPage >= totalPages}
            aria-label="Próxima página"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </nav>
      </div>
    </div>
  );
}
