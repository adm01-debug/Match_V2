import { memo } from 'react';
import { motion } from 'framer-motion';
import { Search, Kanban, Filter, LayoutGrid, List, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface PipelineHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  vagaSelecionada: string;
  setVagaSelecionada: (vagaId: string) => void;
  vagasAtivas: any[];
  isCompact: boolean;
  setIsCompact: (compact: boolean) => void;
  isRefreshing: boolean;
  handleRefresh: () => void;
}

export const PipelineHeader = memo(function PipelineHeader({
  searchQuery,
  setSearchQuery,
  vagaSelecionada,
  setVagaSelecionada,
  vagasAtivas,
  isCompact,
  setIsCompact,
  isRefreshing,
  handleRefresh,
}: PipelineHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 blur-3xl opacity-50 -z-10" />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Kanban className="h-6 w-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                Pipeline de Recrutamento
              </h1>
              <p className="text-muted-foreground">
                Gerencie candidatos com drag & drop intuitivo
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Buscar candidato..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            />
          </div>

          <Select value={vagaSelecionada} onValueChange={setVagaSelecionada}>
            <SelectTrigger className="w-64 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filtrar por vaga" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
              <SelectItem value="todas">Todas as vagas</SelectItem>
              <DropdownMenuSeparator />
              {vagasAtivas.map(vaga => (
                <SelectItem key={vaga.id} value={vaga.id}>
                  {vaga.titulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 p-1">
            <Button
              variant={!isCompact ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setIsCompact(false)}
              className="h-8 px-3 gap-1.5"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Normal</span>
            </Button>
            <Button
              variant={isCompact ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setIsCompact(true)}
              className="h-8 px-3 gap-1.5"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Compacto</span>
            </Button>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});
