import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, Gift, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { difficultyConfig } from "./difficultyConfig";
import type { DailyChallenge } from "./types";

interface Props {
  challenge: DailyChallenge;
  onClaim: (id: string) => void;
}

export const DailyChallengeCard = memo(function DailyChallengeCard({ challenge, onClaim }: Props) {
  const config = difficultyConfig[challenge.difficulty];
  const Icon = challenge.icon;
  const progressPercent = Math.min(100, (challenge.progress / challenge.target) * 100);
  const canClaim = challenge.isCompleted && !challenge.isClaimed;

  const handleClaim = useCallback(() => {
    if (!canClaim) return;
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    onClaim(challenge.id);
  }, [canClaim, challenge.id, onClaim]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          config.borderColor,
          challenge.isClaimed && "opacity-60",
          canClaim && "ring-2 ring-primary/50"
        )}
      >
        {canClaim && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <CardContent className="relative p-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                config.bgColor,
                challenge.isCompleted && "bg-success/20"
              )}
            >
              {challenge.isCompleted ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </motion.div>
              ) : (
                <Icon className={cn("w-6 h-6", config.color)} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-foreground line-clamp-1">{challenge.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">{challenge.description}</p>
                </div>
                <Badge className={cn("flex-shrink-0 border-0", config.bgColor, config.color)}>{config.label}</Badge>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Progresso: {challenge.progress}/{challenge.target}
                  </span>
                  <span className={cn("font-medium", config.color)}>{Math.round(progressPercent)}%</span>
                </div>
                <Progress
                  value={progressPercent}
                  className="h-2"
                  aria-valuenow={Math.round(progressPercent)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                    <Zap className="w-3 h-3" />
                    +{challenge.xpReward} XP
                  </div>
                  {challenge.bonusXP && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/40 text-accent-foreground text-xs font-medium">
                      <Gift className="w-3 h-3" />
                      +{challenge.bonusXP} Bônus
                    </div>
                  )}
                </div>

                {canClaim && (
                  <Button size="sm" onClick={handleClaim} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                    <Gift className="w-4 h-4 mr-1" />
                    Resgatar
                  </Button>
                )}

                {challenge.isClaimed && (
                  <Badge variant="outline" className="text-success border-success/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Resgatado
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
