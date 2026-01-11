/**
 * @module PerfilCargoForm
 * @description Formulário para configuração de perfil de cargo
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Brain, 
  Heart, 
  Settings2, 
  Save,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import { useValoresCulturais, useCompetencias, useCreatePerfilCargo } from '@/hooks/useCompetencias';
import type { PerfilCargo } from '@/types/selection';
import { toast } from 'sonner';

const perfilSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  perfilDominancia: z.number().min(0).max(100),
  perfilInfluencia: z.number().min(0).max(100),
  perfilEstabilidade: z.number().min(0).max(100),
  perfilConformidade: z.number().min(0).max(100),
  toleranciaPerfil: z.number().min(0).max(50),
  pesoTecnico: z.number().min(0).max(100),
  pesoBehavioral: z.number().min(0).max(100),
  pesoCultural: z.number().min(0).max(100),
  notaMinimaAprovacao: z.number().min(0).max(100),
});

type PerfilFormData = z.infer<typeof perfilSchema>;

interface PerfilCargoFormProps {
  vagaId?: string;
  onSuccess?: (perfil: PerfilCargo) => void;
}

export function PerfilCargoForm({ vagaId, onSuccess }: PerfilCargoFormProps) {
  const { data: valores = [] } = useValoresCulturais();
  const { data: competencias = [] } = useCompetencias();
  const createMutation = useCreatePerfilCargo();
  
  const [selectedValores, setSelectedValores] = useState<string[]>([]);
  const [selectedCompetencias, setSelectedCompetencias] = useState<{ id: string; peso: number; obrigatorio: boolean }[]>([]);

  const form = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      perfilDominancia: 25,
      perfilInfluencia: 25,
      perfilEstabilidade: 25,
      perfilConformidade: 25,
      toleranciaPerfil: 15,
      pesoTecnico: 40,
      pesoBehavioral: 30,
      pesoCultural: 30,
      notaMinimaAprovacao: 70,
    },
  });

  const watchDISC = {
    D: form.watch('perfilDominancia'),
    I: form.watch('perfilInfluencia'),
    S: form.watch('perfilEstabilidade'),
    C: form.watch('perfilConformidade'),
  };

  const totalDISC = watchDISC.D + watchDISC.I + watchDISC.S + watchDISC.C;
  const totalPesos = form.watch('pesoTecnico') + form.watch('pesoBehavioral') + form.watch('pesoCultural');

  const toggleValor = (valorId: string) => {
    setSelectedValores(prev => 
      prev.includes(valorId)
        ? prev.filter(id => id !== valorId)
        : [...prev, valorId]
    );
  };

  const addCompetencia = (compId: string) => {
    if (!selectedCompetencias.find(c => c.id === compId)) {
      setSelectedCompetencias(prev => [...prev, { id: compId, peso: 1, obrigatorio: false }]);
    }
  };

  const removeCompetencia = (compId: string) => {
    setSelectedCompetencias(prev => prev.filter(c => c.id !== compId));
  };

  const onSubmit = async (data: PerfilFormData) => {
    if (totalDISC !== 100) {
      toast.error('O perfil DISC deve somar 100%');
      return;
    }
    if (totalPesos !== 100) {
      toast.error('Os pesos devem somar 100%');
      return;
    }

    try {
      const perfilData = await createMutation.mutateAsync({
        ...data,
        vagaId,
      });
      
      // Map the database response to PerfilCargo type
      const perfil: PerfilCargo = {
        id: perfilData.id,
        vagaId: perfilData.vaga_id || undefined,
        nome: perfilData.nome,
        descricao: perfilData.descricao || undefined,
        perfilDominancia: perfilData.perfil_dominancia || 25,
        perfilInfluencia: perfilData.perfil_influencia || 25,
        perfilEstabilidade: perfilData.perfil_estabilidade || 25,
        perfilConformidade: perfilData.perfil_conformidade || 25,
        toleranciaPerfil: perfilData.tolerancia_perfil || 15,
        pesoTecnico: perfilData.peso_tecnico || 40,
        pesoBehavioral: perfilData.peso_comportamental || 30,
        pesoCultural: perfilData.peso_cultural || 30,
        notaMinimaAprovacao: perfilData.nota_minima_aprovacao || 70,
      };
      
      toast.success('Perfil de cargo criado com sucesso!');
      onSuccess?.(perfil);
    } catch (error) {
      toast.error('Erro ao criar perfil de cargo');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basico" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basico" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Básico
            </TabsTrigger>
            <TabsTrigger value="disc" className="gap-2">
              <Brain className="h-4 w-4" />
              DISC
            </TabsTrigger>
            <TabsTrigger value="valores" className="gap-2">
              <Heart className="h-4 w-4" />
              Valores
            </TabsTrigger>
            <TabsTrigger value="competencias" className="gap-2">
              <Target className="h-4 w-4" />
              Competências
            </TabsTrigger>
          </TabsList>

          {/* Tab: Básico */}
          <TabsContent value="basico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Defina o nome e descrição do perfil de cargo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Perfil</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Desenvolvedor Sênior" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva as características desejadas..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Pesos de Avaliação</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Total: {totalPesos}% (deve somar 100%)
                  </p>

                  <FormField
                    control={form.control}
                    name="pesoTecnico"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>Peso Técnico</FormLabel>
                          <span className="font-bold">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={([val]) => field.onChange(val)}
                            max={100}
                            step={5}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pesoBehavioral"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>Peso Comportamental</FormLabel>
                          <span className="font-bold">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={([val]) => field.onChange(val)}
                            max={100}
                            step={5}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pesoCultural"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>Peso Cultural</FormLabel>
                          <span className="font-bold">{field.value}%</span>
                        </div>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={([val]) => field.onChange(val)}
                            max={100}
                            step={5}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="notaMinimaAprovacao"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Nota Mínima para Aprovação</FormLabel>
                        <span className="font-bold">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={([val]) => field.onChange(val)}
                          max={100}
                          step={5}
                        />
                      </FormControl>
                      <FormDescription>
                        Candidatos com score abaixo serão reprovados automaticamente
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: DISC */}
          <TabsContent value="disc" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Perfil DISC Desejado
                </CardTitle>
                <CardDescription>
                  Total: {totalDISC}% (deve somar 100%)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="perfilDominancia"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel className="text-red-600">D - Dominância</FormLabel>
                        <span className="font-bold text-red-600">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={([val]) => field.onChange(val)}
                          max={100}
                          step={5}
                          className="[&>span]:bg-red-500"
                        />
                      </FormControl>
                      <FormDescription>
                        Orientação a resultados, decisão, competitividade
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="perfilInfluencia"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel className="text-yellow-600">I - Influência</FormLabel>
                        <span className="font-bold text-yellow-600">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={([val]) => field.onChange(val)}
                          max={100}
                          step={5}
                          className="[&>span]:bg-yellow-500"
                        />
                      </FormControl>
                      <FormDescription>
                        Comunicação, entusiasmo, otimismo
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="perfilEstabilidade"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel className="text-green-600">S - Estabilidade</FormLabel>
                        <span className="font-bold text-green-600">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={([val]) => field.onChange(val)}
                          max={100}
                          step={5}
                          className="[&>span]:bg-green-500"
                        />
                      </FormControl>
                      <FormDescription>
                        Paciência, trabalho em equipe, confiabilidade
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="perfilConformidade"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel className="text-blue-600">C - Conformidade</FormLabel>
                        <span className="font-bold text-blue-600">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={([val]) => field.onChange(val)}
                          max={100}
                          step={5}
                          className="[&>span]:bg-blue-500"
                        />
                      </FormControl>
                      <FormDescription>
                        Análise, precisão, qualidade
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="toleranciaPerfil"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Tolerância de Desvio</FormLabel>
                        <span className="font-bold">±{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={([val]) => field.onChange(val)}
                          max={50}
                          step={5}
                        />
                      </FormControl>
                      <FormDescription>
                        Margem aceitável de diferença do perfil ideal
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Valores */}
          <TabsContent value="valores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Valores Culturais
                </CardTitle>
                <CardDescription>
                  Selecione os valores importantes para este cargo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {valores.map(valor => (
                    <div
                      key={valor.id}
                      onClick={() => toggleValor(valor.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedValores.includes(valor.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{valor.icone}</span>
                        <span className="font-medium">{valor.nome}</span>
                      </div>
                      {valor.descricao && (
                        <p className="text-xs text-muted-foreground">{valor.descricao}</p>
                      )}
                    </div>
                  ))}
                </div>
                {selectedValores.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Selecionados:</span>
                    {selectedValores.map(id => {
                      const valor = valores.find(v => v.id === id);
                      return valor ? (
                        <Badge key={id} variant="secondary">
                          {valor.icone} {valor.nome}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Competências */}
          <TabsContent value="competencias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Competências Avaliadas
                </CardTitle>
                <CardDescription>
                  Defina as competências que serão avaliadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Competências selecionadas */}
                {selectedCompetencias.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {selectedCompetencias.map(sel => {
                      const comp = competencias.find(c => c.id === sel.id);
                      return comp ? (
                        <div key={sel.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{comp.tipo}</Badge>
                            <span>{comp.nome}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCompetencia(sel.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Lista para adicionar */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Adicionar competência:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {competencias
                      .filter(c => !selectedCompetencias.find(s => s.id === c.id))
                      .map(comp => (
                        <Button
                          key={comp.id}
                          type="button"
                          variant="outline"
                          className="justify-start gap-2"
                          onClick={() => addCompetencia(comp.id)}
                        >
                          <Plus className="h-4 w-4" />
                          <Badge variant="secondary" className="text-xs">{comp.tipo}</Badge>
                          {comp.nome}
                        </Button>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full gap-2"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salvar Perfil de Cargo
        </Button>
      </form>
    </Form>
  );
}
