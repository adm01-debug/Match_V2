import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Vaga, StatusVaga, Prioridade } from "@/types/recruitment";
import { 
  Eye, 
  Edit, 
  Kanban, 
  Share2, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Users,
  Target,
  Clock,
  MoreHorizontal,
  Flame,
  AlertTriangle
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

interface VagaCardProps {
  vaga: Vaga;
}

const statusConfig: Record<StatusVaga, { label: string; className: string }> = {
  rascunho: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
  aguardando_aprovacao: { label: "Em Aprovação", className: "bg-warning/10 text-warning border-warning/20" },
  aprovada: { label: "Aprovada", className: "bg-info/10 text-info border-info/20" },
  publicada: { label: "Aberta", className: "bg-success/10 text-success border-success/20" },
  em_selecao: { label: "Em Seleção", className: "bg-primary/10 text-primary border-primary/20" },
  pausada: { label: "Pausada", className: "bg-muted text-muted-foreground" },
  encerrada: { label: "Encerrada", className: "bg-muted text-muted-foreground" },
  cancelada: { label: "Cancelada", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const prioridadeConfig: Record<Prioridade, { label: string; icon: any; className: string }> = {
  urgente: { label: "Urgente", icon: Flame, className: "bg-destructive/10 text-destructive" },
  alta: { label: "Alta", icon: AlertTriangle, className: "bg-warning/10 text-warning" },
  media: { label: "Média", icon: null, className: "bg-info/10 text-info" },
  baixa: { label: "Baixa", icon: null, className: "bg-muted text-muted-foreground" },
};

export function VagaCard({ vaga }: VagaCardProps) {
  const status = statusConfig[vaga.status];
  const prioridade = prioridadeConfig[vaga.prioridade];
  const PrioridadeIcon = prioridade.icon;
  
  const diasAberta = vaga.dataPublicacao 
    ? Math.floor((new Date().getTime() - new Date(vaga.dataPublicacao).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const formatSalario = (min?: number, max?: number, aCombinar?: boolean) => {
    if (aCombinar) return "A combinar";
    if (min && max) return `R$ ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `A partir de R$ ${min.toLocaleString()}`;
    return "Não informado";
  };

  return (
    <Card className="card-hover border-l-4 border-l-primary">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={cn("text-xs", status.className)}>
                {status.label}
              </Badge>
              {vaga.prioridade !== "baixa" && vaga.prioridade !== "media" && (
                <Badge variant="outline" className={cn("text-xs", prioridade.className)}>
                  {PrioridadeIcon && <PrioridadeIcon className="h-3 w-3 mr-1" />}
                  {prioridade.label}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg text-foreground truncate">
              {vaga.titulo}
            </h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {vaga.departamento}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {vaga.tipoContrato.toUpperCase()}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                {formatSalario(vaga.salarioMin, vaga.salarioMax, vaga.salarioACombinar)}
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover">
              <DropdownMenuItem asChild>
                <Link to={`/vagas/${vaga.id}`} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Ver detalhes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/vagas/${vaga.id}/editar`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Editar vaga
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/pipeline?vaga=${vaga.id}`} className="flex items-center gap-2">
                  <Kanban className="h-4 w-4" />
                  Ver pipeline
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Divulgar vaga
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center p-2.5 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{vaga.totalCandidatos}</span>
            </div>
            <p className="text-xs text-muted-foreground">candidatos</p>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{vaga.emProcesso}</span>
            </div>
            <p className="text-xs text-muted-foreground">em processo</p>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={cn(
                "text-lg font-bold",
                diasAberta > 30 ? "text-warning" : "text-foreground"
              )}>
                {diasAberta}d
              </span>
            </div>
            <p className="text-xs text-muted-foreground">aberta</p>
          </div>
          <div className="text-center p-2.5 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{vaga.quantidade}</span>
            </div>
            <p className="text-xs text-muted-foreground">vaga{vaga.quantidade > 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/vagas/${vaga.id}`}>
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Ver
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/vagas/${vaga.id}/editar`}>
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Editar
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/pipeline?vaga=${vaga.id}`}>
              <Kanban className="h-3.5 w-3.5 mr-1.5" />
              Pipeline
            </Link>
          </Button>
          {vaga.status === "publicada" && (
            <Button variant="outline" size="sm">
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
