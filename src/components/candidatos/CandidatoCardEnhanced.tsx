/**
 * Enhanced Candidate Card with rich interactions
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Mail,
  Phone,
  Briefcase,
  Star,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  FileText,
  Share2,
  Trash2,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface Experiencia {
  cargo: string;
  empresa: string;
  periodo: string;
}

interface MatchScore {
  id: string;
  vaga_titulo: string;
  score_total: number;
  recomendacao: string | null;
}

interface CandidatoCardEnhancedProps {
  candidato: {
    id: string;
    nome: string;
    email: string;
    telefone?: string | null;
    resumo?: string | null;
    habilidades?: string[] | null;
    experiencias?: Experiencia[] | null;
    status?: string | null;
    created_at?: string | null;
    fonte?: string | null;
  };
  matchScore?: MatchScore | null;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  index?: number;
  compact?: boolean;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  novo: { label: 'Novo', color: 'bg-info text-info-foreground' },
  em_triagem: { label: 'Em Triagem', color: 'bg-warning text-warning-foreground' },
  entrevista: { label: 'Entrevista', color: 'bg-accent text-accent-foreground' },
  aprovado: { label: 'Aprovado', color: 'bg-success text-success-foreground' },
  reprovado: { label: 'Reprovado', color: 'bg-destructive text-destructive-foreground' },
  banco_talentos: { label: 'Banco de Talentos', color: 'bg-primary text-primary-foreground' },
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-muted-foreground';
};

const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-success/10 border-success/20';
  if (score >= 60) return 'bg-warning/10 border-warning/20';
  return 'bg-muted/50 border-muted';
};

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
    // Don't navigate if clicking on action buttons
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
          'hover:shadow-lg hover:shadow-primary/5',
          'border-border/50',
          isSelected && 'ring-2 ring-primary shadow-lg shadow-primary/10',
          isHovered && 'border-primary/30'
        )}
        onClick={handleCardClick}
      >
        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
          />
        )}

        {/* Match score highlight */}
        {matchScore && matchScore.score_total >= 80 && (
          <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
            <div className="absolute top-2 -right-6 w-24 transform rotate-45 bg-success text-white text-xs text-center py-0.5">
              Top Match
            </div>
          </div>
        )}

        <CardContent className={cn('p-4', compact && 'p-3')}>
          <div className="flex gap-4">
            {/* Selection checkbox */}
            {onSelect && (
              <div className="flex items-start pt-1">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onSelect(candidato.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Avatar */}
            <div className="relative">
              <Avatar className={cn('border-2 border-background shadow-md', compact ? 'h-12 w-12' : 'h-14 w-14')}>
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {candidato.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </AvatarFallback>
              </Avatar>
              
              {/* Status indicator dot */}
              <div className={cn(
                'absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background',
                status?.color ?? 'bg-muted'
              )} />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={cn('font-semibold truncate', compact ? 'text-sm' : 'text-base')}>
                      {candidato.nome}
                    </h3>
                    {matchScore && matchScore.score_total >= 90 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Sparkles className="h-4 w-4 text-accent" />
                        </TooltipTrigger>
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

                {/* Match Score */}
                {matchScore && (
                  <div className={cn(
                    'flex-shrink-0 px-3 py-1.5 rounded-lg border',
                    getScoreBg(matchScore.score_total)
                  )}>
                    <div className="flex items-center gap-1.5">
                      <Target className={cn('h-4 w-4', getScoreColor(matchScore.score_total))} />
                      <span className={cn('text-lg font-bold', getScoreColor(matchScore.score_total))}>
                        {matchScore.score_total}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate max-w-[80px]">
                      {matchScore.vaga_titulo}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact info */}
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
                    <Phone className="h-3.5 w-3.5" />
                    {candidato.telefone}
                  </span>
                )}
              </div>

              {/* Skills */}
              {!compact && candidato.habilidades && candidato.habilidades.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {candidato.habilidades.slice(0, 4).map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">
                      {skill}
                    </Badge>
                  ))}
                  {candidato.habilidades.length > 4 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{candidato.habilidades.length - 4}
                    </Badge>
                  )}
                </div>
              )}

              {/* Meta info */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {experienceCount} exp.
                    </TooltipTrigger>
                    <TooltipContent>{experienceCount} experiências</TooltipContent>
                  </Tooltip>
                  
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {candidato.created_at && format(new Date(candidato.created_at), "dd MMM", { locale: ptBR })}
                  </span>
                  
                  {candidato.fonte && (
                    <Badge variant="outline" className="text-xs">
                      {candidato.fonte}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Quick actions */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                    className="flex items-center gap-1"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/candidato/${candidato.id}`);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ver perfil</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Enviar mensagem</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Calendar className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Agendar entrevista</TooltipContent>
                    </Tooltip>
                  </motion.div>

                  {/* More actions dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate(`/candidato/${candidato.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Perfil Completo
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Currículo
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem>
                        <Target className="h-4 w-4 mr-2" />
                        Calcular Match
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Adicionar a Vaga
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      {onStatusChange && (
                        <>
                          <DropdownMenuItem onClick={() => onStatusChange(candidato.id, 'em_triagem')}>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Mover para Triagem
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange(candidato.id, 'banco_talentos')}>
                            <Star className="h-4 w-4 mr-2" />
                            Banco de Talentos
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                      </DropdownMenuItem>
                      
                      {onDelete && (
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(candidato.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
