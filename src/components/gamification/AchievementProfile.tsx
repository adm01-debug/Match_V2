/**
 * @fileoverview Public Achievement Profile
 * Shareable profile page showing user achievements
 */

import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Share2, Star, Flame, Award, 
  Crown, Sparkles, Copy, Check, ExternalLink, Medal, Target
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGamification } from "@/hooks/useGamification";

// Simple local Achievement type for this component
interface ProfileAchievement {
  id: string;
  name: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  unlocked: boolean;
}

interface AchievementProfileProps {
  userId?: string;
  userName?: string;
  userAvatar?: string;
  achievements?: ProfileAchievement[];
  className?: string;
}

// Stats card component
const StatCard = memo(({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    className={cn(
      "flex items-center gap-3 p-4 rounded-xl border",
      `bg-${color}-500/10 border-${color}-500/20`
    )}
  >
    <div className={cn(
      "p-2 rounded-lg",
      `bg-${color}-500/20`
    )}>
      <Icon className={cn("h-5 w-5", `text-${color}-500`)} />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  </motion.div>
));

StatCard.displayName = 'StatCard';

// Achievement showcase component
const AchievementShowcase = memo(({ 
  achievement, 
  index 
}: { 
  achievement: ProfileAchievement;
  index: number;
}) => {
  const tierColors = {
    bronze: "from-amber-600 to-orange-700",
    silver: "from-gray-300 to-gray-500",
    gold: "from-yellow-400 to-amber-500",
    platinum: "from-cyan-300 to-blue-400",
    diamond: "from-purple-400 to-pink-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      className="relative group"
    >
      <div className={cn(
        "p-4 rounded-2xl border-2 transition-all duration-300",
        achievement.unlocked 
          ? `bg-gradient-to-br ${tierColors[achievement.tier]} text-white border-transparent shadow-lg`
          : "bg-muted/50 border-border/50 opacity-50 grayscale"
      )}>
        <motion.div
          className="text-4xl mb-2"
          animate={achievement.unlocked ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {achievement.icon}
        </motion.div>
        <p className="font-semibold text-sm">{achievement.name}</p>
        {achievement.unlocked && (
          <Badge className="mt-2 bg-white/20 text-white border-0 text-xs">
            {achievement.tier}
          </Badge>
        )}
      </div>
      
      {/* Glow effect for unlocked */}
      {achievement.unlocked && (
        <motion.div
          className={cn(
            "absolute inset-0 -z-10 rounded-2xl blur-xl opacity-40",
            `bg-gradient-to-br ${tierColors[achievement.tier]}`
          )}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
});

AchievementShowcase.displayName = 'AchievementShowcase';

export const AchievementProfile = memo(({
  userId,
  userName = "Usuário",
  userAvatar,
  achievements: propAchievements,
  className
}: AchievementProfileProps) => {
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  
  const { xp, level, streak } = useGamification();
  
  // Demo achievements
  const demoAchievements: ProfileAchievement[] = [
    { id: '1', name: 'Primeiro Login', icon: '🎯', tier: 'bronze', unlocked: true },
    { id: '2', name: 'Recrutador', icon: '👥', tier: 'silver', unlocked: true },
    { id: '3', name: 'Streak 7 dias', icon: '🔥', tier: 'gold', unlocked: true },
    { id: '4', name: 'Master', icon: '🏆', tier: 'platinum', unlocked: false },
    { id: '5', name: 'Lenda', icon: '👑', tier: 'diamond', unlocked: false },
  ];
  
  const achievements = propAchievements || demoAchievements;

  // Calculate stats
  const stats = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlocked).length;
    const total = achievements.length;
    const byTier = {
      diamond: achievements.filter(a => a.tier === 'diamond' && a.unlocked).length,
      platinum: achievements.filter(a => a.tier === 'platinum' && a.unlocked).length,
      gold: achievements.filter(a => a.tier === 'gold' && a.unlocked).length,
      silver: achievements.filter(a => a.tier === 'silver' && a.unlocked).length,
      bronze: achievements.filter(a => a.tier === 'bronze' && a.unlocked).length,
    };
    const rarest = achievements
      .filter(a => a.unlocked)
      .sort((a, b) => {
        const tierOrder = { diamond: 5, platinum: 4, gold: 3, silver: 2, bronze: 1 };
        return tierOrder[b.tier] - tierOrder[a.tier];
      })[0];

    return { unlocked, total, byTier, rarest };
  }, [achievements]);

  // Share profile URL
  const profileUrl = useMemo(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/profile/${userId || 'demo'}`;
  }, [userId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${userName}`,
          text: `Confira minhas conquistas no sistema de gamificação!`,
          url: profileUrl
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card className={cn("bg-card/50 backdrop-blur-xl border-border/30 overflow-hidden", className)}>
      {/* Profile Header with gradient background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20" />
        <motion.div
          className="absolute inset-0"
          animate={{ 
            background: [
              "radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.3) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <CardHeader className="relative pb-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar with level ring */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <Avatar className="h-24 w-24 border-4 border-primary shadow-xl">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <motion.div
                className="absolute -bottom-2 -right-2 p-2 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="h-4 w-4 text-white" />
              </motion.div>
            </motion.div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <h2 className="text-2xl font-bold">{userName}</h2>
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                  Nível {level}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                {stats.unlocked} conquistas desbloqueadas
              </p>
              
              {/* Quick stats row */}
              <div className="flex justify-center sm:justify-start gap-4 mt-3">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{xp.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="font-semibold">{streak} dias</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold">#{Math.floor(Math.random() * 50) + 1}</span>
                </div>
              </div>
            </div>

            {/* Share button */}
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Compartilhar Perfil</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <input
                      type="text"
                      value={profileUrl}
                      readOnly
                      className="flex-1 bg-transparent text-sm outline-none"
                    />
                    <Button size="sm" onClick={handleCopyLink}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleShare}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </div>

      <CardContent className="pt-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Trophy} label="Conquistas" value={`${stats.unlocked}/${stats.total}`} color="yellow" />
          <StatCard icon={Target} label="Nível" value={level} color="primary" />
          <StatCard icon={Flame} label="Streak" value={`${streak} dias`} color="orange" />
          <StatCard icon={Medal} label="Tier Mais Alto" value={stats.rarest?.tier || 'N/A'} color="purple" />
        </div>

        {/* Achievement Progress by Tier */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Progresso por Tier
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(stats.byTier).map(([tier, count]) => (
              <div key={tier} className="text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  tier === 'diamond' && "text-purple-400",
                  tier === 'platinum' && "text-cyan-400",
                  tier === 'gold' && "text-yellow-500",
                  tier === 'silver' && "text-gray-400",
                  tier === 'bronze' && "text-amber-600"
                )}>
                  {count}
                </div>
                <p className="text-xs text-muted-foreground capitalize">{tier}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Showcase */}
        <Tabs defaultValue="unlocked" className="w-full">
          <TabsList className="w-full bg-muted/50">
            <TabsTrigger value="unlocked" className="flex-1 gap-2">
              <Sparkles className="h-4 w-4" />
              Desbloqueadas ({stats.unlocked})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1 gap-2">
              <Trophy className="h-4 w-4" />
              Todas ({stats.total})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unlocked" className="mt-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              <AnimatePresence>
                {achievements
                  .filter(a => a.unlocked)
                  .map((achievement, index) => (
                    <AchievementShowcase
                      key={achievement.id}
                      achievement={achievement}
                      index={index}
                    />
                  ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              <AnimatePresence>
                {achievements.map((achievement, index) => (
                  <AchievementShowcase
                    key={achievement.id}
                    achievement={achievement}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

AchievementProfile.displayName = 'AchievementProfile';
