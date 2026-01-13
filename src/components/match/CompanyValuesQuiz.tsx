/**
 * @fileoverview Quiz de Valores Culturais para Empresas
 * @description A empresa responde para definir sua cultura e encontrar candidatos alinhados
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Heart, 
  Building2,
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
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  VALORES_CULTURAIS, 
  type ValorCulturalId, 
  type RespostaValorEmpresa,
  type PerfilCulturalEmpresa 
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
  Building: <Building2 className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />,
  Target: <Target className="h-6 w-6" />
};

interface CompanyValuesQuizProps {
  empresaNome: string;
  onComplete: (perfil: PerfilCulturalEmpresa) => void;
  onCancel?: () => void;
}

const intensidadeLabels = [
  { valor: 1, label: 'Nada importante', emoji: '😐' },
  { valor: 2, label: 'Pouco importante', emoji: '🤔' },
  { valor: 3, label: 'Moderadamente', emoji: '👍' },
  { valor: 4, label: 'Muito importante', emoji: '💪' },
  { valor: 5, label: 'Extremamente', emoji: '🔥' }
];

export function CompanyValuesQuiz({ empresaNome, onComplete, onCancel }: CompanyValuesQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostas, setRespostas] = useState<Map<ValorCulturalId, RespostaValorEmpresa>>(new Map());
  const [showIntro, setShowIntro] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [descricaoCultura, setDescricaoCultura] = useState('');
  
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
    
    // Auto-avançar após responder
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
    
    const perfil: PerfilCulturalEmpresa = {
      id: crypto.randomUUID(),
      empresaNome,
      descricaoCultura,
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
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="text-center space-y-4 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center"
            >
              <Building2 className="h-10 w-10 text-primary-foreground" />
            </motion.div>
            
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Deu Match! 💜
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Defina a cultura da {empresaNome}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Por que isso é importante?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Assim como no amor, no trabalho o alinhamento de valores é fundamental. 
                Quando empresa e colaborador compartilham as mesmas crenças, o resultado 
                é engajamento, produtividade e felicidade.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-primary/5">
                <span className="text-2xl">🎯</span>
                <p className="text-sm font-medium mt-1">20 valores</p>
                <p className="text-xs text-muted-foreground">para avaliar</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <span className="text-2xl">⏱️</span>
                <p className="text-sm font-medium mt-1">~5 minutos</p>
                <p className="text-xs text-muted-foreground">tempo estimado</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <span className="text-2xl">💜</span>
                <p className="text-sm font-medium mt-1">Match preciso</p>
                <p className="text-xs text-muted-foreground">com candidatos</p>
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
                className="flex-1 bg-gradient-to-r from-primary to-primary/80"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Começar Quiz
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
        <Card className="border-2 border-green-500/20">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </motion.div>
            <CardTitle className="text-2xl">Perfil Cultural Definido!</CardTitle>
            <CardDescription>
              Seus 5 valores mais importantes para encontrar o match perfeito
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
                      "text-white"
                    )}
                  >
                    <span className="text-2xl font-bold">#{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{valor.nome}</p>
                      <p className="text-sm opacity-90">{valor.descricao}</p>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {resposta.intensidade}/5
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Descreva a cultura da empresa em suas palavras (opcional):
              </label>
              <Textarea
                value={descricaoCultura}
                onChange={(e) => setDescricaoCultura(e.target.value)}
                placeholder="Ex: Somos uma startup inovadora que valoriza..."
                rows={3}
              />
            </div>
            
            <Button 
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              size="lg"
            >
              <Heart className="h-5 w-5 mr-2" />
              Salvar e Encontrar Matches
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
          <span>Questão {currentIndex + 1} de {totalQuestoes}</span>
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
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn(
                  "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4",
                  "bg-gradient-to-br",
                  valorAtual.cor,
                  "text-white"
                )}
              >
                {iconMap[valorAtual.icone] || <Sparkles className="h-6 w-6" />}
              </motion.div>
              
              <Badge variant="outline" className="mx-auto mb-2">
                {valorAtual.nome}
              </Badge>
              
              <CardTitle className="text-xl leading-relaxed">
                {valorAtual.perguntaEmpresa}
              </CardTitle>
              
              <CardDescription className="mt-2">
                {valorAtual.descricao}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                {intensidadeLabels.map((item) => (
                  <motion.button
                    key={item.valor}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResposta(item.valor)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all",
                      "flex items-center justify-between",
                      "hover:border-primary hover:bg-primary/5",
                      respostaAtual?.intensidade === item.valor
                        ? "border-primary bg-primary/10"
                        : "border-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            i < item.valor ? "bg-primary" : "bg-muted"
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
                  Anterior
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
                  className="flex-1"
                >
                  {currentIndex === totalQuestoes - 1 ? 'Ver Resultados' : 'Próximo'}
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
