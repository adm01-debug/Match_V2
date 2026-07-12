/**
 * @fileoverview Construtor de Perfil Comportamental Ideal da Vaga
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Brain, 
  Users, 
  Zap, 
  Shield,
  AlertTriangle,
  Save,
  RotateCcw
} from 'lucide-react';
import type { PerfilIdealComportamental, PerfilIdealDISC } from '@/types/jobFit';
import type { DISCProfile } from '@/types/behavioral';
import type { BrainType } from '@/types/advancedBehavioral';

interface JobProfileBuilderProps {
  vagaId: string;
  vagaTitulo: string;
  onSave: (perfil: PerfilIdealComportamental) => void;
  initialData?: Partial<PerfilIdealComportamental>;
}

const DEFAULT_DISC: PerfilIdealDISC = {
  dominancia: { min: 30, ideal: 50, max: 70, peso: 1 },
  influencia: { min: 30, ideal: 50, max: 70, peso: 1 },
  estabilidade: { min: 30, ideal: 50, max: 70, peso: 1 },
  conformidade: { min: 30, ideal: 50, max: 70, peso: 1 }
};

const COMPETENCIAS = [
  { key: 'lideranca', nome: 'Liderança', icone: Users },
  { key: 'comunicacao', nome: 'Comunicação', icone: Users },
  { key: 'trabalhoEquipe', nome: 'Trabalho em Equipe', icone: Users },
  { key: 'resolucaoProblemas', nome: 'Resolução de Problemas', icone: Brain },
  { key: 'adaptabilidade', nome: 'Adaptabilidade', icone: Zap },
  { key: 'orientacaoResultados', nome: 'Orientação a Resultados', icone: Target },
  { key: 'criatividade', nome: 'Criatividade', icone: Brain },
  { key: 'atencaoDetalhes', nome: 'Atenção aos Detalhes', icone: Shield },
  { key: 'autonomia', nome: 'Autonomia', icone: Zap },
  { key: 'empatia', nome: 'Empatia', icone: Users }
] as const;

export function JobProfileBuilder({ 
  vagaId, 
  vagaTitulo, 
  onSave, 
  initialData 
}: JobProfileBuilderProps) {
  const [discIdeal, setDiscIdeal] = useState<PerfilIdealDISC>(
    initialData?.discIdeal || DEFAULT_DISC
  );
  
  const [competencias, setCompetencias] = useState<Record<string, number>>(
    initialData?.competencias || Object.fromEntries(COMPETENCIAS.map(c => [c.key, 50]))
  );
  
  const [cerebroDominante, setCerebroDominante] = useState<BrainType | undefined>(
    initialData?.cerebroDominante
  );
  
  const [resilienciaMinima, setResilienciaMinima] = useState<number>(
    initialData?.resilienciaMinima || 50
  );
  
  const [discIncompativeis, setDiscIncompativeis] = useState<DISCProfile[]>(
    initialData?.dealbreakers?.discProfilesIncompativeis || []
  );

  const handleDISCChange = (
    perfil: keyof PerfilIdealDISC,
    field: 'min' | 'ideal' | 'max' | 'peso',
    value: number
  ) => {
    setDiscIdeal(prev => ({
      ...prev,
      [perfil]: { ...prev[perfil], [field]: value }
    }));
  };

  const handleCompetenciaChange = (key: string, value: number) => {
    setCompetencias(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const perfil: PerfilIdealComportamental = {
      id: initialData?.id || crypto.randomUUID(),
      vagaId,
      vagaTitulo,
      discIdeal,
      cerebroDominante,
      resilienciaMinima,
      competencias: competencias as PerfilIdealComportamental['competencias'],
      dealbreakers: {
        discProfilesIncompativeis: discIncompativeis.length > 0 ? discIncompativeis : undefined,
        resilienciaMinimaObrigatoria: resilienciaMinima > 60 ? resilienciaMinima - 10 : undefined
      },
      criadoEm: initialData?.criadoEm || new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    onSave(perfil);
  };

  const handleReset = () => {
    setDiscIdeal(DEFAULT_DISC);
    setCompetencias(Object.fromEntries(COMPETENCIAS.map(c => [c.key, 50])));
    setCerebroDominante(undefined);
    setResilienciaMinima(50);
    setDiscIncompativeis([]);
  };

  const toggleDiscIncompativel = (perfil: DISCProfile) => {
    setDiscIncompativeis(prev => 
      prev.includes(perfil)
        ? prev.filter(p => p !== perfil)
        : [...prev, perfil]
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Perfil Comportamental Ideal
        </CardTitle>
        <CardDescription>
          Defina o perfil comportamental ideal para a vaga: <strong>{vagaTitulo}</strong>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="disc" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="disc">DISC</TabsTrigger>
            <TabsTrigger value="competencias">Competências</TabsTrigger>
            <TabsTrigger value="avancado">Avançado</TabsTrigger>
            <TabsTrigger value="dealbreakers">Eliminatórios</TabsTrigger>
          </TabsList>
          
          {/* DISC Tab */}
          <TabsContent value="disc" className="space-y-6 mt-4">
            <p className="text-sm text-muted-foreground">
              Defina a faixa ideal (mín-ideal-máx) para cada dimensão DISC
            </p>
            
            {(['dominancia', 'influencia', 'estabilidade', 'conformidade'] as const).map(perfil => (
              <div key={perfil} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium capitalize">
                    {perfil === 'dominancia' && '🔴 Dominância (D)'}
                    {perfil === 'influencia' && '🟡 Influência (I)'}
                    {perfil === 'estabilidade' && '🟢 Estabilidade (S)'}
                    {perfil === 'conformidade' && '🔵 Conformidade (C)'}
                  </Label>
                  <Badge variant="outline">
                    Peso: {discIdeal[perfil].peso}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs">Mínimo: {discIdeal[perfil].min}%</Label>
                    <Slider
                      value={[discIdeal[perfil].min]}
                      onValueChange={([v]) => v !== undefined && handleDISCChange(perfil, 'min', v)}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Ideal: {discIdeal[perfil].ideal}%</Label>
                    <Slider
                      value={[discIdeal[perfil].ideal]}
                      onValueChange={([v]) => v !== undefined && handleDISCChange(perfil, 'ideal', v)}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Máximo: {discIdeal[perfil].max}%</Label>
                    <Slider
                      value={[discIdeal[perfil].max]}
                      onValueChange={([v]) => v !== undefined && handleDISCChange(perfil, 'max', v)}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs">Peso (importância): {discIdeal[perfil].peso}</Label>
                  <Slider
                    value={[discIdeal[perfil].peso]}
                    onValueChange={([v]) => v !== undefined && handleDISCChange(perfil, 'peso', v)}
                    min={0}
                    max={3}
                    step={0.5}
                    className="mt-2"
                  />
                </div>
              </div>
            ))}
          </TabsContent>
          
          {/* Competências Tab */}
          <TabsContent value="competencias" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Defina o nível ideal (0-100) para cada competência comportamental
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMPETENCIAS.map(comp => (
                <div key={comp.key} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <comp.icone className="h-4 w-4" />
                      {comp.nome}
                    </Label>
                    <Badge variant={(competencias[comp.key] ?? 0) >= 70 ? 'default' : 'outline'}>
                      {competencias[comp.key] ?? 0}%
                    </Badge>
                  </div>
                  <Slider
                    value={[competencias[comp.key] ?? 0]}
                    onValueChange={([v]) => v !== undefined && handleCompetenciaChange(comp.key, v)}
                    max={100}
                    step={5}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Avançado Tab */}
          <TabsContent value="avancado" className="space-y-6 mt-4">
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Cérebro Dominante Preferido
              </Label>
              <div className="flex gap-3 flex-wrap">
                {(['reptiliano', 'limbico', 'neocortex'] as BrainType[]).map(tipo => (
                  <Button
                    key={tipo}
                    variant={cerebroDominante === tipo ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCerebroDominante(cerebroDominante === tipo ? undefined : tipo)}
                  >
                    {tipo === 'reptiliano' && '🦎 Reptiliano'}
                    {tipo === 'limbico' && '❤️ Límbico'}
                    {tipo === 'neocortex' && '🧠 Neocórtex'}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Resiliência Mínima: {resilienciaMinima}%
              </Label>
              <Slider
                value={[resilienciaMinima]}
                onValueChange={([v]) => v !== undefined && setResilienciaMinima(v)}
                max={100}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Nível mínimo de resiliência esperado para a posição
              </p>
            </div>
          </TabsContent>
          
          {/* Dealbreakers Tab */}
          <TabsContent value="dealbreakers" className="space-y-6 mt-4">
            <div className="p-4 bg-destructive border border-destructive rounded-lg">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Critérios Eliminatórios</span>
              </div>
              <p className="text-sm text-destructive">
                Perfis que violarem estes critérios serão automaticamente marcados como incompatíveis
              </p>
            </div>
            
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Perfis DISC Incompatíveis com a Vaga
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {(['D', 'I', 'S', 'C'] as DISCProfile[]).map(perfil => (
                  <label 
                    key={perfil}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={discIncompativeis.includes(perfil)}
                      onCheckedChange={() => toggleDiscIncompativel(perfil)}
                    />
                    <span>
                      {perfil === 'D' && '🔴 Dominância primária'}
                      {perfil === 'I' && '🟡 Influência primária'}
                      {perfil === 'S' && '🟢 Estabilidade primária'}
                      {perfil === 'C' && '🔵 Conformidade primária'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Perfil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
