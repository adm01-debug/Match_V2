/**
 * @component AutomationRuleEditor
 * @description Editor visual para criar e editar regras de automação
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  Zap, 
  Settings2, 
  ArrowRight, 
  Mail, 
  Bell, 
  Calendar,
  CheckCircle,
  XCircle,
  MoveRight
} from 'lucide-react';
import type { AutomationRule, AutomationCondition, AutomationAction } from '@/hooks/useAutomationRules';

interface AutomationRuleEditorProps {
  rule?: AutomationRule;
  onSave: (rule: Omit<AutomationRule, 'id'>) => void;
  onCancel: () => void;
}

const CONDITION_FIELDS = [
  { value: 'match_score', label: 'Match Score' },
  { value: 'etapa', label: 'Etapa Atual' },
  { value: 'dias_na_etapa', label: 'Dias na Etapa' },
  { value: 'nota_prova', label: 'Nota da Prova' },
  { value: 'nota_entrevista', label: 'Nota da Entrevista' },
  { value: 'score_tecnico', label: 'Score Técnico' },
  { value: 'score_comportamental', label: 'Score Comportamental' },
  { value: 'score_cultural', label: 'Score Cultural' },
  { value: 'fit_perfil', label: 'Fit com Perfil' },
  { value: 'origem', label: 'Origem do Candidato' },
];

const OPERATORS = [
  { value: 'igual', label: 'Igual a' },
  { value: 'maior', label: 'Maior que' },
  { value: 'menor', label: 'Menor que' },
  { value: 'contem', label: 'Contém' },
  { value: 'entre', label: 'Entre' },
];

const ACTION_TYPES = [
  { value: 'mover_etapa', label: 'Mover para Etapa', icon: MoveRight },
  { value: 'enviar_email', label: 'Enviar Email', icon: Mail },
  { value: 'notificar', label: 'Notificar Equipe', icon: Bell },
  { value: 'agendar', label: 'Agendar Entrevista', icon: Calendar },
  { value: 'aprovar', label: 'Aprovar Candidato', icon: CheckCircle },
  { value: 'reprovar', label: 'Reprovar Candidato', icon: XCircle },
];

const RULE_TYPES = [
  { value: 'triagem', label: 'Triagem' },
  { value: 'avaliacao', label: 'Avaliação' },
  { value: 'entrevista', label: 'Entrevista' },
  { value: 'oferta', label: 'Oferta' },
  { value: 'geral', label: 'Geral' },
];

export function AutomationRuleEditor({ rule, onSave, onCancel }: AutomationRuleEditorProps) {
  const [nome, setNome] = useState(rule?.nome || '');
  const [descricao, setDescricao] = useState(rule?.descricao || '');
  const [tipo, setTipo] = useState<AutomationRule['tipo']>(rule?.tipo || 'geral');
  const [ativo, setAtivo] = useState(rule?.ativo ?? true);
  const [prioridade, setPrioridade] = useState(rule?.prioridade || 0);
  const [condicoes, setCondicoes] = useState<AutomationCondition[]>(rule?.condicoes || []);
  const [acoes, setAcoes] = useState<AutomationAction[]>(rule?.acoes || []);

  const addCondition = () => {
    setCondicoes([...condicoes, { campo: 'match_score', operador: 'maior', valor: 70 }]);
  };

  const removeCondition = (index: number) => {
    setCondicoes(condicoes.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: keyof AutomationCondition, value: string | number | boolean) => {
    const updated = [...condicoes];
    (updated[index] as Record<string, unknown>)[field] = value;
    setCondicoes(updated);
  };

  const addAction = () => {
    setAcoes([...acoes, { tipo: 'notificar', parametros: {} }]);
  };

  const removeAction = (index: number) => {
    setAcoes(acoes.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, field: keyof AutomationAction, value: unknown) => {
    const updated = [...acoes];
    (updated[index] as Record<string, unknown>)[field] = value;
    setAcoes(updated);
  };

  const handleSave = () => {
    onSave({
      nome,
      descricao: descricao || undefined,
      tipo,
      condicoes,
      acoes,
      ativo,
      prioridade,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            {rule ? 'Editar Regra' : 'Nova Regra de Automação'}
          </CardTitle>
          <CardDescription>
            Configure condições e ações para automatizar o processo seletivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Regra</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Aprovação automática por match score"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as AutomationRule['tipo'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RULE_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o objetivo desta regra..."
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={ativo} onCheckedChange={setAtivo} />
                <Label>Regra Ativa</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="prioridade">Prioridade:</Label>
                <Input
                  id="prioridade"
                  type="number"
                  value={prioridade}
                  onChange={(e) => setPrioridade(parseInt(e.target.value) || 0)}
                  className="w-20"
                  min={0}
                  max={100}
                />
              </div>
            </div>
            <Badge variant={ativo ? 'default' : 'secondary'}>
              {ativo ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="h-4 w-4" />
            Condições
          </CardTitle>
          <CardDescription>
            Quando TODAS as condições forem verdadeiras, as ações serão executadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {condicoes.map((cond, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-muted-foreground">SE</span>
              
              <Select 
                value={cond.campo} 
                onValueChange={(v) => updateCondition(index, 'campo', v)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_FIELDS.map(f => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={cond.operador} 
                onValueChange={(v) => updateCondition(index, 'operador', v)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={String(cond.valor)}
                onChange={(e) => updateCondition(index, 'valor', e.target.value)}
                className="w-32"
                placeholder="Valor"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCondition(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addCondition} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Condição
          </Button>
        </CardContent>
      </Card>

      {/* Arrow */}
      <div className="flex justify-center">
        <div className="p-3 rounded-full bg-primary/10">
          <ArrowRight className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-4 w-4" />
            Ações
          </CardTitle>
          <CardDescription>
            Ações que serão executadas quando as condições forem atendidas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {acoes.map((acao, index) => {
            const ActionIcon = ACTION_TYPES.find(a => a.value === acao.tipo)?.icon || Zap;
            return (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium text-muted-foreground">ENTÃO</span>
                
                <Select 
                  value={acao.tipo} 
                  onValueChange={(v) => updateAction(index, 'tipo', v)}
                >
                  <SelectTrigger className="w-56">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <ActionIcon className="h-4 w-4" />
                        {ACTION_TYPES.find(a => a.value === acao.tipo)?.label}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ACTION_TYPES.map(a => (
                      <SelectItem key={a.value} value={a.value}>
                        <div className="flex items-center gap-2">
                          <a.icon className="h-4 w-4" />
                          {a.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {acao.tipo === 'mover_etapa' && (
                  <Select 
                    value={(acao.parametros['etapa'] as string) || ''} 
                    onValueChange={(v) => updateAction(index, 'parametros', { ...acao.parametros, etapa: v })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Selecione a etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="triagem">Triagem</SelectItem>
                      <SelectItem value="entrevista_rh">Entrevista RH</SelectItem>
                      <SelectItem value="entrevista_tecnica">Entrevista Técnica</SelectItem>
                      <SelectItem value="proposta">Proposta</SelectItem>
                      <SelectItem value="contratado">Contratado</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {acao.tipo === 'enviar_email' && (
                  <Input
                    value={(acao.parametros['template'] as string) || ''}
                    onChange={(e) => updateAction(index, 'parametros', { ...acao.parametros, template: e.target.value })}
                    placeholder="Nome do template"
                    className="w-48"
                  />
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAction(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

          <Button variant="outline" onClick={addAction} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Ação
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={!nome || condicoes.length === 0 || acoes.length === 0}>
          <Zap className="h-4 w-4 mr-2" />
          Salvar Regra
        </Button>
      </div>
    </div>
  );
}
