import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useProva, useCreateProva, useUpdateProva } from "@/hooks/useProvas";
import { categoriasInfo, niveisInfo, departamentosInfo, tiposQuestao } from "@/config/testsConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, CheckCircle2, XCircle, Settings, ListChecks } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Questao { 
  id: string; 
  texto: string; 
  tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'dissertativa'; 
  opcoes: string[]; 
  respostaCorreta: number; 
  pontos: number; 
}

export default function ProvaEditor() {
  usePageTitle('Editor de Prova');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const { data: provaExistente, isLoading: loadingProva } = useProva(id ?? '');
  const createProvaMutation = useCreateProva();
  const updateProvaMutation = useUpdateProva();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nivel, setNivel] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [duracaoMinutos, setDuracaoMinutos] = useState(60);
  const [notaMinima, setNotaMinima] = useState(70);
  const [ativo, setAtivo] = useState(true);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (provaExistente) {
      setTitulo(provaExistente.titulo);
      setDescricao(provaExistente.descricao || "");
      setCategoria(provaExistente.categoria);
      setNivel(provaExistente.niveisAplicaveis?.[0] || "");
      setDepartamento(provaExistente.departamentos?.[0] || "");
      setDuracaoMinutos(provaExistente.duracao);
      setNotaMinima(provaExistente.notaMinima);
      setAtivo(provaExistente.ativo);
      if (provaExistente.questoes) {
        setQuestoes((provaExistente.questoes as unknown) as Questao[]);
      }
    }
  }, [provaExistente]);

  const handleAddQuestao = () => {
    setQuestoes([
      ...questoes, 
      { 
        id: `q-${Date.now()}`, 
        texto: "", 
        tipo: "multipla_escolha", 
        opcoes: ["", "", "", ""], 
        respostaCorreta: 0, 
        pontos: 10 
      }
    ]);
  };

  const handleRemoveQuestao = (index: number) => {
    setQuestoes(questoes.filter((_, i) => i !== index));
  };

  const handleUpdateQuestao = (index: number, field: keyof Questao, value: unknown) => {
    setQuestoes(questoes.map((q, i) => {
      if (i === index) {
        if (field === 'tipo') {
          if (value === 'verdadeiro_falso') {
            return { ...q, tipo: value as Questao['tipo'], opcoes: ['Verdadeiro', 'Falso'], respostaCorreta: 0 };
          }
          if (value === 'dissertativa') {
            return { ...q, tipo: value as Questao['tipo'], opcoes: [], respostaCorreta: -1 };
          }
          return { ...q, tipo: value as Questao['tipo'], opcoes: ['', '', '', ''], respostaCorreta: 0 };
        }
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const handleUpdateOpcao = (qi: number, oi: number, value: string) => {
    setQuestoes(questoes.map((q, i) => 
      i === qi ? { ...q, opcoes: q.opcoes.map((o, j) => j === oi ? value : o) } : q
    ));
  };

  const handleAddOpcao = (qi: number) => {
    setQuestoes(questoes.map((q, i) => 
      i === qi && q.opcoes.length < 6 ? { ...q, opcoes: [...q.opcoes, ""] } : q
    ));
  };

  const handleRemoveOpcao = (qi: number, oi: number) => {
    setQuestoes(questoes.map((q, i) => {
      if (i === qi && q.opcoes.length > 2) {
        const novasOpcoes = q.opcoes.filter((_, j) => j !== oi);
        const novaResposta = q.respostaCorreta >= oi && q.respostaCorreta > 0 ? q.respostaCorreta - 1 : q.respostaCorreta;
        return { ...q, opcoes: novasOpcoes, respostaCorreta: novaResposta };
      }
      return q;
    }));
  };

  const pontuacaoTotal = questoes.reduce((acc, q) => acc + q.pontos, 0);

  const handleSalvar = async () => {
    if (!titulo || !categoria || !nivel) { 
      toast({ title: "Erro", description: "Preencha campos obrigatórios", variant: "destructive" }); 
      return; 
    }
    if (questoes.length === 0) { 
      toast({ title: "Erro", description: "Adicione questões", variant: "destructive" }); 
      return; 
    }
    
    const data = { 
      titulo, 
      descricao, 
      categoria: categoria as import('@/types/tests').CategoriaProva, 
      niveisAplicaveis: [nivel] as import('@/types/tests').NivelCargo[],
      departamentos: (departamento ? [departamento] : ['geral']) as import('@/types/tests').Departamento[],
      duracao: duracaoMinutos, 
      notaMinima, 
      ativo, 
      questoes: questoes as unknown as import('@/types/tests').Questao[], 
      totalQuestoes: questoes.length, 
      pontuacaoMaxima: pontuacaoTotal 
    };
    
    try {
      if (isEditing && id) { 
        await updateProvaMutation.mutateAsync({ id, ...data }); 
        toast({ title: "Prova atualizada" }); 
      } else { 
        await createProvaMutation.mutateAsync(data); 
        toast({ title: "Prova criada" }); 
      }
      navigate("/testes");
    } catch { 
      toast({ title: "Erro ao salvar", variant: "destructive" }); 
    }
  };

  const isCreating = createProvaMutation.isPending;
  const isUpdating = updateProvaMutation.isPending;

  if (loadingProva) {
    return (
      <Layout title="Editor">
        <div className="p-6">
          <Skeleton className="h-96" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isEditing ? "Editar Prova" : "Nova Prova"}>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/testes")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{isEditing ? "Editar Prova" : "Nova Prova"}</h1>
              <p className="text-muted-foreground">{questoes.length} questões • {pontuacaoTotal} pontos</p>
            </div>
          </div>
          <Button onClick={handleSalvar} disabled={isCreating || isUpdating}>
            <Save className="h-4 w-4 mr-2" />
            {isCreating || isUpdating ? "Salvando..." : "Salvar"}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="info"><Settings className="h-4 w-4 mr-1" />Informações</TabsTrigger>
            <TabsTrigger value="questoes"><ListChecks className="h-4 w-4 mr-1" />Questões ({questoes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Informações</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Título *</Label>
                    <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Nome da prova" />
                  </div>
                  <div>
                    <Label>Categoria *</Label>
                    <Select value={categoria} onValueChange={setCategoria}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {categoriasInfo.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={2} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Nível *</Label>
                    <Select value={nivel} onValueChange={setNivel}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {niveisInfo.map(n => <SelectItem key={n.id} value={n.id}>{n.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Departamento</Label>
                    <Select value={departamento || "geral"} onValueChange={(v) => setDepartamento(v === "geral" ? "" : v)}>
                      <SelectTrigger><SelectValue placeholder="Geral" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="geral">Geral</SelectItem>
                        {departamentosInfo.map(d => <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duração (min)</Label>
                    <Input type="number" value={duracaoMinutos} onChange={(e) => setDuracaoMinutos(parseInt(e.target.value) || 60)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nota Mínima (%)</Label>
                    <Input type="number" value={notaMinima} onChange={(e) => setNotaMinima(parseInt(e.target.value) || 70)} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Ativa</Label>
                      <p className="text-xs text-muted-foreground">Disponível para uso</p>
                    </div>
                    <Switch checked={ativo} onCheckedChange={setAtivo} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questoes" className="mt-4 space-y-4">
            {questoes.map((q, qi) => (
              <Card key={q.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <Badge variant="outline">Q{qi + 1}</Badge>
                      <Badge variant="secondary">{q.pontos}pts</Badge>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveQuestao(qi)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label>Enunciado</Label>
                      <Textarea value={q.texto} onChange={(e) => handleUpdateQuestao(qi, 'texto', e.target.value)} rows={2} />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <Select value={q.tipo} onValueChange={(v) => handleUpdateQuestao(qi, 'tipo', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {tiposQuestao.map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {q.tipo !== 'dissertativa' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Opções</Label>
                        {q.tipo === 'multipla_escolha' && (
                          <Button variant="outline" size="sm" onClick={() => handleAddOpcao(qi)} disabled={q.opcoes.length >= 6}>
                            <Plus className="h-3 w-3 mr-1" />Opção
                          </Button>
                        )}
                      </div>
                      {q.opcoes.map((opcao, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <Button 
                            variant={q.respostaCorreta === oi ? "default" : "outline"} 
                            size="icon" 
                            onClick={() => handleUpdateQuestao(qi, 'respostaCorreta', oi)}
                          >
                            {q.respostaCorreta === oi ? <CheckCircle2 className="h-4 w-4" /> : String.fromCharCode(65 + oi)}
                          </Button>
                          <Input 
                            value={opcao} 
                            onChange={(e) => handleUpdateOpcao(qi, oi, e.target.value)} 
                            placeholder={`Opção ${String.fromCharCode(65 + oi)}`} 
                            disabled={q.tipo === 'verdadeiro_falso'} 
                          />
                          {q.tipo === 'multipla_escolha' && q.opcoes.length > 2 && (
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveOpcao(qi, oi)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.tipo === 'dissertativa' && (
                    <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                      Dissertativa - correção manual
                    </div>
                  )}
                  <div>
                    <Label>Pontos</Label>
                    <Input 
                      type="number" 
                      value={q.pontos} 
                      onChange={(e) => handleUpdateQuestao(qi, 'pontos', parseInt(e.target.value) || 10)} 
                      className="w-24" 
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={handleAddQuestao}>
              <Plus className="h-4 w-4 mr-2" />Adicionar Questão
            </Button>
            {questoes.length > 0 && (
              <Card>
                <CardContent className="pt-4 flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="text-2xl font-bold">{pontuacaoTotal} pts</span>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
