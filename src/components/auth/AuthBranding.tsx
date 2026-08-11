import { motion } from 'framer-motion';
import { Briefcase, Users, Target, TrendingUp } from 'lucide-react';

const features = [
  { icon: Users, title: 'Banco de Talentos', description: 'Gerencie candidatos de forma inteligente' },
  { icon: Target, title: 'Match Score', description: 'IA para encontrar o candidato ideal' },
  { icon: TrendingUp, title: 'Pipeline Visual', description: 'Acompanhe todo o processo seletivo' },
];

export function AuthBranding() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      <motion.div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl" animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      
      <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 rounded-xl gradient-primary shadow-glow"><Briefcase className="h-8 w-8 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-white">People Lovers</h1>
              <p className="text-white/60 text-sm">Sistema de Recrutamento</p>
            </div>
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Encontre os<span className="block text-gradient-success">melhores talentos</span>para sua empresa
          </h2>
          <p className="text-lg text-white/70 mb-12 max-w-md">
            Plataforma completa de recrutamento e seleção com inteligência artificial para otimizar seus processos.
          </p>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }} className="flex items-center gap-4 group">
                <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent" />
    </div>
  );
}
