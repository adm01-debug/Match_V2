import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { ConflictInfo } from './types';

export function ConflictBanner({ conflicts }: { conflicts: ConflictInfo[] }) {
  if (conflicts.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg bg-destructive/10 border border-destructive/20"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-destructive">Conflitos detectados</p>
          <ul className="mt-1 space-y-1">
            {conflicts.map((c, i) => (
              <li key={i} className="text-sm text-muted-foreground">{c.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
