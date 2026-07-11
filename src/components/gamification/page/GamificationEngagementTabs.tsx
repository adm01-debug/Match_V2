import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Calendar, Rocket, Sparkles } from "lucide-react";
import { DailyChallenges } from "@/components/gamification/DailyChallenges";
import { WeeklyMissions } from "@/components/gamification/WeeklyMissions";
import { PowerUps, type PowerUpType } from "@/components/gamification/PowerUps";
import { toast } from "sonner";

interface GamificationEngagementTabsProps {
  onXpEarned: (
    xp: number,
    source: "daily_challenge" | "weekly_mission",
    label: string,
    variant: "bonus" | "large",
  ) => void;
}

export function GamificationEngagementTabs({ onXpEarned }: GamificationEngagementTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="challenges" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Desafios Diários</span>
            <span className="sm:hidden">Diários</span>
          </TabsTrigger>
          <TabsTrigger value="missions" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Missões Semanais</span>
            <span className="sm:hidden">Semanais</span>
          </TabsTrigger>
          <TabsTrigger value="powerups" className="gap-2">
            <Rocket className="h-4 w-4" />
            <span className="hidden sm:inline">Power-Ups</span>
            <span className="sm:hidden">Power</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="mt-4">
          <DailyChallenges
            onClaimReward={(_id, xp) => onXpEarned(xp, "daily_challenge", "Desafio Diário!", "bonus")}
          />
        </TabsContent>

        <TabsContent value="missions" className="mt-4">
          <WeeklyMissions
            onClaimReward={(_id, xp) => onXpEarned(xp, "weekly_mission", "Missão Semanal!", "large")}
          />
        </TabsContent>

        <TabsContent value="powerups" className="mt-4">
          <PowerUps
            onActivatePowerUp={(_id: string, type: PowerUpType) => {
              toast.success("Power-Up Ativado!", {
                description: `${type} ativado com sucesso`,
                icon: <Sparkles className="h-5 w-5 text-warning" />,
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
