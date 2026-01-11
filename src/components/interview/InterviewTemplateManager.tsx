/**
 * @component InterviewTemplateManager
 * @description Gerenciador de templates de entrevista estruturada
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  MessageSquare, 
  Clock,
  GripVertical,
  FileText
} from 'lucide-react';
import { useInterviewTemplates, useCreateInterviewTemplate, useDeleteInterviewTemplate, type InterviewTemplate, type TemplatePergunta } from '@/hooks/useInterviewTemplates';
import { toast } from 'sonner';

const TIPO_LABELS: Record<string, string> = {
  tecnica: 'Técnica',
  comportamental: 'Comportamental',
  cultural: 'Cultural',
  final: 'Final',
  mista: 'Mista',
};

const TIPO_COLORS: Record<string, string> = {
  tecnica: 'bg-blue-100 text-blue-800',
  comportamental: 'bg-green-100 text-green-800',
  cultural: 'bg-purple-100 text-purple-800',
  final: 'bg-amber-100 text-amber-800',
  mista: 'bg-gray-100 text-gray-800',
};

const PERGUNTA_TIPOS = [
  { value: 'comportamental', label: 'Comportamental' },
  { value: 'tecnica', label: 'Técnica' },
  { value: 'situacional', label: 'Situacional' },
  { value: 'cultural', label: 'Cultural' },
];

interface TemplateFormProps {
  onSave: (template: Omit<InterviewTemplate, 'id' | 'perguntas'> & { perguntas: Omit<TemplatePergunta, 'id' | 'templateId'>[] }) => void;
  onCancel: () => void;
  initialData?: InterviewTemplate;
}

function TemplateForm({ onSave, onCancel, initialData }: TemplateFormProps) {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [descricao, setDescricao] = useState(initialData?.descricao || '');
  const [tipo, setTipo] = useState<InterviewTemplate['tipo']>(initialData?.tipo || 'comportamental');
  const [duracaoEstimada, setDuracaoEstimada] = useState(initialData?.duracaoEstimada || 60);
  const [ativo, setAtivo] = useState(initialData?.ativo ?? true);
  const [perguntas, setPerguntas] = useState<Omit<TemplatePergunta, 'id' | 'templateId'>[]>(
    initialData?.perguntas.map(p => ({
      texto: p.texto,
      tipo: p.tipo,
      competenciaId: p.competenciaId,
      ordem: p.ordem,
      obrigatoria: p.obrigatoria,
      criteriosAvaliacao: p.criteriosAvaliacao,
      respostaEsperada: p.respostaEsperada,
    })) || []
  );

  const addPergunta = () => {
    setPerguntas([
      ...perguntas,
      {
        texto: '',
        tipo: 'comportamental',
        ordem: perguntas.length,
        obrigatoria: true,
      },
    ]);
  };

  const updatePergunta = (index: number, field: string, value: unknown) => {
    const updated = [...perguntas];
    (updated[index] as Record<string, unknown>)[field] = value;
    setPerguntas(updated);
  };

  const removePergunta = (index: number) => {
    setPerguntas(perguntas.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    onSave({
      nome,
      descricao: descricao || undefined,
      tipo,
      duracaoEstimada,
      ativo,
      perguntas: perguntas.map((p, i) => ({ ...p, ordem: i })),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Template</Label>
          <Input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Entrevista Comportamental Sênior"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo</Label>
          <Select value={tipo} onValueChange={(v) => setTipo(v as InterviewTemplate['tipo'])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TIPO_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
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
          placeholder="Descreva o objetivo deste template..."
          rows={2}
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Label htmlFor="duracao">Duração (min):</Label>
          <Input
            id="duracao"
            type="number"
            value={duracaoEstimada}
            onChange={(e) => setDuracaoEstimada(parseInt(e.target.value) || 60)}
            className="w-24"
            min={15}
            max={180}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={ativo} onCheckedChange={setAtivo} />
          <Label>Template Ativo</Label>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Perguntas</h3>
          <Button variant="outline" size="sm" onClick={addPergunta}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Pergunta
          </Button>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-3 pr-4">
            {perguntas.map((pergunta, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-start gap-2">
                  <div className="p-1 cursor-move text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {index + 1}
                      </Badge>
                      <Select 
                        value={pergunta.tipo} 
                        onValueChange={(v) => updatePergunta(index, 'tipo', v)}
                      >
                        <SelectTrigger className="w-40 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PERGUNTA_TIPOS.map(t => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex-1" />
                      <div className="flex items-center gap-1">
                        <Switch 
                          checked={pergunta.obrigatoria} 
                          onCheckedChange={(v) => updatePergunta(index, 'obrigatoria', v)}
                        />
                        <span className="text-xs text-muted-foreground">Obrigatória</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removePergunta(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={pergunta.texto}
                      onChange={(e) => updatePergunta(index, 'texto', e.target.value)}
                      placeholder="Digite a pergunta..."
                      rows={2}
                    />
                    <Input
                      value={pergunta.respostaEsperada || ''}
                      onChange={(e) => updatePergunta(index, 'respostaEsperada', e.target.value)}
                      placeholder="Resposta esperada (opcional)"
                      className="text-sm"
                    />
                  </div>
                </div>
              </Card>
            ))}

            {perguntas.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma pergunta adicionada</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Salvar Template
        </Button>
      </div>
    </div>
  );
}

export function InterviewTemplateManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<InterviewTemplate | null>(null);

  const { data: templates, isLoading } = useInterviewTemplates();
  const createTemplate = useCreateInterviewTemplate();
  const deleteTemplate = useDeleteInterviewTemplate();

  const handleSave = async (template: Omit<InterviewTemplate, 'id' | 'perguntas'> & { perguntas: Omit<TemplatePergunta, 'id' | 'templateId'>[] }) => {
    try {
      await createTemplate.mutateAsync(template);
      toast.success('Template salvo com sucesso');
      setShowForm(false);
      setEditingTemplate(null);
    } catch (error) {
      toast.error('Erro ao salvar template');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) return;

    try {
      await deleteTemplate.mutateAsync(id);
      toast.success('Template excluído');
    } catch (error) {
      toast.error('Erro ao excluir template');
    }
  };

  if (showForm || editingTemplate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {editingTemplate ? 'Editar Template' : 'Novo Template'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateForm
            initialData={editingTemplate || undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingTemplate(null);
            }}
          />
        </CardContent>
      </Card>
    );
  }

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
            <FileText className="h-5 w-5 text-primary" />
            Templates de Entrevista
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure templates com perguntas estruturadas
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      {templates && templates.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Nenhum template criado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie templates para padronizar suas entrevistas
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templates?.map(template => (
            <Card key={template.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{template.nome}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={TIPO_COLORS[template.tipo] || TIPO_COLORS.mista}>
                        {TIPO_LABELS[template.tipo] || template.tipo}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {template.duracaoEstimada} min
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {template.descricao && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.descricao}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {template.perguntas.length} pergunta(s)
                  </Badge>
                  <Badge variant={template.ativo ? 'default' : 'secondary'}>
                    {template.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
