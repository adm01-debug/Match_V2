/**
 * @fileoverview Public Achievement Profile
 * Shareable profile page showing user achievements
 */

import { useMemo, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Sparkles, Medal, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useGamification } from '@/hooks/useGamification';
import { StatCard } from './achievementProfile/StatCard';
import { AchievementShowcase } from './achievementProfile/AchievementShowcase';
import { ProfileHeader } from './achievementProfile/ProfileHeader';
import { TierProgress } from './achievementProfile/TierProgress';
import { TIER_ORDER, type ProfileAchievement, type AchievementTier } from './achievementProfile/types';

interface AchievementProfileProps {
  userId?: string;
  userName?: string;
  userAvatar?: string;
  achievements?: ProfileAchievement[];
  className?: string;
}

const DEMO_ACHIEVEMENTS: ProfileAchievement[] = [
  { id: '1', name: 'Primeiro Login', icon: '🎯', tier: 'bronze', unlocked: true },
  { id: '2', name: 'Recrutador', icon: '👥', tier: 'silver', unlocked: true },
  { id: '3', name: 'Streak 7 dias', icon: '🔥', tier: 'gold', unlocked: true },
  { id: '4', name: 'Master', icon: '🏆', tier: 'platinum', unlocked: false },
  { id: '5', name: 'Lenda', icon: '👑', tier: 'diamond', unlocked: false },
];

export const AchievementProfile = memo(
  ({ userId, userName = 'Usuário', userAvatar, achievements: propAchievements, className }: AchievementProfileProps) => {
    const { xp, level, streak } = useGamification();
    const achievements = propAchievements || DEMO_ACHIEVEMENTS;

    const stats = useMemo(() => {
      const unlocked = achievements.filter((a) => a.unlocked).length;
      const total = achievements.length;
      const byTier: Record<AchievementTier, number> = {
        diamond: 0, platinum: 0, gold: 0, silver: 0, bronze: 0,
      };
      for (const a of achievements) if (a.unlocked) byTier[a.tier] += 1;
      const rarest = achievements
        .filter((a) => a.unlocked)
        .sort((a, b) => TIER_ORDER[b.tier] - TIER_ORDER[a.tier])[0];
      return { unlocked, total, byTier, rarest };
    }, [achievements]);

    const profileUrl = useMemo(
      () => `${window.location.origin}/profile/${userId || 'demo'}`,
      [userId]
    );

    const rank = useMemo(() => Math.floor(Math.random() * 50) + 1, []);

    return (
      <Card className={cn('bg-card/50 backdrop-blur-xl border-border/30 overflow-hidden', className)}>
        <ProfileHeader
          userName={userName}
          userAvatar={userAvatar}
          level={level}
          xp={xp}
          streak={streak}
          unlocked={stats.unlocked}
          profileUrl={profileUrl}
          rank={rank}
        />

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={Trophy} label="Conquistas" value={`${stats.unlocked}/${stats.total}`} color="yellow" />
            <StatCard icon={Target} label="Nível" value={level} color="primary" />
            <StatCard icon={Flame} label="Streak" value={`${streak} dias`} color="orange" />
            <StatCard icon={Medal} label="Tier Mais Alto" value={stats.rarest?.tier || 'N/A'} color="purple" />
          </div>

          <TierProgress byTier={stats.byTier} />

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
                  {achievements.filter((a) => a.unlocked).map((achievement, index) => (
                    <AchievementShowcase key={achievement.id} achievement={achievement} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                <AnimatePresence>
                  {achievements.map((achievement, index) => (
                    <AchievementShowcase key={achievement.id} achievement={achievement} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }
);

AchievementProfile.displayName = 'AchievementProfile';

export type { ProfileAchievement } from './achievementProfile/types';
