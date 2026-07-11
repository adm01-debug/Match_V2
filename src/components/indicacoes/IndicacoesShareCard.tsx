import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Mail } from 'lucide-react';

export function IndicacoesShareCard() {
  const linkIndicacao = `${window.location.origin}/indicar`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(linkIndicacao);
    toast.success('Link copiado!');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Indique um amigo para trabalhar conosco!');
    const body = encodeURIComponent(
      `Olá!\n\nVocê pode indicar pessoas para trabalhar na nossa empresa através deste link:\n\n${linkIndicacao}\n\nCada indicação contratada rende um bônus para você!\n\nAbraços,\nEquipe RH`,
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-primary/20">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Compartilhe o Programa</h3>
              <p className="text-sm text-muted-foreground">
                Convide colegas para participar do programa de indicações
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link
            </Button>
            <Button variant="outline" onClick={handleShareEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Enviar por E-mail
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
