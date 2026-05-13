import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, BarChart3, Gamepad2, Award, Star, Trophy, Crown
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { BEHAVIORAL_TOOLS } from '@/types/behavioral';
import type { BehavioralResult } from '@/types/behavioral';
import { BehavioralAssessmentPlayer } from '@/components/assessments/BehavioralAssessmentPlayer';
import { BehavioralResultView } from '@/components/assessments/BehavioralResultView';
import { useSaveBehavioralResult } from '@/hooks/useBehavioralAssessments';
import { useBehavioralGamification } from '@/hooks/useBehavioralGamification';
import { useGamification } from '@/hooks/useGamification';
import { toast } from 'sonner';
import { 
  GamifiedAssessmentEngine,
  SwipeValuesCard,
  PersonalityMiniGame,
  PhaseChallenge,
} from '@/components/assessments/gamified';
import { 
  type LeaderboardUser,
  type Achievement,
} from '@/components/gamification';
import { 
  GAMIFIED_QUESTIONS, 
  VALUE_CARDS, 
  PERSONALITY_MINI_GAMES 
} from '@/data/gamifiedAssessmentData';
import { CHALLENGE_PHASES } from '@/data/phaseChallengeData';

// New Components
import { BehavioralProgressHeader } from '@/components/behavioral/BehavioralProgressHeader';
import { BehavioralToolsGrid } from '@/components/behavioral/BehavioralToolsGrid';
import { BehavioralLeaderboardTab } from '@/components/behavioral/BehavioralLeaderboardTab';
import { BehavioralGamifiedTab } from '@/components/behavioral/BehavioralGamifiedTab';

const LOCAL_TOOL_ICONS: Record<string, React.ReactNode> = {
  disc: <Brain className="h-6 w-6" />,
  vakd: <Brain className="h-6 w-6" />,
  metaprograms: <Brain className="h-6 w-6" />,
  mental_triggers: <Brain className="h-6 w-6" />,
  sleight_of_mouth: <Brain className="h-6 w-6" />,
  emotional_states: <Brain className="h-6 w-6" />,
  values: <Brain className="h-6 w-6" />,
  emotional_intelligence: <Brain className="h-6 w-6" />,
  cognitive_biases: <Brain className="h-6 w-6" />,
  rapport: <Brain className="h-6 w-6" />,
  generational: <Brain className="h-6 w-6" />,
  stress_profile: <Brain className="h-6 w-6" />,
  triune_brain: <Brain className="h-6 w-6" />,
  disc_compatibility: <Brain className="h-6 w-6" />,
};

