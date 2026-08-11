import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle2, XCircle, ShieldCheck, Clock, FileSignature } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usePageTitle } from '@/hooks/usePageTitle';

interface PublicProposta {
  id: string;
  candidato_nome: string;
  candidato_email: string;
  vaga_titulo: string;
  salario: number;
  moeda: string;
  data_inicio: string;
  beneficios: string[];
  clausulas: string | null;
  status: string;
  expira_em: string | null;
  assinada_em: string | null;
}

export default function AssinarPropostaPage() {
  usePageTitle('Assinatura de Proposta');
  const { token = '' } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [proposta, setProposta] = useState<PublicProposta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [motivo, setMotivo] = useState('');
  const [modo, setModo] = useState<'aceitar' | 'recusar' | null>(null);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [finalizado, setFinalizado] = useState<null | { status: string; hash?: string }>(null);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const { data, error: rpcErr } = await supabase.rpc('get_proposta_by_token', {
          p_token: token,
        });
        if (!ativo) return;
        if (rpcErr) throw rpcErr;
        const row = (data as unknown as PublicProposta[])?.[0];
        if (!row) {
          setError('Proposta não encontrada. Verifique o link recebido.');
        } else {
          setProposta(row);
          setNome(row.candidato_nome);

          // Marca como visualizada (silencioso)
          if (row.status === 'enviada') {
            await supabase
              .from('propostas')
              .update({ status: 'visualizada', visualizada_em: new Date().toISOString() })
              .eq('id', row.id);
          }
        }
      } catch (e) {
        setError('Erro ao carregar proposta.');
      } finally {
        if (ativo) setLoading(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [token]);

  const finalizada = proposta && ['aceita', 'recusada', 'expirada', 'cancelada'].includes(proposta.status);

  async function submeter(aceitar: boolean) {
    if (aceitar && (!nome.trim() || !aceitouTermos)) {
      toast.error('Confirme seu nome e aceite os termos');
      return;
    }
    if (!aceitar && !motivo.trim()) {
      toast.error('Informe o motivo da recusa');
      return;
    }
    setSubmitting(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('sign-proposal', {
        body: {
          token,
          aceitar,
          assinatura_nome: aceitar ? nome.trim() : undefined,
          motivo_recusa: !aceitar ? motivo.trim() : undefined,
        },
      });
      if (fnErr) throw fnErr;
      const res = data as { success: boolean; status?: string; error?: string; assinatura_hash?: string };
      if (!res.success) {
        toast.error(
          res.error === 'expired'
            ? 'Esta proposta expirou.'
            : res.error === 'already_finalized'
              ? 'Esta proposta já foi finalizada.'
              : 'Não foi possível processar sua resposta.',
        );
        return;
      }
      setFinalizado({ status: res.status ?? (aceitar ? 'aceita' : 'recusada'), hash: res.assinatura_hash });
      toast.success(aceitar ? 'Proposta aceita com sucesso!' : 'Resposta registrada.');
    } catch (e) {
      toast.error('Falha ao registrar assinatura.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !proposta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Link inválido
            </CardTitle>
            <CardDescription>{error ?? 'Proposta indisponível.'}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            <FileSignature className="h-4 w-4" />
            Proposta de Emprego
          </div>
          <h1 className="text-3xl font-bold">Olá, {proposta.candidato_nome}</h1>
          <p className="text-muted-foreground">Você recebeu uma proposta para a vaga abaixo.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{proposta.vaga_titulo}</CardTitle>
                <CardDescription>{proposta.candidato_email}</CardDescription>
              </div>
              <Badge variant={finalizada ? 'secondary' : 'default'}>{proposta.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-xs text-muted-foreground">Remuneração mensal</div>
                <div className="text-2xl font-bold">
                  {proposta.moeda} {Number(proposta.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-xs text-muted-foreground">Data de início</div>
                <div className="text-2xl font-bold">
                  {format(new Date(proposta.data_inicio), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
            </div>

            {proposta.beneficios?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Benefícios</h3>
                <div className="flex flex-wrap gap-2">
                  {proposta.beneficios.map((b) => (
                    <Badge key={b} variant="outline">{b}</Badge>
                  ))}
                </div>
              </div>
            )}

            {proposta.clausulas && (
              <div>
                <h3 className="font-semibold mb-2">Cláusulas</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{proposta.clausulas}</p>
              </div>
            )}

            {proposta.expira_em && !finalizada && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Expira em {format(new Date(proposta.expira_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
            )}
          </CardContent>
        </Card>

        {finalizado || finalizada ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(finalizado?.status ?? proposta.status) === 'aceita' ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-success" />
                    Proposta aceita
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-destructive" />
                    Proposta {finalizado?.status ?? proposta.status}
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {(finalizado?.status ?? proposta.status) === 'aceita'
                  ? 'Sua assinatura foi registrada. A empresa entrará em contato para os próximos passos.'
                  : 'Sua resposta foi registrada. Obrigado por avaliar.'}
              </CardDescription>
            </CardHeader>
            {finalizado?.hash && (
              <CardContent>
                <div className="flex items-start gap-2 p-3 rounded-md bg-muted text-xs font-mono break-all">
                  <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <span>Hash da assinatura: {finalizado.hash}</span>
                </div>
              </CardContent>
            )}
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sua resposta</CardTitle>
              <CardDescription>Confirme sua identidade para assinar eletronicamente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {modo !== 'recusar' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo (assinatura)</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <label className="flex items-start gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={aceitouTermos}
                      onChange={(e) => setAceitouTermos(e.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      Declaro que li e aceito os termos desta proposta e reconheço esta ação como
                      assinatura eletrônica juridicamente válida (MP 2.200-2/2001).
                    </span>
                  </label>
                </>
              )}

              {modo === 'recusar' && (
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo da recusa</Label>
                  <Textarea
                    id="motivo"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Compartilhe o motivo (opcional para você, útil para a empresa)"
                    rows={4}
                  />
                </div>
              )}

              <Separator />

              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                {modo !== 'recusar' ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setModo('recusar')}
                      disabled={submitting}
                    >
                      Recusar proposta
                    </Button>
                    <Button
                      onClick={() => submeter(true)}
                      disabled={submitting || !nome.trim() || !aceitouTermos}
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                      Aceitar e assinar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => setModo(null)} disabled={submitting}>
                      Voltar
                    </Button>
                    <Button variant="destructive" onClick={() => submeter(false)} disabled={submitting || !motivo.trim()}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                      Confirmar recusa
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
