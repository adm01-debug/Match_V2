import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';

const steps = [
  { n: 1, title: 'Indique', text: 'Indique amigos, familiares ou conhecidos para as vagas disponíveis' },
  { n: 2, title: 'Acompanhe', text: 'Acompanhe o status das suas indicações no sistema' },
  { n: 3, title: 'Receba', text: 'Receba R$ 500,00 de bônus para cada indicação contratada' },
];

export function IndicacoesRulesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Regras do Programa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ n, title, text }) => (
            <div key={n} className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-medium">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                  {n}
                </div>
                {title}
              </div>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
