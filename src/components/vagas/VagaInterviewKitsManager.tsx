/**
 * @component VagaInterviewKitsManager
 * @description Gerencia os roteiros de entrevista (Interview Kits) atrelados a uma vaga.
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useVagaInterviewKits, useAttachKitToVaga, useDetachKitFromVaga } from "@/hooks/useInterviewKits";
import { toast } from "sonner";

interface VagaInterviewKitsManagerProps {
  vagaId: string;
}

export function VagaInterviewKitsManager({ vagaId }: VagaInterviewKitsManagerProps) {
  const { data: kits = [], isLoading } = useVagaInterviewKits(vagaId);
  const attach = useAttachKitToVaga();
  const detach = useDetachKitFromVaga();

  const { data: templates = [] } = useQuery({
    queryKey: ["templates-entrevista-ativos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("templates_entrevista")
        .select("id, nome, tipo_entrevista, duracao_sugerida")
        .eq("ativo", true)
        .order("nome");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [etapa, setEtapa] = useState("");

  const handleAttach = async () => {
    if (!selectedTemplate) {
      toast.error("Selecione um roteiro");
      return;
    }
    try {
      await attach.mutateAsync({
        vagaId,
        templateId: selectedTemplate,
        etapa: etapa || undefined,
        ordem: kits.length,
      });
      toast.success("Roteiro vinculado à vaga");
      setSelectedTemplate("");
      setEtapa("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao vincular");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Interview Kits
        </CardTitle>
        <CardDescription>
          Roteiros estruturados de entrevista aplicáveis a esta vaga.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um roteiro" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.nome}
                  {t.tipo_entrevista ? ` — ${t.tipo_entrevista}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Etapa (opcional)"
            value={etapa}
            onChange={(e) => setEtapa(e.target.value)}
            className="md:w-40"
          />
          <Button onClick={handleAttach} disabled={attach.isPending}>
            <Plus className="mr-1 h-4 w-4" /> Vincular
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : kits.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum roteiro vinculado ainda.
          </p>
        ) : (
          <ul className="space-y-2">
            {kits.map((k) => (
              <li
                key={k.id}
                className="flex items-center justify-between rounded-md border border-border bg-card p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{k.template?.nome ?? "Roteiro"}</span>
                  {k.template?.tipo_entrevista && (
                    <Badge variant="secondary">{k.template.tipo_entrevista}</Badge>
                  )}
                  {k.etapa && <Badge variant="outline">{k.etapa}</Badge>}
                  {k.template?.duracao_sugerida && (
                    <span className="text-xs text-muted-foreground">
                      {k.template.duracao_sugerida} min
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => detach.mutate({ id: k.id, vagaId })}
                  aria-label="Remover roteiro"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default VagaInterviewKitsManager;
