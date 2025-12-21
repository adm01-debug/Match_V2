import { memo } from 'react';
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Comunicacao {
  id: string;
  assunto: string;
  conteudo: string;
  template_nome: string;
  template_etapa: string;
  enviado_em: string;
  enviado_por: string | null;
}

interface HistoricoComunicacoesProps {
  candidatoId: string;
  className?: string;
}

const etapaColors: Record<string, string> = {
  candidatura_recebida: "bg-blue-500/20 text-blue-400",
  triagem: "bg-purple-500/20 text-purple-400",
  convite_entrevista_rh: "bg-amber-500/20 text-amber-400",
  convite_entrevista_gestor: "bg-orange-500/20 text-orange-400",
  convite_testes: "bg-pink-500/20 text-pink-400",
  feedback_positivo: "bg-emerald-500/20 text-emerald-400",
  feedback_negativo: "bg-red-500/20 text-red-400",
  proposta: "bg-teal-500/20 text-teal-400",
  contratacao: "bg-green-500/20 text-green-400",
  comunicacao: "bg-slate-500/20 text-slate-400",
};

export function HistoricoComunicacoes({ candidatoId, className }: HistoricoComunicacoesProps) {
  const [comunicacoes, setComunicacoes] = useState<Comunicacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComunicacoes() {
      try {
        const { data, error } = await supabase
          .from("comunicacoes")
          .select("*")
          .eq("candidato_id", candidatoId)
          .order("enviado_em", { ascending: false });

        if (error) throw error;
        setComunicacoes(data || []);
      } catch (error) {
        console.error("Erro ao buscar comunicações:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchComunicacoes();
  }, [candidatoId]);

  if (loading) {
    return (
      <Card role="article" aria-label="Histórico" className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Histórico de Comunicações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Histórico de Comunicações
        </CardTitle>
        <CardDescription>
          E-mails enviados para este candidato
        </CardDescription>
      </CardHeader>
      <CardContent>
        {comunicacoes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Nenhuma comunicação registrada</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {comunicacoes.map((com) => (
                <div
                  key={com.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium line-clamp-1">{com.assunto}</h4>
                    <Badge className={etapaColors[com.template_etapa] || etapaColors.comunicacao}>
                      {com.template_nome}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {com.conteudo}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(com.enviado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                    {com.enviado_por && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Enviado por usuário
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
