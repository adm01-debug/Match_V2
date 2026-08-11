/**
 * @fileoverview Botão para envio de lembretes de entrevista
 * @module InterviewReminderButton
 */

import { useState } from 'react';
import { Bell, BellRing, Users, User, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useInterviewReminders, ReminderConfig } from '@/hooks/useInterviewReminders';

interface InterviewReminderButtonProps {
  entrevistaId?: string;
  candidatoNome?: string;
  variant?: 'default' | 'bulk';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function InterviewReminderButton({
  entrevistaId,
  candidatoNome,
  variant = 'default',
  size = 'default',
}: InterviewReminderButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [config, setConfig] = useState<ReminderConfig>({
    hoursAhead: 24,
    sendToCandidate: true,
    sendToInterviewers: true,
  });
  
  const { sendReminder, sendBulkReminders, isLoading } = useInterviewReminders();

  const handleSendReminder = async () => {
    if (variant === 'bulk') {
      await sendBulkReminders(config);
    } else if (entrevistaId) {
      await sendReminder(entrevistaId, config);
    }
    setShowDialog(false);
  };

  const handleQuickSend = async (toCandidate: boolean, toInterviewers: boolean) => {
    if (entrevistaId) {
      await sendReminder(entrevistaId, {
        sendToCandidate: toCandidate,
        sendToInterviewers: toInterviewers,
      });
    }
  };

  if (variant === 'bulk') {
    return (
      <>
        <Button
          variant="outline"
          size={size}
          onClick={() => setShowDialog(true)}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BellRing className="h-4 w-4" />
          )}
          Enviar Lembretes
        </Button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-primary" />
                Enviar Lembretes em Massa
              </DialogTitle>
              <DialogDescription>
                Envie lembretes para todas as entrevistas agendadas nas próximas horas.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Enviar para entrevistas em:</Label>
                <div className="flex flex-wrap gap-2">
                  {[6, 12, 24, 48].map((hours) => (
                    <Badge
                      key={hours}
                      variant={config.hoursAhead === hours ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setConfig({ ...config, hoursAhead: hours })}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {hours}h
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Destinatários:</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bulk-candidate"
                      checked={config.sendToCandidate}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, sendToCandidate: !!checked })
                      }
                    />
                    <Label htmlFor="bulk-candidate" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Candidatos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bulk-interviewers"
                      checked={config.sendToInterviewers}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, sendToInterviewers: !!checked })
                      }
                    />
                    <Label htmlFor="bulk-interviewers" className="flex items-center gap-2 cursor-pointer">
                      <Users className="h-4 w-4" />
                      Entrevistadores
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSendReminder}
                disabled={isLoading || (!config.sendToCandidate && !config.sendToInterviewers)}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Enviar Lembretes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={size} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <BellRing className="h-4 w-4" />
          Enviar Lembrete
          {candidatoNome && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {candidatoNome}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleQuickSend(true, false)}>
          <User className="h-4 w-4 mr-2" />
          Apenas para candidato
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleQuickSend(false, true)}>
          <Users className="h-4 w-4 mr-2" />
          Apenas para entrevistadores
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleQuickSend(true, true)}>
          <BellRing className="h-4 w-4 mr-2" />
          Para todos
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setShowDialog(true)}>
          <Clock className="h-4 w-4 mr-2" />
          Configurar lembrete...
        </DropdownMenuItem>
      </DropdownMenuContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Configurar Lembrete
            </DialogTitle>
            <DialogDescription>
              Personalize quem receberá o lembrete da entrevista.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="candidate"
                  checked={config.sendToCandidate}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, sendToCandidate: !!checked })
                  }
                />
                <Label htmlFor="candidate" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Enviar para candidato
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="interviewers"
                  checked={config.sendToInterviewers}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, sendToInterviewers: !!checked })
                  }
                />
                <Label htmlFor="interviewers" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Enviar para entrevistadores
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSendReminder}
              disabled={isLoading || (!config.sendToCandidate && !config.sendToInterviewers)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
