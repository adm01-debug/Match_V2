import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, RotateCcw, Save } from 'lucide-react';

interface BuilderHeaderProps {
  nome: string;
  descricao: string;
  onNomeChange: (v: string) => void;
  onDescricaoChange: (v: string) => void;
  onReset: () => void;
  onSave: () => void;
}

export function BuilderHeader({ nome, descricao, onNomeChange, onDescricaoChange, onReset, onSave }: BuilderHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Perfil Cultural da Vaga
          </h2>
          <p className="text-muted-foreground">Defina o que a empresa valoriza para matching preciso</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
          <Button size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Perfil
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome do Perfil</Label>
            <Input value={nome} onChange={(e) => onNomeChange(e.target.value)} placeholder="Ex: Desenvolvedor Sênior - Cultura Tech" />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={descricao} onChange={(e) => onDescricaoChange(e.target.value)} placeholder="Descreva o perfil ideal para esta vaga..." className="h-[80px]" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
