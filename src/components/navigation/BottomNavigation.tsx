/**
 * @fileoverview Bottom Navigation Mobile Component
 * @description Navegação inferior responsiva para dispositivos móveis
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Settings,
  Kanban,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Início', icon: LayoutDashboard },
  { path: '/vagas', label: 'Vagas', icon: Briefcase },
  { path: '/pipeline', label: 'Pipeline', icon: Kanban },
  { path: '/agenda', label: 'Agenda', icon: Calendar },
  { path: '/configuracoes/seguranca', label: 'Config', icon: Settings },
];

function BottomNavigationComponent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const isHome = location.pathname === '/';

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="bg-background/95 backdrop-blur-lg border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-1 safe-area-bottom">
          {!isHome && (
            <motion.button
              onClick={handleBack}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[50px] transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Voltar"
            >
              <div className="relative z-10">
                <ChevronLeft className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium mt-1 relative z-10">Voltar</span>
            </motion.button>
          )}

          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[60px] transition-colors relative",
                  active ? "text-primary" : "text-muted-foreground"
                )}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: 'spring' as const, stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={active ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                  transition={{ type: 'spring' as const, stiffness: 400 }}
                  className="relative z-10"
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <motion.span
                  animate={active ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 0 }}
                  className="text-[10px] font-medium mt-1 relative z-10"
                >
                  {item.label}
                </motion.span>
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

BottomNavigationComponent.displayName = 'BottomNavigation';

export const BottomNavigation = memo(BottomNavigationComponent);
export default BottomNavigation;
