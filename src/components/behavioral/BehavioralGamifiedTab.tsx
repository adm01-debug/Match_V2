import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Play, Trophy, Star, Flame, Gamepad2, Award, Crown, ArrowRight } from 'lucide-react';
import { Leaderboard, AchievementGrid, type LeaderboardUser, type Achievement } from '@/components/gamification';

interface BehavioralGamifiedTabProps {
  onStartQuiz: () => void;
  onStartSwipe: () => void;
  onStartMinigame: () => void;
  onStartPhases: () => void;
  leaderboardUsers: LeaderboardUser[];
  demoAchievements: Achievement[];
  totalBehavioralXP: number;
  behavioralLevel: { level: number; icon: string; title: string } | null;
  nextBehavioralLevel: { icon: string; title: string; minAssessments: number } | null;
  levelProgress: number;
  completedCount: number;
  totalTools: number;
  unlockedCount: number;
  totalAchievements: number;
  achievementsWithStatus: Array<{ id: string; title: string; tier: string; isUnlocked: boolean }>;
}

export function BehavioralGamifiedTab({
  onStartQuiz, onStartSwipe, onStartMinigame, onStartPhases,
  leaderboardUsers, demoAchievements,
  totalBehavioralXP, behavioralLevel, nextBehavioralLevel, levelProgress,
  completedCount, totalTools, unlockedCount, totalAchievements, achievementsWithStatus,
}: BehavioralGamifiedTabProps) {
  const gameModes = [
    { key: 'quiz', title: 'Quiz Interativo', desc: 'Responda perguntas de forma dinâmica com XP, combos e conquistas', icon: Brain, gradient: 'from-primary to-primary/70', borderColor: 'border-primary/20 hover:border-primary/50', badges: [{ icon: Star, text: 'XP & Níveis' }, { icon: Trophy, text: 'Conquistas' }, { icon: Flame, text: 'Combos' }], btnText: 'Começar Quiz', onClick: onStartQuiz },
    { key: 'swipe', title: 'Swipe de Valores', desc: 'Deslize para a direita nos valores que combinam com você', icon: Heart, gradient: 'from-accent to-accent/70', borderColor: 'border-accent/20 hover:border-accent/50', badges: [{ text: '❤️ Like' }, { text: '❌ Pass' }, { text: '⭐ Super Like' }], btnText: 'Iniciar Swipe', btnClass: 'bg-gradient-to-r from-accent to-destructive hover:from-accent hover:to-destructive', onClick: onStartSwipe },
    { key: 'minigame', title: 'Mini-Games', desc: 'Jogos rápidos que revelam traços de personalidade', icon: Gamepad2, gradient: 'from-warning to-warning/70', borderColor: 'border-warning/20 hover:border-warning/50', badges: [{ text: '⚡ Rápido' }, { text: '🎯 Preciso' }, { text: '🧠 Intuitivo' }], btnText: 'Jogar Agora', btnClass: 'bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70 text-warning-foreground', onClick: onStartMinigame },
    { key: 'phases', title: 'Desafio por Fases', desc: 'Complete desafios progressivos para provar suas habilidades', icon: Award, gradient: 'from-secondary to-secondary/70', borderColor: 'border-secondary/20 hover:border-secondary/50', badges: [{ text: '🎯 5 Fases' }, { text: '⭐ +620 XP' }], btnText: 'Iniciar Jornada', btnClass: 'bg-gradient-to-r from-accent to-accent hover:from-accent hover:to-accent', onClick: onStartPhases },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {gameModes.slice(0, 3).map((mode, i) => (
          <motion.div key={mode.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (i + 1) }}>
            <Card className={`h-full hover:shadow-xl transition-all cursor-pointer group border-2 ${mode.borderColor}`}>
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto p-4 rounded-2xl bg-gradient-to-br ${mode.gradient} text-primary-foreground mb-2 group-hover:scale-110 transition-transform`}>
                  <mode.icon className="h-10 w-10" />
                </div>
                <CardTitle className="text-xl">{mode.title}</CardTitle>
                <CardDescription>{mode.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {mode.badges.map((b, j) => (
                    <Badge key={j} variant="secondary" className="gap-1">
                      {'icon' in b && b.icon && <b.icon className="h-3 w-3" />}
                      {b.text}
                    </Badge>
                  ))}
                </div>
                <Button className={`w-full gap-2 ${mode.btnClass || ''}`} size="lg" onClick={mode.onClick}>
                  <Play className="h-5 w-5" />{mode.btnText}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Phase challenge card */}
      {(() => {
        const phaseMode = gameModes[3]!;
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className={`hover:shadow-xl transition-all cursor-pointer group border-2 ${phaseMode.borderColor}`}>
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto p-4 rounded-2xl bg-gradient-to-br ${phaseMode.gradient} text-secondary-foreground mb-2 group-hover:scale-110 transition-transform`}>
                  <Award className="h-10 w-10" />
                </div>
                <CardTitle className="text-xl">{phaseMode.title}</CardTitle>
                <CardDescription>{phaseMode.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md mx-auto">
                <div className="flex flex-wrap gap-2 justify-center">
                  {phaseMode.badges.map((b, j) => (
                    <Badge key={j} variant="secondary">{b.text}</Badge>
                  ))}
                </div>
                <Button className={`w-full gap-2 ${phaseMode.btnClass || ''}`} size="lg" onClick={onStartPhases}>
                  <Award className="h-5 w-5" />{phaseMode.btnText}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })()}

      {/* Leaderboard & Achievements */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Leaderboard users={leaderboardUsers} currentUserId="current" title="Ranking da Semana" maxDisplay={5} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-warning" />Conquistas</CardTitle>
          </CardHeader>
          <CardContent>
            <AchievementGrid achievements={demoAchievements} size="md" columns={5} />
          </CardContent>
        </Card>
      </div>

      {/* XP Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
        <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/10 overflow-hidden">
          <CardContent className="py-6 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
                      <Crown className="h-8 w-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full px-2 py-0.5 text-xs font-bold border shadow-sm">
                      Lv.{behavioralLevel?.level || 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <span className="text-2xl">{behavioralLevel?.icon}</span> {behavioralLevel?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{completedCount}/{totalTools} ferramentas completas</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{totalBehavioralXP} XP</div>
                  <p className="text-sm text-muted-foreground">Total acumulado</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso para próximo nível</span>
                  {nextBehavioralLevel ? (
                    <span className="font-medium">{nextBehavioralLevel.icon} {nextBehavioralLevel.title} <span className="text-muted-foreground ml-1">({nextBehavioralLevel.minAssessments - completedCount} restantes)</span></span>
                  ) : (
                    <span className="font-medium text-warning">Nível Máximo! 🎉</span>
                  )}
                </div>
                <div className="relative">
                  <Progress value={levelProgress} className="h-4" />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">{Math.round(levelProgress)}%</div>
                </div>
              </div>
              {unlockedCount > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <Trophy className="h-4 w-4 text-warning" />Conquistas Desbloqueadas ({unlockedCount}/{totalAchievements})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {achievementsWithStatus.filter(a => a.isUnlocked).map((achievement) => (
                      <motion.div key={achievement.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                        <Badge className={`gap-1.5 py-1.5 px-3 ${achievement.tier === 'diamond' ? 'bg-gradient-to-r from-info to-info text-white border-0' : achievement.tier === 'gold' ? 'bg-gradient-to-r from-warning to-warning text-white border-0' : achievement.tier === 'silver' ? 'bg-gradient-to-r from-muted to-muted-foreground text-white border-0' : 'bg-gradient-to-r from-warning to-warning text-white border-0'}`}>
                          {achievement.tier === 'diamond' ? <Crown className="h-3.5 w-3.5" /> : achievement.tier === 'gold' ? <Star className="h-3.5 w-3.5" /> : <Award className="h-3.5 w-3.5" />}
                          {achievement.title}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              {unlockedCount < totalAchievements && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted"><Trophy className="h-5 w-5 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{totalAchievements - unlockedCount} conquistas bloqueadas</p>
                    <p className="text-xs text-muted-foreground">Complete mais assessments para desbloquear!</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
