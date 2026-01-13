/**
 * @fileoverview AppSidebar component with premium design
 * @module AppSidebar
 */

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Mail,
  Shield,
  HelpCircle,
  Trophy,
  FileCheck,
  UserCog,
  TrendingUp,
  Brain,
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
import { useOnboarding } from "@/hooks/useOnboarding";

const menuItems = [
  {
    group: "Principal",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard, tourId: "dashboard" },
      { title: "Vagas", url: "/vagas", icon: Briefcase, tourId: "vagas" },
      { title: "Banco de Talentos", url: "/talentos", icon: Users, tourId: "candidatos" },
      { title: "Pipeline", url: "/pipeline", icon: Kanban },
      { title: "Parser Currículo", url: "/parser-curriculo", icon: Sparkles },
    ],
  },
  {
    group: "Processo",
    items: [
      { title: "Agenda", url: "/agenda", icon: Calendar, tourId: "agenda" },
      { title: "Avaliações", url: "/avaliacoes", icon: ClipboardCheck },
      { title: "Comportamentais", url: "/avaliacoes-comportamentais", icon: Brain },
      { title: "Avaliação Imersiva", url: "/avaliacao-comportamental", icon: Sparkles },
      { title: "Testes", url: "/testes", icon: FileText },
    ],
  },
  {
    group: "Gestão",
    items: [
      { title: "Indicações", url: "/indicacoes", icon: Gift },
      { title: "Conquistas", url: "/gamification", icon: Trophy },
      { title: "Comunicação", url: "/comunicacao", icon: Mail },
      { title: "Ofertas", url: "/ofertas", icon: FileCheck },
      { title: "Portal Gestor", url: "/gestor", icon: UserCog, roles: ['gestor', 'admin'] as AppRole[] },
      { title: "Relatórios", url: "/relatorios", icon: BarChart3, roles: ['admin', 'rh'] as AppRole[] },
      { title: "Analytics Avançado", url: "/analytics", icon: TrendingUp, roles: ['admin', 'rh'] as AppRole[] },
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
  admin: 'bg-destructive/20 text-destructive border-destructive/30',
  rh: 'bg-primary/20 text-primary border-primary/30',
  gestor: 'bg-warning/20 text-warning border-warning/30',
};

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, roles, signOut, hasRole } = useAuth();
  const { resetTour } = useOnboarding();
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
    const nome = user?.user_metadata?.['nome'] as string | undefined;
    if (nome) {
      return nome
        .split(' ')
        .slice(0, 2)
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  const getUserName = () => {
    const nome = user?.user_metadata?.['nome'] as string | undefined;
    return nome || user?.email?.split('@')[0] || 'Usuário';
  };

  return (
    <Sidebar 
      role="navigation" 
      aria-label="Menu de navegação principal"
      className={cn(
        "border-r-0 transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
      collapsible="icon"
    >
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border/50">
        <div 
          data-testid="app-sidebar" 
          className={cn(
            "flex items-center gap-3 px-4 py-4",
            collapsed && "justify-center px-2"
          )}
        >
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow text-white font-bold text-lg"
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            M
          </motion.div>
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-semibold text-sidebar-foreground">Match ATS</span>
              <span className="text-xs text-sidebar-muted">Recrutamento</span>
            </motion.div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 scrollbar-thin">
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={group.group}>
            {!collapsed && (
              <SidebarGroupLabel className="text-sidebar-muted text-[11px] font-medium uppercase tracking-wider mb-2 px-3">
                {group.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, itemIndex) => {
                  const itemWithRoles = item as typeof item & { roles?: AppRole[]; tourId?: string };
                  if (!canAccessItem(itemWithRoles.roles)) return null;
                  
                  const active = isActive(item.url);
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={collapsed ? item.title : undefined}
                      >
                        <NavLink
                          to={item.url}
                          data-tour={itemWithRoles.tourId}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                            active 
                              ? "bg-sidebar-primary/10 text-sidebar-primary before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:rounded-r-full before:bg-sidebar-primary" 
                              : "hover:bg-sidebar-accent",
                            collapsed && "justify-center px-2"
                          )}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <item.icon className={cn(
                              "h-5 w-5 shrink-0 transition-colors",
                              active ? "text-sidebar-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"
                            )} />
                          </motion.div>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: groupIndex * 0.05 + itemIndex * 0.02 }}
                            >
                              {item.title}
                            </motion.span>
                          )}
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

      <SidebarFooter className="border-t border-sidebar-border/50 p-3">
        {/* User Profile Card */}
        <div className={cn(
          "flex items-center gap-3 rounded-xl p-2.5 bg-sidebar-accent/50 backdrop-blur-sm",
          collapsed && "justify-center bg-transparent"
        )}>
          <Avatar className="h-9 w-9 ring-2 ring-sidebar-primary/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-sidebar-foreground truncate">
                {getUserName()}
              </span>
              <div className="flex gap-1 flex-wrap mt-0.5">
                {roles.map((role) => (
                  <Badge 
                    key={role} 
                    variant="outline" 
                    className={cn(
                      "text-[10px] px-1.5 py-0 h-4 border",
                      roleColors[role]
                    )}
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
              className="h-8 w-8 text-sidebar-muted hover:text-destructive hover:bg-destructive/10 transition-colors"
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
            className="w-full mt-2 text-sidebar-muted hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}

        {/* Actions */}
        <div className={cn("flex gap-1 mt-2", collapsed && "flex-col")}>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTour}
            className={cn(
              "flex-1 text-sidebar-muted hover:text-sidebar-primary hover:bg-sidebar-primary/10 transition-colors",
              collapsed && "px-2 w-full"
            )}
            title="Refazer tour de introdução"
          >
            {collapsed ? (
              <HelpCircle className="h-4 w-4" />
            ) : (
              <>
                <HelpCircle className="h-4 w-4 mr-2" />
                <span className="text-xs">Tour</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              "flex-1 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
              collapsed && "px-2 w-full"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs">Recolher</span>
              </>
            )}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

AppSidebar.displayName = "AppSidebar";
