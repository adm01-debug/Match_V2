import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  UserCheck,
  UserX,
  FileSearch,
  Calendar,
  Star,
  Send,
  Pause,
  Play,
  Archive,
  type LucideIcon,
} from "lucide-react";

/**
 * StatusBadge - Componente universal para exibição de status
 * Padroniza cores e ícones em todo o sistema
 */

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        // Pipeline / Processo Seletivo
        novo: "bg-info/15 text-info",
        triagem: "bg-primary/15 text-primary",
        "em-triagem": "bg-primary/15 text-primary",
        entrevista: "bg-warning/15 text-warning",
        "entrevista-rh": "bg-warning/15 text-warning",
        "entrevista-gestor": "bg-warning/20 text-warning",
        "entrevista-final": "bg-accent/20 text-accent-foreground",
        teste: "bg-accent/20 text-accent-foreground",
        "teste-tecnico": "bg-accent/20 text-accent-foreground",
        aprovado: "bg-success/15 text-success",
        contratado: "bg-success/20 text-success",
        reprovado: "bg-destructive/15 text-destructive",

        // Status Geral
        ativo: "bg-success/15 text-success",
        inativo: "bg-muted text-muted-foreground",
        pendente: "bg-warning/15 text-warning",
        concluido: "bg-success/15 text-success",
        cancelado: "bg-destructive/15 text-destructive",
        arquivado: "bg-muted text-muted-foreground",

        // Vagas
        rascunho: "bg-muted text-muted-foreground",
        publicada: "bg-success/15 text-success",
        "aguardando-aprovacao": "bg-warning/15 text-warning",
        encerrada: "bg-muted text-muted-foreground",
        pausada: "bg-warning/15 text-warning",

        // Entrevistas
        agendada: "bg-info/15 text-info",
        confirmada: "bg-success/15 text-success",
        realizada: "bg-success/20 text-success",
        "nao-compareceu": "bg-destructive/15 text-destructive",
        reagendada: "bg-warning/15 text-warning",

        // Candidatos
        "banco-talentos": "bg-primary/15 text-primary",

        // Prioridades
        urgente: "bg-destructive/15 text-destructive",
        alta: "bg-warning/20 text-warning",
        media: "bg-info/15 text-info",
        baixa: "bg-muted text-muted-foreground",

        // Comunicação
        enviado: "bg-success/15 text-success",
        lido: "bg-info/15 text-info",
        respondido: "bg-success/20 text-success",

        // Default/Fallback
        default: "bg-muted text-muted-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Mapeamento de status para ícones
const statusIcons: Record<string, LucideIcon> = {
  // Pipeline
  novo: Clock,
  triagem: FileSearch,
  "em-triagem": FileSearch,
  entrevista: Calendar,
  "entrevista-rh": Calendar,
  "entrevista-gestor": Calendar,
  "entrevista-final": Calendar,
  teste: FileSearch,
  "teste-tecnico": FileSearch,
  aprovado: CheckCircle2,
  contratado: UserCheck,
  reprovado: XCircle,
  
  // Status Geral
  ativo: CheckCircle2,
  inativo: Pause,
  pendente: Clock,
  concluido: CheckCircle2,
  cancelado: XCircle,
  arquivado: Archive,
  
  // Vagas
  rascunho: FileSearch,
  publicada: Play,
  "aguardando-aprovacao": Clock,
  encerrada: Archive,
  pausada: Pause,
  
  // Entrevistas
  agendada: Calendar,
  confirmada: CheckCircle2,
  realizada: CheckCircle2,
  "nao-compareceu": UserX,
  reagendada: Clock,
  
  // Candidatos
  "banco-talentos": Star,
  
  // Prioridades
  urgente: AlertCircle,
  alta: AlertCircle,
  media: Clock,
  baixa: Clock,
  
  // Comunicação
  enviado: Send,
  lido: CheckCircle2,
  respondido: CheckCircle2,
};

