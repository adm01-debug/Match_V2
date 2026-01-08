import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Settings, Mail, Trash2 } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { useState } from 'react';

export default function TenantManagement() {
  const { tenant, members, inviteMember } = useTenant();
  const [inviteEmail, setInviteEmail] = useState('');
  const isOwner = true; // Simplified for now

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      inviteMember({ email: inviteEmail.trim(), role: 'member' });
      setInviteEmail('');
    }
  };

  const handleRemoveMember = (_userId: string) => {
    // TODO: Implement member removal
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Configurações da Empresa</h1>
            <p className="text-muted-foreground">Gerencie sua organização e membros da equipe</p>
          </div>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general"><Building2 className="h-4 w-4 mr-2" />Geral</TabsTrigger>
            <TabsTrigger value="members"><Users className="h-4 w-4 mr-2" />Membros</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-2" />Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle>Informações da Empresa</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div><label className="text-sm font-medium">Nome</label><Input value={tenant?.name || ''} readOnly={!isOwner} /></div>
                  <div><label className="text-sm font-medium">Slug</label><Input value={tenant?.slug || ''} readOnly /></div>
                </div>
                <div><label className="text-sm font-medium">Plano</label><div className="mt-1"><Badge>free</Badge></div></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Membros da Equipe</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="email@exemplo.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="w-64" />
                  <Button onClick={handleInvite}><Mail className="h-4 w-4 mr-2" />Convidar</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>Papel</TableHead><TableHead className="text-right">Ações</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.name || '-'}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell><Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>{member.role}</Badge></TableCell>
                        <TableCell className="text-right">
                          {member.role !== 'owner' && isOwner && (
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveMember(member.user_id)}><Trash2 className="h-4 w-4" /></Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle>Preferências</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg"><p className="text-sm text-muted-foreground">Configurações adicionais em breve.</p></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
