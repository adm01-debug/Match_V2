/**
 * @fileoverview Sound settings card component
 * @module SoundSettingsCard
 */

import { Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSoundPreferences } from '@/hooks/useSoundPreferences';

export function SoundSettingsCard() {
  const { celebrationSoundEnabled, setCelebrationSound, isLoaded } = useSoundPreferences();

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Sons
          </CardTitle>
          <CardDescription>
            Carregando preferências...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Sons
        </CardTitle>
        <CardDescription>
          Gerencie os sons e efeitos sonoros do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="celebration-sound" className="font-medium cursor-pointer">
              Som de celebração
            </Label>
            <p className="text-sm text-muted-foreground">
              Tocar som quando o perfil for criado com sucesso
            </p>
          </div>
          <div className="flex items-center gap-2">
            {celebrationSoundEnabled ? (
              <Volume2 className="h-4 w-4 text-primary" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
            <Switch
              id="celebration-sound"
              checked={celebrationSoundEnabled}
              onCheckedChange={setCelebrationSound}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
