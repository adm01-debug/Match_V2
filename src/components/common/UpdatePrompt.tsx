import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, X, Sparkles, RefreshCw, Clock, ArrowRight } from 'lucide-react';

interface UpdatePromptProps {
  version?: string;
  changelog?: string[];
  onUpdate: () => void;
  onDismiss?: () => void;
}

export function UpdatePrompt({ version, changelog = [], onUpdate, onDismiss }: UpdatePromptProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleLater = () => {
    // Lembrar em 1 hora
    localStorage.setItem('update-reminder', String(Date.now() + 3600000));
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-top-4">
      <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader className="pb-2 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 animate-pulse">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Nova versão disponível!</CardTitle>
              {version && (
                <CardDescription className="text-xs">
                  Versão {version}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {changelog.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Novidades:</p>
              <ul className="space-y-1">
                {changelog.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <ArrowRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {changelog.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{changelog.length - 3} outras melhorias
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleLater}
            >
              <Clock className="h-4 w-4 mr-1" />
              Depois
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1" />
                  Atualizar
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            A atualização é rápida e não afeta seus dados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
