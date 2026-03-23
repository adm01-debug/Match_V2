/**
 * @fileoverview Hiring Manager Portal - Dashboard para Gestores
 * @module HiringManagerPortalPage
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Layout } from '@/components/layout/Layout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import {
  Briefcase, Users, Clock, CheckCircle2, Calendar,
  Star, Filter, MessageSquare, ThumbsUp, ThumbsDown, Eye, BarChart3,
  AlertTriangle, Zap, Target, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ManagerVaga {
  id: string;
  titulo: string;
  departamento: string;
  status: string;
  totalCandidatos: number;
  emProcesso: number;
  contratados: number;
  diasAberta: number;
  urgente: boolean;
  meta: number;
}

interface ManagerCandidato {
  id: string;
  nome: string;
  foto?: string;
  vaga: string;
  etapa: string;
  matchScore: number;
  diasNaEtapa: number;
  proximaAcao?: string;
  avaliacao?: 'positiva' | 'negativa' | 'pendente';
}

interface ManagerEntrevista {
  id: string;
  candidato: string;
  vaga: string;
  data: Date;
  hora: string;
  tipo: string;
  status: 'agendada' | 'realizada' | 'cancelada';
}

// Mock data for hiring manager
const mockVagas: ManagerVaga[] = [
  {
    id: '1',
    titulo: 'Desenvolvedor Full Stack Senior',
    departamento: 'Tecnologia',
    status: 'publicada',
    totalCandidatos: 45,
    emProcesso: 12,
    contratados: 0,
    diasAberta: 15,
    urgente: true,
    meta: 2,
  },
  {
    id: '2',
    titulo: 'Product Manager',
    departamento: 'Produto',
    status: 'publicada',
    totalCandidatos: 28,
    emProcesso: 5,
    contratados: 1,
    diasAberta: 30,
    urgente: false,
    meta: 1,
  },
  {
    id: '3',
    titulo: 'DevOps Engineer',
    departamento: 'Tecnologia',
    status: 'publicada',
    totalCandidatos: 18,
    emProcesso: 8,
    contratados: 0,
    diasAberta: 10,
    urgente: true,
    meta: 1,
  },
];

const mockCandidatos: ManagerCandidato[] = [
  {
    id: '1',
    nome: 'Ana Carolina Silva',
    vaga: 'Desenvolvedor Full Stack Senior',
    etapa: 'Entrevista Técnica',
    matchScore: 92,
    diasNaEtapa: 3,
    proximaAcao: 'Agendar entrevista técnica',
    avaliacao: 'pendente',
  },
  {
    id: '2',
    nome: 'Pedro Henrique Santos',
    vaga: 'Desenvolvedor Full Stack Senior',
    etapa: 'Entrevista Gestor',
    matchScore: 88,
    diasNaEtapa: 1,
    avaliacao: 'positiva',
  },
  {
    id: '3',
    nome: 'Marina Costa',
    vaga: 'Product Manager',
    etapa: 'Entrevista Final',
    matchScore: 95,
    diasNaEtapa: 2,
    proximaAcao: 'Decisão final',
    avaliacao: 'positiva',
  },
  {
    id: '4',
    nome: 'Lucas Ferreira',
    vaga: 'DevOps Engineer',
    etapa: 'Teste Técnico',
    matchScore: 78,
    diasNaEtapa: 5,
    avaliacao: 'pendente',
  },
];

const mockEntrevistas: ManagerEntrevista[] = [
  {
    id: '1',
    candidato: 'Ana Carolina Silva',
    vaga: 'Desenvolvedor Full Stack Senior',
    data: new Date(),
    hora: '14:00',
    tipo: 'Técnica',
    status: 'agendada',
  },
  {
    id: '2',
    candidato: 'Pedro Henrique Santos',
    vaga: 'Desenvolvedor Full Stack Senior',
    data: new Date(Date.now() + 24 * 60 * 60 * 1000),
    hora: '10:00',
    tipo: 'Gestor',
    status: 'agendada',
  },
  {
    id: '3',
    candidato: 'Marina Costa',
    vaga: 'Product Manager',
    data: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    hora: '15:30',
    tipo: 'Final',
    status: 'agendada',
  },
];

const progressData = [
  { semana: 'Sem 1', candidatos: 12, entrevistas: 4, contratacoes: 0 },
  { semana: 'Sem 2', candidatos: 18, entrevistas: 6, contratacoes: 0 },
  { semana: 'Sem 3', candidatos: 25, entrevistas: 8, contratacoes: 1 },
  { semana: 'Sem 4', candidatos: 32, entrevistas: 10, contratacoes: 1 },
];

export default function HiringManagerPortalPage() {
  usePageTitle('Portal do Gestor');
  const { user } = useAuth();
  const [selectedVaga, setSelectedVaga] = useState<string>('all');

  const gestorNome = user?.user_metadata?.['nome'] as string || 'Gestor';

  // Calculate stats
  const stats = useMemo(() => {
    const totalVagas = mockVagas.length;
    const vagasUrgentes = mockVagas.filter(v => v.urgente).length;
    const totalCandidatos = mockCandidatos.length;
    const pendentesAvaliacao = mockCandidatos.filter(c => c.avaliacao === 'pendente').length;
    const entrevistasHoje = mockEntrevistas.filter(e => 
      format(e.data, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length;
    const tempoMedioContratacao = 25; // dias (mock)

    return {
      totalVagas,
      vagasUrgentes,
      totalCandidatos,
      pendentesAvaliacao,
      entrevistasHoje,
      tempoMedioContratacao,
    };
  }, []);

  const filteredCandidatos = selectedVaga === 'all' 
    ? mockCandidatos 
    : mockCandidatos.filter(c => c.vaga === selectedVaga);

  return (
    <Layout title="Portal do Gestor">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-7 w-7 text-primary" />
              Portal do Gestor
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo, {gestorNome}! Acompanhe suas vagas e candidatos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedVaga} onValueChange={setSelectedVaga}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por vaga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as vagas</SelectItem>
                {mockVagas.map(v => (
                  <SelectItem key={v.id} value={v.titulo}>{v.titulo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Minhas Vagas</p>
                  <p className="text-xl font-bold">{stats.totalVagas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.vagasUrgentes > 0 ? "border-warning/30 bg-warning/5" : ""}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">Urgentes</p>
                  <p className="text-xl font-bold">{stats.vagasUrgentes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Em Processo</p>
                  <p className="text-xl font-bold">{stats.totalCandidatos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.pendentesAvaliacao > 0 ? "border-warning/30 bg-warning/5" : ""}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                  <p className="text-xl font-bold">{stats.pendentesAvaliacao}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Entrevistas Hoje</p>
                  <p className="text-xl font-bold">{stats.entrevistasHoje}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Tempo Médio</p>
                  <p className="text-xl font-bold">{stats.tempoMedioContratacao}d</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Vagas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Minhas Vagas
                </CardTitle>
                <CardDescription>Vagas sob sua responsabilidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockVagas.map((vaga, index) => (
                  <motion.div
                    key={vaga.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      vaga.urgente 
                        ? "border-warning/30 bg-warning/5" 
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{vaga.titulo}</h4>
                          {vaga.urgente && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Urgente
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{vaga.departamento}</p>
                      </div>
                      <Badge variant="outline">
                        {vaga.diasAberta} dias aberta
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{vaga.totalCandidatos}</p>
                        <p className="text-xs text-muted-foreground">Candidatos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{vaga.emProcesso}</p>
                        <p className="text-xs text-muted-foreground">Em Processo</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{vaga.contratados}</p>
                        <p className="text-xs text-muted-foreground">Contratados</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{vaga.meta}</p>
                        <p className="text-xs text-muted-foreground">Meta</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">{vaga.contratados}/{vaga.meta}</span>
                      </div>
                      <Progress 
                        value={(vaga.contratados / vaga.meta) * 100} 
                        className="h-2"
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Candidates awaiting review */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Candidatos em Processo
                </CardTitle>
                <CardDescription>Candidatos que precisam da sua avaliação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredCandidatos.map((candidato, index) => (
                  <motion.div
                    key={candidato.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={candidato.foto} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                          {candidato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{candidato.nome}</h4>
                          <Badge 
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              candidato.matchScore >= 90 && "bg-green-100 text-green-700",
                              candidato.matchScore >= 80 && candidato.matchScore < 90 && "bg-yellow-100 text-yellow-700",
                              candidato.matchScore < 80 && "bg-orange-100 text-orange-700"
                            )}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            {candidato.matchScore}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{candidato.vaga}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {candidato.etapa}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {candidato.diasNaEtapa}d na etapa
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {candidato.avaliacao === 'pendente' ? (
                        <>
                          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                        </>
                      ) : candidato.avaliacao === 'positiva' ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Aprovado
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Reprovado</Badge>
                      )}
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Interviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas Entrevistas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockEntrevistas.map((entrevista, index) => (
                  <motion.div
                    key={entrevista.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{entrevista.candidato}</span>
                      <Badge variant="outline" className="text-xs">
                        {entrevista.tipo}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {entrevista.vaga}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(entrevista.data, "dd/MM", { locale: ptBR })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {entrevista.hora}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Progresso Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="semana" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="candidatos" 
                        stroke="#6366F1" 
                        fill="#6366F1" 
                        fillOpacity={0.3}
                        name="Candidatos"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="entrevistas" 
                        stroke="#22C55E" 
                        fill="#22C55E" 
                        fillOpacity={0.3}
                        name="Entrevistas"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Feedback
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Entrevista
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Fazer Proposta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
