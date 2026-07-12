import { memo } from "react";
import { motion } from "framer-motion";
import { Calendar, Crown, Rocket } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MissionsHeaderProps {
  daysUntilReset: number;
  totalXP: number;
}

export const MissionsHeader = memo(function MissionsHeader({
  daysUntilReset,
  totalXP,
}: MissionsHeaderProps) {
  return (
    <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg"
            animate={{
              boxShadow: [
                "0 4px 20px hsl(var(--primary) / 0.3)",
                "0 4px 30px hsl(var(--primary) / 0.5)",
                "0 4px 20px hsl(var(--primary) / 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Rocket className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Missões Semanais
              <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                <Crown className="w-3 h-3 mr-1" />
                x2 XP
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              Renova em {daysUntilReset} dias
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">XP Total Possível</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {totalXP.toLocaleString()}
          </p>
        </div>
      </div>
    </CardHeader>
  );
});
