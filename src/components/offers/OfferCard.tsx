import { memo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, Mail, DollarSign, Calendar, Eye, Send, MoreHorizontal 
} from 'lucide-react';
import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';

export type OfferStatus =
  | 'rascunho'
  | 'enviada'
  | 'visualizada'
  | 'aceita'
  | 'recusada'
  | 'expirada'
  | 'cancelada';

export interface Offer {
  id: string;
  candidatoNome: string;
  candidatoEmail: string;
  vagaTitulo: string;
  salario: number;
  dataInicio: Date;
  beneficios: string[];
  status: OfferStatus;
  criadaEm: Date;
  expiracaoEm?: Date;
  assinadaEm?: Date;
}

export interface OfferStatusConfigEntry {
  label: string;
  icon: LucideIcon;
  color: string;
}

interface OfferCardProps {
  offer: Offer;
  index: number;
  statusConfig: Record<OfferStatus, OfferStatusConfigEntry>;
  onSelect: (offer: Offer) => void;
  onSend: (offer: Offer) => void;
}

export const OfferCard = memo(function OfferCard({ 
  offer, 
  index, 
  statusConfig, 
  onSelect, 
  onSend 
}: OfferCardProps) {
  const config = statusConfig[offer.status];
  const StatusIcon = config.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                config.color
              )}>
                <StatusIcon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{offer.candidatoNome}</h3>
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    offer.status === 'aceita' && "bg-success text-success border-success",
                    offer.status === 'recusada' && "bg-destructive text-destructive border-destructive"
                  )}>
                    {config.label}
                  </Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {offer.vagaTitulo}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {offer.candidatoEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    R$ {offer.salario.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Início: {format(offer.dataInicio, "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSelect(offer)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
              {offer.status === 'rascunho' && (
                <Button 
                  size="sm"
                  onClick={() => onSend(offer)}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Enviar
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Criada em {format(offer.criadaEm, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
              {offer.expiracaoEm && (
                <>
                  <span>•</span>
                  <span>Expira em {format(offer.expiracaoEm, "dd/MM/yyyy")}</span>
                </>
              )}
              {offer.assinadaEm && (
                <>
                  <span>•</span>
                  <span className="text-success">
                    Assinada em {format(offer.assinadaEm, "dd/MM/yyyy")}
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
