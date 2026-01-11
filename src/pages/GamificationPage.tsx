/**
 * @fileoverview Dedicated Gamification Page
 * Shows achievements, levels, streaks, and leaderboard
 */

import { Layout } from "@/components/layout/Layout";
import { GamificationDashboard } from "@/components/gamification/GamificationDashboard";
import { usePageTitle } from "@/hooks/usePageTitle";
import { motion } from "framer-motion";
import { Trophy, Award, Flame, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GamificationPage() {
  usePageTitle('Conquistas');

  return (
    <Layout title="Conquistas">
      <div className="relative min-h-screen">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, hsl(var(--warning) / 0.15) 0%, transparent 70%)" }}
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)" }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, 30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div 
          className="relative p-6 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <motion.div 
                className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 shadow-lg shadow-yellow-500/25"
                whileHover={{ scale: 1.05, rotate: 5 }}
                animate={{ 
                  boxShadow: [
                    "0 10px 30px -10px rgba(234, 179, 8, 0.3)",
                    "0 10px 40px -10px rgba(234, 179, 8, 0.5)",
                    "0 10px 30px -10px rgba(234, 179, 8, 0.3)",
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity },
                  scale: { type: "spring", stiffness: 400 }
                }}
              >
                <Trophy className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">Conquistas & Ranking</h1>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                    <Flame className="h-3 w-3 mr-1" />
                    Em chamas!
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Acompanhe seu progresso, desbloqueie conquistas e suba no ranking
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <Award className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Nível</p>
                  <p className="font-bold text-yellow-600">12</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Flame className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Streak</p>
                  <p className="font-bold text-orange-600">12 dias</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                <Medal className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Rank</p>
                  <p className="font-bold text-primary">#6</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gamification Dashboard */}
          <GamificationDashboard />
        </motion.div>
      </div>
    </Layout>
  );
}
