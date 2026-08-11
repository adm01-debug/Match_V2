/**
 * Enhanced Candidate Card with rich interactions
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Mail, Phone, Briefcase, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { CandidatoCardData, MatchScore, statusConfig } from './candidatoCard/types';
import { MatchScoreBadge } from './candidatoCard/MatchScoreBadge';
import { CandidatoQuickActions } from './candidatoCard/CandidatoQuickActions';
import { CandidatoMoreActions } from './candidatoCard/CandidatoMoreActions';

interface CandidatoCardEnhancedProps {
  candidato: CandidatoCardData;
  matchScore?: MatchScore | null;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  index?: number;
  compact?: boolean;
}

export function CandidatoCardEnhanced({
  candidato,
  matchScore,
  isSelected = false,
  onSelect,
  onStatusChange,
  onDelete,
  index = 0,
  compact = false,
}: CandidatoCardEnhancedProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const status = statusConfig[candidato.status || 'novo'] ?? statusConfig['novo'];
  const experienceCount = candidato.experiencias?.length || 0;
  const latestExperience = candidato.experiencias?.[0];

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, [role="menuitem"]')) return;
    navigate(`/candidato/${candidato.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          'relative overflow-hidden cursor-pointer transition-all duration-300',
          'hover:shadow-lg hover:shadow-primary/5 border-border/50',
          isSelected && 'ring-2 ring-primary shadow-lg shadow-primary/10',
          isHovered && 'border-primary/30'
        )}
        onClick={handleCardClick}
      >
        {isSelected && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
          />
        )}

        {matchScore && matchScore.score_total >= 80 && (
          <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
            <div className="absolute top-2 -right-6 w-24 transform rotate-45 bg-success text-success-foreground text-xs text-center py-0.5">
              Top Match
            </div>
          </div>
        )}

        <CardContent className={cn('p-4', compact && 'p-3')}>
          <div className="flex gap-4">
            {onSelect && (
              <div className="flex items-start pt-1">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onSelect(candidato.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="relative">
              <Avatar className={cn('border-2 border-background shadow-md', compact ? 'h-12 w-12' : 'h-14 w-14')}>
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {candidato.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                'absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background',
                status?.color ?? 'bg-muted'
              )} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={cn('font-semibold truncate', compact ? 'text-sm' : 'text-base')}>
                      {candidato.nome}
                    </h3>
                    {matchScore && matchScore.score_total >= 90 && (
                      <Tooltip>
                        <TooltipTrigger><Sparkles className="h-4 w-4 text-accent" /></TooltipTrigger>
                        <TooltipContent>Match excepcional!</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {latestExperience && (
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {latestExperience.cargo} • {latestExperience.empresa}
                    </p>
                  )}
                </div>

                {matchScore && <MatchScoreBadge matchScore={matchScore} />}
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[150px]">{candidato.email}</span>
                  </TooltipTrigger>
                  <TooltipContent>{candidato.email}</TooltipContent>
                </Tooltip>
                {candidato.telefone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />{candidato.telefone}
                  </span>
                )}
              </div>

              {!compact && candidato.habilidades && candidato.habilidades.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {candidato.habilidades.slice(0, 4).map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">{skill}</Badge>
                  ))}
                  {candidato.habilidades.length > 4 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{candidato.habilidades.length - 4}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />{experienceCount} exp.
                    </TooltipTrigger>
                    <TooltipContent>{experienceCount} experiências</TooltipContent>
                  </Tooltip>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {candidato.created_at && format(new Date(candidato.created_at), 'dd MMM', { locale: ptBR })}
                  </span>
                  {candidato.fonte && (
                    <Badge variant="outline" className="text-xs">{candidato.fonte}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <CandidatoQuickActions candidatoId={candidato.id} isHovered={isHovered} />
                  <CandidatoMoreActions
                    candidatoId={candidato.id}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
