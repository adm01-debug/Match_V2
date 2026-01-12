/**
 * @fileoverview Sound Settings Panel - Complete sound preferences UI
 * @module SoundSettingsPanel
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Bell, 
  CheckCircle, 
  XCircle, 
  PartyPopper,
  Mouse,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSoundPreferences, type SoundType } from '@/hooks/useSoundPreferences';
import { cn } from '@/lib/utils';

interface SoundOptionProps {
  icon: React.ElementType;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  testSound?: SoundType;
  playSound?: (type: SoundType) => void;
}

const SoundOption = memo(function SoundOption({
  icon: Icon,
  label,
  description,
  enabled,
  onToggle,
  testSound,
  playSound,
}: SoundOptionProps) {
  return (
    <motion.div 
      className="flex items-center justify-between py-3"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <Label className="font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {testSound && playSound && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => playSound(testSound)}
            disabled={!enabled}
            className="text-xs"
          >
            Testar
          </Button>
        )}
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
        />
      </div>
    </motion.div>
  );
});

SoundOption.displayName = 'SoundOption';

export const SoundSettingsPanel = memo(function SoundSettingsPanel() {
  const {
    preferences,
    isLoaded,
    playSound,
    toggleSounds,
    setVolume,
    setCelebrationSound,
    setNotificationSound,
    setSuccessSound,
    setErrorSound,
    setUISounds,
  } = useSoundPreferences();

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {preferences.enabled ? (
                <Volume2 className="h-5 w-5 text-primary" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
              Preferências de Som
            </CardTitle>
            <CardDescription>
              Configure os sons e feedback auditivo do sistema
            </CardDescription>
          </div>
          <Switch
            checked={preferences.enabled}
            onCheckedChange={toggleSounds}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Volume Slider */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: preferences.enabled ? 1 : 0.5 }}
        >
          <div className="flex items-center justify-between">
            <Label>Volume Geral</Label>
            <span className="text-sm text-muted-foreground">
              {Math.round(preferences.volume * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[preferences.volume * 100]}
              onValueChange={(values) => setVolume((values[0] ?? 50) / 100)}
              max={100}
              step={5}
              disabled={!preferences.enabled}
              className="flex-1"
            />
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </motion.div>

        <Separator />

        {/* Sound Options */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium mb-3">Tipos de Som</h4>
          
          <SoundOption
            icon={PartyPopper}
            label="Celebração"
            description="Sons ao desbloquear conquistas e completar metas"
            enabled={preferences.celebrationSound && preferences.enabled}
            onToggle={setCelebrationSound}
            testSound="celebration"
            playSound={playSound}
          />
          
          <SoundOption
            icon={Bell}
            label="Notificações"
            description="Sons para novas notificações e alertas"
            enabled={preferences.notificationSound && preferences.enabled}
            onToggle={setNotificationSound}
            testSound="notification"
            playSound={playSound}
          />
          
          <SoundOption
            icon={CheckCircle}
            label="Sucesso"
            description="Feedback sonoro ao completar ações"
            enabled={preferences.successSound && preferences.enabled}
            onToggle={setSuccessSound}
            testSound="success"
            playSound={playSound}
          />
          
          <SoundOption
            icon={XCircle}
            label="Erros"
            description="Sons de alerta para erros e avisos"
            enabled={preferences.errorSound && preferences.enabled}
            onToggle={setErrorSound}
            testSound="error"
            playSound={playSound}
          />
          
          <SoundOption
            icon={Mouse}
            label="Sons de Interface"
            description="Cliques e hover em elementos interativos"
            enabled={preferences.uiSounds && preferences.enabled}
            onToggle={setUISounds}
            testSound="click"
            playSound={playSound}
          />
        </div>

        <Separator />

        {/* Test All Sounds */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => playSound('levelUp')}
            disabled={!preferences.enabled}
            className="gap-2"
          >
            <Trophy className="h-4 w-4" />
            Level Up
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => playSound('achievement')}
            disabled={!preferences.enabled}
            className="gap-2"
          >
            <PartyPopper className="h-4 w-4" />
            Conquista
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

SoundSettingsPanel.displayName = 'SoundSettingsPanel';
