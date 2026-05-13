import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, Mail, Phone, GraduationCap, Target, 
  ChevronRight, Trash2, MessageSquare, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Candidato, MatchScore, getStatusConfig, getScoreColor } from '@/types/candidate';
import { HighlightMatch } from '@/components/ui/highlight-match';
import { CandidatosEmptyState } from '@/components/empty-states';
import { SkeletonCard } from '@/components/ui/premium-skeleton';
import { FuseMatch } from '@/hooks/useFuzzySearch';

interface CandidatosListProps {
  candidatos: Candidato[];
  isLoading: boolean;
  searchTerm: string;
  getBestMatchScore: (id: string) => MatchScore | null;
  getMatchesForCandidate: (id: string) => readonly FuseMatch[] | undefined;
  onSelect: (candidato: Candidato) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.2 } }
};

export function CandidatosList({
  candidatos,
  isLoading,
  searchTerm,
  getBestMatchScore,
  getMatchesForCandidate,
  onSelect,
  onDelete
}: CandidatosListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (candidatos.length === 0) {
    return (
      <Card variant="glass" className="border-dashed border-2 py-12">
        <CandidatosEmptyState />
      </Card>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {candidatos.map((c) => {
          const status = getStatusConfig(c.status);
          const bestScore = getBestMatchScore(c.id);
          const matches = getMatchesForCandidate(c.id);
          
          return (
            <motion.div
              key={c.id}
              variants={itemVariants}
              layout
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                className="h-full"
              >
                <Card 
                  variant="glass" 
                  className="h-full border-border/40 hover:border-primary/40 transition-all duration-300 relative group overflow-hidden"
                >
                  <CardContent className="p-6">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <Badge className={cn("rounded-full px-3", status.color)}>
                        {status.label}
                      </Badge>
                      
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                          onClick={(e) => onDelete(c.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Candidate Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-lg shadow-inner">
                          {c.nome.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                            <HighlightMatch 
                              text={c.nome} 
                              indices={matches?.find(m => m.key === 'nome')?.indices as [number, number][] | undefined} 
                            />
                          </h3>
                          <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <Briefcase className="h-3 w-3" />
                            <span className="truncate">
                              {c.experiencias?.[0]?.cargo || 'Candidato'} @ {c.experiencias?.[0]?.empresa || 'Indisponível'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 py-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 text-primary/60" />
                          <span className="truncate">
                            <HighlightMatch 
                              text={c.email} 
                              indices={matches?.find(m => m.key === 'email')?.indices as [number, number][] | undefined} 
                            />
                          </span>
                        </div>
                        {c.telefone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 text-primary/60" />
                            <span>{c.telefone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <GraduationCap className="h-4 w-4 text-primary/60" />
                          <span className="truncate">{c.formacao?.[0]?.curso || 'Nível superior'}</span>
                        </div>
                      </div>

                      {/* Match Score & Tags */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        {bestScore ? (
                          <Badge variant="outline" className={cn("gap-1.5 py-1 px-3 border-2 font-bold", getScoreColor(bestScore.score_total))}>
                            <Target className="h-3.5 w-3.5" />
                            {bestScore.score_total}% Match
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1.5 py-1 px-3 text-muted-foreground">
                            <Sparkles className="h-3.5 w-3.5" />
                            Novo Talento
                          </Badge>
                        )}
                        
                        {c.habilidades && c.habilidades.slice(0, 2).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="bg-muted/50 text-[10px] h-6">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="pt-4 flex gap-2">
                        <Button 
                          className="w-full h-10 rounded-xl group/btn" 
                          variant="outline"
                          onClick={() => onSelect(c)}
                        >
                          Ver Perfil Completo
                          <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-xl hover:bg-primary/10">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}