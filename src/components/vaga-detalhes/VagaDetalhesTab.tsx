import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface VagaDetalhes {
  modalidade?: string;
  tipoContrato?: string;
  salarioMin?: number | null;
  salarioMax?: number | null;
  salarioACombinar?: boolean;
  beneficios?: string[];
  descricaoEmpresa?: string;
  responsabilidades?: string;
}

interface VagaDetalhesTabProps {
  vaga: VagaDetalhes;
}

export const VagaDetalhesTab = memo(function VagaDetalhesTab({ vaga }: VagaDetalhesTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-muted-foreground">Modalidade</p><p className="font-medium capitalize">{vaga.modalidade}</p></div>
            <div><p className="text-sm text-muted-foreground">Tipo</p><p className="font-medium uppercase">{vaga.tipoContrato}</p></div>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1"><DollarSign className="h-4 w-4" />Remuneração</p>
            <p className="font-medium">
              {vaga.salarioACombinar ? 'A combinar' : vaga.salarioMin && vaga.salarioMax 
                ? `R$ ${vaga.salarioMin.toLocaleString()} - R$ ${vaga.salarioMax.toLocaleString()}` : 'Não informado'}
            </p>
          </div>
          {vaga.beneficios && vaga.beneficios.length > 0 && (
            <>
              <Separator />
              <div><p className="text-sm text-muted-foreground mb-2">Benefícios</p>
                <div className="flex flex-wrap gap-1">{vaga.beneficios.map((b: string, i: number) => <Badge key={i} variant="secondary">{b}</Badge>)}</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Descrição</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {vaga.descricaoEmpresa && (<div><p className="text-sm text-muted-foreground mb-1">Sobre a Empresa</p><p className="text-sm whitespace-pre-line">{vaga.descricaoEmpresa}</p></div>)}
          {vaga.responsabilidades && (<div><p className="text-sm text-muted-foreground mb-1">Responsabilidades</p><p className="text-sm whitespace-pre-line">{vaga.responsabilidades}</p></div>)}
        </CardContent>
      </Card>
    </div>
  );
});
