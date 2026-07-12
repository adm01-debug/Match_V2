/**
 * @fileoverview Daily Challenges (shell orchestrator)
 */

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DailyChallengeCard } from "./dailyChallenges/DailyChallengeCard";
import { DailyChallengesHeader } from "./dailyChallenges/DailyChallengesHeader";
import { useDailyChallenges } from "./dailyChallenges/useDailyChallenges";
import { useDailyChallenges } from "./dailyChallenges/useDailyChallenges";

export type { DailyChallenge, ChallengeType, ChallengeDifficulty } from "./dailyChallenges/types";

interface DailyChallengesProps {
  className?: string;
  onClaimReward?: (challengeId: string, xpAmount: number) => void;
}

export const DailyChallenges = memo(function DailyChallenges({ className, onClaimReward }: DailyChallengesProps) {
  const { challenges, stats, timeUntilReset, handleClaim } = useDailyChallenges({ onClaimReward });

  return (
    <Card className={cn("overflow-hidden", className)}>
      <DailyChallengesHeader
        completed={stats.completed}
        total={stats.total}
        timeUntilReset={timeUntilReset}
        availableXP={stats.totalXP - stats.earnedXP}
      />

      <CardContent className="p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {challenges.map((challenge) => (
            <DailyChallengeCard key={challenge.id} challenge={challenge} onClaim={handleClaim} />
          ))}
        </AnimatePresence>

        {stats.completed === stats.total && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-gradient-to-r from-success/10 to-success/5 border border-success/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-success" />
                <div>
                  <p className="font-semibold text-success">Todos Completados!</p>
                  <p className="text-sm text-muted-foreground">Bônus especial desbloqueado</p>
                </div>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-success to-success/70">
                <Gift className="w-4 h-4 mr-1" />
                +100 XP Bônus
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
});

DailyChallenges.displayName = "DailyChallenges";