export default function BehavioralAssessmentsPage() {
  usePageTitle('Ferramentas Comportamentais');
  const [searchParams] = useSearchParams();
  const saveResult = useSaveBehavioralResult();
  
  const {
    completedToolIds,
    completedCount,
    totalTools,
    totalBehavioralXP,
    dailyCombo,
    behavioralLevel,
    nextBehavioralLevel,
    levelProgress,
    achievementsWithStatus,
    unlockedCount,
    totalAchievements,
    completeAssessment: gamificationComplete,
  } = useBehavioralGamification();

  const { xp: globalXP, streak, addXP, unlockAchievement } = useGamification();
  
  const [activeTab, setActiveTab] = useState('gamified');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedResults, setCompletedResults] = useState<BehavioralResult[]>([]);
  const [viewingResult, setViewingResult] = useState<BehavioralResult | null>(null);
  const [gamifiedMode, setGamifiedMode] = useState<'quiz' | 'swipe' | 'minigame' | 'phases' | null>(null);

  useEffect(() => {
    const toolParam = searchParams.get('tool');
    if (toolParam && BEHAVIORAL_TOOLS.some(t => t.id === toolParam)) {
      setSelectedTool(toolParam);
      setIsPlaying(true);
    }
  }, [searchParams]);

  const handleCompleteAssessment = async (result: BehavioralResult) => {
    const tool = BEHAVIORAL_TOOLS.find(t => t.id === result.toolId);
    await gamificationComplete(result.toolId, result.timeSpent, result.scores);
    try {
      await saveResult.mutateAsync({
        toolId: result.toolId,
        toolName: tool?.name || result.toolId,
        answers: result.rawAnswers,
        results: result,
        timeSpent: result.timeSpent,
      });
      toast.success('Resultado salvo!');
    } catch {
      toast.error('Erro ao salvar.');
    }
    setCompletedResults(prev => [...prev, result]);
    setIsPlaying(false);
    setSelectedTool(null);
    setViewingResult(result);
    setActiveTab('results');
  };

  const leaderboardUsers: LeaderboardUser[] = [
    { id: '1', name: 'Ana Silva', score: 2450, streak: 7, achievements: 12 },
    { id: 'current', name: 'Você', score: globalXP, streak, achievements: unlockedCount },
  ];

  const demoAchievements: Achievement[] = achievementsWithStatus.slice(0, 5).map(a => ({
    id: a.id, title: a.title, description: a.description, tier: a.tier, category: 'milestone', progress: a.isUnlocked ? 100 : 0, maxProgress: 100
  }));

  if (gamifiedMode === 'quiz') return <Layout title="Quiz"><GamifiedAssessmentEngine questions={GAMIFIED_QUESTIONS} onComplete={(ans, stats) => { addXP(stats.totalXP, 'quiz'); setGamifiedMode(null); }} onExit={() => setGamifiedMode(null)} /></Layout>;
  if (gamifiedMode === 'swipe') return <Layout title="Swipe"><SwipeValuesCard cards={VALUE_CARDS} onComplete={(l) => { addXP(l.length * 10, 'swipe'); setGamifiedMode(null); }} /></Layout>;
  if (gamifiedMode === 'minigame') return <Layout title="Mini-Game"><PersonalityMiniGame games={PERSONALITY_MINI_GAMES} onComplete={(_, xp) => { addXP(xp, 'minigame'); setGamifiedMode(null); }} onExit={() => setGamifiedMode(null)} /></Layout>;
  if (gamifiedMode === 'phases') return <Layout title="Phases"><PhaseChallenge phases={CHALLENGE_PHASES} onComplete={(res) => { addXP(res.reduce((s, r) => s + r.xpEarned, 0), 'phases'); setGamifiedMode(null); }} onExit={() => setGamifiedMode(null)} /></Layout>;
  
  if (isPlaying && selectedTool) return <Layout title="Assessment"><BehavioralAssessmentPlayer toolId={selectedTool} onComplete={handleCompleteAssessment} onCancel={() => setIsPlaying(false)} /></Layout>;
  if (viewingResult) return <Layout title="Resultado"><div className="p-6"><Button variant="outline" onClick={() => setViewingResult(null)}>Voltar</Button><BehavioralResultView result={viewingResult} showDetails /></div></Layout>;

  return (
    <Layout title="Ferramentas Comportamentais">
      <div className="space-y-6">
        <BehavioralProgressHeader 
          totalBehavioralXP={totalBehavioralXP}
          unlockedCount={unlockedCount}
          dailyCombo={dailyCombo}
          progressPercentage={(completedCount / totalTools) * 100}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="gamified" className="gap-2"><Gamepad2 className="h-4 w-4" /> Gamificação</TabsTrigger>
            <TabsTrigger value="tools" className="gap-2"><Brain className="h-4 w-4" /> Ferramentas</TabsTrigger>
            <TabsTrigger value="results" className="gap-2"><BarChart3 className="h-4 w-4" /> Resultados ({completedResults.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="gamified" className="mt-6">
            <BehavioralGamifiedTab
              onStartQuiz={() => setGamifiedMode('quiz')}
              onStartSwipe={() => setGamifiedMode('swipe')}
              onStartMinigame={() => setGamifiedMode('minigame')}
              onStartPhases={() => setGamifiedMode('phases')}
              leaderboardUsers={leaderboardUsers}
              demoAchievements={demoAchievements}
              totalBehavioralXP={totalBehavioralXP}
              behavioralLevel={behavioralLevel}
              nextBehavioralLevel={nextBehavioralLevel}
              levelProgress={levelProgress}
              completedCount={completedCount}
              totalTools={totalTools}
              unlockedCount={unlockedCount}
              totalAchievements={totalAchievements}
              achievementsWithStatus={achievementsWithStatus}
            />
          </TabsContent>

          <TabsContent value="tools" className="mt-6">
            <BehavioralToolsGrid 
              tools={BEHAVIORAL_TOOLS}
              completedToolIds={completedToolIds}
              onStart={(id) => { setSelectedTool(id); setIsPlaying(true); }}
              toolIcons={LOCAL_TOOL_ICONS}
            />
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <BehavioralLeaderboardTab leaderboardUsers={leaderboardUsers} demoAchievements={demoAchievements} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}