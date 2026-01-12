/**
 * @fileoverview Accessibility Settings Panel
 * Comprehensive accessibility controls for users
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  Keyboard, 
  Contrast, 
  Zap,
  Check
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useHighContrast } from "@/components/a11y/HighContrastMode";
import { usePrefersReducedMotion } from "@/components/a11y/ReducedMotion";
import { useSoundPreferences } from "@/hooks/useSoundPreferences";
import { cn } from "@/lib/utils";

interface AccessibilitySettingsProps {
  className?: string;
}

export function AccessibilitySettings({ className }: AccessibilitySettingsProps) {
  const { isHighContrast, toggleHighContrast } = useHighContrast();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { preferences, setVolume, setSoundsEnabled } = useSoundPreferences();
  
  const [reducedMotionOverride, setReducedMotionOverride] = useState<boolean>(prefersReducedMotion);
  const [fontSize, setFontSize] = useState<number>(100);

  const handleFontSizeChange = (value: number[]) => {
    const newValue = value[0] ?? 100;
    setFontSize(newValue);
    document.documentElement.style.fontSize = `${newValue}%`;
  };

  const handleReducedMotionChange = (checked: boolean) => {
    setReducedMotionOverride(checked);
    if (checked) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('reduced-motion-override', JSON.stringify(checked));
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Accessibility className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Configurações de Acessibilidade</CardTitle>
            <CardDescription>
              Personalize a experiência para suas necessidades
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Eye className="h-4 w-4" />
            Visual
          </div>
          
          <div className="space-y-4 pl-6">
            {/* High Contrast */}
            <motion.div 
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <Contrast className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="high-contrast" className="font-medium cursor-pointer">
                    Alto Contraste
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Aumenta o contraste para melhor legibilidade
                  </p>
                </div>
              </div>
              <Switch
                id="high-contrast"
                checked={isHighContrast}
                onCheckedChange={toggleHighContrast}
              />
            </motion.div>

            {/* Font Size */}
            <div className="p-3 rounded-lg border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Tamanho da Fonte</Label>
                <span className="text-sm text-muted-foreground">{fontSize}%</span>
              </div>
              <Slider
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                min={75}
                max={150}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Menor</span>
                <span>Padrão</span>
                <span>Maior</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Motion Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Zap className="h-4 w-4" />
            Movimento
          </div>
          
          <div className="space-y-4 pl-6">
            <motion.div 
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="reduced-motion" className="font-medium cursor-pointer">
                    Reduzir Animações
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Minimiza movimentos e transições
                    {prefersReducedMotion && " (preferência do sistema detectada)"}
                  </p>
                </div>
              </div>
              <Switch
                id="reduced-motion"
                checked={reducedMotionOverride}
                onCheckedChange={handleReducedMotionChange}
              />
            </motion.div>
          </div>
        </div>

        <Separator />

        {/* Sound Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Volume2 className="h-4 w-4" />
            Som
          </div>
          
          <div className="space-y-4 pl-6">
            <motion.div 
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="sounds-enabled" className="font-medium cursor-pointer">
                    Efeitos Sonoros
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Feedback sonoro para ações
                  </p>
                </div>
              </div>
              <Switch
                id="sounds-enabled"
                checked={preferences.enabled}
                onCheckedChange={setSoundsEnabled}
              />
            </motion.div>

            {preferences.enabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-lg border bg-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Volume</Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((preferences.volume ?? 0.5) * 100)}%
                  </span>
                </div>
                <Slider
                  value={[(preferences.volume ?? 0.5) * 100]}
                  onValueChange={(value) => setVolume((value[0] ?? 50) / 100)}
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </motion.div>
            )}
          </div>
        </div>

        <Separator />

        {/* Keyboard Navigation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Keyboard className="h-4 w-4" />
            Navegação por Teclado
          </div>
          
          <div className="pl-6 p-3 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">
              Use atalhos de teclado para navegação rápida:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘/Ctrl + K</kbd>
                <span>Busca rápida</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">?</kbd>
                <span>Ver atalhos</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Tab</kbd>
                <span>Próximo elemento</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Esc</kbd>
                <span>Fechar modais</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              handleFontSizeChange([100]);
              handleReducedMotionChange(prefersReducedMotion);
              if (isHighContrast) toggleHighContrast();
            }}
          >
            <Check className="h-4 w-4 mr-2" />
            Restaurar Padrões
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccessibilitySettings;
