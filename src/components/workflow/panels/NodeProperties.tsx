import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Trash2, Settings } from "lucide-react";
import { TRIGGER_LABELS, ACTION_LABELS, WorkflowNode } from "@/types/workflow";

interface NodePropertiesProps {
  node: WorkflowNode | null;
  onChange: (node: WorkflowNode) => void;
  onDelete: (nodeId: string) => void;
}

export function NodeProperties({ node, onChange, onDelete }: NodePropertiesProps) {
  if (!node) {
    return (
      <Card className="w-72">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Selecione um nó para editar suas propriedades</p>
        </CardContent>
      </Card>
    );
  }

  const updateConfig = (key: string, value: unknown) => {
    onChange({
      ...node,
      data: {
        ...node.data,
        config: { ...node.data.config, [key]: value },
      },
    });
  };

  return (
    <Card className="w-72">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Propriedades</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => onDelete(node.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nome do nó */}
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input
            value={node.data.label}
            onChange={(e) => onChange({ ...node, data: { ...node.data, label: e.target.value } })}
          />
        </div>

        {/* Configurações específicas por tipo */}
        {node.type === "trigger" && (
          <div className="space-y-2">
            <Label>Evento</Label>
            <Select
              value={node.data.trigger}
              onValueChange={(v) => onChange({ ...node, data: { ...node.data, trigger: v as any } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o gatilho" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TRIGGER_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {node.type === "action" && (
          <>
            <div className="space-y-2">
              <Label>Ação</Label>
              <Select
                value={node.data.action}
                onValueChange={(v) => onChange({ ...node, data: { ...node.data, action: v as any } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a ação" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTION_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {node.data.action === "send_email" && (
              <>
                <div className="space-y-2">
                  <Label>Assunto</Label>
                  <Input
                    value={(node.data.config as any)?.subject || ""}
                    onChange={(e) => updateConfig("subject", e.target.value)}
                    placeholder="Assunto do email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select
                    value={(node.data.config as any)?.template || ""}
                    onValueChange={(v) => updateConfig("template", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Boas-vindas</SelectItem>
                      <SelectItem value="interview_scheduled">Entrevista Agendada</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="offer">Proposta</SelectItem>
                      <SelectItem value="rejection">Reprovação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {node.data.action === "move_stage" && (
              <div className="space-y-2">
                <Label>Mover para</Label>
                <Select
                  value={(node.data.config as any)?.stage || ""}
                  onValueChange={(v) => updateConfig("stage", v)}
                >
                  <SelectTrigger>
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
              </div>
            )}
          </>
        )}

        {node.type === "condition" && (
          <>
            <div className="space-y-2">
              <Label>Campo</Label>
              <Select
                value={(node.data.config as any)?.field || ""}
                onValueChange={(v) => updateConfig("field", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="etapa_atual">Etapa Atual</SelectItem>
                  <SelectItem value="fonte">Fonte</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="dias_na_etapa">Dias na Etapa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Operador</Label>
              <Select
                value={(node.data.config as any)?.operator || ""}
                onValueChange={(v) => updateConfig("operator", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Igual a</SelectItem>
                  <SelectItem value="not_equals">Diferente de</SelectItem>
                  <SelectItem value="greater_than">Maior que</SelectItem>
                  <SelectItem value="less_than">Menor que</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input
                value={(node.data.config as any)?.value || ""}
                onChange={(e) => updateConfig("value", e.target.value)}
                placeholder="Valor para comparação"
              />
            </div>
          </>
        )}

        {node.type === "delay" && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Tempo</Label>
              <Input
                type="number"
                min="1"
                value={(node.data.config as any)?.duration || ""}
                onChange={(e) => updateConfig("duration", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Unidade</Label>
              <Select
                value={(node.data.config as any)?.unit || "hours"}
                onValueChange={(v) => updateConfig("unit", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutos</SelectItem>
                  <SelectItem value="hours">Horas</SelectItem>
                  <SelectItem value="days">Dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
