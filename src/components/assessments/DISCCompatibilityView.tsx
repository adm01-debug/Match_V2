/**
 * @fileoverview Componente de visualização de compatibilidade DISC
 * @module DISCCompatibilityView
 */

import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  MessageCircle,
  Briefcase
} from 'lucide-react';
import { getDISCCompatibility } from '@/types/advancedBehavioral';
import { DISC_PROFILES_INFO } from '@/types/behavioral';

interface DISCCompatibilityViewProps {
  candidateProfile?: 'D' | 'I' | 'S' | 'C';
  managerProfile?: 'D' | 'I' | 'S' | 'C';
  className?: string;
}

export const DISCCompatibilityView = memo(function DISCCompatibilityView({
  candidateProfile,
  managerProfile,
  className
}: DISCCompatibilityViewProps) {
  const [profile1, setProfile1] = useState<'D' | 'I' | 'S' | 'C'>(candidateProfile || 'D');
  const [profile2, setProfile2] = useState<'D' | 'I' | 'S' | 'C'>(managerProfile || 'I');

  const compatibility = getDISCCompatibility(profile1, profile2);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    if (score >= 40) return 'Moderada';
    return 'Desafiadora';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Compatibilidade DISC
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seletores de Perfil */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Perfil do Candidato</label>
            <Select value={profile1} onValueChange={(v) => setProfile1(v as 'D' | 'I' | 'S' | 'C')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(['D', 'I', 'S', 'C'] as const).map((p) => (
                  <SelectItem key={p} value={p}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${DISC_PROFILES_INFO[p].cor}`} />
                      {p} - {DISC_PROFILES_INFO[p].nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Perfil do Gestor/Vaga</label>
            <Select value={profile2} onValueChange={(v) => setProfile2(v as 'D' | 'I' | 'S' | 'C')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(['D', 'I', 'S', 'C'] as const).map((p) => (
                  <SelectItem key={p} value={p}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${DISC_PROFILES_INFO[p].cor}`} />
                      {p} - {DISC_PROFILES_INFO[p].nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {compatibility && (
          <>
            {/* Score de Compatibilidade */}
            <div className="text-center py-4 border rounded-lg bg-muted/30">
              <div className={`text-5xl font-bold ${getScoreColor(compatibility.score)}`}>
                {compatibility.score}%
              </div>
              <div className="text-lg text-muted-foreground mt-1">
                Compatibilidade {getScoreLabel(compatibility.score)}
              </div>
              <Progress 
                value={compatibility.score} 
                className="h-2 max-w-xs mx-auto mt-3" 
              />
            </div>

            {/* Análise */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Sinergias
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {compatibility.sinergias.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-success">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Potenciais Conflitos
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {compatibility.conflitos.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-warning">⚠️</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <h4 className="font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-info" />
                Dicas de Comunicação
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {compatibility.dicasComunicacao.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-info">💬</span> {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <h4 className="font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Estilo de Trabalho Juntos
              </h4>
              <p className="text-sm text-muted-foreground italic">
                "{compatibility.estiloTrabalho}"
              </p>
            </div>
          </>
        )}

        {/* Mini Matrix Reference */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">Referência Rápida</h4>
          <div className="grid grid-cols-5 gap-1 text-xs text-center">
            <div></div>
            {(['D', 'I', 'S', 'C'] as const).map((p) => (
              <div key={p} className={`${DISC_PROFILES_INFO[p].cor} text-white rounded py-1 font-medium`}>
                {p}
              </div>
            ))}
            {(['D', 'I', 'S', 'C'] as const).map((p1) => (
              <>
                <div key={`row-${p1}`} className={`${DISC_PROFILES_INFO[p1].cor} text-white rounded py-1 font-medium`}>
                  {p1}
                </div>
                {(['D', 'I', 'S', 'C'] as const).map((p2) => {
                  const compat = getDISCCompatibility(p1, p2);
                  const score = compat?.score || 50;
                  return (
                    <div 
                      key={`${p1}-${p2}`}
                      className={`rounded py-1 ${
                        score >= 75 ? 'bg-success/15 text-success' :
                        score >= 60 ? 'bg-warning/15 text-warning' :
                        score >= 45 ? 'bg-warning/10 text-warning' :
                        'bg-destructive/15 text-destructive'
                      }`}
                    >
                      {score}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default DISCCompatibilityView;
