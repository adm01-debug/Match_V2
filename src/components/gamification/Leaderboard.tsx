/**
 * @fileoverview Leaderboard components for gamification
 * @module Leaderboard
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Minus,
  ChevronUp,
  ChevronDown,
  Star,
  Flame,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  previousRank?: number;
  streak?: number;
  achievements?: number;
  department?: string;
}

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

const positionStyles = {
  1: { 
    bg: "bg-gradient-to-r from-yellow-400 to-amber-500",
    text: "text-yellow-50",
    icon: Crown,
    iconColor: "text-yellow-300",
    glow: "shadow-[0_0_30px_-5px_rgba(251,191,36,0.5)]",
  },
  2: {
    bg: "bg-gradient-to-r from-slate-300 to-slate-400",
    text: "text-slate-700",
    icon: Medal,
    iconColor: "text-slate-500",
    glow: "shadow-[0_0_20px_-5px_rgba(148,163,184,0.5)]",
  },
  3: {
    bg: "bg-gradient-to-r from-amber-600 to-amber-700",
    text: "text-amber-50",
    icon: Medal,
    iconColor: "text-amber-400",
    glow: "shadow-[0_0_20px_-5px_rgba(180,83,9,0.5)]",
  },
};

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
    ? sortedUsers.findIndex(u => u.id === currentUserId) + 1 
    : null;

  return (
    <div className={cn("rounded-xl border bg-card shadow-elevated overflow-hidden", className)}>
      {/* Header */}
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

      {/* Top 3 Podium */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex justify-center items-end gap-2">
          {[2, 1, 3].map((position, index) => {
            const user = sortedUsers[position - 1];
            if (!user) return null;
            
            const style = positionStyles[position as 1 | 2 | 3];
            const height = position === 1 ? "h-24" : position === 2 ? "h-20" : "h-16";
            
            return (
              <motion.div
                key={user.id}
                className="flex flex-col items-center"
                initial={animated ? { y: 50, opacity: 0 } : undefined}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative mb-2">
                  <Avatar className={cn("w-12 h-12 border-2", position === 1 ? "w-14 h-14" : "")}>
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
                    <style.icon className={cn("w-3.5 h-3.5", style.text)} />
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
                  <span className={cn("text-2xl font-bold", style.text)}>
                    {position}º
                  </span>
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

      {/* Rest of rankings */}
      <div className="divide-y">
        <AnimatePresence>
          {displayUsers.slice(3).map((user, index) => {
            const rank = index + 4;
            const isCurrentUser = user.id === currentUserId;
            const rankChange = user.previousRank ? user.previousRank - rank : 0;

            return (
              <motion.div
                key={user.id}
                className={cn(
                  "flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors",
                  isCurrentUser && "bg-primary/5 border-l-2 border-l-primary"
                )}
                initial={animated ? { x: -20, opacity: 0 } : undefined}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Rank */}
                <div className="w-8 text-center">
                  <span className="font-bold text-muted-foreground">{rank}</span>
                </div>

                {/* Rank change */}
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
                    {rankChange === 0 && (
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                )}

                {/* Avatar */}
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium truncate",
                    isCurrentUser && "text-primary"
                  )}>
                    {user.name}
                    {isCurrentUser && " (você)"}
                  </p>
                  {user.department && (
                    <p className="text-xs text-muted-foreground truncate">
                      {user.department}
                    </p>
                  )}
                </div>

                {/* Streak */}
                {showStreak && user.streak && user.streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.streak}</span>
                  </div>
                )}

                {/* Score */}
                <div className="text-right">
                  <p className="font-bold">{user.score.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">pontos</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show more button */}
      {users.length > maxDisplay && (
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Mostrar menos" : `Ver todos (${users.length})`}
          </Button>
        </div>
      )}

      {/* Current user position if not in top */}
      {currentUserRank && currentUserRank > maxDisplay && !expanded && (
        <div className="p-3 border-t bg-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sua posição</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">#{currentUserRank}</span>
              <span className="text-sm text-muted-foreground">
                de {users.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// Mini Leaderboard for sidebar/compact displays
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
            <span className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
              index === 0 && "bg-yellow-400 text-yellow-900",
              index === 1 && "bg-slate-300 text-slate-700",
              index === 2 && "bg-amber-600 text-amber-50",
              index > 2 && "bg-muted text-muted-foreground"
            )}>
              {index + 1}
            </span>
            <Avatar className="w-6 h-6">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-[10px]">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className={cn(
              "flex-1 text-sm truncate",
              isCurrentUser && "font-medium text-primary"
            )}>
              {user.name.split(" ")[0]}
            </span>
            <span className="text-xs font-medium">
              {user.score.toLocaleString()}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
});

// Single Leaderboard Entry for custom layouts
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

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg",
      isCurrentUser && "bg-primary/5 border border-primary/20",
      className
    )}>
      {style ? (
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          style.bg
        )}>
          <style.icon className={cn("w-4 h-4", style.text)} />
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
            <span className="flex items-center gap-0.5 text-orange-500">
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

Leaderboard.displayName = "Leaderboard";
MiniLeaderboard.displayName = "MiniLeaderboard";
LeaderboardEntry.displayName = "LeaderboardEntry";
