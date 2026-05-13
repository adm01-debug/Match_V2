import { memo } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Sparkles, Activity, Calendar, HelpCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DashboardHeaderProps {
  resetTour: () => void;
}

export const DashboardHeader = memo(function DashboardHeader({ resetTour }: DashboardHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-3xl opacity-40 -z-10" />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/30 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground shadow-lg"><LayoutDashboard className="h-7 w-7" /></div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <Badge className="bg-gradient-to-r from-primary/90 to-accent/90 text-white gap-1.5 px-3 py-1"><Sparkles className="h-3.5 w-3.5" />IA Ativa</Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 mt-1"><Activity className="h-4 w-4 text-primary animate-pulse" />Visão geral em tempo real</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-background/50 border">
            <Calendar className="h-4 w-4 text-muted-foreground ml-2" />
            <Select defaultValue="30">
              <SelectTrigger className="w-40 border-0 bg-transparent"><SelectValue placeholder="Período" /></SelectTrigger>
              <SelectContent><SelectItem value="7">7 dias</SelectItem><SelectItem value="30">30 dias</SelectItem><SelectItem value="90">90 dias</SelectItem></SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="icon" onClick={resetTour}><HelpCircle className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </div>
    </motion.div>
  );
});
