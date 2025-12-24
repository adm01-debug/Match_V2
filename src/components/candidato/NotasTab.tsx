/**
 * @fileoverview NotasTab component
 * @module NotasTab
 */

import { useMemo,  useCallback,  memo   } from 'react';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Plus, Clock, User, Trash2, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Nota {
  id: string;
  conteudo: string;
  autor: string;
  data: string;
  tipo: "geral" | "entrevista" | "tecnico" | "comportamental";
}

interface NotasTabProps {
  candidatoId: string;
}

const tipoColors: Record<string, string> = {
  geral: "bg-slate-500/20 text-slate-400",
  entrevista: "bg-blue-500/20 text-blue-400",
  tecnico: "bg-purple-500/20 text-purple-400",
  comportamental: "bg-amber-500/20 text-amber-400",
};

const tipoLabels: Record<string, string> = {
  geral: "Geral",
  entrevista: "Entrevista",
  tecnico: "Técnico",
  comportamental: "Comportamental",
};

export function NotasTab({ candidatoId }: NotasTabProps) {
  const [notas, setNotas] = useState<Nota[]>([
    {
      id: "1",
      conteudo: "Candidato demonstrou boa comunicação durante a triagem. Tem interesse genuíno na empresa.",
      autor: "Maria Santos",
      data: "12/12/2025 10:30",
      tipo: "entrevista",
    },
    {
      id: "2",
      conteudo: "Experiência sólida com gravação a laser. Conhece bem os equipamentos da marca XYZ.",
      autor: "Carlos Mendes",
      data: "14/12/2025 15:00",
      tipo: "tecnico",
    },
    {
      id: "3",
      conteudo: "Verificar disponibilidade para início em janeiro.",
      autor: "Maria Santos",
      data: "15/12/2025 09:00",
      tipo: "geral",
    },
  ]);
  
  const [novaNota, setNovaNota] = useState("");
  const [tipoNota, setTipoNota] = useState<Nota["tipo"]>("geral");
  const [editando, setEditando] = useState<string | null>(null);
  const [conteudoEditado, setConteudoEditado] = useState("");

  const handleAddNota = () => {
    if (!novaNota.trim()) {
      toast.error("Digite o conteúdo da nota");
      return;
    }

    const nota: Nota = {
      id: Date.now().toString(),
      conteudo: novaNota,
      autor: "Usuário Atual",
      data: new Date().toLocaleString("pt-BR"),
      tipo: tipoNota,
    };

    setNotas([nota, ...notas]);
    setNovaNota("");
    toast.success("Nota adicionada");
  };

  const handleDelete = (id: string) => {
    setNotas(notas.filter(n => n.id !== id));
    toast.success("Nota removida");
  };

  const handleEdit = (nota: Nota) => {
    setEditando(nota.id);
    setConteudoEditado(nota.conteudo);
  };

  const handleSaveEdit = (id: string) => {
    setNotas(notas.map(n => 
      n.id === id ? { ...n, conteudo: conteudoEditado } : n
    ));
    setEditando(null);
    toast.success("Nota atualizada");
  };

  return (
    <div data-testid="notas-tab" className="space-y-6">
      {/* Adicionar Nova Nota */}
      <Card role="article" aria-label="Notas">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nova Nota
          </CardTitle>
          <CardDescription>
            Adicione observações e anotações sobre o candidato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(tipoLabels).map(([key, label]) => (
              <Badge
                key={key}
                variant="outline"
                className={`cursor-pointer ${tipoNota === key ? tipoColors[key] : ""}`}
                onClick={() => setTipoNota(key as Nota["tipo"])}
              >
                {label}
              </Badge>
            ))}
          </div>
          <Textarea
            value={novaNota}
            onChange={(e) => setNovaNota(e.target.value)}
            placeholder="Digite sua nota..."
            className="min-h-[100px]"
          />
          <Button onClick={handleAddNota} disabled={!novaNota.trim()}>
            <StickyNote className="h-4 w-4 mr-2" />
            Adicionar Nota
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Notas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5" />
            Notas Registradas
          </CardTitle>
          <CardDescription>
            {notas.length} nota(s) sobre este candidato
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Nenhuma nota registrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notas.map((nota) => (
                <div
                  key={nota.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={tipoColors[nota.tipo]}>
                      {tipoLabels[nota.tipo]}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {editando === nota.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSaveEdit(nota.id)}
                          >
                            <Save className="h-4 w-4 text-success" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditando(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(nota)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(nota.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {editando === nota.id ? (
                    <Textarea
                      value={conteudoEditado}
                      onChange={(e) => setConteudoEditado(e.target.value)}
                      className="mb-2"
                    />
                  ) : (
                    <p className="text-sm mb-3">{nota.conteudo}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {nota.autor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {nota.data}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

NotasTab.displayName = "NotasTab";

export default memo(NotasTab);
