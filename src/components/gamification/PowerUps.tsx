/**
 * @fileoverview Power-ups & Boosters Component
 * 2x XP, Streak Shield, and other boosters
 */

import { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Shield,
  Rocket,
  Clock,
  Star,
  Sparkles,
  Gift,
  Lock,
  Timer,
  TrendingUp,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";

export type PowerUpType = "double_xp" | "streak_shield" | "time_boost" | "bonus_multiplier";

export interface PowerUp {
  id: string;
  type: PowerUpType;
  name: string;
  description: string;
  icon: typeof Zap;
  gradient: string;
  duration: string;
  quantity: number;
  isActive: boolean;
  expiresAt?: Date;
  unlockLevel?: number;
  cost?: number;
}

const powerUpConfigs: Record<PowerUpType, {
  icon: typeof Zap;
  gradient: string;
  activeGlow: string;
  fg: string;
}> = {
  double_xp: {
    icon: Zap,
    gradient: "from-warning to-warning/80",
    activeGlow: "shadow-warning/50",
    fg: "text-warning-foreground",
  },
  streak_shield: {
    icon: Shield,
    gradient: "from-info to-info/80",
    activeGlow: "shadow-info/50",
    fg: "text-info-foreground",
  },
  time_boost: {
    icon: Clock,
    gradient: "from-accent to-accent/80",
    activeGlow: "shadow-accent/50",
    fg: "text-accent-foreground",
  },
  bonus_multiplier: {
    icon: TrendingUp,
    gradient: "from-success to-success/80",
    activeGlow: "shadow-success/50",
    fg: "text-success-foreground",
  },
};

// Demo power-ups
const demoPowerUps: PowerUp[] = [
  {
    id: "double-xp-1",
    type: "double_xp",
    name: "Dobro de XP",
    description: "Ganhe 2x XP em todas as ações",
    icon: Zap,
    gradient: powerUpConfigs.double_xp.gradient,
    duration: "1 hora",
    quantity: 2,
    isActive: false,
  },
  {
    id: "streak-shield-1",
    type: "streak_shield",
    name: "Escudo de Streak",
    description: "Protege seu streak por 1 dia de inatividade",
    icon: Shield,
    gradient: powerUpConfigs.streak_shield.gradient,
    duration: "24 horas",
    quantity: 1,
    isActive: true,
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
  },
  {
    id: "time-boost-1",
    type: "time_boost",
    name: "Turbo Tempo",
    description: "+30 segundos em jogos com timer",
    icon: Clock,
    gradient: powerUpConfigs.time_boost.gradient,
    duration: "3 jogos",
    quantity: 3,
    isActive: false,
  },
  {
    id: "bonus-multiplier-1",
    type: "bonus_multiplier",
    name: "Super Multiplicador",
    description: "1.5x em todos os multiplicadores de combo",
    icon: TrendingUp,
    gradient: powerUpConfigs.bonus_multiplier.gradient,
    duration: "30 min",
    quantity: 0,
    isActive: false,
    unlockLevel: 5,
  },
];

interface PowerUpCardProps {
  powerUp: PowerUp;
  currentLevel?: number;
  onActivate: (id: string) => void;
}

const PowerUpCard = memo(function PowerUpCard({
  powerUp,
  currentLevel = 1,
  onActivate,
}: PowerUpCardProps) {
  const Icon = powerUp.icon;
  const config = powerUpConfigs[powerUp.type];
  const isLocked = powerUp.unlockLevel && currentLevel < powerUp.unlockLevel;
  const canActivate = powerUp.quantity > 0 && !powerUp.isActive && !isLocked;
  
  const remainingTime = powerUp.expiresAt 
    ? Math.max(0, powerUp.expiresAt.getTime() - Date.now())
    : 0;
  const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

  const handleActivate = useCallback(() => {
    if (canActivate) {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 },
      });
      onActivate(powerUp.id);
    }
  }, [canActivate, powerUp.id, onActivate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: isLocked ? 1 : 1.02 }}
      className="relative"
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        powerUp.isActive && `ring-2 ring-offset-2 ${config.activeGlow}`,
        isLocked && "opacity-50"
      )}>
        {powerUp.isActive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {isLocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Nível {powerUp.unlockLevel}</p>
            </div>
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                `bg-gradient-to-br ${powerUp.gradient}`,
                powerUp.isActive && "shadow-lg"
              )}
              animate={powerUp.isActive ? { 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              } : {}}
              transition={{ duration: 2, repeat: powerUp.isActive ? Infinity : 0 }}
            >
              <Icon className={cn("w-6 h-6", config.fg)} />
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{powerUp.name}</h4>
                {powerUp.isActive && (
                  <Badge className="bg-success/20 text-success border-0 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Ativo
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {powerUp.description}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Timer className="w-3 h-3 mr-1" />
                  {powerUp.duration}
                </Badge>
                {!isLocked && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      powerUp.quantity === 0 && "text-muted-foreground"
                    )}
                  >
                    <Gift className="w-3 h-3 mr-1" />
                    {powerUp.quantity}x disponível
                  </Badge>
                )}
              </div>

              {powerUp.isActive && powerUp.expiresAt && (
                <div className="mt-2 flex items-center gap-1 text-xs text-success">
                  <Clock className="w-3 h-3" />
                  Expira em {remainingHours}h {remainingMinutes}m
                </div>
              )}
            </div>

            <div className="flex-shrink-0">
              {canActivate && (
                <Button
                  size="sm"
                  onClick={handleActivate}
                  className={cn(
                    "font-medium",
                    `bg-gradient-to-r ${powerUp.gradient} ${config.fg} hover:opacity-90`
                  )}
                >
                  <Rocket className="w-4 h-4 mr-1" />
                  Ativar
                </Button>
              )}
              {powerUp.isActive && (
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  `bg-gradient-to-br ${powerUp.gradient}`
                )}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className={cn("w-5 h-5", config.fg)} />
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

