import { memo,  useState  , memo} from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoriasInfo, departamentosInfo, niveisInfo } from '@/config/testsConfig';
import { CategoriaProva, Departamento, NivelCargo } from '@/types/tests';
import { Search, X, Filter } from 'lucide-react';

interface TestFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategoria: CategoriaProva | 'todas';
  onCategoriaChange: (value: CategoriaProva | 'todas') => void;
  selectedDepartamento: Departamento | 'todos';
  onDepartamentoChange: (value: Departamento | 'todos') => void;
  selectedNivel: NivelCargo | 'todos';
  onNivelChange: (value: NivelCargo | 'todos') => void;
  onClearFilters: () => void;
}

export function TestFilters({
  searchTerm,
  onSearchChange,
  selectedCategoria,
  onCategoriaChange,
  selectedDepartamento,
  onDepartamentoChange,
  selectedNivel,
  onNivelChange,
  onClearFilters
}: TestFiltersProps) {
  const hasActiveFilters = searchTerm || selectedCategoria !== 'todas' || selectedDepartamento !== 'todos' || selectedNivel !== 'todos';

  return (
    <div role="region" aria-label="Filtros teste" className="space-y-4">
      <div data-testid="test-filters" className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar provas por título, descrição ou tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={selectedCategoria} onValueChange={(v) => onCategoriaChange(v as CategoriaProva | 'todas')}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="todas">Todas as Categorias</SelectItem>
            {Object.entries(categoriasInfo).map(([key, info]) => (
              <SelectItem key={key} value={key}>{info.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDepartamento} onValueChange={(v) => onDepartamentoChange(v as Departamento | 'todos')}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="todos">Todos os Departamentos</SelectItem>
            {Object.entries(departamentosInfo).map(([key, info]) => (
              <SelectItem key={key} value={key}>{info.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedNivel} onValueChange={(v) => onNivelChange(v as NivelCargo | 'todos')}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="todos">Todos os Níveis</SelectItem>
            {Object.entries(niveisInfo)
              .sort((a, b) => a[1].ordem - b[1].ordem)
              .map(([key, info]) => (
                <SelectItem key={key} value={key}>{info.nome}</SelectItem>
              ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={onClearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Busca: "{searchTerm}"
            </Badge>
          )}
          {selectedCategoria !== 'todas' && (
            <Badge variant="secondary" className="text-xs">
              {categoriasInfo[selectedCategoria].nome}
            </Badge>
          )}
          {selectedDepartamento !== 'todos' && (
            <Badge variant="secondary" className="text-xs">
              {departamentosInfo[selectedDepartamento].nome}
            </Badge>
          )}
          {selectedNivel !== 'todos' && (
            <Badge variant="secondary" className="text-xs">
              {niveisInfo[selectedNivel].nome}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

