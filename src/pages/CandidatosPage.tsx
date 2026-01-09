import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect, useMemo } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, Search, Target, Mail, Phone, Briefcase, 
  GraduationCap, Sparkles, Calendar as CalendarIcon, UserPlus,
  TrendingUp, ChevronRight, Trash2, MessageSquare, X, UserCheck, UserX, Clock,
  Filter, SortAsc
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ComunicacaoHistorico } from '@/components/candidatos/ComunicacaoHistorico';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CandidatosEmptyState } from '@/components/empty-states';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface Experiencia {
  cargo: string;
  empresa: string;
  periodo: string;
}

interface Formacao {
  curso: string;
  instituicao: string;
}

interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  resumo: string | null;
  habilidades: string[] | null;
  experiencias: Experiencia[] | null;
  formacao: Formacao[] | null;
  fonte: string | null;
  status: string | null;
  arquivo_curriculo: string | null;
  created_at: string | null;
  updated_at?: string | null;
}

interface MatchScore {
  id: string;
  candidato_id: string;
  vaga_id: string;
  vaga_titulo: string;
  score_total: number;
  recomendacao: string | null;
  created_at: string | null;
}

const statusOptions = [
  { value: 'todos', label: 'Todos os Status' },
  { value: 'novo', label: 'Novo' },
  { value: 'em_triagem', label: 'Em Triagem' },
  { value: 'entrevista', label: 'Entrevista' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'reprovado', label: 'Reprovado' },
  { value: 'banco_talentos', label: 'Banco de Talentos' },
];

const getStatusConfig = (status: string | null) => {
  switch (status) {
    case 'novo': return { label: 'Novo', color: 'bg-info text-info-foreground', chartColor: 'hsl(var(--info))' };
    case 'em_triagem': return { label: 'Em Triagem', color: 'bg-warning text-warning-foreground', chartColor: 'hsl(var(--warning))' };
    case 'entrevista': return { label: 'Entrevista', color: 'bg-accent text-accent-foreground', chartColor: 'hsl(var(--accent))' };
    case 'aprovado': return { label: 'Aprovado', color: 'bg-success text-success-foreground', chartColor: 'hsl(var(--success))' };
    case 'reprovado': return { label: 'Reprovado', color: 'bg-destructive text-destructive-foreground', chartColor: 'hsl(var(--destructive))' };
    case 'banco_talentos': return { label: 'Banco de Talentos', color: 'bg-primary text-primary-foreground', chartColor: 'hsl(var(--primary))' };
    default: return { label: status || 'Novo', color: 'bg-muted text-muted-foreground', chartColor: 'hsl(var(--muted-foreground))' };
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-success bg-success/10 border-success/20';
  if (score >= 60) return 'text-warning bg-warning/10 border-warning/20';
  if (score >= 40) return 'text-accent bg-accent/10 border-accent/20';
  return 'text-destructive bg-destructive/10 border-destructive/20';
};

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const cardHoverVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.2 } }
};

