/**
 * Live Activity Feed - Feed de atividades em tempo real
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  UserPlus,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Mail,
  Star,
  Zap,
  RefreshCw,
  Bell,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityItem {
  id: string;
  type: 'candidate_new' | 'candidate_moved' | 'interview_scheduled' | 'interview_completed' | 
        'offer_sent' | 'hired' | 'rejected' | 'test_completed' | 'match_high';
  title: string;
  description: string;
  timestamp: Date;
  actor?: {
    name: string;
    avatar?: string;
  };
  metadata?: {
    candidateName?: string;
    vagaTitle?: string;
    score?: number;
    fromStage?: string;
    toStage?: string;
  };
  isNew?: boolean;
}

const activityConfig = {
  candidate_new: {
    icon: UserPlus,
    color: 'text-success bg-success/10',
    label: 'Novo candidato',
  },
  candidate_moved: {
    icon: ArrowRight,
    color: 'text-primary bg-primary/10',
    label: 'Movimentação',
  },
  interview_scheduled: {
    icon: Calendar,
    color: 'text-info bg-info/10',
    label: 'Entrevista agendada',
  },
  interview_completed: {
    icon: CheckCircle2,
    color: 'text-success bg-success/10',
    label: 'Entrevista realizada',
  },
  offer_sent: {
    icon: Mail,
    color: 'text-accent bg-accent/10',
    label: 'Proposta enviada',
  },
  hired: {
    icon: Star,
    color: 'text-success bg-success/10',
    label: 'Contratação',
  },
  rejected: {
    icon: XCircle,
    color: 'text-destructive bg-destructive/10',
    label: 'Reprovação',
  },
  test_completed: {
    icon: FileText,
    color: 'text-warning bg-warning/10',
    label: 'Teste concluído',
  },
  match_high: {
    icon: Zap,
    color: 'text-accent bg-accent/10',
    label: 'Match alto',
  },
};

// Mock data generator
const generateMockActivities = (): ActivityItem[] => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'candidate_new',
      title: 'Novo candidato cadastrado',
      description: 'Maria Silva aplicou para Desenvolvedor Full Stack',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      metadata: { candidateName: 'Maria Silva', vagaTitle: 'Desenvolvedor Full Stack' },
      isNew: true,
    },
    {
      id: '2',
      type: 'match_high',
      title: 'Match de 95% identificado',
      description: 'João Santos tem alta compatibilidade com Product Manager',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      metadata: { candidateName: 'João Santos', vagaTitle: 'Product Manager', score: 95 },
      isNew: true,
    },
    {
      id: '3',
      type: 'candidate_moved',
      title: 'Candidato avançou no processo',
      description: 'Ana Costa movida para Entrevista Técnica',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      metadata: { candidateName: 'Ana Costa', fromStage: 'Triagem', toStage: 'Entrevista Técnica' },
    },
    {
      id: '4',
      type: 'interview_scheduled',
      title: 'Entrevista agendada',
      description: 'Pedro Lima - Tech Lead amanhã às 14:00',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      metadata: { candidateName: 'Pedro Lima', vagaTitle: 'Tech Lead' },
    },
    {
      id: '5',
      type: 'test_completed',
      title: 'Teste técnico concluído',
      description: 'Carlos Mendes finalizou avaliação com 87%',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      metadata: { candidateName: 'Carlos Mendes', score: 87 },
    },
    {
      id: '6',
      type: 'hired',
      title: '🎉 Nova contratação!',
      description: 'Fernanda Oliveira foi contratada como UX Designer',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metadata: { candidateName: 'Fernanda Oliveira', vagaTitle: 'UX Designer' },
    },
    {
      id: '7',
      type: 'offer_sent',
      title: 'Proposta enviada',
      description: 'Bruno Almeida recebeu proposta para Backend Developer',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      metadata: { candidateName: 'Bruno Almeida', vagaTitle: 'Backend Developer' },
    },
  ];
  return activities;
};

interface LiveActivityFeedProps {
  maxItems?: number;
  showFilters?: boolean;
  compact?: boolean;
}

export function LiveActivityFeed({ 
  maxItems = 10, 
  showFilters = true,
  compact = false 
}: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    setActivities(generateMockActivities());
    
    // Simulate real-time updates
    if (isLive) {
      const interval = setInterval(() => {
        const types: ActivityItem['type'][] = [
          'candidate_new', 'candidate_moved', 'match_high', 'test_completed'
        ];
        const randomType = types[Math.floor(Math.random() * types.length)] as ActivityItem['type'];
        const names = ['Lucas Souza', 'Juliana Ferreira', 'Rafael Costa', 'Camila Santos'];
        const randomName = names[Math.floor(Math.random() * names.length)] ?? 'Candidato';
        
        const newActivity: ActivityItem = {
          id: Date.now().toString(),
          type: randomType,
          title: activityConfig[randomType].label,
          description: `${randomName} - Atividade simulada`,
          timestamp: new Date(),
          metadata: { candidateName: randomName },
          isNew: true,
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)]);
      }, 30000);
      
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isLive, maxItems]);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'candidate_new', label: 'Novos' },
    { value: 'candidate_moved', label: 'Movimentos' },
    { value: 'match_high', label: 'Matches' },
    { value: 'hired', label: 'Contratações' },
  ];

  return (
    <Card className={cn('relative overflow-hidden', compact && 'border-0 shadow-none')}>
      {!compact && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              Feed de Atividades
              <Badge 
                variant={isLive ? 'default' : 'secondary'}
                className={cn('gap-1', isLive && 'bg-success hover:bg-success')}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', isLive ? 'bg-white animate-pulse' : 'bg-muted-foreground')} />
                {isLive ? 'Ao vivo' : 'Pausado'}
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsLive(!isLive)}
              >
                {isLive ? <Bell className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="flex gap-1 mt-3 flex-wrap">
              {filterOptions.map(option => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
        </CardHeader>
      )}

      <CardContent className={cn(compact && 'p-0')}>
        <ScrollArea className={cn(compact ? 'h-[200px]' : 'h-[350px]')}>
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((activity, index) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className={cn(
                    'group relative',
                    index !== filteredActivities.length - 1 && 'border-b border-border/50'
                  )}
                >
                  {/* New indicator line */}
                  {activity.isNew && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full"
                    />
                  )}
                  
                  <div className={cn(
                    'flex gap-3 p-3 transition-colors',
                    'hover:bg-muted/50',
                    activity.isNew && 'bg-primary/5'
                  )}>
                    {/* Icon */}
                    <div className={cn('p-2 rounded-lg flex-shrink-0', config.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDistanceToNow(activity.timestamp, { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {activity.description}
                      </p>
                      
                      {/* Metadata badges */}
                      {activity.metadata?.score && (
                        <Badge variant="outline" className="mt-1.5 text-xs gap-1">
                          <Star className="h-3 w-3" />
                          {activity.metadata.score}%
                        </Badge>
                      )}
                      
                      {activity.metadata?.toStage && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                          <span>{activity.metadata.fromStage}</span>
                          <ArrowRight className="h-3 w-3" />
                          <Badge variant="secondary" className="text-xs">
                            {activity.metadata.toStage}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {/* Quick action on hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredActivities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
