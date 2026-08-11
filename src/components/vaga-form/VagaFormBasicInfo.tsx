import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";

const departamentos = ["Produção", "Marketing/Arte", "Comercial", "Financeiro", "Administrativo", "Logística", "TI", "RH"];

interface VagaFormBasicInfoProps {
  formData: {
    titulo: string;
    departamento: string;
    quantidade: number;
    gestorNome: string;
    recrutadorNome: string;
    prioridade: string;
  };
  onChange: (field: string, value: string | number | boolean) => void;
}

export function VagaFormBasicInfo({ formData, onChange }: VagaFormBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-5 w-5 text-primary" />
          Informações Básicas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="titulo">Título da Vaga *</Label>
            <Input id="titulo" value={formData.titulo} onChange={(e) => onChange("titulo", e.target.value)} placeholder="Ex: Operador de Gravação" />
          </div>
          <div>
            <Label htmlFor="departamento">Área/Departamento *</Label>
            <Select value={formData.departamento} onValueChange={(v) => onChange("departamento", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione o departamento" /></SelectTrigger>
              <SelectContent className="bg-popover">
                {departamentos.map((dep) => (<SelectItem key={dep} value={dep}>{dep}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantidade">Quantidade de Vagas *</Label>
            <Input id="quantidade" type="number" min={1} value={formData.quantidade} onChange={(e) => onChange("quantidade", parseInt(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="gestor">Gestor Responsável</Label>
            <Input id="gestor" value={formData.gestorNome} onChange={(e) => onChange("gestorNome", e.target.value)} placeholder="Nome do gestor responsável" />
          </div>
          <div>
            <Label htmlFor="recrutador">Recrutador Responsável</Label>
            <Input id="recrutador" value={formData.recrutadorNome} onChange={(e) => onChange("recrutadorNome", e.target.value)} placeholder="Nome do recrutador responsável" />
          </div>
          <div>
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select value={formData.prioridade} onValueChange={(v) => onChange("prioridade", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="urgente">🔥 Urgente</SelectItem>
                <SelectItem value="alta">⚠️ Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
