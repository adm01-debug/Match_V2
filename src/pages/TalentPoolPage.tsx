import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Tag, Search, Filter, Plus, Mail, UserPlus } from 'lucide-react';
import { useTalentPool } from '@/hooks/useTalentPool';

export default function TalentPoolPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { pools, candidates, tags, createPool } = useTalentPool();

  const filteredCandidates = candidates.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedTags.length === 0 || selectedTags.some(t => c.tags?.includes(t)))
  );

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Banco de Talentos</h1>
            <p className="text-muted-foreground">Gerencie candidatos para futuras oportunidades</p>
          </div>
          <Button onClick={() => createPool({ name: 'Novo Pool', description: '' })}><Plus className="h-4 w-4 mr-2" />Novo Pool</Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar candidatos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtros</Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tags.map(tag => (
            <Badge key={tag} variant={selectedTags.includes(tag) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleTag(tag)}>
              <Tag className="h-3 w-3 mr-1" />{tag}
            </Badge>
          ))}
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos ({candidates.length})</TabsTrigger>
            {pools.map(pool => (
              <TabsTrigger key={pool.id} value={pool.id}>{pool.name} ({pool.count})</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCandidates.map(candidate => (
                <Card key={candidate.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{candidate.nome}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.cargo || 'Sem cargo'}</p>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {candidate.tags?.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1"><Mail className="h-4 w-4 mr-1" />Contatar</Button>
                      <Button size="sm" variant="outline" className="flex-1"><UserPlus className="h-4 w-4 mr-1" />Add Pool</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
