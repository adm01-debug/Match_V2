/**
 * @fileoverview Gift Badge System
 * Award badges and recognition to colleagues
 */

import { useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, Heart, Star, Sparkles, Send, Search,
  Award, ThumbsUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface GiftableBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  xpCost: number;
  xpReward: number;
  category: 'recognition' | 'achievement' | 'celebration';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Colleague {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  department?: string;
}

export interface GiftHistory {
  id: string;
  badge: GiftableBadge;
  from: Colleague;
  to: Colleague;
  message?: string;
  timestamp: Date;
}

interface GiftBadgeProps {
  userXP: number;
  colleagues?: Colleague[];
  giftHistory?: GiftHistory[];
  onGiftBadge?: (badge: GiftableBadge, to: Colleague, message: string) => void;
  className?: string;
}

// Available badges to gift
const GIFTABLE_BADGES: GiftableBadge[] = [
  {
    id: 'kudos',
    name: 'Kudos',
    icon: '👏',
    description: 'Reconhecimento por um ótimo trabalho',
    xpCost: 50,
    xpReward: 25,
    category: 'recognition',
    rarity: 'common'
  },
  {
    id: 'helper',
    name: 'Grande Ajuda',
    icon: '🤝',
    description: 'Por ajudar quando mais precisava',
    xpCost: 100,
    xpReward: 50,
    category: 'recognition',
    rarity: 'common'
  },
  {
    id: 'innovator',
    name: 'Inovador',
    icon: '💡',
    description: 'Por uma ideia brilhante',
    xpCost: 150,
    xpReward: 75,
    category: 'achievement',
    rarity: 'rare'
  },
  {
    id: 'rockstar',
    name: 'Rockstar',
    icon: '🌟',
    description: 'Performance excepcional',
    xpCost: 200,
    xpReward: 100,
    category: 'achievement',
    rarity: 'rare'
  },
  {
    id: 'mentor',
    name: 'Mentor',
    icon: '🎓',
    description: 'Por ensinar e guiar outros',
    xpCost: 250,
    xpReward: 125,
    category: 'recognition',
    rarity: 'epic'
  },
  {
    id: 'champion',
    name: 'Champion',
    icon: '🏆',
    description: 'Verdadeiro campeão do time',
    xpCost: 300,
    xpReward: 150,
    category: 'achievement',
    rarity: 'epic'
  },
  {
    id: 'legend',
    name: 'Lenda',
    icon: '👑',
    description: 'Status lendário alcançado',
    xpCost: 500,
    xpReward: 250,
    category: 'celebration',
    rarity: 'legendary'
  }
];

// Demo colleagues
const DEMO_COLLEAGUES: Colleague[] = [
  { id: 'c1', name: 'Ana Silva', department: 'RH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnaSilva' },
  { id: 'c2', name: 'Carlos Santos', department: 'Tech', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosSantos' },
  { id: 'c3', name: 'Maria Oliveira', department: 'Marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MariaOliveira' },
  { id: 'c4', name: 'João Pedro', department: 'Vendas', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JoaoPedro' },
  { id: 'c5', name: 'Fernanda Costa', department: 'RH', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FernandaCosta' },
];

// Badge card component
const BadgeCard = memo(({ 
  badge, 
  canAfford,
  onSelect
}: { 
  badge: GiftableBadge;
  canAfford: boolean;
  onSelect: () => void;
}) => {
  const rarityColors = {
    common: "from-gray-400 to-gray-500",
    rare: "from-blue-400 to-indigo-500",
    epic: "from-purple-400 to-pink-500",
    legendary: "from-yellow-400 to-amber-500"
  };

  return (
    <motion.button
      whileHover={{ scale: canAfford ? 1.05 : 1 }}
      whileTap={{ scale: canAfford ? 0.95 : 1 }}
      onClick={canAfford ? onSelect : undefined}
      disabled={!canAfford}
      className={cn(
        "p-4 rounded-xl border text-left transition-all duration-300 w-full",
        canAfford 
          ? "bg-card/50 border-border/30 hover:bg-card/80 cursor-pointer" 
          : "bg-muted/30 border-muted opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex items-start gap-3">
        <motion.div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
            `bg-gradient-to-br ${rarityColors[badge.rarity]}`
          )}
          animate={canAfford ? { 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          {badge.icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold">{badge.name}</p>
            <Badge variant="outline" className={cn(
              "text-xs capitalize",
              badge.rarity === 'legendary' && "border-yellow-500 text-yellow-600",
              badge.rarity === 'epic' && "border-purple-500 text-purple-600",
              badge.rarity === 'rare' && "border-blue-500 text-blue-600"
            )}>
              {badge.rarity}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-orange-500 font-medium">-{badge.xpCost} XP</span>
            <span className="text-green-500 font-medium">+{badge.xpReward} XP para receptor</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
});

BadgeCard.displayName = 'BadgeCard';

// Colleague selector
const ColleagueSelector = memo(({ 
  colleagues,
  selected,
  onSelect,
  searchQuery,
  onSearchChange
}: { 
  colleagues: Colleague[];
  selected?: Colleague;
  onSelect: (colleague: Colleague) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) => {
  const filtered = colleagues.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar colega..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="max-h-48 overflow-y-auto space-y-2">
        {filtered.map((colleague) => (
          <motion.button
            key={colleague.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(colleague)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
              selected?.id === colleague.id
                ? "bg-primary/10 border border-primary/30"
                : "bg-muted/50 hover:bg-muted"
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={colleague.avatar} />
              <AvatarFallback>
                {colleague.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium">{colleague.name}</p>
              {colleague.department && (
                <p className="text-sm text-muted-foreground">{colleague.department}</p>
              )}
            </div>
            {selected?.id === colleague.id && (
              <ThumbsUp className="h-5 w-5 text-primary ml-auto" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
});

ColleagueSelector.displayName = 'ColleagueSelector';

// Gift history item
const GiftHistoryItem = memo(({ gift }: { gift: GiftHistory }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
  >
    <div className="text-2xl">{gift.badge.icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm">
        <span className="font-medium">{gift.from.name}</span>
        {' → '}
        <span className="font-medium">{gift.to.name}</span>
      </p>
      <p className="text-xs text-muted-foreground truncate">{gift.message || gift.badge.name}</p>
    </div>
    <p className="text-xs text-muted-foreground">
      {gift.timestamp.toLocaleDateString()}
    </p>
  </motion.div>
));

GiftHistoryItem.displayName = 'GiftHistoryItem';

export const GiftBadge = memo(({
  userXP,
  colleagues = DEMO_COLLEAGUES,
  giftHistory = [],
  onGiftBadge,
  className
}: GiftBadgeProps) => {
  const [selectedBadge, setSelectedBadge] = useState<GiftableBadge | null>(null);
  const [selectedColleague, setSelectedColleague] = useState<Colleague | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState<'badge' | 'colleague' | 'message'>('badge');

  const handleSendGift = useCallback(() => {
    if (!selectedBadge || !selectedColleague) return;

    onGiftBadge?.(selectedBadge, selectedColleague, message);
    
    toast.success(`${selectedBadge.icon} ${selectedBadge.name} enviado!`, {
      description: `Para ${selectedColleague.name}`,
      icon: <Sparkles className="h-5 w-5 text-yellow-500" />
    });

    // Reset
    setSelectedBadge(null);
    setSelectedColleague(null);
    setMessage('');
    setStep('badge');
    setDialogOpen(false);
  }, [selectedBadge, selectedColleague, message, onGiftBadge]);

  const handleNext = useCallback(() => {
    if (step === 'badge' && selectedBadge) setStep('colleague');
    else if (step === 'colleague' && selectedColleague) setStep('message');
  }, [step, selectedBadge, selectedColleague]);

  const handleBack = useCallback(() => {
    if (step === 'message') setStep('colleague');
    else if (step === 'colleague') setStep('badge');
  }, [step]);

  return (
    <Card className={cn("bg-card/50 backdrop-blur-xl border-border/30", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Presentear Badge</CardTitle>
              <p className="text-sm text-muted-foreground">
                Reconheça seus colegas com badges especiais
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Star className="h-3 w-3 text-yellow-500" />
            {userXP.toLocaleString()} XP disponível
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Available Badges */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Badges Disponíveis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {GIFTABLE_BADGES.slice(0, 4).map((badge) => (
              <Dialog key={badge.id} open={dialogOpen && selectedBadge?.id === badge.id} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) {
                  setStep('badge');
                  setSelectedBadge(null);
                  setSelectedColleague(null);
                  setMessage('');
                }
              }}>
                <DialogTrigger asChild>
                  <div onClick={() => {
                    if (userXP >= badge.xpCost) {
                      setSelectedBadge(badge);
                      setStep('colleague');
                      setDialogOpen(true);
                    }
                  }}>
                    <BadgeCard
                      badge={badge}
                      canAfford={userXP >= badge.xpCost}
                      onSelect={() => {}}
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <span className="text-2xl">{badge.icon}</span>
                      Enviar {badge.name}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="py-4 space-y-4">
                    {step === 'colleague' && (
                      <ColleagueSelector
                        colleagues={colleagues}
                        selected={selectedColleague || undefined}
                        onSelect={setSelectedColleague}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                      />
                    )}

                    {step === 'message' && selectedColleague && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Avatar>
                            <AvatarImage src={selectedColleague.avatar} />
                            <AvatarFallback>
                              {selectedColleague.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedColleague.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedColleague.department}</p>
                          </div>
                        </div>
                        <Textarea
                          placeholder="Adicione uma mensagem especial (opcional)..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                        />
                      </div>
                    )}
                  </div>

                  <DialogFooter className="flex gap-2">
                    {step !== 'colleague' && (
                      <Button variant="outline" onClick={handleBack}>
                        Voltar
                      </Button>
                    )}
                    {step === 'message' ? (
                      <Button onClick={handleSendGift} className="gap-2">
                        <Send className="h-4 w-4" />
                        Enviar Badge
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleNext} 
                        disabled={step === 'colleague' && !selectedColleague}
                        className="gap-2"
                      >
                        Continuar
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Recent Gifts */}
        {giftHistory.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Reconhecimentos Recentes
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {giftHistory.slice(0, 5).map((gift) => (
                  <GiftHistoryItem key={gift.id} gift={gift} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

GiftBadge.displayName = 'GiftBadge';
