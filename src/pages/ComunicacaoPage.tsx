import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect, useMemo, useCallback } from "react";
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { HighlightMatch, getMatchIndices } from '@/components/ui/highlight-match';
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useComunicacoes } from "@/hooks/useComunicacoes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, MessageSquare, Send, Search, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const EMAIL_TEMPLATES = [
  { id: 'agendamento', nome: 'Agendamento de Entrevista', assunto: 'Agendamento de Entrevista - {{vaga}}', corpo: 'Olá {{nome}},\n\nGostaríamos de agendar uma entrevista para a vaga de {{vaga}}.\n\nData: {{data}}\nHorário: {{horario}}\nLocal: {{local}}\n\nPor favor, confirme sua disponibilidade.\n\nAtenciosamente,\nEquipe de RH' },
  { id: 'confirmacao', nome: 'Confirmação de Candidatura', assunto: 'Candidatura Recebida - {{vaga}}', corpo: 'Olá {{nome}},\n\nRecebemos sua candidatura para a vaga de {{vaga}}.\n\nAnalisaremos seu perfil e entraremos em contato em breve.\n\nAtenciosamente,\nEquipe de RH' },
  { id: 'feedback_positivo', nome: 'Feedback Positivo', assunto: 'Parabéns! Próxima Etapa - {{vaga}}', corpo: 'Olá {{nome}},\n\nParabéns! Você foi aprovado para a próxima etapa do processo seletivo para {{vaga}}.\n\nEm breve entraremos em contato com mais detalhes.\n\nAtenciosamente,\nEquipe de RH' },
  { id: 'feedback_negativo', nome: 'Feedback Negativo', assunto: 'Atualização do Processo - {{vaga}}', corpo: 'Olá {{nome}},\n\nAgradecemos seu interesse na vaga de {{vaga}}.\n\nInfelizmente, não seguiremos com sua candidatura neste momento. Manteremos seu currículo em nosso banco de talentos.\n\nDesejamos sucesso!\n\nAtenciosamente,\nEquipe de RH' },
  { id: 'proposta', nome: 'Proposta de Emprego', assunto: 'Proposta de Emprego - {{vaga}}', corpo: 'Olá {{nome}},\n\nTemos o prazer de informar que você foi selecionado para a vaga de {{vaga}}!\n\nSegue nossa proposta:\n- Salário: {{salario}}\n- Benefícios: {{beneficios}}\n- Início: {{data_inicio}}\n\nAguardamos seu retorno.\n\nAtenciosamente,\nEquipe de RH' },
];

interface ComunicacaoLocal {
  id: string;
  candidato_id: string;
  candidato?: { nome: string; email: string; foto_url?: string };
  tipo: string;
  assunto: string;
  conteudo: string;
  status: string;
  created_at: string;
}

