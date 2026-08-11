/**
 * @fileoverview Premium AgendaHoje component
 * @module AgendaHoje
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgendaDia } from "@/types/recruitment";
import { Calendar, Video, ClipboardCheck, Users, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AgendaProps {
  agenda: AgendaDia[];
}

const tipoConfig = {
  entrevista: {
    icon: Video,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    badge: "Entrevista",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  teste: {
    icon: ClipboardCheck,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
    badge: "Teste",
    badgeClass: "bg-accent/10 text-accent border-accent/20",
  },
  reuniao: {
    icon: Users,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
    badge: "Reunião",
    badgeClass: "bg-success/10 text-success border-success/20",
  },
};

function AgendaHojeComponent({ agenda }: AgendaProps) {
  const today = new Date().toLocaleDateString("pt-BR", { 
    weekday: "long", 
    day: "numeric", 
    month: "long" 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card role="article" aria-label="Agenda de hoje" className="h-full border-border/50 shadow-elevated overflow-hidden">
        {/* Header accent */}
        <div className="h-1 gradient-primary" />
        
        <CardHeader className="pb-3">
          <div data-testid="agenda-hoje" className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="p-2 rounded-xl bg-primary/10"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Calendar className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <CardTitle className="text-base font-semibold">Agenda do Dia</CardTitle>
                <p className="text-xs text-muted-foreground capitalize">{today}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-medium">
              {agenda.length} {agenda.length === 1 ? 'evento' : 'eventos'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {agenda.length === 0 ? (
            <motion.div 
              className="text-center py-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="p-4 rounded-2xl bg-success/10 w-fit mx-auto mb-4"
              >
                <Calendar className="h-10 w-10 text-success" />
              </motion.div>
              <p className="font-medium text-foreground">Agenda livre!</p>
              <p className="text-sm text-muted-foreground mt-1">Nenhum compromisso agendado para hoje</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link to="/agenda">
                  Ver calendário completo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <>
              {agenda.map((item, index) => {
                const config = tipoConfig[item.tipo];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, type: 'spring', stiffness: 300 }}
                    whileHover={{ x: 4 }}
                    className={cn(
                      "group relative flex gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                      "hover:shadow-soft hover:border-primary/30 hover:bg-primary/5",
                      config.borderColor
                    )}
                  >
                    {/* Time indicator */}
                    <div className="flex flex-col items-center justify-center min-w-[50px]">
                      <motion.div 
                        className={cn("text-2xl font-bold", config.color)}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.08 + 0.1 }}
                      >
                        {item.hora.split(":")[0]}
                      </motion.div>
                      <span className="text-xs text-muted-foreground">:{item.hora.split(":")[1]}</span>
                    </div>
                    
                    {/* Vertical divider with gradient */}
                    <div className={cn("w-0.5 rounded-full", config.bgColor)} />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <motion.div 
                          className={cn("rounded-lg p-1.5", config.bgColor)}
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          <Icon className={cn("h-4 w-4", config.color)} />
                        </motion.div>
                        <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", config.badgeClass)}>
                          {config.badge}
                        </Badge>
                      </div>
                      
                      <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {item.candidato}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">{item.titulo}</p>
                      
                      {item.local && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="truncate">{item.local}</span>
                        </div>
                      )}
                    </div>

                    {/* Hover arrow */}
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                  </motion.div>
                );
              })}
              
              <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground hover:text-primary" asChild>
                <Link to="/agenda">
                  Ver agenda completa
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

AgendaHojeComponent.displayName = "AgendaHoje";

export const AgendaHoje = memo(AgendaHojeComponent);
export default AgendaHoje;
