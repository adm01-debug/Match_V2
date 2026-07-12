import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { categoriasInfo, niveisInfo } from '@/config/testsConfig';

interface Props {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  filtroCategoria: string;
  onCategoriaChange: (v: string) => void;
  filtroNivel: string;
  onNivelChange: (v: string) => void;
}

export const TestsFilters = ({
  searchQuery, onSearchChange, filtroCategoria, onCategoriaChange, filtroNivel, onNivelChange,
}: Props) => (
  <div className="flex flex-col md:flex-row gap-4">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar prova..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
    <Select value={filtroCategoria} onValueChange={onCategoriaChange}>
      <SelectTrigger className="w-48">
        <Filter className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todas">Todas Categorias</SelectItem>
        {categoriasInfo.map(c => (
          <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select value={filtroNivel} onValueChange={onNivelChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Nível" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos Níveis</SelectItem>
        {niveisInfo.map(n => (
          <SelectItem key={n.id} value={n.id}>{n.nome}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