interface PowerUpsProps {
  className?: string;
  currentLevel?: number;
  onActivatePowerUp?: (powerUpId: string, type: PowerUpType) => void;
}

export const PowerUps = memo(function PowerUps({
  className,
  currentLevel = 3,
  onActivatePowerUp,
}: PowerUpsProps) {
  const [powerUps, setPowerUps] = useState<PowerUp[]>(demoPowerUps);

  const activePowerUps = powerUps.filter(p => p.isActive).length;

  const handleActivate = useCallback((id: string) => {
    setPowerUps(prev => prev.map(p => {
      if (p.id === id && p.quantity > 0) {
        const expiresAt = new Date();
        if (p.type === "double_xp") {
          expiresAt.setHours(expiresAt.getHours() + 1);
        } else if (p.type === "streak_shield") {
          expiresAt.setHours(expiresAt.getHours() + 24);
        } else if (p.type === "time_boost") {
          expiresAt.setMinutes(expiresAt.getMinutes() + 30);
        } else {
          expiresAt.setMinutes(expiresAt.getMinutes() + 30);
        }
        
        onActivatePowerUp?.(id, p.type);
        
        return { 
          ...p, 
          isActive: true, 
          quantity: p.quantity - 1,
          expiresAt,
        };
      }
      return p;
    }));
  }, [onActivatePowerUp]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-warning/10 via-warning/10 to-accent/10 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2.5 rounded-xl bg-gradient-to-br from-warning to-warning/80 shadow-lg"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 text-warning-foreground" />
            </motion.div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Power-Ups
                {activePowerUps > 0 && (
                  <Badge className="bg-gradient-to-r from-success to-success/80 text-success-foreground border-0">
                    <Flame className="w-3 h-3 mr-1" />
                    {activePowerUps} ativo{activePowerUps > 1 ? 's' : ''}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Potencialize seus ganhos de XP
              </p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="gap-1">
            <Gift className="w-4 h-4" />
            Loja
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {powerUps.map((powerUp) => (
            <PowerUpCard
              key={powerUp.id}
              powerUp={powerUp}
              currentLevel={currentLevel}
              onActivate={handleActivate}
            />
          ))}
        </AnimatePresence>

        <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium">Dica do dia</p>
              <p className="text-xs text-muted-foreground">
                Use o Dobro de XP junto com missões de alto valor para maximizar seus ganhos!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PowerUps.displayName = "PowerUps";
