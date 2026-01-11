/**
 * @fileoverview Smart Breadcrumbs Component
 * @description Intelligent breadcrumb navigation with context awareness
 */

import { memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  ChevronRight,
  Briefcase,
  Users,
  Kanban,
  Calendar,
  FileText,
  BarChart3,
  Gift,
  Mail,
  Shield,
  UserCircle,
  MoreHorizontal,
  Plus,
  Edit,
} from 'lucide-react';

interface BreadcrumbConfig {
  path: string;
  label: string;
  icon: React.ElementType;
  parent?: string;
  actions?: {
    label: string;
    icon: React.ElementType;
    path: string;
  }[];
}

const routeConfig: Record<string, BreadcrumbConfig> = {
  '/': {
    path: '/',
    label: 'Dashboard',
    icon: Home,
  },
  '/vagas': {
    path: '/vagas',
    label: 'Vagas',
    icon: Briefcase,
    parent: '/',
    actions: [
      { label: 'Nova Vaga', icon: Plus, path: '/vagas/nova' },
    ],
  },
  '/vagas/nova': {
    path: '/vagas/nova',
    label: 'Nova Vaga',
    icon: Plus,
    parent: '/vagas',
  },
  '/talentos': {
    path: '/talentos',
    label: 'Talentos',
    icon: Users,
    parent: '/',
  },
  '/pipeline': {
    path: '/pipeline',
    label: 'Pipeline',
    icon: Kanban,
    parent: '/',
  },
  '/agenda': {
    path: '/agenda',
    label: 'Agenda',
    icon: Calendar,
    parent: '/',
  },
  '/testes': {
    path: '/testes',
    label: 'Testes',
    icon: FileText,
    parent: '/',
    actions: [
      { label: 'Nova Prova', icon: Plus, path: '/testes/nova' },
    ],
  },
  '/testes/nova': {
    path: '/testes/nova',
    label: 'Nova Prova',
    icon: Plus,
    parent: '/testes',
  },
  '/indicacoes': {
    path: '/indicacoes',
    label: 'Indicações',
    icon: Gift,
    parent: '/',
  },
  '/comunicacao': {
    path: '/comunicacao',
    label: 'Comunicação',
    icon: Mail,
    parent: '/',
  },
  '/relatorios': {
    path: '/relatorios',
    label: 'Relatórios',
    icon: BarChart3,
    parent: '/',
  },
  '/admin': {
    path: '/admin',
    label: 'Administração',
    icon: Shield,
    parent: '/',
  },
  '/configuracoes/seguranca': {
    path: '/configuracoes/seguranca',
    label: 'Segurança',
    icon: Shield,
    parent: '/',
  },
};

// Dynamic route patterns
const dynamicRoutePatterns = [
  { pattern: /^\/vagas\/([^/]+)$/, getConfig: (id: string): BreadcrumbConfig => ({
    path: `/vagas/${id}`,
    label: 'Detalhes da Vaga',
    icon: Briefcase,
    parent: '/vagas',
  })},
  { pattern: /^\/vagas\/([^/]+)\/editar$/, getConfig: (id: string): BreadcrumbConfig => ({
    path: `/vagas/${id}/editar`,
    label: 'Editar Vaga',
    icon: Edit,
    parent: `/vagas/${id}`,
  })},
  { pattern: /^\/candidato\/([^/]+)$/, getConfig: (_id: string): BreadcrumbConfig => ({
    path: `/candidato/${_id}`,
    label: 'Perfil do Candidato',
    icon: UserCircle,
    parent: '/talentos',
  })},
  { pattern: /^\/testes\/([^/]+)\/editar$/, getConfig: (id: string): BreadcrumbConfig => ({
    path: `/testes/${id}/editar`,
    label: 'Editar Prova',
    icon: Edit,
    parent: '/testes',
  })},
  { pattern: /^\/testes\/([^/]+)\/aplicar$/, getConfig: (id: string): BreadcrumbConfig => ({
    path: `/testes/${id}/aplicar`,
    label: 'Aplicar Prova',
    icon: FileText,
    parent: '/testes',
  })},
  { pattern: /^\/avaliacao\/([^/]+)$/, getConfig: (id: string): BreadcrumbConfig => ({
    path: `/avaliacao/${id}`,
    label: 'Avaliação',
    icon: FileText,
    parent: '/pipeline',
  })},
];

