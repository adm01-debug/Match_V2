import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';
import { DEALBREAKER_SUGGESTIONS } from './types';

interface DealbreakersTabProps {
  dealbreakers: string[];
  toggleDealbreaker: (item: string) => void;
  customDealbreaker: string;
  setCustomDealbreaker: (v: string) => void;
  addCustomDealbreaker: () => void;
}

export function DealbreakersTab({ dealbreakers, toggleDealbreaker, customDealbreaker, setCustomDealbreaker, addCustomDealbreaker }: DealbreakersTabProps) {
  return (
    <div className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Comportamentos Inaceitáveis
          </CardTitle>
          <CardDescription>Selecione comportamentos que desqualificam candidatos automaticamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {DEALBREAKER_SUGGESTIONS.map((item) => (
              <Badge
                key={item}
                variant={dealbreakers.includes(item) ? 'destructive' : 'outline'}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleDealbreaker(item)}
              >
                {item}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Input
              value={customDealbreaker}
              onChange={(e) => setCustomDealbreaker(e.target.value)}
              placeholder="Adicionar dealbreaker personalizado..."
              onKeyDown={(e) => e.key === 'Enter' && addCustomDealbreaker()}
            />
            <Button onClick={addCustomDealbreaker} variant="outline">
              Adicionar
            </Button>
          </div>

          {dealbreakers.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="font-medium text-destructive mb-2">{dealbreakers.length} dealbreaker(s) selecionado(s):</p>
              <div className="flex flex-wrap gap-2">
                {dealbreakers.map((item) => (
                  <Badge key={item} variant="destructive" className="cursor-pointer" onClick={() => toggleDealbreaker(item)}>
                    {item} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
