import { useState, useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, FileText, Download, Search, CheckCircle2, XCircle, Clock, User, AlertCircle } from 'lucide-react';

export interface ConsentRecord {
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

export interface ConsentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  active: boolean;
}

type StatusFilter = 'all' | 'granted' | 'revoked' | 'pending';

interface GDPRConsentProps {
  consents: ConsentRecord[];
  consentTypes: ConsentType[];
  onExportData: (candidateId: string) => void | Promise<void>;
  onRevokeConsent: (consentId: string) => void | Promise<void>;
  isLoading?: boolean;
}

function formatDate(date: Date | undefined): string {
  if (!date) return '-';
  try {
    return date.toLocaleDateString('pt-BR');
  } catch {
    return '-';
  }
}

function GDPRConsentComponent({ 
  consents, 
  consentTypes, 
  onExportData, 
  onRevokeConsent,
  isLoading = false 
}: GDPRConsentProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredConsents = useMemo(() => {
    return consents.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search) {
        const query = search.toLowerCase();
        return c.candidateName.toLowerCase().includes(query) || 
               c.email.toLowerCase().includes(query);
      }
      return true;
    });
  }, [consents, statusFilter, search]);

  const stats = useMemo(() => ({
    total: consents.length,
    granted: consents.filter(c => c.status === 'granted').length,
    revoked: consents.filter(c => c.status === 'revoked').length,
    pending: consents.filter(c => c.status === 'pending').length,
  }), [consents]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleFilterChange = useCallback((filter: StatusFilter) => {
    setStatusFilter(filter);
  }, []);

  const handleExportData = useCallback(async (candidateId: string) => {
    try {
      await onExportData(candidateId);
    } catch (error) {
      console.error('[GDPRConsent] Export error:', error);
    }
  }, [onExportData]);

  const handleRevokeConsent = useCallback(async (consentId: string) => {
    try {
      await onRevokeConsent(consentId);
    } catch (error) {
      console.error('[GDPRConsent] Revoke error:', error);
    }
  }, [onRevokeConsent]);

  const getStatusBadge = (status: ConsentRecord['status']) => {
    switch (status) {
      case 'granted': 
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            Concedido
          </Badge>
        );
      case 'revoked': 
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" aria-hidden="true" />
            Revogado
          </Badge>
        );
      case 'pending': 
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            Pendente
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label="Gestão de Consentimento LGPD/GDPR">
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200">
                Gestão de Consentimento (LGPD/GDPR)
              </p>
              <p className="text-blue-700 dark:text-blue-300 mt-1">
                Gerencie os consentimentos dos candidatos, atenda solicitações de acesso a dados (DSAR) e mantenha a conformidade com a legislação de proteção de dados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4" role="group" aria-label="Estatísticas de consentimento">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" aria-label={`${stats.total} consentimentos no total`}>
              {stats.total.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-600">Concedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" aria-label={`${stats.granted} consentimentos concedidos`}>
              {stats.granted.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-600">Revogados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600" aria-label={`${stats.revoked} consentimentos revogados`}>
              {stats.revoked.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-yellow-600">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600" aria-label={`${stats.pending} consentimentos pendentes`}>
              {stats.pending.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">Registros de Consentimento</TabsTrigger>
          <TabsTrigger value="types">Tipos de Consentimento</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <div className="flex gap-4 flex-wrap" role="search" aria-label="Filtros de consentimento">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input 
                placeholder="Buscar por nome ou e-mail..." 
                value={search} 
                onChange={handleSearchChange} 
                className="pl-9"
                aria-label="Buscar consentimentos"
              />
            </div>
            <div className="flex gap-2" role="radiogroup" aria-label="Filtrar por status">
              <Button 
                variant={statusFilter === 'all' ? 'default' : 'outline'} 
                onClick={() => handleFilterChange('all')}
                aria-pressed={statusFilter === 'all'}
              >
                Todos
              </Button>
              <Button 
                variant={statusFilter === 'granted' ? 'default' : 'outline'} 
                onClick={() => handleFilterChange('granted')}
                aria-pressed={statusFilter === 'granted'}
              >
                Concedidos
              </Button>
              <Button 
                variant={statusFilter === 'revoked' ? 'default' : 'outline'} 
                onClick={() => handleFilterChange('revoked')}
                aria-pressed={statusFilter === 'revoked'}
              >
                Revogados
              </Button>
            </div>
          </div>

          <Card>
            <Table aria-label="Tabela de registros de consentimento">
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredConsents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-6 w-6" aria-hidden="true" />
                        {search ? 'Nenhum resultado para a busca' : 'Nenhum registro encontrado'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredConsents.map((consent) => (
                    <TableRow key={consent.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <div>
                            <div className="font-medium">{consent.candidateName}</div>
                            <div className="text-xs text-muted-foreground">{consent.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{consent.consentType}</TableCell>
                      <TableCell>{getStatusBadge(consent.status)}</TableCell>
                      <TableCell className="text-sm">
                        {consent.status === 'granted' && formatDate(consent.grantedAt)}
                        {consent.status === 'revoked' && formatDate(consent.revokedAt)}
                        {consent.status === 'pending' && '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{consent.source}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleExportData(consent.candidateId)} 
                            aria-label={`Exportar dados de ${consent.candidateName}`}
                          >
                            <Download className="h-4 w-4" aria-hidden="true" />
                          </Button>
                          {consent.status === 'granted' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRevokeConsent(consent.id)} 
                              aria-label={`Revogar consentimento de ${consent.candidateName}`}
                            >
                              <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
          
          {filteredConsents.length > 0 && (
            <div className="text-sm text-muted-foreground" aria-live="polite">
              Exibindo {filteredConsents.length} de {consents.length} registros
            </div>
          )}
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          {consentTypes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum tipo de consentimento configurado
              </CardContent>
            </Card>
          ) : (
            consentTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      {type.name}
                      {type.required && (
                        <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                      )}
                    </CardTitle>
                    <Badge variant={type.active ? 'default' : 'secondary'}>
                      {type.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

GDPRConsentComponent.displayName = 'GDPRConsent';

export const GDPRConsent = memo(GDPRConsentComponent);
export default GDPRConsent;
