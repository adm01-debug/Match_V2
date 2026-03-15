import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useWhiteLabel } from '@/hooks/useWhiteLabel';
import { Palette, RotateCcw } from 'lucide-react';

export function WhiteLabelSettings() {
  const { config, updateConfig, resetConfig, isCustomized } = useWhiteLabel();
  const { toast } = useToast();
  const [form, setForm] = useState(config);

  const handleSave = () => {
    updateConfig(form);
    toast({ title: 'Configurações de marca salvas' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />White Label</CardTitle>
        <CardDescription>Personalize a aparência do sistema com sua marca</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Nome da Empresa</Label>
          <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>URL do Logo</Label>
          <Input value={form.logoUrl || ''} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Cor Primária</Label>
            <Input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Cor Secundária</Label>
            <Input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Fonte</Label>
          <Input value={form.fontFamily || ''} onChange={(e) => setForm({ ...form, fontFamily: e.target.value })} placeholder="Inter" />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave}>Salvar</Button>
          {isCustomized && (
            <Button variant="outline" onClick={resetConfig}><RotateCcw className="h-4 w-4 mr-1" />Resetar</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default WhiteLabelSettings;
