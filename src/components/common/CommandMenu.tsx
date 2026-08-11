import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Kanban,
  Calendar,
  ClipboardCheck,
  FileText,
  Gift,
  BarChart3,
  Plus,
  Sparkles,
  Mail,
  Shield,
  Globe,
  Clock,
} from "lucide-react";
import { useAuth, AppRole } from "@/contexts/AuthContext";

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string[];
  roles?: AppRole[];
  group: "navigation" | "actions" | "recent";
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigateTo = useCallback(
    (path: string) => {
      navigate(path);
      setOpen(false);
    },
    [navigate]
  );

  const canAccess = useCallback(
    (roles?: AppRole[]) => {
      if (!roles || roles.length === 0) return true;
      return roles.some((role) => hasRole(role));
    },
    [hasRole]
  );

  const commandItems: CommandItem[] = [
    // Navigation
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Visão geral do recrutamento",
      icon: LayoutDashboard,
      action: () => navigateTo("/"),
      keywords: ["home", "inicio", "painel", "visão geral"],
      group: "navigation",
    },
    {
      id: "vagas",
      title: "Vagas",
      description: "Gerenciar vagas abertas",
      icon: Briefcase,
      action: () => navigateTo("/vagas"),
      keywords: ["jobs", "posições", "oportunidades"],
      group: "navigation",
    },
    {
      id: "talentos",
      title: "Banco de Talentos",
      description: "Visualizar candidatos cadastrados",
      icon: Users,
      action: () => navigateTo("/talentos"),
      keywords: ["candidatos", "pessoas", "currículos", "cv"],
      group: "navigation",
    },
    {
      id: "pipeline",
      title: "Pipeline",
      description: "Kanban de processos seletivos",
      icon: Kanban,
      action: () => navigateTo("/pipeline"),
      keywords: ["kanban", "funil", "etapas", "processo"],
      group: "navigation",
    },
    {
      id: "agenda",
      title: "Agenda",
      description: "Entrevistas e compromissos",
      icon: Calendar,
      action: () => navigateTo("/agenda"),
      keywords: ["calendário", "entrevistas", "reuniões", "schedule"],
      group: "navigation",
    },
    {
      id: "avaliacoes",
      title: "Avaliações",
      description: "Avaliar candidatos",
      icon: ClipboardCheck,
      action: () => navigateTo("/avaliacoes"),
      keywords: ["feedback", "notas", "avaliação"],
      group: "navigation",
    },
    {
      id: "testes",
      title: "Testes",
      description: "Provas e avaliações técnicas",
      icon: FileText,
      action: () => navigateTo("/testes"),
      keywords: ["provas", "exames", "técnico"],
      group: "navigation",
    },
    {
      id: "indicacoes",
      title: "Indicações",
      description: "Programa de indicações",
      icon: Gift,
      action: () => navigateTo("/indicacoes"),
      keywords: ["referral", "bonus", "indica"],
      group: "navigation",
    },
    {
      id: "comunicacao",
      title: "Comunicação",
      description: "Emails e mensagens",
      icon: Mail,
      action: () => navigateTo("/comunicacao"),
      keywords: ["email", "mensagem", "template"],
      group: "navigation",
    },
    {
      id: "relatorios",
      title: "Relatórios",
      description: "Analytics e métricas",
      icon: BarChart3,
      action: () => navigateTo("/relatorios"),
      keywords: ["analytics", "métricas", "dados", "reports"],
      roles: ["admin", "rh"],
      group: "navigation",
    },
    {
      id: "admin",
      title: "Administração",
      description: "Configurações do sistema",
      icon: Shield,
      action: () => navigateTo("/admin"),
      keywords: ["config", "usuários", "permissões"],
      roles: ["admin"],
      group: "navigation",
    },
    {
      id: "portal",
      title: "Portal do Candidato",
      description: "Área externa do candidato",
      icon: Globe,
      action: () => navigateTo("/portal"),
      keywords: ["externo", "candidato", "aplicação"],
      group: "navigation",
    },
    // Quick Actions
    {
      id: "nova-vaga",
      title: "Criar Nova Vaga",
      description: "Abrir uma nova posição",
      icon: Plus,
      action: () => navigateTo("/vagas/nova"),
      keywords: ["adicionar", "nova", "criar", "vaga"],
      group: "actions",
    },
    {
      id: "parser",
      title: "Parser de Currículo",
      description: "Extrair dados de CV com IA",
      icon: Sparkles,
      action: () => navigateTo("/parser-curriculo"),
      keywords: ["ia", "inteligência", "extrair", "cv", "currículo"],
      group: "actions",
    },
    {
      id: "nova-entrevista",
      title: "Agendar Entrevista",
      description: "Marcar nova entrevista",
      icon: Clock,
      action: () => navigateTo("/agenda?action=new"),
      keywords: ["agendar", "marcar", "entrevista", "calendário"],
      group: "actions",
    },
  ];

  const filteredItems = commandItems.filter((item) => canAccess(item.roles));

  const navigationItems = filteredItems.filter(
    (item) => item.group === "navigation"
  );
  const actionItems = filteredItems.filter((item) => item.group === "actions");

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Digite para buscar..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Ações Rápidas">
          {actionItems.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.title} ${item.keywords?.join(" ") || ""}`}
              onSelect={item.action}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{item.title}</span>
                {item.description && (
                  <span className="text-sm text-muted-foreground">
                    {item.description}
                  </span>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navegação">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.title} ${item.keywords?.join(" ") || ""}`}
              onSelect={item.action}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{item.title}</span>
                {item.description && (
                  <span className="text-sm text-muted-foreground">
                    {item.description}
                  </span>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

CommandMenu.displayName = "CommandMenu";
