/**
 * @fileoverview Construtor de Perfil Cultural da Empresa
 * Interface para definir os valores e cultura que a empresa busca
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Target, 
  Scale, 
  AlertTriangle, 
  CheckCircle2,
  Sparkles,
  Save,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  BEHAVIORAL_PILLARS, 
  COMPANY_CULTURE_DIMENSIONS,
  type CompanyProfile 
} from '@/config/behavioralPillars';

interface CompanyProfileBuilderProps {
  initialProfile?: Partial<CompanyProfile>;
  onSave: (profile: CompanyProfile) => void;
  vagaId?: string;
}

const DEALBREAKER_SUGGESTIONS = [
  'Falta de integridade/desonestidade',
  'Incapacidade de trabalhar em equipe',
  'Resistência a feedback',
  'Falta de proatividade',
  'Comunicação agressiva',
  'Inflexibilidade',
  'Desrespeito a prazos',
  'Falta de ownership',
  'Comportamento político excessivo',
  'Resistência a mudanças',
];

export function CompanyProfileBuilder({ 
  initialProfile, 
  onSave, 
  vagaId 
}: CompanyProfileBuilderProps) {
  const [activeTab, setActiveTab] = useState('pilares');
  const [nome, setNome] = useState(initialProfile?.nome || '');
  const [descricao, setDescricao] = useState(initialProfile?.descricao || '');
  const [pilaresValorizados, setPilaresValorizados] = useState<Record<string, number>>(
    initialProfile?.pilaresValorizados || 
    Object.fromEntries(BEHAVIORAL_PILLARS.map(p => [p.id, 5]))
  );
  const [culturaDimensoes, setCulturaDimensoes] = useState<Record<string, number>>({
    velocidade: 50,
    hierarquia: 50,
    conflito: 50,
    inovacao: 50,
    resultado: 50,
    transparencia: 50,
    trabalho_vida: 50,
    erro: 50,
  });
  const [dealbreakers, setDealbreakers] = useState<string[]>(
    initialProfile?.dealbreakers || []
  );
  const [customDealbreaker, setCustomDealbreaker] = useState('');

  const handlePilarChange = (pilarId: string, value: number[]) => {
    setPilaresValorizados(prev => ({ ...prev, [pilarId]: value[0] ?? 5 }));
  };

  const handleCulturaChange = (dimensao: string, value: number[]) => {
    setCulturaDimensoes(prev => ({ ...prev, [dimensao]: value[0] ?? 50 }));
  };

  const toggleDealbreaker = (item: string) => {
    setDealbreakers(prev => 
      prev.includes(item) 
        ? prev.filter(d => d !== item)
        : [...prev, item]
    );
  };

  const addCustomDealbreaker = () => {
    if (customDealbreaker.trim() && !dealbreakers.includes(customDealbreaker.trim())) {
      setDealbreakers(prev => [...prev, customDealbreaker.trim()]);
      setCustomDealbreaker('');
    }
  };

  const handleSave = () => {
    const velocidade = culturaDimensoes['velocidade'] ?? 50;
    const hierarquia = culturaDimensoes['hierarquia'] ?? 50;
    
    const profile: CompanyProfile = {
      id: vagaId || crypto.randomUUID(),
      nome,
      descricao,
      valores: [],
      cultura: 'hibrida',
      ritmo: velocidade > 60 ? 'intenso' : velocidade < 40 ? 'tranquilo' : 'moderado',
      hierarquia: hierarquia > 60 ? 'vertical' : hierarquia < 40 ? 'horizontal' : 'matricial',
      pilaresValorizados,
      dealbreakers,
    };
    onSave(profile);
  };

  const resetToDefaults = () => {
    setPilaresValorizados(Object.fromEntries(BEHAVIORAL_PILLARS.map(p => [p.id, 5])));
    setCulturaDimensoes({
      velocidade: 50,
      hierarquia: 50,
      conflito: 50,
      inovacao: 50,
      resultado: 50,
      transparencia: 50,
      trabalho_vida: 50,
      erro: 50,
    });
    setDealbreakers([]);
  };

  // Calcular pilares mais e menos valorizados
  const topPilares = Object.entries(pilaresValorizados)
    .sort(([,a], [,b]) => (b ?? 0) - (a ?? 0))
    .slice(0, 3)
    .map(([id]) => BEHAVIORAL_PILLARS.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const lowPilares = Object.entries(pilaresValorizados)
    .sort(([,a], [,b]) => (a ?? 0) - (b ?? 0))
    .slice(0, 2)
    .filter(([,v]) => (v ?? 0) <= 4)
    .map(([id]) => BEHAVIORAL_PILLARS.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Perfil Cultural da Vaga
          </h2>
          <p className="text-muted-foreground">
            Defina o que a empresa valoriza para matching preciso
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Perfil
          </Button>
        </div>
      </div>

      {/* Info básica */}
      <Card>
        <CardContent className="pt-6 grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome do Perfil</Label>
            <Input 
              value={nome} 
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Desenvolvedor Sênior - Cultura Tech"
            />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o perfil ideal para esta vaga..."
              className="h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="pilares" className="gap-2">
            <Target className="h-4 w-4" />
            Pilares
          </TabsTrigger>
          <TabsTrigger value="cultura" className="gap-2">
            <Scale className="h-4 w-4" />
            Cultura
          </TabsTrigger>
          <TabsTrigger value="dealbreakers" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Dealbreakers
          </TabsTrigger>
        </TabsList>

        {/* TAB: Pilares Comportamentais */}
        <TabsContent value="pilares" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Importância de Cada Pilar (1-10)
              </CardTitle>
              <CardDescription>
                Defina o peso de cada pilar comportamental para esta posição
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {BEHAVIORAL_PILLARS.map((pilar) => {
                const pilarValue = pilaresValorizados[pilar.id] ?? 5;
                return (
                <motion.div
                  key={pilar.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", pilar.cor)} />
                      <span className="font-medium">{pilar.nome}</span>
                    </div>
                    <Badge 
                      variant={pilarValue >= 8 ? 'default' : 'outline'}
                      className={pilarValue >= 8 ? 'bg-primary' : ''}
                    >
                      {pilarValue}/10
                    </Badge>
                  </div>
                  <Slider
                    value={[pilarValue]}
                    onValueChange={(v) => handlePilarChange(pilar.id, v)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {pilar.descricao}
                  </p>
                </motion.div>
              );})}
            </CardContent>
          </Card>

          {/* Resumo dos Pilares */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Mais Valorizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {topPilares.map((pilar) => (
                    <Badge key={pilar.id} className={cn(pilar.cor, "text-white")}>
                      {pilar.nome} ({pilaresValorizados[pilar.id] ?? 5})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {lowPilares.length > 0 && (
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    Menos Prioritários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lowPilares.map((pilar) => (
                    <Badge key={pilar.id} variant="outline">
                      {pilar.nome} ({pilaresValorizados[pilar.id] ?? 5})
                    </Badge>
                  ))}
                </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* TAB: Dimensões Culturais */}
        <TabsContent value="cultura" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Espectro Cultural
              </CardTitle>
              <CardDescription>
                Posicione a cultura da empresa em cada dimensão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {Object.entries(COMPANY_CULTURE_DIMENSIONS).map(([key, dim]) => {
                const culturaValue = culturaDimensoes[key] ?? 50;
                return (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dim.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {culturaValue}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[culturaValue]}
                      onValueChange={(v) => handleCulturaChange(key, v)}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="max-w-[45%] text-left">{dim.extremos[0]}</span>
                      <span className="max-w-[45%] text-right">{dim.extremos[1]}</span>
                    </div>
                  </div>
                </div>
              );})}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Dealbreakers */}
        <TabsContent value="dealbreakers" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                Comportamentos Inaceitáveis
              </CardTitle>
              <CardDescription>
                Selecione comportamentos que desqualificam candidatos automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {DEALBREAKER_SUGGESTIONS.map((item) => (
                  <Badge
                    key={item}
                    variant={dealbreakers.includes(item) ? 'destructive' : 'outline'}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => toggleDealbreaker(item)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Input
                  value={customDealbreaker}
                  onChange={(e) => setCustomDealbreaker(e.target.value)}
                  placeholder="Adicionar dealbreaker personalizado..."
                  onKeyDown={(e) => e.key === 'Enter' && addCustomDealbreaker()}
                />
                <Button onClick={addCustomDealbreaker} variant="outline">
                  Adicionar
                </Button>
              </div>

              {dealbreakers.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="font-medium text-red-600 mb-2">
                    {dealbreakers.length} dealbreaker(s) selecionado(s):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dealbreakers.map((item) => (
                      <Badge 
                        key={item} 
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => toggleDealbreaker(item)}
                      >
                        {item} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview do Perfil */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Preview do Perfil de Matching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Top 3 Pilares</p>
              <div className="space-y-1">
                {topPilares.map((p, i) => (
                  <p key={p.id}>
                    {i + 1}. {p.nome} <span className="text-primary font-medium">({pilaresValorizados[p.id] ?? 5}/10)</span>
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Cultura</p>
              <p>
                Ritmo: <span className="font-medium">{(culturaDimensoes['velocidade'] ?? 50) > 60 ? 'Intenso' : (culturaDimensoes['velocidade'] ?? 50) < 40 ? 'Tranquilo' : 'Moderado'}</span>
              </p>
              <p>
                Estrutura: <span className="font-medium">{(culturaDimensoes['hierarquia'] ?? 50) > 60 ? 'Hierárquica' : (culturaDimensoes['hierarquia'] ?? 50) < 40 ? 'Horizontal' : 'Matricial'}</span>
              </p>
              <p>
                Inovação: <span className="font-medium">{(culturaDimensoes['inovacao'] ?? 50) > 60 ? 'Disruptiva' : (culturaDimensoes['inovacao'] ?? 50) < 40 ? 'Incremental' : 'Balanceada'}</span>
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Dealbreakers</p>
              {dealbreakers.length === 0 ? (
                <p className="text-amber-600">Nenhum definido</p>
              ) : (
                <p>{dealbreakers.length} comportamento(s) eliminatório(s)</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CompanyProfileBuilder;
