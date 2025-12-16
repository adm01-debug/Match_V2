import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { QuestaoForm } from '@/components/tests/QuestaoForm';
import { QuestaoCard } from '@/components/tests/QuestaoCard';
import { todasProvas, categoriasInfo, departamentosInfo, niveisInfo } from '@/data/testsData';
import { Questao, Prova, CategoriaProva, Departamento, NivelCargo } from '@/types/tests';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Save, 
  FileText, 
  Clock, 
  Target,
  AlertCircle,
  CheckCircle,
  Trash2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Sample questoes for demo
const questoesDemo: Questao[] = [
  {
    id: 'q1',
    enunciado: 'Qual é a principal função de uma variável em programação?',
    tipo: 'multipla_escolha',
    alternativas: [
      'Armazenar dados na memória',
      'Executar funções automaticamente',
      'Conectar ao banco de dados',
      'Renderizar interfaces'
    ],
    respostaCorreta: 0,
    pontuacao: 5,
    dificuldade: 'facil'
  },
  {
    id: 'q2',
    enunciado: 'Em JavaScript, a palavra-chave "const" permite reatribuir valores a uma variável.',
    tipo: 'verdadeiro_falso',
    alternativas: ['Verdadeiro', 'Falso'],
    respostaCorreta: 1,
    pontuacao: 5,
    dificuldade: 'facil'
  },
  {
    id: 'q3',
    enunciado: 'Explique a diferença entre programação orientada a objetos e programação funcional.',
    tipo: 'dissertativa',
    pontuacao: 15,
    dificuldade: 'medio'
  }
];

