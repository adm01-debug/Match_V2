import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Gift, Lock } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tierConfig } from "./rarityStyles";
import { MissionProgress } from "./MissionProgress";
import { MissionRewardBadge } from "./MissionRewardBadge";
import type { WeeklyMission } from "./types";

interface MissionCardProps {
  mission: WeeklyMission;
  onClaim: (id: string) => void;
}

export const MissionCard = memo(function MissionCard({ mission, onClaim }: MissionCardProps) {
  const config = tierConfig[mission.tier];
  const Icon = mission.icon;
  const TierIcon = config.icon;
  const canClaim = mission.isCompleted && !mission.isClaimed && !mission.isLocked;
  const totalXP = Math.round(mission.xpReward * mission.multiplier);

  const handleClaim = useCallback(() => {
    if (canClaim) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onClaim(mission.id);
    }
  }, [canClaim, mission.id, onClaim]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: mission.isLocked ? 1 : 1.02 }}
      className={cn("relative", mission.isLocked && "opacity-60")}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          config.borderColor,
          mission.isClaimed && "opacity-60",
          canClaim && "ring-2 ring-primary/50 shadow-lg"
        )}
      >
        <div
          className={cn(
            "absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold",
            "flex items-center gap-1 bg-gradient-to-r text-primary-foreground shadow-md",
            config.gradient
          )}
        >
          <TierIcon className="w-3 h-3" />
          {config.label}
        </div>

        {mission.isLocked && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="text-center p-4">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{mission.unlockRequirement}</p>
            </div>
          </div>
        )}

        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <motion.div
              className={cn(
                "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
                config.gradient
              )}
              animate={canClaim ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 1.5, repeat: canClaim ? Infinity : 0 }}
            >
              {mission.isCompleted ? (
                <CheckCircle2 className="w-7 h-7 text-primary-foreground" />
              ) : (
                <Icon className="w-7 h-7 text-primary-foreground" />
              )}
            </motion.div>

            <div className="flex-1 min-w-0 pr-16">
              <h4 className="font-bold text-foreground text-lg mb-1">{mission.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>

              <MissionProgress progress={mission.progress} target={mission.target} config={config} />
              <MissionRewardBadge totalXP={totalXP} multiplier={mission.multiplier} config={config} />

              {canClaim && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                  <Button
                    onClick={handleClaim}
                    className={cn(
                      "w-full h-11 font-semibold bg-gradient-to-r hover:opacity-90 text-primary-foreground",
                      config.gradient
                    )}
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Resgatar +{totalXP} XP
                  </Button>
                </motion.div>
              )}

              {mission.isClaimed && (
                <div className="mt-4 flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Recompensa resgatada!</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
