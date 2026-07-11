import { motion } from "framer-motion";
import { Gamepad2, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GAME_CARDS, GamifiedMode } from "./gameCardsConfig";

interface PlayNowGridProps {
  onSelect: (mode: NonNullable<GamifiedMode>) => void;
}

export function PlayNowGrid({ onSelect }: PlayNowGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-success to-primary">
          <Gamepad2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold">Jogar Agora</h2>
        <Badge variant="outline" className="border-success/50 text-success">
          <Star className="h-3 w-3 mr-1" />
          Ganhe XP
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {GAME_CARDS.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card
              className="group cursor-pointer overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
              onClick={() => onSelect(game.id)}
            >
              <CardContent className="p-0">
                <div className={`relative p-6 bg-gradient-to-br ${game.gradient}`}>
                  <game.icon className="h-10 w-10 text-white mb-2 relative z-10" />
                  <Badge className="bg-white/20 text-white border-0 text-xs">
                    {game.xp}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{game.title}</h3>
                  <p className="text-sm text-muted-foreground">{game.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
