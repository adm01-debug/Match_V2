import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useTalentPool } from '@/hooks/useTalentPool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, Star, Mail, Phone } from 'lucide-react';

export default function TalentPoolPage() {
  const { candidates, isLoading } = useTalentPool();
  const [search, setSearch] = useState('');

  const filtered = search
    ? candidates.filter((c) =>
        c.nome.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.habilidades || []).some((h: string) => h.toLowerCase().includes(search.toLowerCase()))
      )
    : candidates;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Banco de Talentos
            </h1>
            <p className="text-muted-foreground mt-1">
              {candidates.length} candidatos no banco de talentos
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nome, email ou habilidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum candidato encontrado no banco de talentos</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((candidato) => (
              <Card key={candidato.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{candidato.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />{candidato.email}
                  </div>
                  {candidato.telefone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />{candidato.telefone}
                    </div>
                  )}
                  {candidato.habilidades && candidato.habilidades.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidato.habilidades.slice(0, 5).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                      {candidato.habilidades.length > 5 && (
                        <Badge variant="outline" className="text-xs">+{candidato.habilidades.length - 5}</Badge>
                      )}
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full mt-2">Ver Perfil</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
