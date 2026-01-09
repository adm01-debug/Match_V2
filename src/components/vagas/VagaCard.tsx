/**
 * @fileoverview VagaCard component with premium design
 * @module VagaCard
 */

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Vaga } from "@/types/recruitment";
import { useDeleteVaga } from "@/hooks/useVagas";
import { 
  Eye, Edit, Kanban, Share2, Briefcase, DollarSign,
  Users, Target, Clock, MoreHorizontal, Trash2, Loader2, 
  Building2, Sparkles, TrendingUp, Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface VagaCardProps {
  vaga: Vaga;
  onDeleted?: () => void;
  index?: number;
}

function formatSalario(min?: number, max?: number, aCombinar?: boolean): string {
  if (aCombinar) return "A combinar";
  if (min && max) return `R$ ${min.toLocaleString('pt-BR')} - ${max.toLocaleString('pt-BR')}`;
  if (min) return `A partir de R$ ${min.toLocaleString('pt-BR')}`;
  return "Não informado";
}

function calculateDaysOpen(dateStr?: string): number {
  if (!dateStr) return 0;
  try {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  } catch {
    return 0;
  }
}

const statusConfig: Record<string, { label: string; className: string; icon?: React.ElementType }> = {
  publicada: { label: "Aberta", className: "bg-success/10 text-success border-success/20", icon: Sparkles },
  aguardando_aprovacao: { label: "Aguardando", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  em_selecao: { label: "Em Seleção", className: "bg-primary/10 text-primary border-primary/20", icon: TrendingUp },
  encerrada: { label: "Encerrada", className: "bg-muted text-muted-foreground border-muted", icon: undefined },
  rascunho: { label: "Rascunho", className: "bg-muted text-muted-foreground border-muted", icon: undefined },
};

const prioridadeConfig: Record<string, { label: string; className: string }> = {
  urgente: { label: "Urgente", className: "bg-destructive/10 text-destructive border-destructive/20 animate-pulse" },
  alta: { label: "Alta", className: "bg-warning/10 text-warning border-warning/20" },
  media: { label: "Média", className: "bg-primary/10 text-primary border-primary/20" },
  baixa: { label: "Baixa", className: "bg-muted text-muted-foreground border-muted" },
};

function VagaCardComponent({ vaga, onDeleted, index = 0 }: VagaCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteVaga = useDeleteVaga();
  
  const diasAberta = useMemo(
    () => calculateDaysOpen(vaga.dataPublicacao instanceof Date ? vaga.dataPublicacao.toISOString() : vaga.dataPublicacao),
    [vaga.dataPublicacao]
  );

  const salarioFormatado = useMemo(
    () => formatSalario(vaga.salarioMin, vaga.salarioMax, vaga.salarioACombinar),
    [vaga.salarioMin, vaga.salarioMax, vaga.salarioACombinar]
  );

  const status = statusConfig[vaga.status] || statusConfig['rascunho'];
  const prioridade = prioridadeConfig[vaga.prioridade] || prioridadeConfig['media'];
  const showPriority = vaga.prioridade === "urgente" || vaga.prioridade === "alta";
  const StatusIcon = status?.icon;

  const handleOpenDeleteDialog = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      await deleteVaga.mutateAsync(vaga.id);
      toast.success("Vaga excluída com sucesso!");
      setShowDeleteDialog(false);
      onDeleted?.();
    } catch (error) {
      console.error('[VagaCard] Delete error:', error);
      toast.error("Erro ao excluir vaga. Tente novamente.");
    }
  }, [deleteVaga, vaga.id, onDeleted]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 400, 
          damping: 25,
          delay: index * 0.05
        }}
        whileHover={{ 
          y: -6,
          transition: { duration: 0.2 }
        }}
        className={cn(
          "group relative rounded-xl overflow-hidden",
          "bg-gradient-to-br from-card via-card to-card/80",
          "border border-border/50 hover:border-primary/30",
          "shadow-sm hover:shadow-xl hover:shadow-primary/5",
          "transition-all duration-300"
        )}
        role="article"
        aria-label={`Vaga: ${vaga.titulo}`}
      >
        {/* Gradient accent bar */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1",
          vaga.prioridade === "urgente" 
            ? "bg-gradient-to-r from-destructive via-destructive/80 to-warning"
            : vaga.prioridade === "alta"
            ? "bg-gradient-to-r from-warning via-warning/80 to-primary"
            : "bg-gradient-to-r from-primary via-primary/80 to-accent"
        )} />

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative p-5">
          {/* Header */}
          <div 
            data-testid="vaga-card" 
            className="flex items-start justify-between gap-3 mb-4"
          >
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" className={cn("text-xs font-medium", status?.className)}>
                  {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                  {status?.label}
                </Badge>
                {showPriority && (
                  <Badge variant="outline" className={cn("text-xs font-medium", prioridade?.className)}>
                    {vaga.prioridade === "urgente" && <Zap className="h-3 w-3 mr-1" />}
                    {prioridade?.label}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                {vaga.titulo}
              </h3>
              
              {/* Meta info */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary/60" aria-hidden="true" />
                  <span>{vaga.departamento}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-primary/60" aria-hidden="true" />
                  <span className="uppercase text-xs font-medium">{vaga.tipoContrato}</span>
                </span>
              </div>
              
              {/* Salary */}
              <div className="flex items-center gap-1.5 mt-2">
                <DollarSign className="h-4 w-4 text-success" aria-hidden="true" />
                <span className="font-semibold text-foreground">{salarioFormatado}</span>
              </div>
            </div>
            
            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                  aria-label="Mais opções"
                >
                  <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover/95 backdrop-blur-sm">
                <DropdownMenuItem asChild>
                  <Link to={`/vagas/${vaga.id}`} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    Ver detalhes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/vagas/${vaga.id}/editar`} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" aria-hidden="true" />
                    Editar vaga
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/pipeline?vaga=${vaga.id}`} className="flex items-center gap-2">
                    <Kanban className="h-4 w-4" aria-hidden="true" />
                    Ver pipeline
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  Divulgar vaga
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                  onClick={handleOpenDeleteDialog}
                  aria-label="Excluir vaga"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Excluir vaga
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stats Grid */}
          <div 
            className="grid grid-cols-4 gap-2 mb-4"
            role="group"
            aria-label="Estatísticas da vaga"
          >
            {[
              { icon: Users, value: vaga.totalCandidatos, label: 'candidatos', color: 'text-primary' },
              { icon: Target, value: vaga.emProcesso, label: 'em processo', color: 'text-accent' },
              { icon: Clock, value: `${diasAberta}d`, label: 'aberta', color: diasAberta > 30 ? 'text-warning' : 'text-muted-foreground' },
              { icon: Briefcase, value: vaga.quantidade, label: vaga.quantidade > 1 ? 'vagas' : 'vaga', color: 'text-success' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (index * 0.05) + (i * 0.05) }}
                className={cn(
                  "text-center p-3 rounded-lg",
                  "bg-gradient-to-br from-muted/60 to-muted/30",
                  "border border-border/30",
                  "group-hover:border-primary/20 transition-colors"
                )}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <stat.icon className={cn("h-4 w-4", stat.color)} aria-hidden="true" />
                  <span className={cn("text-lg font-bold", stat.color)}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {[
              { to: `/vagas/${vaga.id}`, icon: Eye, label: 'Detalhes', primary: false },
              { to: `/vagas/${vaga.id}/editar`, icon: Edit, label: 'Editar', primary: false },
              { to: `/pipeline?vaga=${vaga.id}`, icon: Kanban, label: 'Pipeline', primary: true },
            ].map((btn) => (
              <Button 
                key={btn.label}
                type="button" 
                variant={btn.primary ? "default" : "outline"}
                size="sm" 
                className={cn(
                  "flex-1 transition-all",
                  btn.primary 
                    ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-sm"
                    : "hover:bg-primary/5 hover:border-primary/30"
                )}
                asChild
              >
                <Link to={btn.to}>
                  <btn.icon className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  {btn.label}
                </Link>
              </Button>
            ))}
            {vaga.status === "publicada" && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="hover:bg-primary/5 hover:border-primary/30"
                aria-label="Compartilhar vaga"
              >
                <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-sm border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir vaga</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a vaga <strong>"{vaga.titulo}"</strong>? 
              Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={deleteVaga.isPending}
              onClick={handleCloseDeleteDialog}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleteVaga.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteVaga.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Excluir
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

VagaCardComponent.displayName = "VagaCard";

export const VagaCard = memo(VagaCardComponent);
export default VagaCard;
