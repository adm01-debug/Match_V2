import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ClipboardCheck, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const parecerConfig: Record<string, { label: string; className: string }> = {
  aprovar: { label: 'Aprovado', className: 'bg-success/20 text-success border-success/30' },
  reprovar: { label: 'Reprovado', className: 'bg-destructive/20 text-destructive border-destructive/30' },
  em_duvida: { label: 'Em Dúvida', className: 'bg-warning/20 text-warning border-warning/30' },
  rascunho: { label: 'Rascunho', className: 'bg-muted text-muted-foreground border-border' },
};

export default function AvaliacoesPage() {
  usePageTitle('Avaliações');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterParecer, setFilterParecer] = useState<string>('all');

  const { data: avaliacoes = [], isLoading } = useQuery({
    queryKey: ['avaliacoes-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('*, processos_seletivos(candidato_nome, vaga_titulo)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const filtered = avaliacoes.filter((a: any) => {
    const candidato = a.processos_seletivos?.candidato_nome || '';
    const vaga = a.processos_seletivos?.vaga_titulo || '';
    const matchSearch = !search || 
      candidato.toLowerCase().includes(search.toLowerCase()) ||
      vaga.toLowerCase().includes(search.toLowerCase());
    const matchParecer = filterParecer === 'all' || a.parecer === filterParecer;
    return matchSearch && matchParecer;
  });

  const stats = {
    total: avaliacoes.length,
    aprovados: avaliacoes.filter((a: any) => a.parecer === 'aprovar').length,
    reprovados: avaliacoes.filter((a: any) => a.parecer === 'reprovar').length,
    pendentes: avaliacoes.filter((a: any) => a.parecer === 'em_duvida' || a.parecer === 'rascunho').length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Avaliações</h1>
            <p className="text-muted-foreground mt-1">Gerencie as avaliações de candidatos</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: ClipboardCheck },
            { label: 'Aprovados', value: stats.aprovados, className: 'text-green-600' },
            { label: 'Reprovados', value: stats.reprovados, className: 'text-destructive' },
            { label: 'Pendentes', value: stats.pendentes, className: 'text-amber-600' },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-bold ${s.className || ''}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Lista de Avaliações</CardTitle>
                <CardDescription>Todas as avaliações realizadas no sistema</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar candidato ou vaga..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterParecer} onValueChange={setFilterParecer}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Parecer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="aprovar">Aprovados</SelectItem>
                    <SelectItem value="reprovar">Reprovados</SelectItem>
                    <SelectItem value="em_duvida">Em Dúvida</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {search || filterParecer !== 'all' ? 'Nenhuma avaliação encontrada com os filtros aplicados' : 'Nenhuma avaliação realizada ainda'}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidato</TableHead>
                      <TableHead>Vaga</TableHead>
                      <TableHead>Etapa</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Parecer</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((avaliacao: any) => {
                      const parecer = avaliacao.parecer as string;
                      const config = parecerConfig[parecer] ?? { label: parecer, className: 'bg-muted text-muted-foreground border-border' };
                      return (
                        <TableRow key={avaliacao.id}>
                          <TableCell className="font-medium">
                            {avaliacao.processos_seletivos?.candidato_nome || '-'}
                          </TableCell>
                          <TableCell>{avaliacao.processos_seletivos?.vaga_titulo || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{avaliacao.etapa}</Badge>
                          </TableCell>
                          <TableCell>
                            {avaliacao.nota_geral ? `${avaliacao.nota_geral}/10` : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={config.className}>
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(avaliacao.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/avaliacao/${avaliacao.processo_id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> Ver
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
