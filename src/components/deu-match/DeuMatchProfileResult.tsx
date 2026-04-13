import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Trophy, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { type PerfilCulturalEmpresa, type PerfilCulturalCandidato, VALORES_CULTURAIS } from '@/types/match';

interface DeuMatchProfileResultProps {
  type: 'empresa' | 'candidato';
  perfil: PerfilCulturalEmpresa | PerfilCulturalCandidato;
  hasOtherProfile: boolean;
  onBack: () => void;
  onViewMatches: () => void;
}

export const DeuMatchProfileResult: React.FC<DeuMatchProfileResultProps> = ({
  type, perfil, hasOtherProfile, onBack, onViewMatches
}) => {
  const isEmpresa = type === 'empresa';
  const nome = isEmpresa 
    ? (perfil as PerfilCulturalEmpresa).empresaNome 
    : (perfil as PerfilCulturalCandidato).candidatoNome;
  const topValores = perfil.valoresPrioritarios
    .map(id => VALORES_CULTURAIS.find(v => v.id === id))
    .filter(Boolean);

  const gradient = isEmpresa 
    ? 'from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-900'
    : 'from-pink-50 via-rose-50 to-orange-50 dark:from-slate-900 dark:via-pink-900/20 dark:to-slate-900';
  const headerGradient = isEmpresa 
    ? 'from-indigo-500 to-purple-500' 
    : 'from-pink-500 to-rose-500';
  const Icon = isEmpresa ? Building2 : User;
  const title = isEmpresa ? 'Perfil Cultural Definido!' : 'Valores Descobertos!';
  const sectionTitle = isEmpresa ? 'Seus 5 Valores Principais' : 'O Que Mais Importa Para Você';
  const SectionIcon = isEmpresa ? Trophy : Heart;
  const sectionIconColor = isEmpresa ? 'text-yellow-500' : 'text-pink-500';
  const matchButtonGradient = isEmpresa 
    ? 'bg-gradient-to-r from-pink-500 to-rose-500' 
    : 'bg-gradient-to-r from-purple-500 to-indigo-500';

  return (
    <Layout title={isEmpresa ? "Perfil Cultural" : "Seus Valores"}>
      <div className={`min-h-screen bg-gradient-to-br ${gradient} py-8`}>
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden">
              <div className={`bg-gradient-to-r ${headerGradient} p-8 text-white text-center`}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                  <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon className="h-10 w-10" />
                  </div>
                </motion.div>
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                <p className="opacity-90">{nome}</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <SectionIcon className={`h-5 w-5 ${sectionIconColor}`} />
                    {sectionTitle}
                  </h3>
                  <div className="space-y-2">
                    {topValores.map((valor, i) => valor && (
                      <motion.div
                        key={valor.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-3 rounded-lg bg-gradient-to-r ${valor.cor} text-white flex items-center gap-3`}
                      >
                        <span className="font-bold text-lg">#{i + 1}</span>
                        <span className="font-medium">{valor.nome}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />Voltar
                  </Button>
                  {hasOtherProfile && (
                    <Button className={`flex-1 ${matchButtonGradient}`} onClick={onViewMatches}>
                      <Heart className="h-4 w-4 mr-2" />Ver Matches
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};
