import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { InterviewReminderButton } from "@/components/agenda/InterviewReminderButton";
import { EntrevistaCardData, statusConfig, tipoConfig } from "./agendaConfig";

interface EntrevistaCardProps {
  entrevista: EntrevistaCardData;
  onConfirmar: (id: string) => void;
  onCancelar: (id: string) => void;
  onNoShow: (id: string) => void;
  onRegistrarFeedback: (entrevista: EntrevistaCardData) => void;
}

export function EntrevistaCard({
  entrevista,
  onConfirmar,
  onCancelar,
  onNoShow,
  onRegistrarFeedback,
}: EntrevistaCardProps) {
  const navigate = useNavigate();
  const status = statusConfig[entrevista.status as keyof typeof statusConfig];
  const tipo = tipoConfig[entrevista.tipo as keyof typeof tipoConfig];
  const TipoIcon = tipo?.icon || CalendarIcon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={undefined} />
            <AvatarFallback>{entrevista.candidatoNome?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium truncate">{entrevista.candidatoNome}</p>
              <Badge className={cn("border-0", status?.color)}>{status?.label}</Badge>
            </div>

            <p className="text-sm text-muted-foreground truncate">{entrevista.vagaTitulo}</p>

            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {entrevista.horaInicio}
              </span>
              <span className="flex items-center gap-1">
                <TipoIcon className="h-4 w-4" />
                {tipo?.label}
              </span>
              {entrevista.entrevistadores.length > 0 && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {entrevista.entrevistadores[0]}
                </span>
              )}
            </div>

            {entrevista.local && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {entrevista.local}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              {entrevista.status === "agendada" && (
                <>
                  <Button size="sm" variant="outline" onClick={() => onConfirmar(entrevista.id)}>
                    Confirmar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onCancelar(entrevista.id)}>
                    Cancelar
                  </Button>
                </>
              )}
              {entrevista.status === "confirmada" && (
                <>
                  <Button size="sm" onClick={() => onRegistrarFeedback(entrevista)}>
                    Registrar Feedback
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onNoShow(entrevista.id)}>
                    No-Show
                  </Button>
                </>
              )}
              {(entrevista.status === "agendada" || entrevista.status === "confirmada") && (
                <InterviewReminderButton
                  entrevistaId={entrevista.id}
                  candidatoNome={entrevista.candidatoNome}
                  size="sm"
                />
              )}
              {entrevista.candidatoId && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/candidato/${entrevista.candidatoId}`)}
                >
                  Ver Perfil
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
