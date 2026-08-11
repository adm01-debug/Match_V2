import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LeaderboardUser } from "./types";

interface MiniLeaderboardProps {
  users: LeaderboardUser[];
  currentUserId?: string;
  maxDisplay?: number;
  className?: string;
}

export const MiniLeaderboard = memo(function MiniLeaderboard({
  users,
  currentUserId,
  maxDisplay = 5,
  className,
}: MiniLeaderboardProps) {
  const sortedUsers = [...users].sort((a, b) => b.score - a.score).slice(0, maxDisplay);

  return (
    <div className={cn("space-y-2", className)}>
      {sortedUsers.map((user, index) => {
        const isCurrentUser = user.id === currentUserId;

        return (
          <motion.div
            key={user.id}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg",
              isCurrentUser ? "bg-primary/10" : "hover:bg-muted/50"
            )}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <span
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                index === 0 && "bg-warning text-warning-foreground",
                index === 1 && "bg-muted-foreground/40 text-background",
                index === 2 && "bg-accent text-accent-foreground",
                index > 2 && "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </span>
            <Avatar className="w-6 h-6">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-[10px]">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "flex-1 text-sm truncate",
                isCurrentUser && "font-medium text-primary"
              )}
            >
              {user.name.split(" ")[0]}
            </span>
            <span className="text-xs font-medium">{user.score.toLocaleString()}</span>
          </motion.div>
        );
      })}
    </div>
  );
});

MiniLeaderboard.displayName = "MiniLeaderboard";