export default function ProvaEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const existingProva = id ? todasProvas.find(p => p.id === id) : null;
  
  // Form state
  const [titulo, setTitulo] = useState(existingProva?.titulo || '');
  const [descricao, setDescricao] = useState(existingProva?.descricao || '');
  const [categoria, setCategoria] = useState<CategoriaProva>(existingProva?.categoria || 'tecnico');
  const [departamentos, setDepartamentos] = useState<Departamento[]>(existingProva?.departamentos || ['geral']);
  const [niveis, setNiveis] = useState<NivelCargo[]>(existingProva?.niveisAplicaveis || ['junior', 'pleno']);
  const [duracao, setDuracao] = useState(existingProva?.duracao || 30);
  const [notaMinima, setNotaMinima] = useState(existingProva?.notaMinima || 60);
  const [ativo, setAtivo] = useState(existingProva?.ativo ?? true);
  
  // Questions state
  const [questoes, setQuestoes] = useState<Questao[]>(existingProva ? questoesDemo : []);
  const [isQuestaoDialogOpen, setIsQuestaoDialogOpen] = useState(false);
  const [editingQuestao, setEditingQuestao] = useState<Questao | null>(null);
  const [deleteQuestao, setDeleteQuestao] = useState<Questao | null>(null);

  // Calculated values
  const totalPontos = questoes.reduce((sum, q) => sum + q.pontuacao, 0);
  const questoesPorTipo = {
    multipla_escolha: questoes.filter(q => q.tipo === 'multipla_escolha').length,
    verdadeiro_falso: questoes.filter(q => q.tipo === 'verdadeiro_falso').length,
    dissertativa: questoes.filter(q => q.tipo === 'dissertativa').length,
    pratica: questoes.filter(q => q.tipo === 'pratica').length
  };

  const handleAddQuestao = () => {
    setEditingQuestao(null);
    setIsQuestaoDialogOpen(true);
  };

  const handleEditQuestao = (questao: Questao) => {
    setEditingQuestao(questao);
    setIsQuestaoDialogOpen(true);
  };

  const handleSaveQuestao = (questao: Questao) => {
    if (editingQuestao) {
      setQuestoes(questoes.map(q => q.id === questao.id ? questao : q));
      toast({ title: "Questão atualizada" });
    } else {
      setQuestoes([...questoes, questao]);
      toast({ title: "Questão adicionada" });
    }
    setIsQuestaoDialogOpen(false);
    setEditingQuestao(null);
  };

  const handleDeleteQuestao = () => {
    if (deleteQuestao) {
      setQuestoes(questoes.filter(q => q.id !== deleteQuestao.id));
      toast({ title: "Questão removida", variant: "destructive" });
      setDeleteQuestao(null);
    }
  };

  const handleSaveProva = () => {
    if (!titulo.trim()) {
      toast({ title: "Erro", description: "Título é obrigatório", variant: "destructive" });
      return;
    }
    if (questoes.length === 0) {
      toast({ title: "Erro", description: "Adicione ao menos uma questão", variant: "destructive" });
      return;
    }

    toast({ 
      title: id ? "Prova atualizada!" : "Prova criada!", 
      description: `${titulo} - ${questoes.length} questões`
    });
    navigate('/testes');
  };

  const toggleDepartamento = (dep: Departamento) => {
    if (departamentos.includes(dep)) {
      if (departamentos.length > 1) {
        setDepartamentos(departamentos.filter(d => d !== dep));
      }
    } else {
      setDepartamentos([...departamentos, dep]);
    }
  };

  const toggleNivel = (nivel: NivelCargo) => {
    if (niveis.includes(nivel)) {
      if (niveis.length > 1) {
        setNiveis(niveis.filter(n => n !== nivel));
      }
    } else {
      setNiveis([...niveis, nivel]);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/testes')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {id ? 'Editar Prova' : 'Nova Prova'}
            </h1>
            <p className="text-muted-foreground">
              Configure os detalhes e adicione questões
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <Switch checked={ativo} onCheckedChange={setAtivo} />
              <Label className="text-sm">{ativo ? 'Ativa' : 'Inativa'}</Label>
            </div>
            <Button variant="outline" onClick={() => navigate('/testes')}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProva}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Prova
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Título da Prova *</Label>
                  <Input
                    placeholder="Ex: Raciocínio Lógico Avançado"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    placeholder="Descreva o objetivo e conteúdo da prova..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={categoria} onValueChange={(v) => setCategoria(v as CategoriaProva)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {Object.entries(categoriasInfo).map(([key, info]) => (
                          <SelectItem key={key} value={key}>{info.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duração (minutos)</Label>
                    <Input
                      type="number"
                      min={5}
                      max={240}
                      value={duracao}
                      onChange={(e) => setDuracao(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nota Mínima para Aprovação (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={notaMinima}
                    onChange={(e) => setNotaMinima(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Departamentos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Departamentos</CardTitle>
                <CardDescription>Selecione os departamentos onde esta prova será aplicada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(departamentosInfo).map(([key, info]) => (
                    <Badge
                      key={key}
                      variant={departamentos.includes(key as Departamento) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleDepartamento(key as Departamento)}
                    >
                      {info.nome}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Níveis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Níveis de Cargo</CardTitle>
                <CardDescription>Selecione os níveis para os quais esta prova é adequada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(niveisInfo)
                    .sort((a, b) => a[1].ordem - b[1].ordem)
                    .map(([key, info]) => (
                      <Badge
                        key={key}
                        variant={niveis.includes(key as NivelCargo) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleNivel(key as NivelCargo)}
                      >
                        {info.nome}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Questões */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Questões</CardTitle>
                    <CardDescription>
                      {questoes.length} questão(ões) • {totalPontos} pontos
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddQuestao}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Questão
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {questoes.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Nenhuma questão adicionada</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comece adicionando questões à sua prova
                    </p>
                    <Button onClick={handleAddQuestao}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Primeira Questão
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questoes.map((questao, index) => (
                      <QuestaoCard
                        key={questao.id}
                        questao={questao}
                        index={index}
                        onEdit={handleEditQuestao}
                        onDelete={setDeleteQuestao}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Resumo da Prova</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Total de Questões
                    </span>
                    <span className="font-medium">{questoes.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Pontuação Total
                    </span>
                    <span className="font-medium">{totalPontos} pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Duração
                    </span>
                    <span className="font-medium">{duracao} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Nota Mínima
                    </span>
                    <span className="font-medium">{notaMinima}%</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Por Tipo de Questão</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Múltipla Escolha</span>
                      <span>{questoesPorTipo.multipla_escolha}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verdadeiro/Falso</span>
                      <span>{questoesPorTipo.verdadeiro_falso}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dissertativa</span>
                      <span>{questoesPorTipo.dissertativa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prática</span>
                      <span>{questoesPorTipo.pratica}</span>
                    </div>
                  </div>
                </div>

                {questoes.length === 0 && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-500/10 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Adicione ao menos uma questão para salvar a prova</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Question Dialog */}
        <Dialog open={isQuestaoDialogOpen} onOpenChange={setIsQuestaoDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingQuestao ? 'Editar Questão' : 'Nova Questão'}
              </DialogTitle>
            </DialogHeader>
            <QuestaoForm
              questao={editingQuestao || undefined}
              onSave={handleSaveQuestao}
              onCancel={() => {
                setIsQuestaoDialogOpen(false);
                setEditingQuestao(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteQuestao} onOpenChange={() => setDeleteQuestao(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Questão?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A questão será removida permanentemente da prova.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteQuestao} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
