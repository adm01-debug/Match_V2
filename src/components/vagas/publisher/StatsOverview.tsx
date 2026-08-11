import { motion, AnimatePresence } from 'framer-motion';
import { Eye, MousePointer, Users } from 'lucide-react';

interface StatsOverviewProps {
  show: boolean;
  stats: { views: number; clicks: number; applications: number };
}

export function StatsOverview({ show, stats }: StatsOverviewProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/50"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Eye className="h-4 w-4" />
              <span className="text-xs">Visualizações</span>
            </div>
            <p className="text-2xl font-bold">{stats.views.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <MousePointer className="h-4 w-4" />
              <span className="text-xs">Cliques</span>
            </div>
            <p className="text-2xl font-bold">{stats.clicks.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Candidaturas</span>
            </div>
            <p className="text-2xl font-bold">{stats.applications.toLocaleString()}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
