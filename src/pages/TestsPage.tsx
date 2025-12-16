import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ProvaCard } from '@/components/tests/ProvaCard';
import { BateriaCard } from '@/components/tests/BateriaCard';
import { TestFilters } from '@/components/tests/TestFilters';
import { CategoriaCard } from '@/components/tests/CategoriaCard';
import { 
  todasProvas, 
  bateriasProvas, 
  categoriasInfo, 
  departamentosInfo, 
  niveisInfo 
} from '@/data/testsData';
import { Prova, BateriaProvas, CategoriaProva, Departamento, NivelCargo } from '@/types/tests';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  FileText, 
  Layers, 
  Clock, 
  Users, 
  BarChart3, 
  CheckCircle,
  BookOpen,
  Brain,
  Heart,
  Code,
  Globe,
  Target,
  TrendingUp
} from 'lucide-react';

export default function TestsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('biblioteca');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaProva | 'todas'>('todas');
  const [selectedDepartamento, setSelectedDepartamento] = useState<Departamento | 'todos'>('todos');
  const [selectedNivel, setSelectedNivel] = useState<NivelCargo | 'todos'>('todos');
  const [selectedProva, setSelectedProva] = useState<Prova | null>(null);
  const [selectedBateria, setSelectedBateria] = useState<BateriaProvas | null>(null);

  // Filter provas
  const filteredProvas = useMemo(() => {
    return todasProvas.filter((prova) => {
      const matchSearch = searchTerm === '' || 
        prova.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prova.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prova.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchCategoria = selectedCategoria === 'todas' || prova.categoria === selectedCategoria;
      
      const matchDepartamento = selectedDepartamento === 'todos' || 
        prova.departamentos.includes(selectedDepartamento);
      
      const matchNivel = selectedNivel === 'todos' || 
        prova.niveisAplicaveis.includes(selectedNivel);

      return matchSearch && matchCategoria && matchDepartamento && matchNivel;
    });
  }, [searchTerm, selectedCategoria, selectedDepartamento, selectedNivel]);

  // Count provas by categoria
  const provasByCategoria = useMemo(() => {
    const counts: Record<CategoriaProva, number> = {
      cognitivo: 0,
      comportamental: 0,
      tecnico: 0,
      idiomas: 0,
      situacional: 0,
      competencias: 0
    };
    todasProvas.forEach(prova => {
      counts[prova.categoria]++;
    });
    return counts;
  }, []);

  // Stats
  const stats = useMemo(() => ({
    totalProvas: todasProvas.length,
    totalAplicacoes: todasProvas.reduce((sum, p) => sum + p.aplicacoes, 0),
    mediaDuracao: Math.round(todasProvas.reduce((sum, p) => sum + p.duracao, 0) / todasProvas.length),
    totalBaterias: bateriasProvas.length
  }), []);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategoria('todas');
    setSelectedDepartamento('todos');
    setSelectedNivel('todos');
  };

  const handleEditProva = (prova: Prova) => {
    navigate(`/testes/${prova.id}/editar`);
  };

  const handleDuplicateProva = (prova: Prova) => {
    toast({
      title: "Prova duplicada",
      description: `Cópia de "${prova.titulo}" criada com sucesso!`
    });
  };

  const handleDeleteProva = (prova: Prova) => {
    toast({
      title: "Prova excluída",
      description: `"${prova.titulo}" foi removida.`,
      variant: "destructive"
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Banco de Testes e Provas</h1>
            <p className="text-muted-foreground mt-1">
              Biblioteca completa de avaliações para recrutamento
            </p>
          </div>
          <Button onClick={() => navigate('/testes/nova')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Prova
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalProvas}</p>
                  <p className="text-xs text-muted-foreground">Provas Disponíveis</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(stats.totalAplicacoes / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-muted-foreground">Total de Aplicações</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.mediaDuracao}min</p>
                  <p className="text-xs text-muted-foreground">Duração Média</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Layers className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalBaterias}</p>
                  <p className="text-xs text-muted-foreground">Baterias Prontas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="biblioteca">
              <BookOpen className="h-4 w-4 mr-2" />
              Biblioteca de Provas
            </TabsTrigger>
            <TabsTrigger value="baterias">
              <Layers className="h-4 w-4 mr-2" />
              Baterias Pré-configuradas
            </TabsTrigger>
            <TabsTrigger value="categorias">
              <Brain className="h-4 w-4 mr-2" />
              Por Categoria
            </TabsTrigger>
          </TabsList>

          {/* Biblioteca Tab */}
          <TabsContent value="biblioteca" className="space-y-4">
            <TestFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategoria={selectedCategoria}
              onCategoriaChange={setSelectedCategoria}
              selectedDepartamento={selectedDepartamento}
              onDepartamentoChange={setSelectedDepartamento}
              selectedNivel={selectedNivel}
              onNivelChange={setSelectedNivel}
              onClearFilters={clearFilters}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredProvas.length} prova(s) encontrada(s)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProvas.map((prova) => (
                <ProvaCard
                  key={prova.id}
                  prova={prova}
                  onSelect={setSelectedProva}
                  onEdit={handleEditProva}
                  onDuplicate={handleDuplicateProva}
                  onDelete={handleDeleteProva}
                />
              ))}
            </div>

            {filteredProvas.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Nenhuma prova encontrada</h3>
                  <p className="text-sm text-muted-foreground">
                    Tente ajustar os filtros ou termos de busca
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Baterias Tab */}
          <TabsContent value="baterias" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bateriasProvas.map((bateria) => (
                <BateriaCard
                  key={bateria.id}
                  bateria={bateria}
                  onSelect={setSelectedBateria}
                />
              ))}
            </div>
          </TabsContent>

          {/* Categorias Tab */}
          <TabsContent value="categorias" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(categoriasInfo) as CategoriaProva[]).map((categoria) => (
                <CategoriaCard
                  key={categoria}
                  categoria={categoria}
                  count={provasByCategoria[categoria]}
                  onClick={() => {
                    setSelectedCategoria(categoria);
                    setActiveTab('biblioteca');
                  }}
                  isSelected={selectedCategoria === categoria}
                />
              ))}
            </div>

            {/* Detailed breakdown by category */}
            <div className="space-y-6">
              {(Object.keys(categoriasInfo) as CategoriaProva[]).map((categoria) => {
                const provasCategoria = todasProvas.filter(p => p.categoria === categoria);
                const info = categoriasInfo[categoria];
                
                return (
                  <Card key={categoria}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${info.cor} flex items-center justify-center`}>
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        {info.nome}
                        <Badge variant="secondary" className="ml-auto">
                          {provasCategoria.length} provas
                        </Badge>
                      </CardTitle>
                      <CardDescription>{info.descricao}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {provasCategoria.map((prova) => (
                          <ProvaCard
                            key={prova.id}
                            prova={prova}
                            compact
                            onSelect={setSelectedProva}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Prova Detail Sheet */}
        <Sheet open={!!selectedProva} onOpenChange={() => setSelectedProva(null)}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            {selectedProva && (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedProva.titulo}</SheetTitle>
                  <SheetDescription>{selectedProva.descricao}</SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={categoriasInfo[selectedProva.categoria].cor}>
                      {categoriasInfo[selectedProva.categoria].nome}
                    </Badge>
                    {selectedProva.ativo ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Inativo
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{selectedProva.duracao} min</p>
                        <p className="text-xs text-muted-foreground">Duração</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <FileText className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{selectedProva.totalQuestoes}</p>
                        <p className="text-xs text-muted-foreground">Questões</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{selectedProva.aplicacoes}</p>
                        <p className="text-xs text-muted-foreground">Aplicações</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{selectedProva.mediaNotas}%</p>
                        <p className="text-xs text-muted-foreground">Média</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Nota Mínima para Aprovação</h4>
                    <div className="flex items-center gap-3">
                      <Progress value={selectedProva.notaMinima} className="flex-1" />
                      <span className="text-sm font-medium">{selectedProva.notaMinima}%</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Departamentos</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProva.departamentos.map((dep) => (
                        <Badge key={dep} variant="outline">
                          {departamentosInfo[dep].nome}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Níveis Aplicáveis</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProva.niveisAplicaveis.map((nivel) => (
                        <Badge key={nivel} variant="secondary">
                          {niveisInfo[nivel].nome}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProva.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      Aplicar Prova
                    </Button>
                    <Button variant="outline" onClick={() => handleEditProva(selectedProva)}>
                      Editar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Bateria Detail Sheet */}
        <Sheet open={!!selectedBateria} onOpenChange={() => setSelectedBateria(null)}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            {selectedBateria && (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedBateria.nome}</SheetTitle>
                  <SheetDescription>{selectedBateria.descricao}</SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="flex gap-2">
                    <Badge>{departamentosInfo[selectedBateria.departamento].nome}</Badge>
                    <Badge variant="secondary">{niveisInfo[selectedBateria.nivel].nome}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">
                          {Math.floor(selectedBateria.duracaoTotal / 60)}h {selectedBateria.duracaoTotal % 60}min
                        </p>
                        <p className="text-xs text-muted-foreground">Duração Total</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <FileText className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                        <p className="text-lg font-bold">{selectedBateria.provas.length}</p>
                        <p className="text-xs text-muted-foreground">Provas</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Provas Obrigatórias
                    </h4>
                    <div className="space-y-2">
                      {selectedBateria.obrigatorias.map((id) => {
                        const prova = todasProvas.find(p => p.id === id);
                        return prova ? (
                          <ProvaCard
                            key={id}
                            prova={prova}
                            compact
                            onSelect={setSelectedProva}
                          />
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Provas Opcionais</h4>
                    <div className="space-y-2">
                      {selectedBateria.opcionais.map((id) => {
                        const prova = todasProvas.find(p => p.id === id);
                        return prova ? (
                          <ProvaCard
                            key={id}
                            prova={prova}
                            compact
                            onSelect={setSelectedProva}
                          />
                        ) : null;
                      })}
                    </div>
                  </div>

                  <Separator />

                  <Button className="w-full">
                    Aplicar Bateria Completa
                  </Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
}
