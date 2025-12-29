import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, Sparkles, Rocket, Target, Users, Calendar, Search, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  icon?: React.ElementType;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  spotlightPadding?: number;
}

const DEFAULT_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Match ATS! 🎉',
    description: 'Vamos fazer um tour rápido pelas principais funcionalidades do seu novo sistema de recrutamento.',
    icon: Rocket,
    position: 'center',
  },
  {
    id: 'dashboard',
    title: 'Dashboard Inteligente',
    description: 'Aqui você tem uma visão geral completa: KPIs em tempo real, funil de conversão, alertas inteligentes e insights sobre seu processo seletivo.',
    target: '[data-tour="dashboard"]',
    icon: Target,
    position: 'right',
    spotlightPadding: 8,
  },
  {
    id: 'candidatos',
    title: 'Gestão de Candidatos',
    description: 'Gerencie todos os candidatos em um só lugar. Visualize perfis, acompanhe o progresso no pipeline e analise match scores com IA.',
    target: '[data-tour="candidatos"]',
    icon: Users,
    position: 'right',
    spotlightPadding: 8,
  },
  {
    id: 'vagas',
    title: 'Gestão de Vagas',
    description: 'Crie e gerencie vagas com facilidade. Defina requisitos, publique em múltiplos canais e acompanhe métricas de cada posição.',
    target: '[data-tour="vagas"]',
    icon: Target,
    position: 'right',
    spotlightPadding: 8,
  },
  {
    id: 'agenda',
    title: 'Agenda de Entrevistas',
    description: 'Agende entrevistas, envie convites automáticos e nunca perca um compromisso importante com a visualização de calendário.',
    target: '[data-tour="agenda"]',
    icon: Calendar,
    position: 'right',
    spotlightPadding: 8,
  },
  {
    id: 'search',
    title: 'Busca Rápida (⌘K)',
    description: 'Use Ctrl+K (ou ⌘K no Mac) para buscar candidatos, vagas ou navegar rapidamente pelo sistema. Experimente!',
    target: '[data-tour="search"]',
    icon: Search,
    position: 'bottom',
    spotlightPadding: 12,
  },
  {
    id: 'done',
    title: 'Tudo Pronto! ✨',
    description: 'Você está pronto para começar a recrutar com eficiência. Explore as funcionalidades e transforme seu processo seletivo!',
    icon: CheckCircle2,
    position: 'center',
  },
];

interface OnboardingTourProps {
  steps?: TourStep[];
  onComplete?: () => void;
  forceShow?: boolean;
}

interface SpotlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function OnboardingTour({ steps = DEFAULT_STEPS, onComplete, forceShow }: OnboardingTourProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightPosition | null>(null);
  const [cardPosition, setCardPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('match-ats-tour-completed');
    if (!hasSeenTour || forceShow) {
      // Small delay to allow page to render
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const updateSpotlight = useCallback(() => {
    const step = steps[currentStep];
    
    if (!step.target || step.position === 'center') {
      setSpotlight(null);
      setCardPosition(null);
      return;
    }

    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      const padding = step.spotlightPadding || 8;
      
      setSpotlight({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      // Calculate card position based on step position preference
      const cardWidth = 400;
      const cardHeight = 250;
      let cardTop = 0;
      let cardLeft = 0;

      switch (step.position) {
        case 'right':
          cardTop = rect.top;
          cardLeft = rect.right + 20;
          if (cardLeft + cardWidth > window.innerWidth) {
            cardLeft = rect.left - cardWidth - 20;
          }
          break;
        case 'bottom':
          cardTop = rect.bottom + 20;
          cardLeft = rect.left + rect.width / 2 - cardWidth / 2;
          break;
        case 'top':
          cardTop = rect.top - cardHeight - 20;
          cardLeft = rect.left + rect.width / 2 - cardWidth / 2;
          break;
        case 'left':
          cardTop = rect.top;
          cardLeft = rect.left - cardWidth - 20;
          break;
        default:
          cardTop = rect.bottom + 20;
          cardLeft = rect.left;
      }

      // Ensure card stays within viewport
      cardTop = Math.max(20, Math.min(cardTop, window.innerHeight - cardHeight - 20));
      cardLeft = Math.max(20, Math.min(cardLeft, window.innerWidth - cardWidth - 20));

      setCardPosition({ top: cardTop, left: cardLeft });
    } else {
      setSpotlight(null);
      setCardPosition(null);
    }
  }, [currentStep, steps]);

  useEffect(() => {
    if (isVisible) {
      updateSpotlight();
      window.addEventListener('resize', updateSpotlight);
      window.addEventListener('scroll', updateSpotlight);
      return () => {
        window.removeEventListener('resize', updateSpotlight);
        window.removeEventListener('scroll', updateSpotlight);
      };
    }
  }, [isVisible, updateSpotlight]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('match-ats-tour-completed', 'true');
    setIsVisible(false);
  };

  const handleComplete = () => {
    localStorage.setItem('match-ats-tour-completed', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const Icon = step.icon || Sparkles;
  const isCenter = step.position === 'center' || !step.target;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Tour de onboarding">
      {/* Backdrop with spotlight cutout */}
      <div className="absolute inset-0">
        {spotlight ? (
          <svg className="w-full h-full">
            <defs>
              <mask id="spotlight-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect
                  x={spotlight.left}
                  y={spotlight.top}
                  width={spotlight.width}
                  height={spotlight.height}
                  rx="8"
                  fill="black"
                  className="transition-all duration-300 ease-out"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.75)"
              mask="url(#spotlight-mask)"
            />
          </svg>
        ) : (
          <div className="w-full h-full bg-background/80 backdrop-blur-sm" />
        )}
      </div>

      {/* Spotlight ring effect */}
      {spotlight && (
        <div
          className="absolute rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-transparent transition-all duration-300 ease-out pointer-events-none"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
          }}
        >
          <div className="absolute inset-0 rounded-lg animate-pulse bg-primary/10" />
        </div>
      )}

      {/* Tour Card */}
      <Card
        className={cn(
          "w-full max-w-md shadow-2xl border-primary/20 animate-in fade-in zoom-in-95 duration-300",
          isCenter
            ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-4"
            : "fixed"
        )}
        style={!isCenter && cardPosition ? { top: cardPosition.top, left: cardPosition.left } : undefined}
      >
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={handleSkip}
            aria-label="Pular tour"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Passo {currentStep + 1} de {steps.length}
              </span>
              <h2 className="text-lg font-semibold text-foreground leading-tight">
                {step.title}
              </h2>
            </div>
          </div>
          
          <Progress value={progress} className="h-1" />
        </CardHeader>

        <CardContent className="pt-2">
          <p className="text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* Step indicators */}
          <div className="flex justify-center gap-1.5 mt-4">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentStep
                    ? "w-6 bg-primary"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Ir para passo ${index + 1}`}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Pular tour
            </Button>
            <Button size="sm" onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>
                  Começar
                  <Rocket className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default OnboardingTour;
