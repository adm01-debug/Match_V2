import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface VagaFormDescriptionProps {
  formData: {
    descricaoEmpresa: string;
    responsabilidades: string;
    requisitosObrigatorios: string;
    requisitosDesejaveis: string;
  };
  onChange: (field: string, value: string) => void;
}

export function VagaFormDescription({ formData, onChange }: VagaFormDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-5 w-5 text-primary" />
          Descrição da Vaga
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="descricaoEmpresa">Sobre a Empresa</Label>
          <Textarea id="descricaoEmpresa" value={formData.descricaoEmpresa} onChange={(e) => onChange("descricaoEmpresa", e.target.value)} rows={3} />
        </div>
        <div>
          <Label htmlFor="responsabilidades">Responsabilidades *</Label>
          <Textarea id="responsabilidades" value={formData.responsabilidades} onChange={(e) => onChange("responsabilidades", e.target.value)} placeholder="• Descreva as principais responsabilidades&#10;• Uma por linha" rows={5} />
        </div>
        <div>
          <Label htmlFor="requisitosObrigatorios">Requisitos Obrigatórios *</Label>
          <Textarea id="requisitosObrigatorios" value={formData.requisitosObrigatorios} onChange={(e) => onChange("requisitosObrigatorios", e.target.value)} placeholder="• Liste os requisitos obrigatórios&#10;• Um por linha" rows={4} />
        </div>
        <div>
          <Label htmlFor="requisitosDesejaveis">Requisitos Desejáveis</Label>
          <Textarea id="requisitosDesejaveis" value={formData.requisitosDesejaveis} onChange={(e) => onChange("requisitosDesejaveis", e.target.value)} placeholder="• Liste os requisitos desejáveis&#10;• Um por linha" rows={3} />
        </div>
      </CardContent>
    </Card>
  );
}