export default function ComunicacaoPage() {
  usePageTitle('Comunicação');
  
  const [searchParams] = useSearchParams();
  const candidatoIdParam = searchParams.get('candidato');
  const { toast } = useToast();
  const { registrarComunicacao } = useComunicacoes();

  const [activeTab, setActiveTab] = useState("enviar");
  const [loading, setLoading] = useState(true);
  const [comunicacoes, setComunicacoes] = useState<ComunicacaoLocal[]>([]);
  const [candidatos, setCandidatos] = useState<{ id: string; nome: string; email: string; foto_url?: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [candidatoSelecionado, setCandidatoSelecionado] = useState<string>(candidatoIdParam || "");
  const [templateSelecionado, setTemplateSelecionado] = useState<string>("");
  const [assunto, setAssunto] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: candidatosData } = await supabase
        .from('candidatos')
        .select('id, nome, email')
        .order('nome');
      setCandidatos((candidatosData || []) as { id: string; nome: string; email: string }[]);

      const { data: comunicacoesData } = await supabase
        .from('comunicacoes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      const mapped: ComunicacaoLocal[] = (comunicacoesData || []).map(c => ({
        id: c.id,
        candidato_id: c.candidato_id,
        tipo: 'email',
        assunto: c.assunto,
        conteudo: c.conteudo,
        status: 'enviado',
        created_at: c.created_at,
      }));
      setComunicacoes(mapped);
    } catch {
      toast({ title: "Erro", description: "Erro ao carregar dados", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setTemplateSelecionado(templateId);
    const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setAssunto(template.assunto);
      setConteudo(template.corpo);
    }
  };

  const handleEnviar = async () => {
    if (!candidatoSelecionado || !assunto || !conteudo) {
      toast({ title: "Erro", description: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    setEnviando(true);
    try {
      await registrarComunicacao({
        candidato_id: candidatoSelecionado,
        assunto,
        conteudo,
      });

      toast({ title: "Sucesso", description: "Comunicação enviada" });
      setCandidatoSelecionado("");
      setTemplateSelecionado("");
      setAssunto("");
      setConteudo("");
      loadData();
      setActiveTab("historico");
    } catch {
      toast({ title: "Erro", description: "Erro ao enviar", variant: "destructive" });
    } finally {
      setEnviando(false);
    }
  };

  // Busca fuzzy com Fuse.js
  const { results: fuzzyResults, matchesMap } = useFuzzySearch(
    comunicacoes,
    [
      { name: 'assunto', weight: 2 },
      { name: 'conteudo', weight: 1 },
    ],
    searchQuery,
    { ...FUZZY_PRESETS.default }
  );

  // Função para obter índices de match
  const getComunicacaoMatchIndices = useCallback((id: string, key: string) => {
    const matches = matchesMap.get(id);
    return getMatchIndices(matches, key);
  }, [matchesMap]);

  const comunicacoesFiltradas = useMemo(() => {
    return searchQuery ? fuzzyResults : comunicacoes;
  }, [comunicacoes, fuzzyResults, searchQuery]);

  const statusStyles: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
    enviado: { icon: CheckCircle2, color: "text-green-500" },
    pendente: { icon: Clock, color: "text-amber-500" },
    erro: { icon: XCircle, color: "text-red-500" },
  };

  if (loading) {
    return (
      <Layout title="Comunicação">
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Comunicação">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Central de Comunicação</h1>
            <p className="text-muted-foreground">Envie e-mails e mensagens para candidatos</p>
          </div>
          <Button onClick={loadData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="enviar" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Nova Mensagem
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Histórico ({comunicacoes.length})
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enviar" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Nova Comunicação</CardTitle>
                <CardDescription>Envie um e-mail ou mensagem para um candidato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Candidato *</Label>
                  <Select value={candidatoSelecionado} onValueChange={setCandidatoSelecionado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o candidato" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidatos.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{c.nome.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {c.nome}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Template (opcional)</Label>
                  <Select value={templateSelecionado} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Usar template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EMAIL_TEMPLATES.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assunto *</Label>
                  <Input value={assunto} onChange={(e) => setAssunto(e.target.value)} placeholder="Assunto da mensagem" />
                </div>

                <div className="space-y-2">
                  <Label>Conteúdo *</Label>
                  <Textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} placeholder="Digite o conteúdo..." rows={8} />
                  <p className="text-xs text-muted-foreground">Use variáveis: {"{{nome}}"}, {"{{vaga}}"}</p>
                </div>

                <Button onClick={handleEnviar} disabled={enviando} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  {enviando ? "Enviando..." : "Enviar"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico" className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por assunto..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
            </div>

            <div className="space-y-3">
              {comunicacoesFiltradas.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma comunicação encontrada</CardContent></Card>
              ) : (
                comunicacoesFiltradas.map(c => {
                  const status = statusStyles[c.status] ?? statusStyles['enviado'];
                  const StatusIcon = status?.icon ?? CheckCircle2;
                  return (
                    <Card key={c.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>?</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium">
                                <HighlightMatch 
                                  text={c.assunto} 
                                  indices={getComunicacaoMatchIndices(c.id, 'assunto')} 
                                />
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{c.tipo}</Badge>
                                <StatusIcon className={cn("h-4 w-4", status?.color ?? "text-green-500")} />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              <HighlightMatch 
                                text={c.conteudo} 
                                indices={getComunicacaoMatchIndices(c.id, 'conteudo')} 
                              />
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: ptBR })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EMAIL_TEMPLATES.map(template => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.nome}</CardTitle>
                    <CardDescription>{template.assunto}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">{template.corpo}</p>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Button variant="outline" size="sm" onClick={() => { handleTemplateChange(template.id); setActiveTab("enviar"); }}>
                      Usar Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
