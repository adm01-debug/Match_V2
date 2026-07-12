import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { positionStyles } from "./positionStyles";
import type { LeaderboardUser } from "./types";

interface LeaderboardPodiumProps {
  topUsers: LeaderboardUser[];
  animated?: boolean;
}

export const LeaderboardPodium = memo(function LeaderboardPodium({
  topUsers,
  animated = true,
}: LeaderboardPodiumProps) {
  return (
    <div className="p-4 border-b bg-muted/30">
      <div className="flex justify-center items-end gap-2">
        {[2, 1, 3].map((position, index) => {
          const user = topUsers[position - 1];
          if (!user) return null;

          const style = positionStyles[position as 1 | 2 | 3];
          const height = position === 1 ? "h-24" : position === 2 ? "h-20" : "h-16";
          const Icon = style.icon;

          return (
            <motion.div
              key={user.id}
              className="flex flex-col items-center"
              initial={animated ? { y: 50, opacity: 0 } : undefined}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative mb-2">
                <Avatar className={cn("w-12 h-12 border-2", position === 1 && "w-14 h-14")}>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <motion.div
                  className={cn(
                    "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center",
                    style.bg
                  )}
                  animate={{ rotate: position === 1 ? [0, 10, -10, 0] : 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon className={cn("w-3.5 h-3.5", style.text)} />
                </motion.div>
              </div>

              <motion.div
                className={cn(
                  "w-20 rounded-t-lg flex flex-col items-center justify-end p-2",
                  style.bg,
                  style.glow,
                  height
                )}
                initial={animated ? { scaleY: 0 } : undefined}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                style={{ transformOrigin: "bottom" }}
              >
                <span className={cn("text-2xl font-bold", style.text)}>{position}º</span>
                <span className={cn("text-xs font-medium truncate w-full text-center", style.text)}>
                  {user.name.split(" ")[0]}
                </span>
                <span className={cn("text-[10px] opacity-80", style.text)}>
                  {user.score.toLocaleString()} pts
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