// Mapeamento de labels amigáveis
const statusLabels: Record<string, string> = {
  // Pipeline
  novo: "Novo",
  triagem: "Triagem",
  "em-triagem": "Em Triagem",
  "em_triagem": "Em Triagem",
  entrevista: "Entrevista",
  "entrevista-rh": "Entrevista RH",
  "entrevista_rh": "Entrevista RH",
  "entrevista-gestor": "Ent. Gestor",
  "entrevista_gestor": "Ent. Gestor",
  "entrevista-final": "Ent. Final",
  "entrevista_final": "Ent. Final",
  teste: "Teste",
  "teste-tecnico": "Teste Técnico",
  "teste_tecnico": "Teste Técnico",
  "pre_selecao": "Pré-seleção",
  aprovado: "Aprovado",
  contratado: "Contratado",
  reprovado: "Reprovado",
  
  // Status Geral
  ativo: "Ativo",
  inativo: "Inativo",
  pendente: "Pendente",
  concluido: "Concluído",
  cancelado: "Cancelado",
  arquivado: "Arquivado",
  em_andamento: "Em Andamento",
  
  // Vagas
  rascunho: "Rascunho",
  publicada: "Publicada",
  "aguardando-aprovacao": "Aguardando Aprovação",
  aguardando_aprovacao: "Aguardando Aprovação",
  em_selecao: "Em Seleção",
  encerrada: "Encerrada",
  pausada: "Pausada",
  
  // Entrevistas
  agendada: "Agendada",
  confirmada: "Confirmada",
  realizada: "Realizada",
  "nao-compareceu": "Não Compareceu",
  nao_compareceu: "Não Compareceu",
  reagendada: "Reagendada",
  
  // Candidatos
  "banco-talentos": "Banco de Talentos",
  banco_talentos: "Banco de Talentos",
  
  // Prioridades
  urgente: "Urgente",
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
  
  // Comunicação
  enviado: "Enviado",
  lido: "Lido",
  respondido: "Respondido",
};

// Converte snake_case para kebab-case para lookup de variante
function normalizeStatus(status: string): string {
  return status.toLowerCase().replace(/_/g, "-");
}

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: string;
  showIcon?: boolean;
  showLabel?: boolean;
  customLabel?: string;
  loading?: boolean;
}

export function StatusBadge({
  status,
  showIcon = true,
  showLabel = true,
  customLabel,
  loading = false,
  size,
  className,
  ...props
}: StatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);
  const Icon = loading ? Loader2 : statusIcons[normalizedStatus];
  const label = customLabel || statusLabels[status] || statusLabels[normalizedStatus] || status;
  
  // Determina a variante correta usando lista de variantes conhecidas
  const knownVariants = ['novo', 'triagem', 'em-triagem', 'entrevista', 'entrevista-rh', 'entrevista-gestor', 'entrevista-final', 'teste', 'teste-tecnico', 'aprovado', 'contratado', 'reprovado', 'ativo', 'inativo', 'pendente', 'concluido', 'cancelado', 'arquivado', 'rascunho', 'publicada', 'aguardando-aprovacao', 'encerrada', 'pausada', 'agendada', 'confirmada', 'realizada', 'nao-compareceu', 'reagendada', 'banco-talentos', 'urgente', 'alta', 'media', 'baixa', 'enviado', 'lido', 'respondido'];
  const variant = knownVariants.includes(normalizedStatus)
    ? (normalizedStatus as VariantProps<typeof statusBadgeVariants>["variant"])
    : "default";

  return (
    <div
      className={cn(statusBadgeVariants({ variant, size }), className)}
      {...props}
    >
      {showIcon && Icon && (
        <Icon 
          className={cn(
            "shrink-0",
            size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5",
            loading && "animate-spin"
          )} 
        />
      )}
      {showLabel && <span>{label}</span>}
    </div>
  );
}

StatusBadge.displayName = "StatusBadge";

// Export helper para uso em outros componentes
export { statusLabels, statusIcons, normalizeStatus };
