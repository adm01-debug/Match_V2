/**
 * @fileoverview Leaderboard components for gamification
 * @module Leaderboard
 */

import { memo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeaderboardPodium } from "./leaderboard/LeaderboardPodium";
import { LeaderboardRow } from "./leaderboard/LeaderboardRow";
import type { LeaderboardUser } from "./leaderboard/types";

export type { LeaderboardUser } from "./leaderboard/types";
export { MiniLeaderboard } from "./leaderboard/MiniLeaderboard";
export { LeaderboardEntry } from "./leaderboard/LeaderboardEntry";

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserId?: string;
  title?: string;
  showRankChange?: boolean;
  showStreak?: boolean;
  maxDisplay?: number;
  animated?: boolean;
  className?: string;
}

export const Leaderboard = memo(function Leaderboard({
  users,
  currentUserId,
  title = "Ranking",
  showRankChange = true,
  showStreak = true,
  maxDisplay = 10,
  animated = true,
  className,
}: LeaderboardProps) {
  const [expanded, setExpanded] = useState(false);

  const sortedUsers = [...users].sort((a, b) => b.score - a.score);
  const displayUsers = expanded ? sortedUsers : sortedUsers.slice(0, maxDisplay);

  const currentUserRank = currentUserId
    ? sortedUsers.findIndex((u) => u.id === currentUserId) + 1
    : null;

  return (
    <div className={cn("rounded-xl border bg-card shadow-elevated overflow-hidden", className)}>
      <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <Badge variant="secondary">
            <Users className="w-3 h-3 mr-1" />
            {users.length} participantes
          </Badge>
        </div>
      </div>

      <LeaderboardPodium topUsers={sortedUsers} animated={animated} />

      <div className="divide-y">
        <AnimatePresence>
          {displayUsers.slice(3).map((user, index) => (
            <LeaderboardRow
              key={user.id}
              user={user}
              rank={index + 4}
              index={index}
              isCurrentUser={user.id === currentUserId}
              showRankChange={showRankChange}
              showStreak={showStreak}
              animated={animated}
            />
          ))}
        </AnimatePresence>
      </div>

      {users.length > maxDisplay && (
        <div className="p-3 border-t">
          <Button variant="ghost" className="w-full" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Mostrar menos" : `Ver todos (${users.length})`}
          </Button>
        </div>
      )}

      {currentUserRank && currentUserRank > maxDisplay && !expanded && (
        <div className="p-3 border-t bg-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sua posição</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">#{currentUserRank}</span>
              <span className="text-sm text-muted-foreground">de {users.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Leaderboard.displayName = "Leaderboard";
