/**
 * @fileoverview Quiz de Valores para Candidatos
 * @description O candidato responde para encontrar empresas alinhadas com seus valores
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Heart, 
  User,
  CheckCircle2,
  Lightbulb,
  Users,
  Award,
  Eye,
  Leaf,
  Zap,
  Compass,
  GraduationCap,
  Shield,
  Flame,
  Mountain,
  Scale,
  Trophy,
  Rocket,
  Palette,
  Target,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  VALORES_CULTURAIS, 
  type ValorCulturalId, 
  type RespostaValorCandidato,
  type PerfilCulturalCandidato 
} from '@/types/match';

const iconMap: Record<string, React.ReactNode> = {
  Lightbulb: <Lightbulb className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  Award: <Award className="h-6 w-6" />,
  Eye: <Eye className="h-6 w-6" />,
  Rainbow: <Sparkles className="h-6 w-6" />,
  Leaf: <Leaf className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  Compass: <Compass className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
  Flame: <Flame className="h-6 w-6" />,
  Mountain: <Mountain className="h-6 w-6" />,
  Scale: <Scale className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Trophy: <Trophy className="h-6 w-6" />,
  Rocket: <Rocket className="h-6 w-6" />,
  Building: <User className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />,
  Target: <Target className="h-6 w-6" />
};

interface CandidateValuesQuizProps {
  candidatoId: string;
  candidatoNome: string;
  onComplete: (perfil: PerfilCulturalCandidato) => void;
  onCancel?: () => void;
}

const intensidadeLabels = [
  { valor: 1, label: 'Não me representa', emoji: '😕', color: 'from-gray-400 to-gray-500' },
  { valor: 2, label: 'Pouco importante', emoji: '🤷', color: 'from-yellow-400 to-orange-400' },
  { valor: 3, label: 'Importante', emoji: '👍', color: 'from-blue-400 to-cyan-400' },
  { valor: 4, label: 'Muito importante', emoji: '💪', color: 'from-green-400 to-emerald-400' },
  { valor: 5, label: 'Essencial para mim', emoji: '❤️‍🔥', color: 'from-pink-500 to-rose-500' }
];

export function CandidateValuesQuiz({ candidatoId, candidatoNome, onComplete, onCancel }: CandidateValuesQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostas, setRespostas] = useState<Map<ValorCulturalId, RespostaValorCandidato>>(new Map());
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  
  const valorAtual = VALORES_CULTURAIS[currentIndex]!;
  const totalQuestoes = VALORES_CULTURAIS.length;
  const progresso = (currentIndex / totalQuestoes) * 100;
  
  const handleResposta = useCallback((intensidade: number) => {
    if (!valorAtual) return;
    setRespostas(prev => {
      const nova = new Map(prev);
      nova.set(valorAtual.id, {
        valorId: valorAtual.id,
        intensidade
      });
      return nova;
    });
    
    setTimeout(() => {
      if (currentIndex < totalQuestoes - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setShowResults(true);
      }
    }, 300);
  }, [valorAtual, currentIndex, totalQuestoes]);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  const handleComplete = () => {
    const valoresArray = Array.from(respostas.values());
    const sorted = [...valoresArray].sort((a, b) => b.intensidade - a.intensidade);
    const top5 = sorted.slice(0, 5).map(v => v.valorId);
    
    const perfil: PerfilCulturalCandidato = {
      id: crypto.randomUUID(),
      candidatoId,
      candidatoNome,
      valores: valoresArray,
      valoresPrioritarios: top5,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    
    onComplete(perfil);
  };
  
  const respostaAtual = valorAtual ? respostas.get(valorAtual.id) : undefined;
  
  // Tela de introdução
  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6"
      >
        <Card className="border-2 border-pink-500/20 bg-gradient-to-br from-background to-pink-50/10 dark:to-pink-950/10">
          <CardHeader className="text-center space-y-4 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center"
            >
              <Heart className="h-12 w-12 text-white" />
            </motion.div>
            
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Encontre seu Match! 💜
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Olá, {candidatoNome}! Vamos descobrir seus valores
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                O segredo de um trabalho feliz
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Quando você trabalha em uma empresa que compartilha seus valores, 
                tudo flui naturalmente. Menos estresse, mais realização, e 
                a sensação de estar no lugar certo.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-pink-500/5">
                <span className="text-2xl">💭</span>
                <p className="text-sm font-medium mt-1">20 reflexões</p>
                <p className="text-xs text-muted-foreground">sobre você</p>
              </div>
              <div className="p-4 rounded-lg bg-pink-500/5">
                <span className="text-2xl">⏱️</span>
                <p className="text-sm font-medium mt-1">~5 minutos</p>
                <p className="text-xs text-muted-foreground">do seu tempo</p>
              </div>
              <div className="p-4 rounded-lg bg-pink-500/5">
                <span className="text-2xl">💜</span>
                <p className="text-sm font-medium mt-1">Matches</p>
                <p className="text-xs text-muted-foreground">personalizados</p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Voltar
                </Button>
              )}
              <Button 
                onClick={() => setShowIntro(false)} 
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Descobrir Meus Valores
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Tela de resultados
  if (showResults) {
    const sortedValues = Array.from(respostas.values())
      .sort((a, b) => b.intensidade - a.intensidade);
    const top5 = sortedValues.slice(0, 5);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto p-6"
      >
        <Card className="border-2 border-pink-500/20">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="mx-auto mb-4"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1"
                >
                  <Star className="h-4 w-4 text-yellow-900" />
                </motion.div>
              </div>
            </motion.div>
            <CardTitle className="text-2xl">Seus Valores Descobertos! ✨</CardTitle>
            <CardDescription>
              Isso é o que mais importa para você no trabalho
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              {top5.map((resposta, index) => {
                const valor = VALORES_CULTURAIS.find(v => v.id === resposta.valorId)!;
                return (
                  <motion.div
                    key={resposta.valorId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl",
                      "bg-gradient-to-r",
                      valor.cor,
                      "text-white shadow-lg"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-lg font-bold">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{valor.nome}</p>
                      <p className="text-sm opacity-90 line-clamp-1">{valor.descricao}</p>
                    </div>
                    <div className="flex">
                      {Array.from({ length: resposta.intensidade }).map((_, i) => (
                        <Heart key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                🎯 Agora vamos encontrar empresas que compartilham esses valores com você!
              </p>
            </div>
            
            <Button 
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              size="lg"
            >
              <Heart className="h-5 w-5 mr-2" />
              Ver Meus Matches
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Quiz principal
  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Reflexão {currentIndex + 1} de {totalQuestoes}</span>
          <span>{Math.round(progresso)}% completo</span>
        </div>
        <Progress value={progresso} className="h-2" />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-pink-500/20">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className={cn(
                  "mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 rotate-3",
                  "bg-gradient-to-br",
                  valorAtual.cor,
                  "text-white shadow-lg"
                )}
              >
                {iconMap[valorAtual.icone] || <Sparkles className="h-6 w-6" />}
              </motion.div>
              
              <Badge variant="outline" className="mx-auto mb-2 border-pink-500/30">
                {valorAtual.nome}
              </Badge>
              
              <CardTitle className="text-xl leading-relaxed">
                {valorAtual.perguntaCandidato}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                {intensidadeLabels.map((item) => (
                  <motion.button
                    key={item.valor}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResposta(item.valor)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all",
                      "flex items-center gap-4",
                      respostaAtual?.intensidade === item.valor
                        ? `border-pink-500 bg-gradient-to-r ${item.color} text-white`
                        : "border-muted hover:border-pink-300"
                    )}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="font-medium flex-1 text-left">{item.label}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Heart
                          key={i}
                          className={cn(
                            "h-4 w-4 transition-all",
                            i < item.valor 
                              ? respostaAtual?.intensidade === item.valor
                                ? "fill-white text-white"
                                : "fill-pink-500 text-pink-500"
                              : respostaAtual?.intensidade === item.valor
                                ? "text-white/30"
                                : "text-muted"
                          )}
                        />
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="flex-1"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                <Button
                  onClick={() => {
                    if (currentIndex < totalQuestoes - 1) {
                      setCurrentIndex(prev => prev + 1);
                    } else {
                      setShowResults(true);
                    }
                  }}
                  disabled={!respostaAtual}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500"
                >
                  {currentIndex === totalQuestoes - 1 ? 'Ver Resultado' : 'Próximo'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
