import { memo } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Mail,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    group: "Principal",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Vagas", url: "/vagas", icon: Briefcase },
      { title: "Banco de Talentos", url: "/talentos", icon: Users },
      { title: "Pipeline", url: "/pipeline", icon: Kanban },
      { title: "Parser Currículo", url: "/parser-curriculo", icon: Sparkles },
    ],
  },
  {
    group: "Processo",
    items: [
      { title: "Agenda", url: "/agenda", icon: Calendar },
      { title: "Avaliações", url: "/avaliacoes", icon: ClipboardCheck },
      { title: "Testes", url: "/testes", icon: FileText },
    ],
  },
  {
    group: "Gestão",
    items: [
      { title: "Indicações", url: "/indicacoes", icon: Gift },
      { title: "Comunicação", url: "/comunicacao", icon: Mail },
      { title: "Relatórios", url: "/relatorios", icon: BarChart3, roles: ['admin', 'rh'] as AppRole[] },
      { title: "Administração", url: "/admin", icon: Shield, roles: ['admin'] as AppRole[] },
    ],
  },
  {
    group: "Externo",
    items: [
      { title: "Portal Candidato", url: "/portal", icon: Globe },
    ],
  },
];

const roleLabels: Record<AppRole, string> = {
  admin: 'Admin',
  rh: 'RH',
  gestor: 'Gestor',
};

const roleColors: Record<AppRole, string> = {
  admin: 'bg-destructive/20 text-destructive',
  rh: 'bg-primary/20 text-primary',
  gestor: 'bg-amber-500/20 text-amber-600',
};

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, roles, signOut, hasRole } = useAuth();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const canAccessItem = (itemRoles?: AppRole[]) => {
    if (!itemRoles || itemRoles.length === 0) return true;
    return itemRoles.some(role => hasRole(role));
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.nome) {
      return user.user_metadata.nome
        .split(' ')
        .slice(0, 2)
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  const getUserName = () => {
    return user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Usuário';
  };

  return (
    <Sidebar role="navigation" aria-label="Menu de navegação principal"
      className={cn(
        "border-r-0 transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div data-testid="app-sidebar" className={cn(
          "flex items-center gap-3 px-4 py-4",
          collapsed && "justify-center px-2"
        )}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            PB
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">Promo Brindes</span>
              <span className="text-xs text-sidebar-muted">Recrutamento</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 scrollbar-thin">
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            {!collapsed && (
              <SidebarGroupLabel className="text-sidebar-muted text-xs uppercase tracking-wider mb-2">
                {group.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const itemWithRoles = item as typeof item & { roles?: AppRole[] };
                  if (!canAccessItem(itemWithRoles.roles)) return null;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        tooltip={collapsed ? item.title : undefined}
                      >
                        <NavLink
                          to={item.url}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                            "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                            isActive(item.url) && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                            collapsed && "justify-center px-2"
                          )}
                        >
                          <item.icon className={cn("h-5 w-5 shrink-0", collapsed && "h-5 w-5")} />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className={cn(
          "flex items-center gap-3 rounded-lg p-2",
          collapsed && "justify-center"
        )}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/20 text-primary text-sm">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-sidebar-foreground truncate">
                {getUserName()}
              </span>
              <div className="flex gap-1 flex-wrap">
                {roles.map((role) => (
                  <Badge 
                    key={role} 
                    variant="secondary" 
                    className={cn("text-[10px] px-1.5 py-0", roleColors[role])}
                  >
                    {roleLabels[role]}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-sidebar-muted hover:text-destructive"
              onClick={handleLogout}
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>

        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="w-full mt-2 text-sidebar-muted hover:text-destructive"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            "w-full mt-2 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Recolher menu
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
