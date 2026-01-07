/**
 * @fileoverview VagaCard component with motion interactions
 * @module VagaCard
 */

import { memo, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
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
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { Vaga } from "@/types/recruitment";
import { useDeleteVaga } from "@/hooks/useVagas";
import { 
  Eye, Edit, Kanban, Share2, MapPin, Briefcase, DollarSign,
  Users, Target, Clock, MoreHorizontal, Trash2, Loader2
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

// Motion transition config

function VagaCardComponent({ vaga, onDeleted }: VagaCardProps) {
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

  const showPriority = vaga.prioridade === "urgente" || vaga.prioridade === "alta";

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          y: -4,
          boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.15)',
        }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
        className="rounded-lg border bg-card text-card-foreground shadow-sm border-l-4 border-l-primary"
        role="article"
        aria-label={`Vaga: ${vaga.titulo}`}
      >
        <CardContent className="p-5">
          <div 
            data-testid="vaga-card" 
            className="flex items-start justify-between gap-3 mb-4"
          >
            <div className="flex-1 min-w-0">
              <motion.div 
                className="flex items-center gap-2 mb-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <StatusBadge status={vaga.status} size="sm" />
                {showPriority && (
                  <PriorityBadge 
                    priority={vaga.prioridade} 
                    size="sm" 
                    pulse={vaga.prioridade === "urgente"}
                  />
                )}
              </motion.div>
              <h3 className="font-semibold text-lg text-foreground truncate">
                {vaga.titulo}
              </h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{vaga.departamento}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{vaga.tipoContrato.toUpperCase()}</span>
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{salarioFormatado}</span>
                </span>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    aria-label="Mais opções"
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
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

          <div 
            className="grid grid-cols-4 gap-3 mb-4"
            role="group"
            aria-label="Estatísticas da vaga"
          >
            {[
              { icon: Users, value: vaga.totalCandidatos, label: 'candidatos' },
              { icon: Target, value: vaga.emProcesso, label: 'em processo' },
              { icon: Clock, value: `${diasAberta}d`, label: 'aberta', warning: diasAberta > 30 },
              { icon: Briefcase, value: vaga.quantidade, label: vaga.quantidade > 1 ? 'vagas' : 'vaga' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring' as const, stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--muted))' }}
                className="text-center p-2.5 rounded-lg bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <stat.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className={cn(
                    "text-lg font-bold",
                    stat.warning ? "text-warning" : "text-foreground"
                  )}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { to: `/vagas/${vaga.id}`, icon: Eye, label: 'Ver' },
              { to: `/vagas/${vaga.id}/editar`, icon: Edit, label: 'Editar' },
              { to: `/pipeline?vaga=${vaga.id}`, icon: Kanban, label: 'Pipeline' },
            ].map((btn) => (
              <motion.div
                key={btn.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button type="button" variant="outline" size="sm" className="w-full" asChild>
                  <Link to={btn.to}>
                    <btn.icon className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    {btn.label}
                  </Link>
                </Button>
              </motion.div>
            ))}
            {vaga.status === "publicada" && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  aria-label="Compartilhar vaga"
                >
                  <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
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
