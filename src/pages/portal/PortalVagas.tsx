import { usePageTitle } from '@/hooks/usePageTitle';
import { Suspense, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCandidatoAuth } from '@/contexts/CandidatoAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign,
  ArrowLeft,
  Send,
  CheckCircle2,
  Upload,
  FileText,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const modalidadeLabels: Record<string, string> = {
  presencial: 'Presencial',
  hibrido: 'Híbrido',
  remoto: 'Remoto'
};

const contratoLabels: Record<string, string> = {
  clt: 'CLT',
  pj: 'PJ',
  estagio: 'Estágio',
  temporario: 'Temporário'
};

interface VagaPublicada {
  id: string;
  titulo: string;
  departamento: string;
  cidade: string | null;
  estado: string | null;
  modalidade: string;
  tipo_contrato: string;
  descricao?: string | null;
  salario_min: number | null;
  salario_max: number | null;
  salario_a_combinar?: boolean;
  data_publicacao: string | null;
  [key: string]: unknown;
}

const PortalVagas = () => {
  usePageTitle('Portal - Vagas');

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile } = useCandidatoAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVaga, setSelectedVaga] = useState<VagaPublicada | null>(null);
  const [cartaApresentacao, setCartaApresentacao] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: vagas, isLoading } = useQuery({
    queryKey: ['vagas-publicadas', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('vagas')
        .select('*')
        .eq('status', 'publicada')
        .order('data_publicacao', { ascending: false });
      
      if (searchTerm) {
        query = query.or(`titulo.ilike.%${searchTerm}%,departamento.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const { data: candidaturasExistentes } = useQuery({
    queryKey: ['minhas-candidaturas-ids', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('candidaturas')
        .select('vaga_id')
        .eq('candidato_auth_id', profile.id);
      
      if (error) throw error;
      return data?.map(c => c.vaga_id) || [];
    },
    enabled: !!profile?.id
  });

  const candidatarMutation = useMutation({
    mutationFn: async ({ vagaId, carta, curriculoUrl }: { vagaId: string; carta: string; curriculoUrl?: string }) => {
      if (!profile?.id) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('candidaturas')
        .insert({
          candidato_auth_id: profile.id,
          vaga_id: vagaId,
          carta_apresentacao: carta,
          curriculo_url: curriculoUrl || null,
          status: 'pendente',
          etapa_atual: 'inscricao'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Candidatura enviada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['minhas-candidaturas-ids'] });
      queryClient.invalidateQueries({ queryKey: ['candidaturas'] });
      setIsDialogOpen(false);
      setCartaApresentacao('');
      setCurriculo(null);
      setSelectedVaga(null);
    },
    onError: (error: Error) => {
      toast.error('Erro ao enviar candidatura', { description: error.message });
    }
  });

  const uploadCurriculo = async (file: File): Promise<string | undefined> => {
    if (!profile?.user_id) return undefined;
    const ext = file.name.split('.').pop();
    const path = `${profile.user_id}/${Date.now()}.${ext}`;
    
    const { error } = await supabase.storage
      .from('curriculos')
      .upload(path, file, { upsert: true });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('curriculos')
      .getPublicUrl(path);
    
    return publicUrl;
  };

  const handleCandidatar = async () => {
    if (!selectedVaga) return;
    
    try {
      setUploading(true);
      let curriculoUrl: string | undefined;
      
      if (curriculo) {
        curriculoUrl = await uploadCurriculo(curriculo);
      }
      
      candidatarMutation.mutate({ vagaId: selectedVaga.id, carta: cartaApresentacao, curriculoUrl });
    } catch (err) {
      toast.error('Erro ao fazer upload do currículo');
    } finally {
      setUploading(false);
    }
  };

  const jaCandidatou = (vagaId: string) => {
    return candidaturasExistentes?.includes(vagaId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato inválido. Envie PDF ou DOC/DOCX.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 5MB.');
      return;
    }
    setCurriculo(file);
  };

  return (
    <Suspense fallback={<div className="animate-pulse">Carregando...</div>}>
      <div role="main" className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/portal/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">Vagas Disponíveis</h1>
              <p className="text-sm text-muted-foreground">Encontre sua próxima oportunidade</p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por cargo ou departamento..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : vagas && vagas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vagas.map((vaga: VagaPublicada) => (
                <Card key={vaga.id} className="hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{vaga.titulo}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {vaga.departamento}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {modalidadeLabels[vaga.modalidade] || vaga.modalidade}
                      </Badge>
                      <Badge variant="secondary">
                        {contratoLabels[vaga.tipo_contrato] || vaga.tipo_contrato}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {vaga.cidade && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {vaga.cidade}, {vaga.estado}
                        </p>
                      )}
                      {!vaga.salario_a_combinar && vaga.salario_min && (
                        <p className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          R$ {vaga.salario_min.toLocaleString()} - R$ {vaga.salario_max?.toLocaleString()}
                        </p>
                      )}
                      {vaga.data_publicacao && (
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Publicada em {format(new Date(vaga.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      )}
                    </div>
                    
                    {jaCandidatou(vaga.id) ? (
                      <Button disabled className="w-full" variant="secondary">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Já candidatado
                      </Button>
                    ) : (
                      <Dialog open={isDialogOpen && selectedVaga?.id === vaga.id} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (open) setSelectedVaga(vaga);
                        else { setSelectedVaga(null); setCurriculo(null); }
                      }}>
                        <DialogTrigger asChild>
                          <Button className="w-full">
                            <Send className="h-4 w-4 mr-2" />
                            Candidatar-se
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Candidatar-se para {vaga.titulo}</DialogTitle>
                            <DialogDescription>
                              Envie sua candidatura para esta vaga. Uma carta de apresentação ajuda a destacar seu perfil.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                              <h4 className="font-medium mb-1">{vaga.titulo}</h4>
                              <p className="text-sm text-muted-foreground">{vaga.departamento}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {modalidadeLabels[vaga.modalidade]}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {contratoLabels[vaga.tipo_contrato]}
                                </Badge>
                              </div>
                            </div>

                            {/* Resume Upload */}
                            <div className="space-y-2">
                              <Label className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                Currículo (PDF ou DOC, máx 5MB)
                              </Label>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              {curriculo ? (
                                <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                                  <span className="text-sm flex-1 truncate">{curriculo.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {(curriculo.size / 1024).toFixed(0)}KB
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => setCurriculo(null)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Anexar Currículo
                                </Button>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Carta de Apresentação (opcional)</Label>
                              <Textarea
                                placeholder="Escreva uma breve apresentação sobre você e por que você é ideal para esta vaga..."
                                rows={5}
                                value={cartaApresentacao}
                                onChange={(e) => setCartaApresentacao(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button 
                              onClick={handleCandidatar}
                              disabled={candidatarMutation.isPending || uploading}
                            >
                              {(candidatarMutation.isPending || uploading) ? 'Enviando...' : 'Enviar Candidatura'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma vaga encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente buscar por outros termos' : 'Não há vagas publicadas no momento'}
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </Suspense>
  );
};

export default PortalVagas;
