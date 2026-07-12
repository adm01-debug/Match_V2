import { usePageTitle } from '@/hooks/usePageTitle';
import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Briefcase, Search, ArrowLeft } from 'lucide-react';
import { usePortalVagas } from './portalVagas/usePortalVagas';
import { VagaCard } from './portalVagas/VagaCard';
import { CandidatarDialog } from './portalVagas/CandidatarDialog';
import { VagaPublicada } from './portalVagas/types';

const PortalVagas = () => {
  usePageTitle('Portal - Vagas');
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVaga, setSelectedVaga] = useState<VagaPublicada | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { vagas, isLoading, candidatarMutation, uploadCurriculo, jaCandidatou } = usePortalVagas(searchTerm);

  const handleSubmit = async ({ carta, curriculo }: { carta: string; curriculo: File | null }) => {
    if (!selectedVaga) return;
    try {
      setUploading(true);
      const curriculoUrl = curriculo ? await uploadCurriculo(curriculo) : undefined;
      await candidatarMutation.mutateAsync({ vagaId: selectedVaga.id, carta, curriculoUrl });
      setIsDialogOpen(false);
      setSelectedVaga(null);
    } catch {
      toast.error('Erro ao fazer upload do currículo');
    } finally {
      setUploading(false);
    }
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : vagas && vagas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vagas.map((vaga) => (
                <VagaCard
                  key={vaga.id}
                  vaga={vaga}
                  jaCandidatou={jaCandidatou(vaga.id)}
                  onCandidatar={() => { setSelectedVaga(vaga); setIsDialogOpen(true); }}
                />
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

        <CandidatarDialog
          vaga={selectedVaga}
          open={isDialogOpen}
          onOpenChange={(o) => { setIsDialogOpen(o); if (!o) setSelectedVaga(null); }}
          onSubmit={handleSubmit}
          isSubmitting={candidatarMutation.isPending || uploading}
        />
      </div>
    </Suspense>
  );
};

export default PortalVagas;
