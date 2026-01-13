/**
 * @fileoverview Offer Management Page - Gestão de Propostas
 * @module OfferManagementPage
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Layout } from '@/components/layout/Layout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { 
  FileText, Send, Clock, CheckCircle2, XCircle, 
  PenTool, Download, Eye, Plus, Search, Filter,
  DollarSign, Calendar, Briefcase, User, Mail,
  FileSignature, Sparkles, Copy, MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Offer {
  id: string;
  candidatoNome: string;
  candidatoEmail: string;
  vagaTitulo: string;
  salario: number;
  dataInicio: Date;
  beneficios: string[];
  status: 'rascunho' | 'enviada' | 'visualizada' | 'aceita' | 'recusada' | 'expirada';
  criadaEm: Date;
  expiracaoEm?: Date;
  assinadaEm?: Date;
}

interface OfferTemplate {
  id: string;
  nome: string;
  descricao: string;
  conteudo: string;
  campos: string[];
}

const mockOffers: Offer[] = [
  {
    id: '1',
    candidatoNome: 'Ana Carolina Silva',
    candidatoEmail: 'ana.silva@email.com',
    vagaTitulo: 'Desenvolvedor Full Stack Senior',
    salario: 18000,
    dataInicio: new Date('2024-02-01'),
    beneficios: ['VR', 'VT', 'Plano de Saúde', 'PLR'],
    status: 'enviada',
    criadaEm: new Date(),
    expiracaoEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    candidatoNome: 'Pedro Henrique Santos',
    candidatoEmail: 'pedro.santos@email.com',
    vagaTitulo: 'Product Manager',
    salario: 22000,
    dataInicio: new Date('2024-02-15'),
    beneficios: ['VR', 'VT', 'Plano de Saúde', 'Stock Options'],
    status: 'aceita',
    criadaEm: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    assinadaEm: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    candidatoNome: 'Marina Costa',
    candidatoEmail: 'marina.costa@email.com',
    vagaTitulo: 'UX Designer',
    salario: 12000,
    dataInicio: new Date('2024-02-10'),
    beneficios: ['VR', 'VT', 'Plano de Saúde'],
    status: 'visualizada',
    criadaEm: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    expiracaoEm: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
  },
];

const templates: OfferTemplate[] = [
  {
    id: '1',
    nome: 'Proposta Padrão CLT',
    descricao: 'Template padrão para contratações CLT',
    conteudo: 'Prezado(a) {{candidato}}, temos o prazer de formalizar nossa proposta...',
    campos: ['salario', 'cargo', 'dataInicio', 'beneficios'],
  },
  {
    id: '2',
    nome: 'Proposta Executiva',
    descricao: 'Para posições de liderança e executivas',
    conteudo: 'Caro(a) {{candidato}}, é com grande satisfação que apresentamos...',
    campos: ['salario', 'cargo', 'bonus', 'stockOptions', 'dataInicio'],
  },
  {
    id: '3',
    nome: 'Proposta Tech',
    descricao: 'Focada em benefícios tech e flexibilidade',
    conteudo: 'Olá {{candidato}}! Queremos você no nosso time...',
    campos: ['salario', 'cargo', 'remoto', 'equipamentos', 'dataInicio'],
  },
];

const statusConfig = {
  rascunho: { label: 'Rascunho', color: 'bg-gray-500', icon: FileText },
  enviada: { label: 'Enviada', color: 'bg-blue-500', icon: Send },
  visualizada: { label: 'Visualizada', color: 'bg-yellow-500', icon: Eye },
  aceita: { label: 'Aceita', color: 'bg-green-500', icon: CheckCircle2 },
  recusada: { label: 'Recusada', color: 'bg-red-500', icon: XCircle },
  expirada: { label: 'Expirada', color: 'bg-orange-500', icon: Clock },
};

export default function OfferManagementPage() {
  usePageTitle('Gestão de Propostas');
  
  const [offers] = useState<Offer[]>(mockOffers);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New offer form state
  const [newOffer, setNewOffer] = useState({
    candidatoNome: '',
    candidatoEmail: '',
    vagaTitulo: '',
    salario: '',
    dataInicio: '',
    beneficios: [] as string[],
    template: '',
  });

  // Busca fuzzy com Fuse.js
  const { results: fuzzyResults } = useFuzzySearch(
    offers,
    [
      { name: 'candidatoNome', weight: 2 },
      { name: 'vagaTitulo', weight: 1.5 },
      { name: 'candidatoEmail', weight: 1 },
    ],
    searchTerm,
    { ...FUZZY_PRESETS.default }
  );

  const filteredOffers = (searchTerm ? fuzzyResults : offers).filter(offer => {
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
    return matchesStatus;
  });

  const stats = {
    total: offers.length,
    pendentes: offers.filter(o => ['enviada', 'visualizada'].includes(o.status)).length,
    aceitas: offers.filter(o => o.status === 'aceita').length,
    taxaAceitacao: offers.length > 0 
      ? ((offers.filter(o => o.status === 'aceita').length / offers.length) * 100).toFixed(0)
      : 0,
  };

  const handleCreateOffer = () => {
    toast.success('Proposta criada com sucesso!');
    setIsCreateOpen(false);
    // Reset form
    setNewOffer({
      candidatoNome: '',
      candidatoEmail: '',
      vagaTitulo: '',
      salario: '',
      dataInicio: '',
      beneficios: [],
      template: '',
    });
  };

  const handleSendOffer = (offer: Offer) => {
    toast.success(`Proposta enviada para ${offer.candidatoEmail}`);
  };

  return (
    <Layout title="Gestão de Propostas">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileSignature className="h-7 w-7 text-primary" />
              Gestão de Propostas
            </h1>
            <p className="text-muted-foreground">
              Crie, envie e acompanhe propostas de emprego
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-gradient-to-r from-primary to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Proposta
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pendentes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aceitas</p>
                  <p className="text-2xl font-bold">{stats.aceitas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa Aceitação</p>
                  <p className="text-2xl font-bold">{stats.taxaAceitacao}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por candidato ou vaga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Offers List */}
        <Tabs defaultValue="lista">
          <TabsList>
            <TabsTrigger value="lista">Lista</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="space-y-4 mt-4">
            <AnimatePresence>
              {filteredOffers.map((offer, index) => {
                const config = statusConfig[offer.status];
                const StatusIcon = config.icon;
                
                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                              config.color
                            )}>
                              <StatusIcon className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{offer.candidatoNome}</h3>
                                <Badge variant="outline" className={cn(
                                  "text-xs",
                                  offer.status === 'aceita' && "bg-green-100 text-green-700 border-green-200",
                                  offer.status === 'recusada' && "bg-red-100 text-red-700 border-red-200"
                                )}>
                                  {config.label}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                {offer.vagaTitulo}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {offer.candidatoEmail}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  R$ {offer.salario.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Início: {format(offer.dataInicio, "dd/MM/yyyy")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOffer(offer)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Visualizar
                            </Button>
                            {offer.status === 'rascunho' && (
                              <Button 
                                size="sm"
                                onClick={() => handleSendOffer(offer)}
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Enviar
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Criada em {format(offer.criadaEm, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                            {offer.expiracaoEm && (
                              <>
                                <span>•</span>
                                <span>Expira em {format(offer.expiracaoEm, "dd/MM/yyyy")}</span>
                              </>
                            )}
                            {offer.assinadaEm && (
                              <>
                                <span>•</span>
                                <span className="text-green-600">
                                  Assinada em {format(offer.assinadaEm, "dd/MM/yyyy")}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredOffers.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma proposta encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Crie uma nova proposta para começar
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Proposta
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-all cursor-pointer group">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{template.nome}</span>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                      <CardDescription>{template.descricao}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {template.campos.map((campo) => (
                          <Badge key={campo} variant="secondary" className="text-xs">
                            {campo}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        <PenTool className="h-4 w-4 mr-2" />
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <Card className="border-dashed flex items-center justify-center min-h-[200px]">
                <Button variant="ghost" className="flex-col h-auto py-8">
                  <Plus className="h-8 w-8 mb-2" />
                  <span>Criar Template</span>
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Offer Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Proposta de Emprego</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Candidato</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Nome do candidato"
                      className="pl-10"
                      value={newOffer.candidatoNome}
                      onChange={(e) => setNewOffer({...newOffer, candidatoNome: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="email"
                      placeholder="email@exemplo.com"
                      className="pl-10"
                      value={newOffer.candidatoEmail}
                      onChange={(e) => setNewOffer({...newOffer, candidatoEmail: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Vaga</Label>
                <Select 
                  value={newOffer.vagaTitulo}
                  onValueChange={(v) => setNewOffer({...newOffer, vagaTitulo: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a vaga" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev-senior">Desenvolvedor Full Stack Senior</SelectItem>
                    <SelectItem value="pm">Product Manager</SelectItem>
                    <SelectItem value="ux">UX Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salário (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="number"
                      placeholder="15000"
                      className="pl-10"
                      value={newOffer.salario}
                      onChange={(e) => setNewOffer({...newOffer, salario: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="date"
                      className="pl-10"
                      value={newOffer.dataInicio}
                      onChange={(e) => setNewOffer({...newOffer, dataInicio: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Template</Label>
                <Select 
                  value={newOffer.template}
                  onValueChange={(v) => setNewOffer({...newOffer, template: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea 
                  placeholder="Adicione observações ou personalizações..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateOffer}>
                <FileSignature className="h-4 w-4 mr-2" />
                Criar Proposta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Offer Dialog */}
        <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Proposta</DialogTitle>
            </DialogHeader>
            
            {selectedOffer && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedOffer.candidatoNome}</h3>
                    <p className="text-muted-foreground">{selectedOffer.vagaTitulo}</p>
                  </div>
                  <Badge className={cn(
                    statusConfig[selectedOffer.status].color,
                    "text-white"
                  )}>
                    {statusConfig[selectedOffer.status].label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">Salário</p>
                    <p className="text-xl font-bold">
                      R$ {selectedOffer.salario.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">Data de Início</p>
                    <p className="text-xl font-bold">
                      {format(selectedOffer.dataInicio, "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-2">Benefícios</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffer.beneficios.map((b) => (
                      <Badge key={b} variant="secondary">{b}</Badge>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PDF
                  </Button>
                  {selectedOffer.status === 'rascunho' && (
                    <Button onClick={() => handleSendOffer(selectedOffer)}>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Proposta
                    </Button>
                  )}
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
