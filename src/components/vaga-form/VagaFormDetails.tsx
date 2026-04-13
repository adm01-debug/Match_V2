import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

const beneficiosOpcoes = [
  "Vale Transporte", "Vale Refeição", "Vale Alimentação", "Plano de Saúde",
  "Plano Odontológico", "Seguro de Vida", "PLR", "Bônus", "Gympass", "Home Office", "Auxílio Creche",
];

interface VagaFormDetailsProps {
  formData: {
    tipoContrato: string;
    modalidade: string;
    horarioTrabalho: string;
    cidade: string;
    estado: string;
    salarioMin: string | number;
    salarioMax: string | number;
    salarioACombinar: boolean;
    beneficios: string[];
  };
  onChange: (field: string, value: string | number | boolean | string[]) => void;
  onToggleBeneficio: (beneficio: string) => void;
}

export function VagaFormDetails({ formData, onChange, onToggleBeneficio }: VagaFormDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-5 w-5 text-primary" />
          Detalhes da Posição
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Tipo de Contrato</Label>
            <Select value={formData.tipoContrato} onValueChange={(v) => onChange("tipoContrato", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="clt">CLT</SelectItem>
                <SelectItem value="pj">PJ</SelectItem>
                <SelectItem value="estagio">Estágio</SelectItem>
                <SelectItem value="temporario">Temporário</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Modalidade</Label>
            <Select value={formData.modalidade} onValueChange={(v) => onChange("modalidade", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="hibrido">Híbrido</SelectItem>
                <SelectItem value="remoto">Remoto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Horário de Trabalho</Label>
            <Input value={formData.horarioTrabalho} onChange={(e) => onChange("horarioTrabalho", e.target.value)} />
          </div>
          <div>
            <Label>Cidade</Label>
            <Input value={formData.cidade} onChange={(e) => onChange("cidade", e.target.value)} />
          </div>
          <div>
            <Label>Estado</Label>
            <Input value={formData.estado} onChange={(e) => onChange("estado", e.target.value)} maxLength={2} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Faixa Salarial</Label>
          <div className="flex items-center gap-4">
            <Input type="number" placeholder="Mínimo" value={formData.salarioMin} onChange={(e) => onChange("salarioMin", e.target.value)} disabled={formData.salarioACombinar} className="w-40" />
            <span className="text-muted-foreground">até</span>
            <Input type="number" placeholder="Máximo" value={formData.salarioMax} onChange={(e) => onChange("salarioMax", e.target.value)} disabled={formData.salarioACombinar} className="w-40" />
            <div className="flex items-center gap-2">
              <Checkbox id="salarioACombinar" checked={formData.salarioACombinar} onCheckedChange={(v) => onChange("salarioACombinar", v)} />
              <Label htmlFor="salarioACombinar" className="text-sm font-normal">A combinar</Label>
            </div>
          </div>
        </div>
        <div>
          <Label>Benefícios</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {beneficiosOpcoes.map((beneficio) => (
              <Badge key={beneficio} variant={formData.beneficios.includes(beneficio) ? "default" : "outline"} className="cursor-pointer" onClick={() => onToggleBeneficio(beneficio)}>
                {beneficio}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
