import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft, CheckCircle2, MapPin, Building2, Briefcase, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { KnockoutQuestionsForm } from '@/components/carreiras/KnockoutQuestionsForm';
import { evaluateKnockouts, type KnockoutAnswer, type KnockoutQuestion } from '@/types/knockout';

interface Vaga {
  id: string;
  titulo: string;
  departamento: string | null;
  cidade: string | null;
  estado: string | null;
  modalidade: string | null;
  tipo_contrato: string | null;
  descricao_empresa: string | null;
  responsabilidades: string | null;
  requisitos_obrigatorios: string | null;
  perguntas_triagem: KnockoutQuestion[] | null;
  status: string;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AplicarVagaPage() {
  const { vagaId = '' } = useParams<{ vagaId: string }>();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [carta, setCarta] = useState('');
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [knockoutAnswers, setKnockoutAnswers] = useState<Record<string, KnockoutAnswer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<null | { magic: boolean; msg: string }>(null);
  const [rejected, setRejected] = useState<string | null>(null);

  const { data: vaga, isLoading } = useQuery({
    queryKey: ['aplicar-vaga', vagaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vagas')
        .select('id,titulo,departamento,cidade,estado,modalidade,tipo_contrato,descricao_empresa,responsabilidades,requisitos_obrigatorios,perguntas_triagem,status')
        .eq('id', vagaId)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as Vaga | null;
    },
    enabled: !!vagaId,
  });

  const knockoutQuestions: KnockoutQuestion[] = Array.isArray(vaga?.perguntas_triagem)
    ? (vaga!.perguntas_triagem as KnockoutQuestion[])
    : [];

  useEffect(() => {
    if (vaga) document.title = `Candidatar-se: ${vaga.titulo}`;
  }, [vaga]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!nome.trim() || !email.trim()) {
      toast.error('Nome e email são obrigatórios');
      return;
    }
    if (curriculo && curriculo.size > 4_000_000) {
      toast.error('Currículo deve ter no máximo 4MB');
      return;
    }

    setSubmitting(true);
    try {
      const curriculo_base64 = curriculo ? await fileToBase64(curriculo) : undefined;
      const { data, error } = await supabase.functions.invoke('public-apply', {
        body: {
          vaga_id: vagaId,
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          telefone: telefone.trim() || undefined,
          linkedin_url: linkedin.trim() || undefined,
          carta_apresentacao: carta.trim() || undefined,
          curriculo_base64,
          curriculo_nome: curriculo?.name,
          redirect_to: `${window.location.origin}/portal`,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.message || data.error);

      setSuccess({
        magic: Boolean(data?.magic_link_sent),
        msg: data?.message ?? 'Candidatura registrada com sucesso!',
      });
      toast.success('Candidatura enviada!');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Falha ao enviar candidatura');
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vaga || vaga.status !== 'publicada') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Vaga indisponível</h1>
        <p className="text-muted-foreground">Esta vaga foi encerrada ou não existe.</p>
        <Button onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center flex flex-col items-center gap-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <h1 className="text-2xl font-bold">Candidatura enviada!</h1>
            <p className="text-muted-foreground">{success.msg}</p>
            {success.magic && (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Verifique sua caixa de entrada (e spam) para acessar o portal do candidato.
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" asChild>
                <Link to="/carreiras">Ver outras vagas</Link>
              </Button>
              <Button asChild>
                <Link to="/portal">Ir para o portal</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Detalhes da vaga */}
          <div className="md:col-span-2">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">{vaga.titulo}</CardTitle>
                <div className="flex flex-wrap gap-2 pt-2">
                  {vaga.departamento && (
                    <Badge variant="secondary" className="gap-1">
                      <Building2 className="h-3 w-3" /> {vaga.departamento}
                    </Badge>
                  )}
                  {(vaga.cidade || vaga.estado) && (
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="h-3 w-3" /> {[vaga.cidade, vaga.estado].filter(Boolean).join(', ')}
                    </Badge>
                  )}
                  {vaga.modalidade && (
                    <Badge variant="secondary" className="gap-1">
                      <Briefcase className="h-3 w-3" /> {vaga.modalidade}
                    </Badge>
                  )}
                  {vaga.tipo_contrato && <Badge variant="outline">{vaga.tipo_contrato}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {vaga.responsabilidades && (
                  <div>
                    <h3 className="font-semibold mb-1">Responsabilidades</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{vaga.responsabilidades}</p>
                  </div>
                )}
                {vaga.requisitos_obrigatorios && (
                  <div>
                    <h3 className="font-semibold mb-1">Requisitos</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{vaga.requisitos_obrigatorios}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formulário */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Candidatura rápida</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sem cadastro. Enviamos um link mágico ao seu email para acompanhar o processo.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome completo *</Label>
                      <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required autoComplete="name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} autoComplete="tel" placeholder="(11) 99999-9999" />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="curriculo">Currículo (PDF, até 4MB)</Label>
                    <Input
                      id="curriculo"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCurriculo(e.target.files?.[0] ?? null)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="carta">Carta de apresentação (opcional)</Label>
                    <Textarea
                      id="carta"
                      rows={4}
                      value={carta}
                      onChange={(e) => setCarta(e.target.value)}
                      placeholder="Conte por que você é a pessoa certa para esta vaga…"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando…</>
                    ) : (
                      'Enviar candidatura'
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Ao enviar, você concorda com nossos <Link to="/termos" className="underline">Termos</Link> e{' '}
                    <Link to="/privacidade" className="underline">Política de Privacidade</Link>.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
