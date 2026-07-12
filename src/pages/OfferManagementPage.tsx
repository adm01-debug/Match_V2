import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Layout } from '@/components/layout/Layout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { 
  FileText, Send, Clock, CheckCircle2, XCircle, 
  Download, Eye, Plus, FileSignature, Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { OfferStats } from '@/components/offers/OfferStats';
import { OfferFilters } from '@/components/offers/OfferFilters';
import { OfferCard, type Offer } from '@/components/offers/OfferCard';
import { CreateOfferDialog } from '@/components/offers/CreateOfferDialog';

const mockOffers: Offer[] = [
  { id: '1', candidatoNome: 'Ana Carolina Silva', candidatoEmail: 'ana.silva@email.com', vagaTitulo: 'Desenvolvedor Full Stack Senior', salario: 18000, dataInicio: new Date('2024-02-01'), beneficios: ['VR', 'VT', 'Plano de Saúde', 'PLR'], status: 'enviada', criadaEm: new Date(), expiracaoEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  { id: '2', candidatoNome: 'Pedro Henrique Santos', candidatoEmail: 'pedro.santos@email.com', vagaTitulo: 'Product Manager', salario: 22000, dataInicio: new Date('2024-02-15'), beneficios: ['VR', 'VT', 'Plano de Saúde', 'Stock Options'], status: 'aceita', criadaEm: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), assinadaEm: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: '3', candidatoNome: 'Marina Costa', candidatoEmail: 'marina.costa@email.com', vagaTitulo: 'UX Designer', salario: 12000, dataInicio: new Date('2024-02-10'), beneficios: ['VR', 'VT', 'Plano de Saúde'], status: 'visualizada', criadaEm: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), expiracaoEm: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) },
];

const templates = [
  { id: '1', nome: 'Proposta Padrão CLT', descricao: 'Template padrão para contratações CLT', conteudo: '...', campos: ['salario', 'cargo', 'dataInicio', 'beneficios'] },
  { id: '2', nome: 'Proposta Executiva', descricao: 'Para posições de liderança e executivas', conteudo: '...', campos: ['salario', 'cargo', 'bonus', 'stockOptions', 'dataInicio'] },
  { id: '3', nome: 'Proposta Tech', descricao: 'Focada em benefícios tech e flexibilidade', conteudo: '...', campos: ['salario', 'cargo', 'remoto', 'equipamentos', 'dataInicio'] },
];

const statusConfig = {
  rascunho: { label: 'Rascunho', color: 'bg-muted-foreground', icon: FileText },
  enviada: { label: 'Enviada', color: 'bg-info', icon: Send },
  visualizada: { label: 'Visualizada', color: 'bg-warning', icon: Eye },
  aceita: { label: 'Aceita', color: 'bg-success', icon: CheckCircle2 },
  recusada: { label: 'Recusada', color: 'bg-destructive', icon: XCircle },
  expirada: { label: 'Expirada', color: 'bg-warning', icon: Clock },
};

