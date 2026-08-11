/**
 * @fileoverview Gift Badge System — orquestrador
 * Subcomponentes: giftBadge/{BadgeCard, ColleagueSelector, GiftHistoryItem}
 */

import { useState, memo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Gift, Heart, Star, Sparkles, Send, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { GiftableBadge, Colleague, GiftHistory } from './giftBadge/types';
import { GIFTABLE_BADGES, DEMO_COLLEAGUES } from './giftBadge/giftBadgeData';
import { BadgeCard } from './giftBadge/BadgeCard';
import { ColleagueSelector } from './giftBadge/ColleagueSelector';
import { GiftHistoryItem } from './giftBadge/GiftHistoryItem';

export type { GiftableBadge, Colleague, GiftHistory };

interface GiftBadgeProps {
  userXP: number;
  colleagues?: Colleague[];
  giftHistory?: GiftHistory[];
  onGiftBadge?: (badge: GiftableBadge, to: Colleague, message: string) => void;
  className?: string;
}

export const GiftBadge = memo(
  ({ userXP, colleagues = DEMO_COLLEAGUES, giftHistory = [], onGiftBadge, className }: GiftBadgeProps) => {
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
        icon: <Sparkles className="h-5 w-5 text-warning" />,
      });
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
      <Card className={cn('bg-card/50 backdrop-blur-xl border-border/30', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                <Gift className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Presentear Badge</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Reconheça seus colegas com badges especiais
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3 text-warning" />
              {userXP.toLocaleString()} XP disponível
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Badges Disponíveis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GIFTABLE_BADGES.slice(0, 4).map((badge) => (
                <Dialog
                  key={badge.id}
                  open={dialogOpen && selectedBadge?.id === badge.id}
                  onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                      setStep('badge');
                      setSelectedBadge(null);
                      setSelectedColleague(null);
                      setMessage('');
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <div
                      onClick={() => {
                        if (userXP >= badge.xpCost) {
                          setSelectedBadge(badge);
                          setStep('colleague');
                          setDialogOpen(true);
                        }
                      }}
                    >
                      <BadgeCard badge={badge} canAfford={userXP >= badge.xpCost} onSelect={() => {}} />
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
                                {selectedColleague.name.split(' ').map((n) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedColleague.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedColleague.department}
                              </p>
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

          {giftHistory.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" />
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
  },
);

GiftBadge.displayName = 'GiftBadge';
