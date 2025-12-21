import { usePageTitle } from '@/hooks/usePageTitle';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCandidatoAuth } from '@/contexts/CandidatoAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  LogOut, 
  User, 
  FileText,
  Search,
  Calendar,
  Building2,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const etapasOrdem = ['inscricao', 'triagem', 'entrevista_rh', 'teste_tecnico', 'entrevista_gestor', 'proposta', 'contratado'];

const etapasLabels: Record<string, string> = {
  inscricao: 'Inscrição',
  triagem: 'Triagem',
  entrevista_rh: 'Entrevista RH',
  teste_tecnico: 'Teste Técnico',
  entrevista_gestor: 'Entrevista Gestor',
  proposta: 'Proposta',
  contratado: 'Contratado'
};

const statusColors: Record<string, string> = {
  pendente: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  em_andamento: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  aprovado: 'bg-green-500/10 text-green-600 border-green-500/20',
  reprovado: 'bg-red-500/10 text-red-600 border-red-500/20',
  desistencia: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
};

const PortalDashboard = () => {
  usePageTitle('Portal - Dashboard');

  const navigate = useNavigate();
  const { profile, signOut, loading: authLoading } = useCandidatoAuth();

  // Fetch candidaturas
  const { data: candidaturas, isLoading: candidaturasLoading } = useQuery({
    queryKey: ['candidaturas', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('candidaturas')
        .select(`
          *,
          vagas:vaga_id (
            id,
            titulo,
            departamento,
            modalidade,
            cidade,
            estado,
            tipo_contrato
          )
        `)
        .eq('candidato_auth_id', profile.id)
        .order('data_candidatura', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id
  });

  // Fetch available jobs
  const { data: vagasDisponiveis } = useQuery({
    queryKey: ['vagas-publicadas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vagas')
        .select('*')
        .eq('status', 'publicada')
        .order('data_publicacao', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/portal');
  };

  const getEtapaProgress = (etapa: string) => {
    const index = etapasOrdem.indexOf(etapa);
    return ((index + 1) / etapasOrdem.length) * 100;
  };

  const stats = {
    total: candidaturas?.length || 0,
    emAndamento: candidaturas?.filter(c => c.status === 'em_andamento' || c.status === 'pendente').length || 0,
    aprovadas: candidaturas?.filter(c => c.status === 'aprovado').length || 0,
    reprovadas: candidaturas?.filter(c => c.status === 'reprovado').length || 0
  };

  if (authLoading || candidaturasLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Portal do Candidato</h1>
              <p className="text-sm text-muted-foreground">Olá, {profile?.nome}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/portal/perfil')}>
              <User className="h-4 w-4 mr-2" />
              Meu Perfil
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total de Candidaturas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.emAndamento}</p>
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.aprovadas}</p>
                  <p className="text-sm text-muted-foreground">Aprovadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.reprovadas}</p>
                  <p className="text-sm text-muted-foreground">Não Selecionadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Minhas Candidaturas */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Minhas Candidaturas</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/portal/vagas')}>
                <Search className="h-4 w-4 mr-2" />
                Buscar Vagas
              </Button>
            </div>

            {candidaturas && candidaturas.length > 0 ? (
              <div className="space-y-4">
                {candidaturas.map((candidatura: any) => (
                  <Card key={candidatura.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {candidatura.vagas?.titulo || 'Vaga'}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {candidatura.vagas?.departamento}
                                </span>
                                {candidatura.vagas?.cidade && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {candidatura.vagas?.cidade}, {candidatura.vagas?.estado}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={statusColors[candidatura.status]}>
                                  {candidatura.status === 'pendente' ? 'Pendente' : 
                                   candidatura.status === 'em_andamento' ? 'Em Andamento' :
                                   candidatura.status === 'aprovado' ? 'Aprovado' :
                                   candidatura.status === 'reprovado' ? 'Não Selecionado' : candidatura.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(candidatura.data_candidatura), "dd 'de' MMMM", { locale: ptBR })}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                Etapa: {etapasLabels[candidatura.etapa_atual] || candidatura.etapa_atual}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {Math.round(getEtapaProgress(candidatura.etapa_atual))}%
                              </span>
                            </div>
                            <Progress value={getEtapaProgress(candidatura.etapa_atual)} className="h-2" />
                            <div className="flex justify-between mt-2">
                              {etapasOrdem.slice(0, 5).map((etapa, index) => (
                                <div 
                                  key={etapa}
                                  className={`text-[10px] ${
                                    etapasOrdem.indexOf(candidatura.etapa_atual) >= index 
                                      ? 'text-primary font-medium' 
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  {etapasLabels[etapa]}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Nenhuma candidatura ainda</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore as vagas disponíveis e candidate-se!
                  </p>
                  <Button onClick={() => navigate('/portal/vagas')}>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar Vagas
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Vagas Recentes */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Vagas Recentes</h2>
            
            {vagasDisponiveis && vagasDisponiveis.length > 0 ? (
              <div className="space-y-3">
                {vagasDisponiveis.map((vaga: any) => (
                  <Card key={vaga.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/portal/vagas/${vaga.id}`)}>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">{vaga.titulo}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{vaga.departamento}</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {vaga.modalidade}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {vaga.tipo_contrato}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button variant="outline" className="w-full" onClick={() => navigate('/portal/vagas')}>
                  Ver todas as vagas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Nenhuma vaga disponível no momento</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortalDashboard;
