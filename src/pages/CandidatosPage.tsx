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
  Users, Search, Filter, Target, Mail, Phone, Briefcase, 
  GraduationCap, Sparkles, Calendar as CalendarIcon, Loader2, UserPlus,
  TrendingUp, ChevronRight, Trash2, MessageSquare, X, UserCheck, UserX, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ComunicacaoHistorico } from '@/components/candidatos/ComunicacaoHistorico';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  resumo: string | null;
  habilidades: string[] | null;
  experiencias: any;
  formacao: any;
  fonte: string | null;
  status: string | null;
  arquivo_curriculo: string | null;
  created_at: string;
}

interface MatchScore {
  id: string;
  candidato_id: string;
  vaga_id: string;
  vaga_titulo: string;
  score_total: number;
  recomendacao: string;
  created_at: string;
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

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'novo': return { label: 'Novo', color: 'bg-blue-500', chartColor: '#3b82f6' };
    case 'em_triagem': return { label: 'Em Triagem', color: 'bg-yellow-500', chartColor: '#eab308' };
    case 'entrevista': return { label: 'Entrevista', color: 'bg-purple-500', chartColor: '#a855f7' };
    case 'aprovado': return { label: 'Aprovado', color: 'bg-green-500', chartColor: '#22c55e' };
    case 'reprovado': return { label: 'Reprovado', color: 'bg-red-500', chartColor: '#ef4444' };
    case 'banco_talentos': return { label: 'Banco de Talentos', color: 'bg-indigo-500', chartColor: '#6366f1' };
    default: return { label: status || 'Novo', color: 'bg-gray-500', chartColor: '#6b7280' };
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-500 bg-green-50 dark:bg-green-950/30';
  if (score >= 60) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30';
  if (score >= 40) return 'text-orange-500 bg-orange-50 dark:bg-orange-950/30';
  return 'text-red-500 bg-red-50 dark:bg-red-950/30';
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

  const allSkills = [...new Set(candidatos.flatMap(c => c.habilidades || []))].sort();

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

      setCandidatos(candidatosData || []);

      // Fetch match scores
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
          scoresMap[score.candidato_id].push(score);
        });
        setMatchScores(scoresMap);
      }
    } catch (error) {
      console.error('Error fetching candidatos:', error);
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

      const candidatoDate = new Date(c.created_at);
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
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Statistics by status
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Banco de Candidatos</h1>
            <p className="text-muted-foreground mt-1">
              {candidatos.length} candidatos cadastrados
            </p>
          </div>
          <Button onClick={() => navigate('/parser-curriculo')}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Candidato via Parser
          </Button>
        </div>

        {/* Statistics */}
        {!isLoading && candidatos.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Quick Stats */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{quickStats.novos}</p>
                    <p className="text-xs text-muted-foreground">Novos</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{quickStats.emProcesso}</p>
                    <p className="text-xs text-muted-foreground">Em Processo</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <UserCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{quickStats.aprovados}</p>
                    <p className="text-xs text-muted-foreground">Aprovados</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <UserX className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{quickStats.reprovados}</p>
                    <p className="text-xs text-muted-foreground">Reprovados</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pie Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={55}
                        paddingAngle={2}
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
                          borderRadius: '8px'
                        }}
                      />
                      <Legend 
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle"
                        iconSize={8}
                        formatter={(value) => <span className="text-xs">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
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

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              {/* Date From */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Data de cadastro (de)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                <label className="text-xs text-muted-foreground mb-1 block">Data de cadastro (até)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                <label className="text-xs text-muted-foreground mb-1 block">
                  Experiências mínimas: {minExperiences === 0 ? "Todas" : minExperiences}
                </label>
                <div className="flex items-center gap-3 h-10 px-3 border rounded-md">
                  <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Slider
                    value={[minExperiences]}
                    onValueChange={(value) => setMinExperiences(value[0])}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-6 text-right">{minExperiences}</span>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Mais recentes</SelectItem>
                    <SelectItem value="match_score">Maior Match Score</SelectItem>
                    <SelectItem value="nome">Nome (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCandidatos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum candidato encontrado</h3>
              <p className="text-muted-foreground mt-1">
                {candidatos.length === 0 
                  ? "Use o Parser de Currículo para adicionar candidatos."
                  : "Tente ajustar os filtros de busca."}
              </p>
              {candidatos.length === 0 && (
                <Button className="mt-4" onClick={() => navigate('/parser-curriculo')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Candidato
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidatos.map((candidato) => {
              const bestScore = getBestMatchScore(candidato.id);
              const statusConfig = getStatusConfig(candidato.status);

              return (
                <Sheet key={candidato.id}>
                  <SheetTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCandidato(candidato)}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{candidato.nome}</h3>
                            <p className="text-sm text-muted-foreground truncate">{candidato.email}</p>
                          </div>
                          <Badge className={cn("text-white text-xs", statusConfig.color)}>
                            {statusConfig.label}
                          </Badge>
                        </div>

                        {bestScore && (
                          <div className={cn("p-2 rounded-lg mb-3 flex items-center justify-between", getScoreColor(bestScore.score_total))}>
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              <span className="text-sm font-medium">Match Score</span>
                            </div>
                            <span className="font-bold">{bestScore.score_total}%</span>
                          </div>
                        )}

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            <span>{candidato.experiencias?.length || 0} experiências</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Sparkles className="h-4 w-4" />
                            <span>{candidato.habilidades?.length || 0} habilidades</span>
                          </div>
                        </div>

                        {candidato.habilidades && candidato.habilidades.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {candidato.habilidades.slice(0, 3).map((skill, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                            ))}
                            {candidato.habilidades.length > 3 && (
                              <Badge variant="outline" className="text-xs">+{candidato.habilidades.length - 3}</Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-3 border-t">
                          <span className="text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {new Date(candidato.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </SheetTrigger>

                  <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
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
                          <SelectTrigger>
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
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{candidato.email}</span>
                        </div>
                        {candidato.telefone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{candidato.telefone}</span>
                          </div>
                        )}
                      </div>

                      {/* Match Scores */}
                      {matchScores[candidato.id] && matchScores[candidato.id].length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Match Scores
                          </h4>
                          <div className="space-y-2">
                            {matchScores[candidato.id].map((score) => (
                              <div key={score.id} className={cn("p-3 rounded-lg", getScoreColor(score.score_total))}>
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
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                            {candidato.resumo}
                          </p>
                        </div>
                      )}

                      {/* Skills */}
                      {candidato.habilidades && candidato.habilidades.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
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
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Experiências ({candidato.experiencias.length})
                          </h4>
                          <div className="space-y-2">
                            {candidato.experiencias.map((exp: any, i: number) => (
                              <div key={i} className="p-3 bg-muted rounded-lg">
                                <p className="font-medium text-sm">{exp.cargo}</p>
                                <p className="text-sm text-primary">{exp.empresa}</p>
                                <p className="text-xs text-muted-foreground">{exp.periodo}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {candidato.formacao && candidato.formacao.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Formação ({candidato.formacao.length})
                          </h4>
                          <div className="space-y-2">
                            {candidato.formacao.map((edu: any, i: number) => (
                              <div key={i} className="p-3 bg-muted rounded-lg">
                                <p className="font-medium text-sm">{edu.curso}</p>
                                <p className="text-sm text-primary">{edu.instituicao}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Communication History */}
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Histórico de Comunicações
                        </h4>
                        <ComunicacaoHistorico candidatoId={candidato.id} />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t">
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/candidato/${candidato.id}`)}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Ver Perfil Completo
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteCandidato(candidato.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