export default function CandidatosPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [matchScores, setMatchScores] = useState<Record<string, MatchScore[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [skillFilter, setSkillFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('created_at');
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [minExperiences, setMinExperiences] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const allSkills = [...new Set(candidatos.flatMap(c => c.habilidades || []))].sort();
  
  usePageTitle('Talentos');

  useEffect(() => {
    fetchCandidatos();
  }, []);

  const fetchCandidatos = async () => {
    setIsLoading(true);
    try {
      const { data: candidatosData, error: candidatosError } = await supabase
        .from('candidatos')
        .select('*')
        .order('created_at', { ascending: false });

      if (candidatosError) throw candidatosError;

      setCandidatos((candidatosData || []) as Candidato[]);

      if (candidatosData && candidatosData.length > 0) {
        const { data: scoresData, error: scoresError } = await supabase
          .from('match_scores')
          .select('*')
          .in('candidato_id', candidatosData.map(c => c.id));

        if (scoresError) throw scoresError;

        const scoresMap: Record<string, MatchScore[]> = {};
        scoresData?.forEach(score => {
          if (!scoresMap[score.candidato_id]) {
            scoresMap[score.candidato_id] = [];
          }
          scoresMap[score.candidato_id]?.push(score as MatchScore);
        });
        setMatchScores(scoresMap);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os candidatos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCandidato = async (id: string) => {
    try {
      const { error } = await supabase.from('candidatos').delete().eq('id', id);
      if (error) throw error;

      setCandidatos(prev => prev.filter(c => c.id !== id));
      setSelectedCandidato(null);
      toast({ title: "Candidato removido", description: "O candidato foi excluído do banco de dados." });
    } catch (error) {
      toast({ title: "Erro ao excluir", description: "Não foi possível excluir o candidato.", variant: "destructive" });
    }
  };

  const updateCandidatoStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('candidatos')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;

      setCandidatos(prev => prev.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));
      
      if (selectedCandidato?.id === id) {
        setSelectedCandidato(prev => prev ? { ...prev, status: newStatus } : null);
      }
      
      toast({ 
        title: "Status atualizado", 
        description: `O status foi alterado para "${getStatusConfig(newStatus).label}".` 
      });
    } catch (error) {
      toast({ 
        title: "Erro ao atualizar", 
        description: "Não foi possível atualizar o status.", 
        variant: "destructive" 
      });
    }
  };

  const getBestMatchScore = (candidatoId: string): MatchScore | null => {
    const scores = matchScores[candidatoId];
    if (!scores || scores.length === 0) return null;
    return scores.reduce((best, current) => 
      current.score_total > best.score_total ? current : best
    );
  };

  const filteredCandidatos = candidatos
    .filter(c => {
      const matchesSearch = !searchTerm || 
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
      
      const matchesSkill = skillFilter === 'todas' || 
        (c.habilidades && c.habilidades.some((h: string) => 
          h.toLowerCase().includes(skillFilter.toLowerCase())
        ));

      const candidatoDate = c.created_at ? new Date(c.created_at) : new Date(0);
      const matchesDateFrom = !dateFrom || candidatoDate >= startOfDay(dateFrom);
      const matchesDateTo = !dateTo || candidatoDate <= endOfDay(dateTo);
      
      const experienceCount = c.experiencias?.length || 0;
      const matchesExperience = experienceCount >= minExperiences;

      return matchesSearch && matchesStatus && matchesSkill && matchesDateFrom && matchesDateTo && matchesExperience;
    })
    .sort((a, b) => {
      if (sortBy === 'match_score') {
        const scoreA = getBestMatchScore(a.id)?.score_total || 0;
        const scoreB = getBestMatchScore(b.id)?.score_total || 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'nome') {
        return a.nome.localeCompare(b.nome);
      }
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

  const statusStats = useMemo(() => {
    const counts: Record<string, number> = {};
    candidatos.forEach(c => {
      const status = c.status || 'novo';
      counts[status] = (counts[status] || 0) + 1;
    });
    
    return statusOptions
      .filter(opt => opt.value !== 'todos')
      .map(opt => ({
        name: opt.label,
        value: counts[opt.value] || 0,
        color: getStatusConfig(opt.value).chartColor,
      }))
      .filter(item => item.value > 0);
  }, [candidatos]);

  const quickStats = useMemo(() => {
    const novos = candidatos.filter(c => c.status === 'novo' || !c.status).length;
    const emProcesso = candidatos.filter(c => ['em_triagem', 'entrevista'].includes(c.status || '')).length;
    const aprovados = candidatos.filter(c => c.status === 'aprovado').length;
    const reprovados = candidatos.filter(c => c.status === 'reprovado').length;
    
    return { novos, emProcesso, aprovados, reprovados };
  }, [candidatos]);

  const evolutionData = useMemo(() => {
    const last30Days: { date: string; label: string; count: number; accumulated: number }[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      last30Days.push({
        date: format(date, 'yyyy-MM-dd'),
        label: format(date, 'dd/MM', { locale: ptBR }),
        count: 0,
        accumulated: 0,
      });
    }
    
    candidatos.forEach(c => {
      if (!c.created_at) return;
      const candidatoDate = format(new Date(c.created_at), 'yyyy-MM-dd');
      const dayData = last30Days.find(d => d.date === candidatoDate);
      if (dayData) {
        dayData.count++;
      }
    });
    
    let accumulated = candidatos.filter(c => {
      if (!c.created_at) return true;
      const candidatoDate = new Date(c.created_at);
      return candidatoDate < subDays(today, 29);
    }).length;
    
    last30Days.forEach(day => {
      accumulated += day.count;
      day.accumulated = accumulated;
    });
    
    return last30Days.filter((_, i) => i % 3 === 0 || i === last30Days.length - 1);
  }, [candidatos]);

  const activeFiltersCount = [
    statusFilter !== 'todos',
    skillFilter !== 'todas',
    dateFrom !== undefined,
    dateTo !== undefined,
    minExperiences > 0
  ].filter(Boolean).length;

  return (
    <Layout>
      <div className="space-y-6 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 gradient-mesh opacity-30" />
        
        {/* Premium Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl glass-card p-6 md:p-8"
        >
          <div className="absolute inset-0 gradient-primary opacity-5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10 shadow-glow-primary">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gradient">
                  Banco de Talentos
                </h1>
              </div>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{candidatos.length}</span> candidatos cadastrados no sistema
              </p>
            </div>
            <Button 
              onClick={() => navigate('/parser-curriculo')}
              className="btn-premium text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Candidato
            </Button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {!isLoading && candidatos.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: Users, label: 'Novos', value: quickStats.novos, color: 'info' },
              { icon: Clock, label: 'Em Processo', value: quickStats.emProcesso, color: 'warning' },
              { icon: UserCheck, label: 'Aprovados', value: quickStats.aprovados, color: 'success' },
              { icon: UserX, label: 'Reprovados', value: quickStats.reprovados, color: 'destructive' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card variant="glass" hover="lift" className="group overflow-hidden">
                  <CardContent className="p-4 md:p-5 relative">
                    <div className={cn(
                      "absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 -translate-y-1/2 translate-x-1/2",
                      stat.color === 'info' && "bg-info",
                      stat.color === 'warning' && "bg-warning",
                      stat.color === 'success' && "bg-success",
                      stat.color === 'destructive' && "bg-destructive"
                    )} />
                    <div className="flex items-center gap-3 relative">
                      <div className={cn(
                        "p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110",
                        stat.color === 'info' && "bg-info/10 text-info",
                        stat.color === 'warning' && "bg-warning/10 text-warning",
                        stat.color === 'success' && "bg-success/10 text-success",
                        stat.color === 'destructive' && "bg-destructive/10 text-destructive"
                      )}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Charts Row */}
        {!isLoading && candidatos.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            {/* Area Chart - Evolution */}
            <Card variant="glass" className="lg:col-span-2 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Evolução de Candidatos
                  <Badge variant="secondary" size="sm">30 dias</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={evolutionData}>
                      <defs>
                        <linearGradient id="colorAccumulated" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                      <XAxis 
                        dataKey="label" 
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                        tickLine={false}
                        axisLine={false}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)'
                        }}
                        formatter={(value: number, name: string) => [
                          value,
                          name === 'accumulated' ? 'Total Acumulado' : 'Novos no dia'
                        ]}
                        labelFormatter={(label) => `Data: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="accumulated" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fill="url(#colorAccumulated)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card variant="glass" className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {statusStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value} candidatos`, '']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px'
                        }}
                      />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                        iconSize={8}
                        iconType="circle"
                        formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass" className="overflow-hidden">
            <CardContent className="p-4 md:p-6">
              {/* Main Search Row */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 bg-background/50 border-border/50 focus:bg-background transition-colors"
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px] h-11 bg-background/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    variant={showFilters ? "secondary" : "outline"} 
                    size="icon"
                    className="h-11 w-11 shrink-0"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px] h-11 bg-background/50">
                      <SortAsc className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Ordenar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Mais recentes</SelectItem>
                      <SelectItem value="match_score">Maior Match Score</SelectItem>
                      <SelectItem value="nome">Nome (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50">
                      {/* Skill Filter */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Habilidade</label>
                        <Select value={skillFilter} onValueChange={setSkillFilter}>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Filtrar por skill" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas as skills</SelectItem>
                            {allSkills.slice(0, 50).map(skill => (
                              <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Date From */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Cadastrado a partir de</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-background/50",
                                !dateFrom && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                              {dateFrom && (
                                <X 
                                  className="ml-auto h-4 w-4 hover:text-destructive" 
                                  onClick={(e) => { e.stopPropagation(); setDateFrom(undefined); }}
                                />
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateFrom}
                              onSelect={setDateFrom}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Date To */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Cadastrado até</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-background/50",
                                !dateTo && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                              {dateTo && (
                                <X 
                                  className="ml-auto h-4 w-4 hover:text-destructive" 
                                  onClick={(e) => { e.stopPropagation(); setDateTo(undefined); }}
                                />
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateTo}
                              onSelect={setDateTo}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Min Experience */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">
                          Experiências mínimas: <span className="font-bold text-foreground">{minExperiences === 0 ? "Todas" : minExperiences}</span>
                        </label>
                        <div className="flex items-center gap-3 h-10 px-3 border rounded-lg bg-background/50">
                          <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <Slider
                            value={[minExperiences]}
                            onValueChange={(value) => setMinExperiences(value[0] ?? 0)}
                            max={10}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-6 text-right">{minExperiences}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-muted-foreground">Carregando talentos...</p>
            </div>
          </div>
        ) : filteredCandidatos.length === 0 ? (
          <CandidatosEmptyState 
            hasFilters={searchTerm !== '' || statusFilter !== 'todos' || skillFilter !== 'todas' || dateFrom !== undefined || dateTo !== undefined || minExperiences > 0}
            onClearFilters={() => {
              setSearchTerm('');
              setStatusFilter('todos');
              setSkillFilter('todas');
              setDateFrom(undefined);
              setDateTo(undefined);
              setMinExperiences(0);
            }}
          />
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredCandidatos.map((candidato) => {
              const bestScore = getBestMatchScore(candidato.id);
              const statusConfig = getStatusConfig(candidato.status ?? 'novo');

              return (
                <motion.div 
                  key={candidato.id} 
                  variants={itemVariants}
                  layout
                >
                  <Sheet>
                    <SheetTrigger asChild>
                      <motion.div
                        variants={cardHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        className="cursor-pointer"
                        onClick={() => setSelectedCandidato(candidato)}
                      >
                        <Card variant="glass" className="h-full overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                          <CardContent className="p-5 relative">
                            {/* Glow effect */}
                            {bestScore && bestScore.score_total >= 80 && (
                              <div className="absolute top-0 right-0 w-24 h-24 bg-success/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            )}
                            
                            <div className="relative">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-lg truncate">{candidato.nome}</h3>
                                  <p className="text-sm text-muted-foreground truncate">{candidato.email}</p>
                                </div>
                                <Badge className={cn("shrink-0 ml-2", statusConfig.color)} size="sm">
                                  {statusConfig.label}
                                </Badge>
                              </div>

                              {/* Match Score */}
                              {bestScore && (
                                <div className={cn(
                                  "p-3 rounded-xl mb-4 flex items-center justify-between border",
                                  getScoreColor(bestScore.score_total)
                                )}>
                                  <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    <span className="text-sm font-medium">Match Score</span>
                                  </div>
                                  <span className="text-lg font-bold">{bestScore.score_total}%</span>
                                </div>
                              )}

                              {/* Stats */}
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Briefcase className="h-4 w-4" />
                                  <span>{candidato.experiencias?.length || 0} experiências</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Sparkles className="h-4 w-4" />
                                  <span>{candidato.habilidades?.length || 0} habilidades</span>
                                </div>
                              </div>

                              {/* Skills */}
                              {candidato.habilidades && candidato.habilidades.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {candidato.habilidades.slice(0, 3).map((skill, i) => (
                                    <Badge key={i} variant="secondary" size="sm" className="bg-secondary/50">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {candidato.habilidades.length > 3 && (
                                    <Badge variant="outline" size="sm">
                                      +{candidato.habilidades.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {/* Footer */}
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  {candidato.created_at ? format(new Date(candidato.created_at), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-primary font-medium">
                                  Ver detalhes
                                  <ChevronRight className="h-3 w-3" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </SheetTrigger>

                    <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          {candidato.nome}
                        </SheetTitle>
                      </SheetHeader>

                      <div className="space-y-6 mt-6">
                        {/* Status Edit */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Alterar Status</h4>
                          <Select 
                            value={candidato.status || 'novo'} 
                            onValueChange={(value) => updateCandidatoStatus(candidato.id, value)}
                          >
                            <SelectTrigger className="bg-muted/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.filter(opt => opt.value !== 'todos').map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", getStatusConfig(opt.value).color)} />
                                    {opt.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Contact */}
                        <div className="p-4 rounded-xl bg-muted/30 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-primary" />
                            <span>{candidato.email}</span>
                          </div>
                          {candidato.telefone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-primary" />
                              <span>{candidato.telefone}</span>
                            </div>
                          )}
                        </div>

                        {/* Match Scores */}
                        {matchScores[candidato.id] && (matchScores[candidato.id]?.length ?? 0) > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                              <Target className="h-4 w-4 text-primary" />
                              Match Scores
                            </h4>
                            <div className="space-y-2">
                              {(matchScores[candidato.id] ?? []).map((score) => (
                                <div key={score.id} className={cn(
                                  "p-3 rounded-xl border",
                                  getScoreColor(score.score_total)
                                )}>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">{score.vaga_titulo}</span>
                                    <span className="font-bold">{score.score_total}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resume */}
                        {candidato.resumo && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Resumo</h4>
                            <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl">
                              {candidato.resumo}
                            </p>
                          </div>
                        )}

                        {/* Skills */}
                        {candidato.habilidades && candidato.habilidades.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-primary" />
                              Habilidades ({candidato.habilidades.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {candidato.habilidades.map((skill, i) => (
                                <Badge key={i} variant="secondary">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Experience */}
                        {candidato.experiencias && candidato.experiencias.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-primary" />
                              Experiências ({candidato.experiencias.length})
                            </h4>
                            <div className="space-y-2">
                              {candidato.experiencias.map((exp: Experiencia, i: number) => (
                                <div key={i} className="p-4 bg-muted/30 rounded-xl">
                                  <p className="font-medium text-sm">{exp.cargo}</p>
                                  <p className="text-sm text-primary">{exp.empresa}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{exp.periodo}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education */}
                        {candidato.formacao && candidato.formacao.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-primary" />
                              Formação ({candidato.formacao.length})
                            </h4>
                            <div className="space-y-2">
                              {candidato.formacao.map((edu: Formacao, i: number) => (
                                <div key={i} className="p-4 bg-muted/30 rounded-xl">
                                  <p className="font-medium text-sm">{edu.curso}</p>
                                  <p className="text-sm text-primary">{edu.instituicao}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Communication History */}
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            Histórico de Comunicações
                          </h4>
                          <ComunicacaoHistorico candidatoId={candidato.id} />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t">
                          <Button 
                            className="flex-1 btn-premium text-primary-foreground"
                            onClick={() => navigate(`/candidato/${candidato.id}`)}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Ver Perfil Completo
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => deleteCandidato(candidato.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Results Count */}
        {!isLoading && filteredCandidatos.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground"
          >
            Exibindo <span className="font-semibold text-foreground">{filteredCandidatos.length}</span> de{' '}
            <span className="font-semibold text-foreground">{candidatos.length}</span> candidatos
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
