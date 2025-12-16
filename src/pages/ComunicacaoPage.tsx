import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { 
  Mail, 
  Plus, 
  Edit, 
  Copy, 
  Eye, 
  Search,
  FileText,
  Send,
  Variable,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { 
  emailTemplatesMock, 
  etapasProcesso, 
  variaveisDisponiveis,
  EmailTemplate 
} from "@/data/emailTemplatesData";

export default function ComunicacaoPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(emailTemplatesMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [etapaFilter, setEtapaFilter] = useState<string>("todas");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<EmailTemplate>>({});

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.assunto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEtapa = etapaFilter === "todas" || template.etapa === etapaFilter;
    return matchesSearch && matchesEtapa;
  });

  const getEtapaLabel = (etapa: string) => {
    return etapasProcesso.find(e => e.value === etapa)?.label || etapa;
  };

  const getEtapaColor = (etapa: string) => {
    const colors: Record<string, string> = {
      candidatura_recebida: "bg-blue-500/20 text-blue-400",
      triagem: "bg-purple-500/20 text-purple-400",
      convite_entrevista_rh: "bg-amber-500/20 text-amber-400",
      convite_entrevista_gestor: "bg-orange-500/20 text-orange-400",
      convite_testes: "bg-pink-500/20 text-pink-400",
      feedback_positivo: "bg-emerald-500/20 text-emerald-400",
      feedback_negativo: "bg-red-500/20 text-red-400",
      proposta: "bg-teal-500/20 text-teal-400",
      contratacao: "bg-green-500/20 text-green-400",
      banco_talentos: "bg-slate-500/20 text-slate-400",
    };
    return colors[etapa] || "bg-muted text-muted-foreground";
  };

  const handleToggleAtivo = (id: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, ativo: !t.ativo } : t
    ));
    toast.success("Status do template atualizado");
  };

  const handleDuplicar = (template: EmailTemplate) => {
    const novoTemplate: EmailTemplate = {
      ...template,
      id: String(Date.now()),
      nome: `${template.nome} (Cópia)`,
      criadoEm: new Date().toISOString().split('T')[0],
      atualizadoEm: new Date().toISOString().split('T')[0],
    };
    setTemplates(prev => [...prev, novoTemplate]);
    toast.success("Template duplicado com sucesso");
  };

  const handleSaveEdit = () => {
    if (!selectedTemplate || !editForm.nome || !editForm.assunto || !editForm.conteudo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    setTemplates(prev => prev.map(t => 
      t.id === selectedTemplate.id 
        ? { ...t, ...editForm, atualizadoEm: new Date().toISOString().split('T')[0] } 
        : t
    ));
    setIsEditing(false);
    toast.success("Template atualizado com sucesso");
  };

  const handlePreview = (template: EmailTemplate) => {
    const previewContent = template.conteudo
      .replace(/{{candidato_nome}}/g, "Maria Silva")
      .replace(/{{vaga_titulo}}/g, "Desenvolvedor Full Stack")
      .replace(/{{empresa_nome}}/g, "Promo Brindes")
      .replace(/{{data_entrevista}}/g, "20/01/2024")
      .replace(/{{hora_entrevista}}/g, "14:00")
      .replace(/{{local_entrevista}}/g, "Google Meet - link será enviado")
      .replace(/{{recrutador_nome}}/g, "Ana Costa")
      .replace(/{{prazo_testes}}/g, "3 dias")
      .replace(/{{salario_proposto}}/g, "R$ 8.000,00")
      .replace(/{{data_inicio}}/g, "01/02/2024");
    
    return previewContent;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência");
  };

  // Stats
  const totalTemplates = templates.length;
  const templatesAtivos = templates.filter(t => t.ativo).length;
  const etapasCobertas = new Set(templates.map(t => t.etapa)).size;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Comunicação</h1>
            <p className="text-muted-foreground">Gerencie templates de email para cada etapa do processo</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Template</DialogTitle>
                <DialogDescription>Configure um novo template de email</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Template</Label>
                    <Input placeholder="Ex: Convite Entrevista" />
                  </div>
                  <div className="space-y-2">
                    <Label>Etapa do Processo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {etapasProcesso.map(etapa => (
                          <SelectItem key={etapa.value} value={etapa.value}>
                            {etapa.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assunto do Email</Label>
                  <Input placeholder="Ex: Convite para Entrevista - {{vaga_titulo}}" />
                </div>
                <div className="space-y-2">
                  <Label>Conteúdo</Label>
                  <Textarea 
                    placeholder="Digite o conteúdo do email..."
                    className="min-h-[200px]"
                  />
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-2">Variáveis disponíveis:</p>
                  <div className="flex flex-wrap gap-2">
                    {variaveisDisponiveis.slice(0, 6).map(v => (
                      <Badge 
                        key={v.nome} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => copyToClipboard(v.nome)}
                      >
                        {v.nome}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button onClick={() => toast.success("Template criado!")}>Criar Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalTemplates}</p>
                <p className="text-sm text-muted-foreground">Templates</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{templatesAtivos}</p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/20">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{etapasCobertas}/{etapasProcesso.length}</p>
                <p className="text-sm text-muted-foreground">Etapas Cobertas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Send className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">--</p>
                <p className="text-sm text-muted-foreground">Enviados (mês)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="variaveis">Variáveis</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={etapaFilter} onValueChange={setEtapaFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filtrar por etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as etapas</SelectItem>
                      {etapasProcesso.map(etapa => (
                        <SelectItem key={etapa.value} value={etapa.value}>
                          {etapa.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Templates Grid */}
            <div className="grid gap-4">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="h-5 w-5 text-primary shrink-0" />
                          <h3 className="font-semibold truncate">{template.nome}</h3>
                          <Badge className={getEtapaColor(template.etapa)}>
                            {getEtapaLabel(template.etapa)}
                          </Badge>
                          {!template.ativo && (
                            <Badge variant="outline" className="text-muted-foreground">
                              Inativo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 truncate">
                          <span className="font-medium">Assunto:</span> {template.assunto}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.variaveis.slice(0, 4).map(v => (
                            <Badge key={v} variant="outline" className="text-xs">
                              {`{{${v}}}`}
                            </Badge>
                          ))}
                          {template.variaveis.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.variaveis.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={template.ativo}
                            onCheckedChange={() => handleToggleAtivo(template.id)}
                          />
                        </div>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => setSelectedTemplate(template)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Preview do Template</SheetTitle>
                              <SheetDescription>
                                Visualização com dados de exemplo
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-4">
                              <div className="bg-muted/30 p-4 rounded-lg border">
                                <p className="text-sm text-muted-foreground mb-1">Assunto:</p>
                                <p className="font-medium">
                                  {template.assunto
                                    .replace(/{{candidato_nome}}/g, "Maria Silva")
                                    .replace(/{{vaga_titulo}}/g, "Desenvolvedor Full Stack")
                                    .replace(/{{empresa_nome}}/g, "Promo Brindes")}
                                </p>
                              </div>
                              <div className="bg-muted/30 p-4 rounded-lg border">
                                <p className="text-sm text-muted-foreground mb-2">Conteúdo:</p>
                                <pre className="whitespace-pre-wrap text-sm font-sans">
                                  {handlePreview(template)}
                                </pre>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => copyToClipboard(handlePreview(template))}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copiar
                                </Button>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => {
                                setSelectedTemplate(template);
                                setEditForm(template);
                                setIsEditing(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Editar Template</SheetTitle>
                              <SheetDescription>
                                Modifique o conteúdo do template
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-4">
                              <div className="space-y-2">
                                <Label>Nome</Label>
                                <Input 
                                  value={editForm.nome || ""}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, nome: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Etapa</Label>
                                <Select 
                                  value={editForm.etapa}
                                  onValueChange={(v) => setEditForm(prev => ({ ...prev, etapa: v }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {etapasProcesso.map(etapa => (
                                      <SelectItem key={etapa.value} value={etapa.value}>
                                        {etapa.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Assunto</Label>
                                <Input 
                                  value={editForm.assunto || ""}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, assunto: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Conteúdo</Label>
                                <Textarea 
                                  value={editForm.conteudo || ""}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, conteudo: e.target.value }))}
                                  className="min-h-[300px]"
                                />
                              </div>
                              <Button className="w-full" onClick={handleSaveEdit}>
                                Salvar Alterações
                              </Button>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDuplicar(template)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="variaveis">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Variable className="h-5 w-5" />
                  Variáveis Disponíveis
                </CardTitle>
                <CardDescription>
                  Use estas variáveis nos templates para personalização automática
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {variaveisDisponiveis.map(variavel => (
                    <div 
                      key={variavel.nome}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <code className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-mono">
                          {variavel.nome}
                        </code>
                        <span className="text-sm text-muted-foreground">
                          {variavel.descricao}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(variavel.nome)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