export default function OfferManagementPage() {
  usePageTitle('Gestão de Propostas');
  const [offers] = useState<Offer[]>(mockOffers);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newOffer, setNewOffer] = useState({ candidatoNome: '', candidatoEmail: '', vagaTitulo: '', salario: '', dataInicio: '', beneficios: [] as string[], template: '' });

  const { results: fuzzyResults } = useFuzzySearch(offers, [{ name: 'candidatoNome', weight: 2 }, { name: 'vagaTitulo', weight: 1.5 }, { name: 'candidatoEmail', weight: 1 }], searchTerm, { ...FUZZY_PRESETS.default });

  const filteredOffers = (searchTerm ? fuzzyResults : offers).filter(o => statusFilter === 'all' || o.status === statusFilter);

  const stats = {
    total: offers.length,
    pendentes: offers.filter(o => ['enviada', 'visualizada'].includes(o.status)).length,
    aceitas: offers.filter(o => o.status === 'aceita').length,
    taxaAceitacao: offers.length > 0 ? ((offers.filter(o => o.status === 'aceita').length / offers.length) * 100).toFixed(0) : 0,
  };

  const handleCreateOffer = () => {
    toast.success('Proposta criada com sucesso!');
    setIsCreateOpen(false);
    setNewOffer({ candidatoNome: '', candidatoEmail: '', vagaTitulo: '', salario: '', dataInicio: '', beneficios: [], template: '' });
  };

  return (
    <Layout title="Gestão de Propostas">
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><FileSignature className="h-7 w-7 text-primary" />Gestão de Propostas</h1>
            <p className="text-muted-foreground">Crie, envie e acompanhe propostas de emprego</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-to-r from-primary to-accent"><Plus className="h-4 w-4 mr-2" />Nova Proposta</Button>
        </div>

        <OfferStats stats={stats} />
        <OfferFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} statusConfig={statusConfig} />

        <Tabs defaultValue="lista">
          <TabsList><TabsTrigger value="lista">Lista</TabsTrigger><TabsTrigger value="templates">Templates</TabsTrigger></TabsList>
          <TabsContent value="lista" className="space-y-4 mt-4">
            <AnimatePresence>
              {filteredOffers.map((offer, i) => (
                <OfferCard key={offer.id} offer={offer} index={i} statusConfig={statusConfig} onSelect={setSelectedOffer} onSend={(o) => toast.success(`Enviada para ${o.candidatoEmail}`)} />
              ))}
            </AnimatePresence>
            {filteredOffers.length === 0 && <div className="text-center py-12"><FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" /><h3 className="text-lg font-medium mb-2">Nenhuma proposta encontrada</h3><Button onClick={() => setIsCreateOpen(true)} className="mt-4"><Plus className="h-4 w-4 mr-2" />Nova Proposta</Button></div>}
          </TabsContent>
          <TabsContent value="templates" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template, index) => (
                <motion.div key={template.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                  <Card className="hover:shadow-md transition-all cursor-pointer group">
                    <CardHeader><CardTitle className="flex items-center justify-between"><span>{template.nome}</span><Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100"><Copy className="h-4 w-4" /></Button></CardTitle><CardDescription>{template.descricao}</CardDescription></CardHeader>
                    <CardContent><div className="flex flex-wrap gap-2">{template.campos.map(c => <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>)}</div><Button variant="outline" className="w-full mt-4">Usar Template</Button></CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <CreateOfferDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} newOffer={newOffer} setNewOffer={setNewOffer} templates={templates} onCreate={handleCreateOffer} />

        <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader><DialogTitle>Detalhes da Proposta</DialogTitle></DialogHeader>
            {selectedOffer && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white", statusConfig[selectedOffer.status].color)}>
                      {(() => { const Icon = statusConfig[selectedOffer.status].icon; return <Icon className="h-6 w-6" />; })()}
                    </div>
                    <div><h3 className="font-bold text-lg">{selectedOffer.candidatoNome}</h3><p className="text-sm text-muted-foreground">{selectedOffer.vagaTitulo}</p></div>
                  </div>
                  <Badge className={statusConfig[selectedOffer.status].color}>{statusConfig[selectedOffer.status].label}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold border-b pb-2">Informações Financeiras</h4>
                    <div className="space-y-2"><div className="flex justify-between"><span className="text-muted-foreground">Salário Base:</span><span className="font-medium">R$ {selectedOffer.salario.toLocaleString()}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Data de Início:</span><span className="font-medium">{format(selectedOffer.dataInicio, "dd/MM/yyyy")}</span></div></div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold border-b pb-2">Benefícios</h4>
                    <div className="flex flex-wrap gap-2">{selectedOffer.beneficios.map((b: string) => <Badge key={b} variant="secondary">{b}</Badge>)}</div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter><Button variant="outline" onClick={() => setSelectedOffer(null)}>Fechar</Button><Button><Download className="h-4 w-4 mr-2" />Baixar PDF</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
