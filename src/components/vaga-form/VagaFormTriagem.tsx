import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, X, Target, Share2 } from "lucide-react";

const canaisDivulgacao = [
  { id: "portal", nome: "Portal de Vagas (site próprio)" },
  { id: "linkedin", nome: "LinkedIn" },
  { id: "indeed", nome: "Indeed" },
  { id: "catho", nome: "Catho" },
  { id: "infojobs", nome: "InfoJobs" },
  { id: "whatsapp", nome: "WhatsApp (grupos internos)" },
  { id: "instagram", nome: "Instagram" },
];

interface VagaFormTriagemProps {
  perguntasTriagem: Array<{ pergunta: string; eliminatoria: boolean }>;
  onAddPergunta: () => void;
  onRemovePergunta: (index: number) => void;
  onUpdatePergunta: (index: number, field: string, value: string | boolean) => void;
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  canais: string[];
  onToggleCanal: (canal: string) => void;
}

export function VagaFormTriagem({
  perguntasTriagem, onAddPergunta, onRemovePergunta, onUpdatePergunta,
  skills, onAddSkill, onRemoveSkill, canais, onToggleCanal,
}: VagaFormTriagemProps) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onAddSkill(newSkill.trim());
      setNewSkill("");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-5 w-5 text-primary" />
            Critérios de Seleção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Perguntas de Triagem (Knockout Questions)</Label>
              <Button variant="outline" size="sm" onClick={onAddPergunta}><Plus className="h-4 w-4 mr-1" />Adicionar</Button>
            </div>
            {perguntasTriagem.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma pergunta de triagem adicionada.</p>
            ) : (
              <div className="space-y-3">
                {perguntasTriagem.map((p, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <Input value={p.pergunta} onChange={(e) => onUpdatePergunta(index, "pergunta", e.target.value)} placeholder="Digite a pergunta..." />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={p.eliminatoria} onCheckedChange={(v) => onUpdatePergunta(index, "eliminatoria", v)} />
                      <Label className="text-sm font-normal whitespace-nowrap">Eliminatória</Label>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onRemovePergunta(index)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label>Skills/Competências para Avaliação</Label>
            <div className="flex gap-2 mt-2 mb-3">
              <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Digite uma skill e pressione Enter" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())} />
              <Button variant="outline" onClick={handleAddSkill}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => onRemoveSkill(skill)} />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Share2 className="h-5 w-5 text-primary" />
            Canais de Divulgação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {canaisDivulgacao.map((canal) => (
              <div key={canal.id} className="flex items-center gap-2">
                <Checkbox id={canal.id} checked={canais.includes(canal.id)} onCheckedChange={() => onToggleCanal(canal.id)} />
                <Label htmlFor={canal.id} className="text-sm font-normal">{canal.nome}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
