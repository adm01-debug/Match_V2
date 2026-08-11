import { motion } from 'framer-motion';
import { Crown, Star, Flame, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CardHeader } from '@/components/ui/card';
import { ShareProfileDialog } from './ShareProfileDialog';

interface Props {
  userName: string;
  userAvatar?: string;
  level: number;
  xp: number;
  streak: number;
  unlocked: number;
  profileUrl: string;
  rank: number;
}

export const ProfileHeader = ({ userName, userAvatar, level, xp, streak, unlocked, profileUrl, rank }: Props) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-accent/20" />
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, hsl(var(--primary) / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <CardHeader className="relative pb-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <Avatar className="h-24 w-24 border-4 border-primary shadow-xl">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {userName.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <motion.div
              className="absolute -bottom-2 -right-2 p-2 rounded-full bg-gradient-to-br from-warning to-warning shadow-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="h-4 w-4 text-primary-foreground" />
            </motion.div>
          </motion.div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h2 className="text-2xl font-bold">{userName}</h2>
              <Badge className="bg-gradient-to-r from-warning to-warning text-primary-foreground border-0">
                Nível {level}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{unlocked} conquistas desbloqueadas</p>

            <div className="flex justify-center sm:justify-start gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 text-warning" />
                <span className="font-semibold">{xp.toLocaleString()} XP</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Flame className="h-4 w-4 text-warning" />
                <span className="font-semibold">{streak} dias</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Trophy className="h-4 w-4 text-warning" />
                <span className="font-semibold">#{rank}</span>
              </div>
            </div>
          </div>

          <ShareProfileDialog profileUrl={profileUrl} userName={userName} />
        </div>
      </CardHeader>
    </div>
  );
};
