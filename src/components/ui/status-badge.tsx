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
  Briefcase,
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
        novo: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
        triagem: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
        "em-triagem": "bg-violet-500/15 text-violet-700 dark:text-violet-400",
        entrevista: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        "entrevista-rh": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        "entrevista-gestor": "bg-orange-500/15 text-orange-700 dark:text-orange-400",
        "entrevista-final": "bg-pink-500/15 text-pink-700 dark:text-pink-400",
        teste: "bg-pink-500/15 text-pink-700 dark:text-pink-400",
        "teste-tecnico": "bg-pink-500/15 text-pink-700 dark:text-pink-400",
        aprovado: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        contratado: "bg-green-600/15 text-green-700 dark:text-green-400",
        reprovado: "bg-red-500/15 text-red-700 dark:text-red-400",
        
        // Status Geral
        ativo: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        inativo: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
        pendente: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        concluido: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        cancelado: "bg-red-500/15 text-red-700 dark:text-red-400",
        arquivado: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
        
        // Vagas
        rascunho: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
        publicada: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        "aguardando-aprovacao": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        encerrada: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
        pausada: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        
        // Entrevistas
        agendada: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
        confirmada: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        realizada: "bg-green-600/15 text-green-700 dark:text-green-400",
        "nao-compareceu": "bg-red-500/15 text-red-700 dark:text-red-400",
        reagendada: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        
        // Candidatos
        "banco-talentos": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
        
        // Prioridades
        urgente: "bg-red-500/15 text-red-700 dark:text-red-400",
        alta: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
        media: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
        baixa: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
        
        // Comunicação
        enviado: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        lido: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
        respondido: "bg-green-600/15 text-green-700 dark:text-green-400",
        
        // Default/Fallback
        default: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
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
  
  // Determina a variante correta
  const variant = statusBadgeVariants.variants?.variant?.[normalizedStatus as keyof typeof statusBadgeVariants.variants.variant]
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
