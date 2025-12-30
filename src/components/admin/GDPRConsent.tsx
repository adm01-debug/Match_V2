import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, FileText, Download, Search, CheckCircle2, XCircle, Clock, History, User } from 'lucide-react';

interface ConsentRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  email: string;
  consentType: string;
  status: 'granted' | 'revoked' | 'pending';
  grantedAt?: Date;
  revokedAt?: Date;
  ipAddress?: string;
  source: 'portal' | 'form' | 'import' | 'api';
}

interface ConsentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  active: boolean;
}

interface GDPRConsentProps {
  consents: ConsentRecord[];
  consentTypes: ConsentType[];
  onExportData: (candidateId: string) => void;
  onRevokeConsent: (consentId: string) => void;
}

export function GDPRConsent({ consents, consentTypes, onExportData, onRevokeConsent }: GDPRConsentProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredConsents = consents.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.candidateName.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: consents.length,
    granted: consents.filter(c => c.status === 'granted').length,
    revoked: consents.filter(c => c.status === 'revoked').length,
    pending: consents.filter(c => c.status === 'pending').length,
  };

  const getStatusBadge = (status: ConsentRecord['status']) => {
    switch (status) {
      case 'granted': return <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" />Concedido</Badge>;
      case 'revoked': return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Revogado</Badge>;
      case 'pending': return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200">Gestão de Consentimento (LGPD/GDPR)</p>
              <p className="text-blue-700 dark:text-blue-300 mt-1">
                Gerencie os consentimentos dos candidatos, atenda solicitações de acesso a dados (DSAR) e mantenha a conformidade com a legislação de proteção de dados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-green-600">Concedidos</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{stats.granted}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-red-600">Revogados</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{stats.revoked}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-yellow-600">Pendentes</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-yellow-600">{stats.pending}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">Registros de Consentimento</TabsTrigger>
          <TabsTrigger value="types">Tipos de Consentimento</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>Todos</Button>
            <Button variant={statusFilter === 'granted' ? 'default' : 'outline'} onClick={() => setStatusFilter('granted')}>Concedidos</Button>
            <Button variant={statusFilter === 'revoked' ? 'default' : 'outline'} onClick={() => setStatusFilter('revoked')}>Revogados</Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsents.map((consent) => (
                  <TableRow key={consent.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{consent.candidateName}</div>
                          <div className="text-xs text-muted-foreground">{consent.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{consent.consentType}</TableCell>
                    <TableCell>{getStatusBadge(consent.status)}</TableCell>
                    <TableCell className="text-sm">
                      {consent.status === 'granted' && consent.grantedAt?.toLocaleDateString('pt-BR')}
                      {consent.status === 'revoked' && consent.revokedAt?.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell><Badge variant="outline">{consent.source}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onExportData(consent.candidateId)} title="Exportar dados (DSAR)">
                          <Download className="h-4 w-4" />
                        </Button>
                        {consent.status === 'granted' && (
                          <Button variant="ghost" size="sm" onClick={() => onRevokeConsent(consent.id)} title="Revogar consentimento">
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          {consentTypes.map((type) => (
            <Card key={type.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {type.name}
                    {type.required && <Badge variant="destructive" className="text-xs">Obrigatório</Badge>}
                  </CardTitle>
                  <Badge variant={type.active ? 'default' : 'secondary'}>{type.active ? 'Ativo' : 'Inativo'}</Badge>
                </div>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
