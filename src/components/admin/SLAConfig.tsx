import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Clock, AlertTriangle } from 'lucide-react';

export function SLAConfig() {
  const { toast } = useToast();
  const [slas, setSlas] = useState([
    { etapa: 'Triagem', dias: 3 },
    { etapa: 'Entrevista RH', dias: 5 },
    { etapa: 'Teste Técnico', dias: 7 },
    { etapa: 'Entrevista Gestor', dias: 5 },
    { etapa: 'Proposta', dias: 3 },
  ]);

  const handleSave = () => toast({ title: 'SLAs atualizados com sucesso' });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Configuração de SLA</CardTitle>
        <CardDescription>Defina os prazos máximos por etapa do processo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {slas.map((sla, i) => (
          <div key={sla.etapa} className="flex items-center gap-3">
            <Label className="w-40">{sla.etapa}</Label>
            <Input type="number" className="w-20" value={sla.dias} onChange={(e) => {
              const updated = [...slas];
              updated[i] = { ...sla, dias: parseInt(e.target.value) || 0 };
              setSlas(updated);
            }} />
            <span className="text-sm text-muted-foreground">dias</span>
          </div>
        ))}
        <Button onClick={handleSave} className="mt-2">Salvar SLAs</Button>
      </CardContent>
    </Card>
  );
}

export function SLADashboard() {
  const mockData = [
    { etapa: 'Triagem', total: 15, emRisco: 3, vencidos: 1 },
    { etapa: 'Entrevista RH', total: 8, emRisco: 2, vencidos: 0 },
    { etapa: 'Teste Técnico', total: 5, emRisco: 1, vencidos: 1 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Dashboard de SLA</CardTitle>
        <CardDescription>Visão geral do cumprimento dos prazos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockData.map((item) => (
          <div key={item.etapa} className="flex items-center justify-between p-3 rounded-lg border">
            <span className="font-medium">{item.etapa}</span>
            <div className="flex gap-2">
              <Badge variant="secondary">{item.total} total</Badge>
              {item.emRisco > 0 && <Badge variant="outline" className="text-yellow-600">{item.emRisco} em risco</Badge>}
              {item.vencidos > 0 && <Badge variant="destructive">{item.vencidos} vencidos</Badge>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
