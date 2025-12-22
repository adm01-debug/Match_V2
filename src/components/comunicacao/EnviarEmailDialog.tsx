import { useCallback,  memo  } from 'react';
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Send, Loader2, Eye, User } from "lucide-react";
import { emailTemplatesMock, variaveisDisponiveis } from "@/data/emailTemplatesData";
import { useComunicacoes } from "@/hooks/useComunicacoes";

interface Candidato {
  id: string;
  nome: string;
  email: string;
  vagaTitulo?: string;
}

interface EnviarEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidato: Candidato;
  onSuccess?: () => void;
}

export function EnviarEmailDialog({ open, onOpenChange, candidato, onSuccess }: EnviarEmailDialogProps) {
  const { registrarComunicacao, isRegistrando } = useComunicacoes();

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [assunto, setAssunto] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const activeTemplates = useMemo(() => emailTemplatesMock.filter((t) => t.ativo), []);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplatesMock.find((t) => t.id === templateId);
    if (!template) return;

    // Substitui variáveis com dados do candidato
    const processedSubject = template.assunto
      .replace(/{{candidato_nome}}/g, candidato.nome)
      .replace(/{{vaga_titulo}}/g, candidato.vagaTitulo || "Vaga em Aberto")
      .replace(/{{empresa_nome}}/g, "Promo Brindes");

    const processedContent = template.conteudo
      .replace(/{{candidato_nome}}/g, candidato.nome)
      .replace(/{{vaga_titulo}}/g, candidato.vagaTitulo || "Vaga em Aberto")
      .replace(/{{empresa_nome}}/g, "Promo Brindes")
      .replace(/{{data_entrevista}}/g, "[DATA A DEFINIR]")
      .replace(/{{hora_entrevista}}/g, "[HORA A DEFINIR]")
      .replace(/{{local_entrevista}}/g, "[LOCAL A DEFINIR]")
      .replace(/{{recrutador_nome}}/g, "Equipe RH")
      .replace(/{{prazo_testes}}/g, "3 dias")
      .replace(/{{salario_proposto}}/g, "[A COMBINAR]")
      .replace(/{{data_inicio}}/g, "[A DEFINIR]");

    setAssunto(processedSubject);
    setConteudo(processedContent);
  };

  const handleSend = async () => {
    if (!assunto.trim() || !conteudo.trim()) {
      toast.error("Preencha o assunto e o conteúdo do e-mail");
      return;
    }

    try {
      const template = emailTemplatesMock.find((t) => t.id === selectedTemplate);
      
      await registrarComunicacao({
        candidato_id: candidato.id,
        assunto,
        conteudo,
        template_nome: template?.nome || 'E-mail personalizado',
        template_etapa: template?.etapa || 'geral',
      });

      toast.success(`E-mail registrado para ${candidato.email}`, {
        description: "A comunicação foi salva no histórico.",
      });

      onOpenChange(false);
      onSuccess?.();

      // Reset
      setSelectedTemplate("");
      setAssunto("");
      setConteudo("");
      setShowPreview(false);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      toast.error("Erro ao registrar e-mail", {
        description: "Tente novamente em alguns instantes.",
      });
    }
  };

  const copyVariable = (variable: string) => {
    const currentPosition = (document.activeElement as HTMLTextAreaElement)?.selectionStart || conteudo.length;
    const newContent = conteudo.slice(0, currentPosition) + variable + conteudo.slice(currentPosition);
    setConteudo(newContent);
    toast.success("Variável inserida");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Enviar E-mail
          </DialogTitle>
          <DialogDescription>Envie um e-mail para o candidato selecionado</DialogDescription>
        </DialogHeader>

        <div role="region" aria-label="Enviar email" className="space-y-4 py-4">
          {/* Destinatário */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{candidato.nome}</p>
              <p className="text-sm text-muted-foreground">{candidato.email}</p>
            </div>
          </div>

          {/* Seleção de Template */}
          <div className="space-y-2">
            <Label>Usar Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template ou escreva do zero..." />
              </SelectTrigger>
              <SelectContent>
                {activeTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assunto */}
          <div className="space-y-2">
            <Label>Assunto *</Label>
            <Input
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              placeholder="Digite o assunto do e-mail..."
            />
          </div>

          {/* Conteúdo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Conteúdo *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {showPreview ? "Editar" : "Preview"}
              </Button>
            </div>

            {showPreview ? (
              <div className="min-h-[200px] p-4 bg-muted/30 rounded-lg border whitespace-pre-wrap text-sm">
                {conteudo || "Nenhum conteúdo..."}
              </div>
            ) : (
              <Textarea
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                placeholder="Digite o conteúdo do e-mail..."
                className="min-h-[200px]"
              />
            )}
          </div>

          {/* Variáveis Disponíveis */}
          {!showPreview && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Variáveis disponíveis (clique para inserir):</p>
              <div className="flex flex-wrap gap-1">
                {variaveisDisponiveis.map((v) => (
                  <Badge
                    key={v.nome}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 text-xs"
                    onClick={() => copyVariable(v.nome)}
                  >
                    {v.nome}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRegistrando}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={isRegistrando || !assunto.trim() || !conteudo.trim()}>
            {isRegistrando ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar E-mail
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
