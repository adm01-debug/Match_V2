import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface TourStep { id: string; title: string; description: string; target?: string; position?: 'top' | 'bottom' | 'left' | 'right'; }

const DEFAULT_STEPS: TourStep[] = [
  { id: 'welcome', title: 'Bem-vindo ao Match ATS! 🎉', description: 'Vamos fazer um tour rápido pelas principais funcionalidades.' },
  { id: 'dashboard', title: 'Dashboard', description: 'Aqui você tem uma visão geral de todos os processos seletivos, métricas e atividades recentes.', target: '[data-tour="dashboard"]' },
  { id: 'candidatos', title: 'Candidatos', description: 'Gerencie todos os candidatos, visualize perfis e acompanhe o progresso no pipeline.', target: '[data-tour="candidatos"]' },
  { id: 'vagas', title: 'Vagas', description: 'Crie e gerencie vagas, defina requisitos e publique em múltiplos canais.', target: '[data-tour="vagas"]' },
  { id: 'agenda', title: 'Agenda', description: 'Agende entrevistas, sincronize com seu calendário e envie convites automáticos.', target: '[data-tour="agenda"]' },
  { id: 'search', title: 'Busca Rápida', description: 'Use Ctrl+K para buscar candidatos, vagas ou navegar rapidamente pelo sistema.', target: '[data-tour="search"]' },
  { id: 'done', title: 'Tudo Pronto! ✅', description: 'Você está pronto para começar. Explore as funcionalidades e qualquer dúvida, acesse a ajuda.' },
];

interface OnboardingTourProps { steps?: TourStep[]; onComplete?: () => void; forceShow?: boolean; }

export function OnboardingTour({ steps = DEFAULT_STEPS, onComplete, forceShow }: OnboardingTourProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('match-ats-tour-completed');
    if (!hasSeenTour || forceShow) setIsVisible(true);
  }, [forceShow]);

  const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep(s => s + 1); else handleComplete(); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
  const handleSkip = () => { localStorage.setItem('match-ats-tour-completed', 'true'); setIsVisible(false); };
  const handleComplete = () => { localStorage.setItem('match-ats-tour-completed', 'true'); setIsVisible(false); onComplete?.(); };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-2xl animate-in fade-in zoom-in-95">
        <CardHeader className="relative">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleSkip}><X className="h-4 w-4" /></Button>
          <div className="flex items-center gap-2 mb-2"><Sparkles className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">Passo {currentStep + 1} de {steps.length}</span></div>
          <CardTitle className="text-xl">{step.title}</CardTitle>
          <Progress value={progress} className="h-1 mt-2" />
        </CardHeader>
        <CardContent><p className="text-muted-foreground">{step.description}</p></CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0}><ChevronLeft className="h-4 w-4 mr-1" />Anterior</Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip}>Pular</Button>
            <Button onClick={handleNext}>{currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}<ChevronRight className="h-4 w-4 ml-1" /></Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default OnboardingTour;
