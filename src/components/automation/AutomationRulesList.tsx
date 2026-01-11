/**
 * @component AutomationRulesList
 * @description Lista de regras de automação com ações
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Plus, 
  Pencil, 
  Trash2, 
  History,
  Settings2,
  ArrowRight
} from 'lucide-react';
import { useAutomationRules, useToggleAutomationRule, useDeleteAutomationRule } from '@/hooks/useAutomationRules';
import { toast } from 'sonner';

interface AutomationRulesListProps {
  onEdit: (ruleId: string) => void;
  onNew: () => void;
  onViewLogs: (ruleId: string) => void;
}

const TIPO_LABELS: Record<string, string> = {
  triagem: 'Triagem',
  avaliacao: 'Avaliação',
  entrevista: 'Entrevista',
  oferta: 'Oferta',
  geral: 'Geral',
};

const TIPO_COLORS: Record<string, string> = {
  triagem: 'bg-blue-100 text-blue-800',
  avaliacao: 'bg-purple-100 text-purple-800',
  entrevista: 'bg-green-100 text-green-800',
  oferta: 'bg-amber-100 text-amber-800',
  geral: 'bg-gray-100 text-gray-800',
};

export function AutomationRulesList({ onEdit, onNew, onViewLogs }: AutomationRulesListProps) {
  const { data: rules, isLoading } = useAutomationRules();
  const toggleRule = useToggleAutomationRule();
  const deleteRule = useDeleteAutomationRule();

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleRule.mutateAsync({ id, ativo: !currentStatus });
      toast.success(`Regra ${!currentStatus ? 'ativada' : 'desativada'}`);
    } catch (error) {
      toast.error('Erro ao alterar status da regra');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta regra?')) return;
    
    try {
      await deleteRule.mutateAsync(id);
      toast.success('Regra excluída');
    } catch (error) {
      toast.error('Erro ao excluir regra');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Regras de Automação
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure ações automáticas baseadas em condições
          </p>
        </div>
        <Button onClick={onNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Regra
        </Button>
      </div>

      {rules && rules.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Nenhuma regra configurada</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie regras para automatizar tarefas repetitivas no processo seletivo
            </p>
            <Button onClick={onNew}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Regra
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rules?.map(rule => (
            <Card key={rule.id} className={!rule.ativo ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Switch
                        checked={rule.ativo}
                        onCheckedChange={() => handleToggle(rule.id, rule.ativo)}
                      />
                      <h3 className="font-medium">{rule.nome}</h3>
                      <Badge className={TIPO_COLORS[rule.tipo] || TIPO_COLORS['geral']}>
                        {TIPO_LABELS[rule.tipo] || rule.tipo}
                      </Badge>
                      <Badge variant="outline" className="font-mono text-xs">
                        P{rule.prioridade}
                      </Badge>
                    </div>

                    {rule.descricao && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {rule.descricao}
                      </p>
                    )}

                    {/* Conditions and Actions Preview */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted">
                        <Settings2 className="h-3 w-3" />
                        {rule.condicoes.length} condição(ões)
                      </div>
                      <ArrowRight className="h-3 w-3" />
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted">
                        <Zap className="h-3 w-3" />
                        {rule.acoes.length} ação(ões)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewLogs(rule.id)}
                      title="Ver histórico"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(rule.id)}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rule.id)}
                      className="text-destructive hover:text-destructive"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
