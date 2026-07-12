/**
 * @fileoverview Realtime Leaderboard with Supabase integration
 * Shows live ranking updates with animations
 */

import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Medal, TrendingUp, TrendingDown, Minus, Users, Sparkles, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  achievements: number;
  rank: number;
  previousRank?: number;
  department?: string;
  isCurrentUser?: boolean;
}

interface RealtimeLeaderboardProps {
  currentUserId?: string;
  className?: string;
  showDepartmentFilter?: boolean;
}

// Demo data for when there's no real data
const generateDemoLeaderboard = (currentUserId?: string): LeaderboardEntry[] => {
  const names = [
    'Ana Silva', 'Carlos Santos', 'Maria Oliveira', 'João Pedro', 'Fernanda Costa',
    'Ricardo Lima', 'Juliana Alves', 'Bruno Martins', 'Patrícia Souza', 'André Ferreira',
    'Camila Rocha', 'Lucas Ribeiro', 'Amanda Nascimento', 'Gabriel Santos', 'Isabela Cruz'
  ];

  const departments = ['RH', 'Tech', 'Vendas', 'Marketing', 'Operações'];

  return names.map((name, index) => ({
    id: `user-${index + 1}`,
    userId: index === 4 ? (currentUserId || `user-${index + 1}`) : `user-${index + 1}`,
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
    xp: Math.floor(10000 - (index * 500) + Math.random() * 200),
    level: Math.floor(15 - (index * 0.8)),
    streak: Math.floor(Math.random() * 30) + 1,
    achievements: Math.floor(Math.random() * 20) + 5,
    rank: index + 1,
    previousRank: index + 1 + Math.floor(Math.random() * 3) - 1,
    department: departments[index % departments.length],
    isCurrentUser: index === 4
  }));
};

const RankBadge = memo(({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <motion.div
        className="relative"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Crown className="h-6 w-6 text-warning" />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles className="h-6 w-6 text-warning" />
        </motion.div>
      </motion.div>
    );
  }
  if (rank === 2) {
    return <Medal className="h-5 w-5 text-muted-foreground" />;
  }
  if (rank === 3) {
    return <Medal className="h-5 w-5 text-warning/70" />;
  }
  return (
    <span className="text-sm font-bold text-muted-foreground w-6 text-center">
      #{rank}
    </span>
  );
});

RankBadge.displayName = 'RankBadge';

const RankChange = memo(({ current, previous }: { current: number; previous?: number }) => {
  if (!previous || current === previous) {
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
  
  const diff = previous - current;
  
  if (diff > 0) {
    return (
      <motion.div 
        className="flex items-center gap-1 text-green-500"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <TrendingUp className="h-4 w-4" />
        <span className="text-xs font-bold">+{diff}</span>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="flex items-center gap-1 text-red-500"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <TrendingDown className="h-4 w-4" />
      <span className="text-xs font-bold">{diff}</span>
    </motion.div>
  );
});

RankChange.displayName = 'RankChange';

const LeaderboardRow = memo(({ 
  entry, 
  index,
  showDepartment = false 
}: { 
  entry: LeaderboardEntry; 
  index: number;
  showDepartment?: boolean;
}) => {
  const isTop3 = entry.rank <= 3;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
        entry.isCurrentUser 
          ? "bg-primary/10 border-2 border-primary/30 shadow-lg" 
          : "bg-card/50 hover:bg-card/80 border border-border/30",
        isTop3 && "relative overflow-hidden"
      )}
    >
      {/* Rank glow for top 3 */}
      {isTop3 && (
        <motion.div
          className={cn(
            "absolute inset-0 opacity-10",
            entry.rank === 1 && "bg-gradient-to-r from-yellow-500 to-amber-500",
            entry.rank === 2 && "bg-gradient-to-r from-gray-300 to-gray-400",
            entry.rank === 3 && "bg-gradient-to-r from-amber-600 to-orange-600"
          )}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <RankBadge rank={entry.rank} />

      <Avatar className={cn(
        "h-10 w-10 border-2",
        entry.rank === 1 && "border-yellow-500",
        entry.rank === 2 && "border-gray-400",
        entry.rank === 3 && "border-amber-600",
        entry.rank > 3 && "border-border"
      )}>
        <AvatarImage src={entry.avatar} alt={entry.name} />
        <AvatarFallback>{entry.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn(
            "font-semibold truncate",
            entry.isCurrentUser && "text-primary"
          )}>
            {entry.name}
          </p>
          {entry.isCurrentUser && (
            <Badge variant="secondary" className="text-xs">Você</Badge>
          )}
          {entry.streak >= 7 && (
            <Badge variant="outline" className="gap-1 border-orange-500/50 text-orange-600">
              <Flame className="h-3 w-3" />
              {entry.streak}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Nível {entry.level}</span>
          {showDepartment && entry.department && (
            <>
              <span>•</span>
              <span>{entry.department}</span>
            </>
          )}
        </div>
      </div>

      <RankChange current={entry.rank} previous={entry.previousRank} />

      <div className="text-right">
        <p className="font-bold text-lg">{entry.xp.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">XP</p>
      </div>
    </motion.div>
  );
});

LeaderboardRow.displayName = 'LeaderboardRow';

export const RealtimeLeaderboard = memo(({
  currentUserId,
  className,
  showDepartmentFilter = true
}: RealtimeLeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('weekly');
  const [isLoading, setIsLoading] = useState(true);

  // Generate demo data on mount
  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use demo data for now
      const demoData = generateDemoLeaderboard(currentUserId);
      setLeaderboard(demoData);
      setIsLoading(false);
    };

    loadLeaderboard();
  }, [currentUserId, timeframe]);

  // Filter by department
  const filteredLeaderboard = useMemo(() => {
    if (selectedDepartment === 'all') return leaderboard;
    return leaderboard.filter(entry => entry.department === selectedDepartment);
  }, [leaderboard, selectedDepartment]);

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(leaderboard.map(e => e.department).filter(Boolean));
    return ['all', ...Array.from(depts)] as string[];
  }, [leaderboard]);

  // Find current user's position
  const currentUserEntry = useMemo(() => 
    leaderboard.find(e => e.isCurrentUser),
    [leaderboard]
  );

  return (
    <Card className={cn("bg-card/50 backdrop-blur-xl border-border/30", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg shadow-yellow-500/20">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Ranking Global</CardTitle>
              <p className="text-sm text-muted-foreground">
                {leaderboard.length} participantes
              </p>
            </div>
          </div>

          <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as typeof timeframe)}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="daily" className="text-xs">Hoje</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs">Semana</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">Mês</TabsTrigger>
              <TabsTrigger value="all" className="text-xs">Geral</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {showDepartmentFilter && departments.length > 2 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDepartment(dept)}
                className="text-xs"
              >
                {dept === 'all' ? (
                  <>
                    <Users className="h-3 w-3 mr-1" />
                    Todos
                  </>
                ) : dept}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="h-20 rounded-xl bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredLeaderboard.map((entry, index) => (
              <LeaderboardRow
                key={entry.id}
                entry={entry}
                index={index}
                showDepartment={selectedDepartment === 'all'}
              />
            ))}
          </AnimatePresence>
        )}

        {/* Current user position if not in view */}
        {currentUserEntry && currentUserEntry.rank > 10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 border-t border-border/30"
          >
            <p className="text-sm text-muted-foreground mb-2">Sua posição:</p>
            <LeaderboardRow 
              entry={currentUserEntry} 
              index={0}
              showDepartment={selectedDepartment === 'all'}
            />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
});

RealtimeLeaderboard.displayName = 'RealtimeLeaderboard';
