import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare, Plus } from "lucide-react";
import { CandidatoPerfil } from "@/data/candidatoPerfilData";
import { EnviarEmailDialog } from "@/components/comunicacao/EnviarEmailDialog";
import { HistoricoComunicacoes } from "@/components/comunicacao/HistoricoComunicacoes";

interface ComunicacaoTabProps {
  candidato: CandidatoPerfil;
}

export function ComunicacaoTab({ candidato }: ComunicacaoTabProps) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Ações Rápidas */}
      <Card role="article" aria-label="Comunicações com candidato">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comunicação
          </CardTitle>
          <CardDescription>
            Envie e-mails e gerencie a comunicação com o candidato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setEmailDialogOpen(true)}>
              <Send className="h-4 w-4 mr-2" />
              Enviar E-mail
            </Button>
            <Button variant="outline" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Agendar Lembrete (Em breve)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Histórico */}
      <HistoricoComunicacoes candidatoId={candidato.id} />

      {/* Dialog de Envio */}
      <EnviarEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        candidato={{
          id: candidato.id,
          nome: candidato.nome,
          email: candidato.email,
          vagaTitulo: candidato.vagaAtual,
        }}
      />
    </div>
  );
}
