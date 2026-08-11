import { memo } from "react";
import { Star, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { positionStyles } from "./positionStyles";
import type { LeaderboardUser } from "./types";

interface LeaderboardEntryProps {
  user: LeaderboardUser;
  rank: number;
  isCurrentUser?: boolean;
  showStreak?: boolean;
  className?: string;
}

export const LeaderboardEntry = memo(function LeaderboardEntry({
  user,
  rank,
  isCurrentUser = false,
  showStreak = true,
  className,
}: LeaderboardEntryProps) {
  const style = rank <= 3 ? positionStyles[rank as 1 | 2 | 3] : null;
  const Icon = style?.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg",
        isCurrentUser && "bg-primary/5 border border-primary/20",
        className
      )}
    >
      {style && Icon ? (
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            style.bg
          )}
        >
          <Icon className={cn("w-4 h-4", style.text)} />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-sm font-bold text-muted-foreground">{rank}</span>
        </div>
      )}

      <Avatar className="w-10 h-10">
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {user.achievements && (
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3" />
              {user.achievements}
            </span>
          )}
          {showStreak && user.streak && (
            <span className="flex items-center gap-0.5 text-warning">
              <Flame className="w-3 h-3" />
              {user.streak}
            </span>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg">{user.score.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">pontos</p>
      </div>
    </div>
  );
});

LeaderboardEntry.displayName = "LeaderboardEntry";
