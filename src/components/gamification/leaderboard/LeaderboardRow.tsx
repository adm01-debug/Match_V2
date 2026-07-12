import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Minus, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LeaderboardUser } from "./types";

interface LeaderboardRowProps {
  user: LeaderboardUser;
  rank: number;
  index: number;
  isCurrentUser: boolean;
  showRankChange: boolean;
  showStreak: boolean;
  animated: boolean;
}

export const LeaderboardRow = memo(function LeaderboardRow({
  user,
  rank,
  index,
  isCurrentUser,
  showRankChange,
  showStreak,
  animated,
}: LeaderboardRowProps) {
  const rankChange = user.previousRank ? user.previousRank - rank : 0;

  return (
    <motion.div
      className={cn(
        "flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors",
        isCurrentUser && "bg-primary/5 border-l-2 border-l-primary"
      )}
      initial={animated ? { x: -20, opacity: 0 } : undefined}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="w-8 text-center">
        <span className="font-bold text-muted-foreground">{rank}</span>
      </div>

      {showRankChange && (
        <div className="w-6">
          {rankChange > 0 && (
            <div className="flex items-center text-success">
              <ChevronUp className="w-4 h-4" />
              <span className="text-xs">{rankChange}</span>
            </div>
          )}
          {rankChange < 0 && (
            <div className="flex items-center text-destructive">
              <ChevronDown className="w-4 h-4" />
              <span className="text-xs">{Math.abs(rankChange)}</span>
            </div>
          )}
          {rankChange === 0 && <Minus className="w-4 h-4 text-muted-foreground" />}
        </div>
      )}

      <Avatar className="w-8 h-8">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className={cn("font-medium truncate", isCurrentUser && "text-primary")}>
          {user.name}
          {isCurrentUser && " (você)"}
        </p>
        {user.department && (
          <p className="text-xs text-muted-foreground truncate">{user.department}</p>
        )}
      </div>

      {showStreak && user.streak && user.streak > 0 && (
        <div className="flex items-center gap-1 text-warning">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-medium">{user.streak}</span>
        </div>
      )}

      <div className="text-right">
        <p className="font-bold">{user.score.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">pontos</p>
      </div>
    </motion.div>
  );
});
