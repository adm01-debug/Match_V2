import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Mail, Trash2, Plus } from "lucide-react";

interface ScheduledReport {
  id: string;
  reportType: string;
  frequency: "daily" | "weekly" | "monthly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  isActive: boolean;
  lastSent?: string;
  nextRun?: string;
}

interface ReportSchedulerProps {
  reportType: string;
  onSchedule?: (schedule: Omit<ScheduledReport, "id">) => void;
}

export function ReportScheduler({ reportType, onSchedule }: ReportSchedulerProps) {
  const { toast } = useToast();
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [time, setTime] = useState("08:00");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [isActive, setIsActive] = useState(true);

  const addRecipient = () => {
    if (newRecipient && newRecipient.includes("@")) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient("");
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const handleSchedule = () => {
    if (recipients.length === 0) {
      toast({ title: "Adicione ao menos um destinatário", variant: "destructive" });
      return;
    }

    const schedule: Omit<ScheduledReport, "id"> = {
      reportType,
      frequency,
      time,
      recipients,
      isActive,
      ...(frequency === "weekly" && { dayOfWeek: parseInt(dayOfWeek) }),
      ...(frequency === "monthly" && { dayOfMonth: parseInt(dayOfMonth) }),
    };

    onSchedule?.(schedule);
    toast({ title: "Agendamento criado!", description: "Você receberá os relatórios conforme configurado." });
  };

  const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agendar Relatório
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Frequência */}
        <div className="space-y-2">
          <Label>Frequência</Label>
          <Select value={frequency} onValueChange={(v) => setFrequency(v as typeof frequency)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dia da Semana (para semanal) */}
        {frequency === "weekly" && (
          <div className="space-y-2">
            <Label>Dia da Semana</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weekDays.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Dia do Mês (para mensal) */}
        {frequency === "monthly" && (
          <div className="space-y-2">
            <Label>Dia do Mês</Label>
            <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 28 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Horário */}
        <div className="space-y-2">
          <Label>Horário</Label>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        {/* Destinatários */}
        <div className="space-y-2">
          <Label>Destinatários</Label>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="email@exemplo.com"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRecipient()}
            />
            <Button variant="outline" size="icon" onClick={addRecipient}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {recipients.map((email) => (
              <Badge key={email} variant="secondary" className="gap-1">
                <Mail className="h-3 w-3" />
                {email}
                <Trash2 className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeRecipient(email)} />
              </Badge>
            ))}
          </div>
        </div>

        {/* Ativo */}
        <div className="flex items-center justify-between">
          <Label>Agendamento ativo</Label>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>

        <Button className="w-full" onClick={handleSchedule}>
          Salvar Agendamento
        </Button>
      </CardContent>
    </Card>
  );
}