function getRouteConfig(pathname: string): BreadcrumbConfig | null {
  // Check static routes first
  if (routeConfig[pathname]) {
    return routeConfig[pathname];
  }
  
  // Check dynamic routes
  for (const { pattern, getConfig } of dynamicRoutePatterns) {
    const match = pathname.match(pattern);
    if (match && match[1]) {
      return getConfig(match[1]);
    }
  }
  
  return null;
}

function buildBreadcrumbChain(pathname: string): BreadcrumbConfig[] {
  const chain: BreadcrumbConfig[] = [];
  let currentPath: string | undefined = pathname;
  
  while (currentPath) {
    const config = getRouteConfig(currentPath);
    if (config) {
      chain.unshift(config);
      currentPath = config.parent;
    } else {
      break;
    }
  }
  
  return chain;
}

interface SmartBreadcrumbsProps {
  className?: string;
  maxItems?: number;
  showActions?: boolean;
}

export const SmartBreadcrumbs = memo(function SmartBreadcrumbs({
  className,
  maxItems = 4,
  showActions = true,
}: SmartBreadcrumbsProps) {
  const location = useLocation();
  
  const breadcrumbs = useMemo(() => {
    return buildBreadcrumbChain(location.pathname);
  }, [location.pathname]);
  
  // Don't show breadcrumbs on dashboard
  if (location.pathname === '/' || breadcrumbs.length === 0) {
    return null;
  }
  
  // Handle overflow
  const shouldCollapse = breadcrumbs.length > maxItems;
  const visibleBreadcrumbs = shouldCollapse 
    ? [breadcrumbs[0], ...breadcrumbs.slice(-2)]
    : breadcrumbs;
  const collapsedBreadcrumbs = shouldCollapse 
    ? breadcrumbs.slice(1, -2)
    : [];
  
  const currentPage = breadcrumbs[breadcrumbs.length - 1];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-center gap-3", className)}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <AnimatePresence mode="popLayout">
            {visibleBreadcrumbs.map((crumb, index) => {
              if (!crumb) return null;
              
              const isLast = index === visibleBreadcrumbs.length - 1;
              const Icon = crumb.icon;
              
              // Insert ellipsis for collapsed items
              if (shouldCollapse && index === 1 && collapsedBreadcrumbs.length > 0) {
                return (
                  <motion.div
                    key="ellipsis"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="contents"
                  >
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </BreadcrumbSeparator>
                    
                    <BreadcrumbItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="min-w-[180px]">
                          {collapsedBreadcrumbs.map((collapsed) => {
                            if (!collapsed) return null;
                            const CollapsedIcon = collapsed.icon;
                            return (
                              <DropdownMenuItem key={collapsed.path} asChild>
                                <Link to={collapsed.path} className="flex items-center gap-2">
                                  <CollapsedIcon className="h-4 w-4" />
                                  {collapsed.label}
                                </Link>
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                    
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </BreadcrumbSeparator>
                    
                    {/* Continue with current item */}
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="flex items-center gap-1.5 font-medium">
                          <Icon className="h-4 w-4" />
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link 
                            to={crumb.path}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                          >
                            <Icon className="h-4 w-4" />
                            {crumb.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </motion.div>
                );
              }
              
              return (
                <motion.div
                  key={crumb.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className="contents"
                >
                  {index > 0 && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </BreadcrumbSeparator>
                  )}
                  
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="flex items-center gap-1.5 font-medium">
                        <Icon className="h-4 w-4" />
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link 
                          to={crumb.path}
                          className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                          <Icon className="h-4 w-4" />
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Quick Actions for current page */}
      {showActions && currentPage?.actions && currentPage.actions.length > 0 && (
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
          {currentPage.actions.map((action) => {
            const ActionIcon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                  "bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                )}
              >
                <ActionIcon className="h-3.5 w-3.5" />
                {action.label}
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
});

SmartBreadcrumbs.displayName = 'SmartBreadcrumbs';