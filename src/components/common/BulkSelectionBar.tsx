import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X, Mail, Tag, Archive, UserPlus, Trash2, MoveRight } from "lucide-react";

interface BulkSelectionBarProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onClearSelection: () => void;
  onAction: (action: string) => void;
  entityType: "candidatos" | "vagas";
}

export function BulkSelectionBar({
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAll,
  onClearSelection,
  onAction,
  entityType,
}: BulkSelectionBarProps) {
  if (selectedCount === 0) return null;

  const candidatoActions = [
    { id: "move_stage", label: "Mover para etapa", icon: MoveRight },
    { id: "add_tags", label: "Adicionar tags", icon: Tag },
    { id: "send_email", label: "Enviar email", icon: Mail },
    { id: "add_talent_pool", label: "Adicionar ao Talent Pool", icon: UserPlus },
    { id: "archive", label: "Arquivar", icon: Archive },
    { id: "delete", label: "Excluir", icon: Trash2, destructive: true },
  ];

  const vagaActions = [
    { id: "publish", label: "Publicar", icon: MoveRight },
    { id: "unpublish", label: "Despublicar", icon: Archive },
    { id: "duplicate", label: "Duplicar", icon: Tag },
    { id: "archive", label: "Arquivar", icon: Archive },
    { id: "delete", label: "Excluir", icon: Trash2, destructive: true },
  ];

  const actions = entityType === "candidatos" ? candidatoActions : vagaActions;

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 p-3 bg-primary/10 border rounded-lg mb-4">
      <div className="flex items-center gap-3">
        <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
        <Badge variant="secondary" className="font-medium">
          {selectedCount} de {totalCount} selecionados
        </Badge>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="h-4 w-4 mr-1" />Limpar
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm">
              Ações <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {actions.map((action) => (
              <div key={action.id}>
                {action.destructive && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={() => onAction(action.id)}
                  className={action.destructive ? "text-destructive" : ""}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </DropdownMenuItem>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
