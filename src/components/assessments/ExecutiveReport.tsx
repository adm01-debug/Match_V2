/**
 * @fileoverview Relatório Executivo Consolidado para Gestores
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FileText,
  User,
  ThumbsUp,
  TrendingUp,
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Target,
  ArrowRight,
  Download,
  Printer
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { RelatorioExecutivo } from '@/types/jobFit';

interface ExecutiveReportProps {
  relatorio: RelatorioExecutivo;
  candidatoFoto?: string;
  onPrint?: () => void;
  onExport?: () => void;
}

const CLASSIFICACAO_CORES = {
  excepcional: 'bg-success text-success-foreground',
  acima_media: 'bg-success/70 text-success-foreground',
  adequado: 'bg-warning text-warning-foreground',
  abaixo_media: 'bg-warning/70 text-warning-foreground',
  nao_recomendado: 'bg-destructive text-destructive-foreground'
};

const CLASSIFICACAO_LABELS = {
  excepcional: 'Excepcional',
  acima_media: 'Acima da Média',
  adequado: 'Adequado',
  abaixo_media: 'Abaixo da Média',
  nao_recomendado: 'Não Recomendado'
};

const DECISAO_CONFIG = {
  aprovar: { icon: CheckCircle, cor: 'text-success bg-success/15', label: 'Aprovar' },
  entrevistar: { icon: Clock, cor: 'text-info bg-info/15', label: 'Entrevistar' },
  reserva: { icon: Clock, cor: 'text-warning bg-warning/15', label: 'Banco de Reserva' },
  recusar: { icon: XCircle, cor: 'text-destructive bg-destructive/15', label: 'Não Prosseguir' }
};

const DISC_COLORS = {
  D: 'hsl(var(--destructive))',
  I: 'hsl(var(--warning))',
  S: 'hsl(var(--success))',
  C: 'hsl(var(--info))'
};

export function ExecutiveReport({ 
  relatorio, 
  candidatoFoto,
  onPrint,
  onExport 
}: ExecutiveReportProps) {
  const decisaoConfig = DECISAO_CONFIG[relatorio.decisaoSugerida];
  const DecisaoIcon = decisaoConfig.icon;

  // Preparar dados para radar chart
  const radarData = relatorio.dadosVisuais.radarCompetencias.map(c => ({
    subject: c.label.charAt(0).toUpperCase() + c.label.slice(1),
    A: c.valor,
    fullMark: 100
  }));

  // Preparar dados para DISC pie chart
  const discData = Object.entries(relatorio.dadosVisuais.discChart).map(([key, value]) => ({
    name: key,
    value
  }));

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header com ações */}
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Relatório Executivo
        </h2>
        <div className="flex gap-2">
          {onPrint && (
            <Button variant="outline" size="sm" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          )}
        </div>
      </div>

      {/* Card principal do candidato */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={candidatoFoto} />
              <AvatarFallback className="text-2xl">
                {relatorio.candidatoNome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">{relatorio.candidatoNome}</h3>
                <Badge className={CLASSIFICACAO_CORES[relatorio.classificacaoGeral]}>
                  {CLASSIFICACAO_LABELS[relatorio.classificacaoGeral]}
                </Badge>
              </div>

              {relatorio.vagaTitulo && (
                <p className="text-muted-foreground mb-3">
                  Candidato para: <strong>{relatorio.vagaTitulo}</strong>
                </p>
              )}

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-lg">{relatorio.manchetePrincipal}</p>
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {relatorio.scoreFinalConsolidado}%
              </div>
              <p className="text-sm text-muted-foreground">Score Consolidado</p>
              <div className="mt-2">
                <Badge variant="outline">
                  Confiança: {relatorio.confiancaDecisao}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decisão Sugerida */}
      <Card className={decisaoConfig.cor}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DecisaoIcon className="h-8 w-8" />
              <div>
                <h4 className="font-bold text-lg">Decisão Sugerida: {decisaoConfig.label}</h4>
                <p className="text-sm opacity-80">
                  Baseado em {relatorio.ferramentasAvaliadas.length} ferramentas de avaliação
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Ferramentas:</span>
              {relatorio.ferramentasAvaliadas.slice(0, 4).map(f => (
                <Badge key={f} variant="outline" className="bg-white/50">
                  {f.toUpperCase()}
                </Badge>
              ))}
              {relatorio.ferramentasAvaliadas.length > 4 && (
                <Badge variant="outline" className="bg-white/50">
                  +{relatorio.ferramentasAvaliadas.length - 4}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de seções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Perfil Comportamental */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-info" />
              {relatorio.secoes.perfilComportamental.titulo}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{relatorio.secoes.perfilComportamental.conteudo}</p>
          </CardContent>
        </Card>

        {/* Pontos Fortes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-success" />
              {relatorio.secoes.pontosFortes.titulo}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{relatorio.secoes.pontosFortes.conteudo}</p>
          </CardContent>
        </Card>

        {/* Áreas de Desenvolvimento */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-warning" />
              {relatorio.secoes.areasDesenvolvimento.titulo}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{relatorio.secoes.areasDesenvolvimento.conteudo}</p>
          </CardContent>
        </Card>

        {/* Fit Cultural */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              {relatorio.secoes.fitCultural.titulo}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{relatorio.secoes.fitCultural.conteudo}</p>
            {relatorio.dadosVisuais.compatibilidadeVaga && (
              <div className="mt-2">
                <Progress value={relatorio.dadosVisuais.compatibilidadeVaga} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Riscos */}
      <Card className={relatorio.secoes.riscos.conteudo.includes('Nenhum') ? 'border-success/30' : 'border-destructive/30'}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className={`h-4 w-4 ${relatorio.secoes.riscos.conteudo.includes('Nenhum') ? 'text-success' : 'text-destructive'}`} />
            {relatorio.secoes.riscos.titulo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{relatorio.secoes.riscos.conteudo}</p>
        </CardContent>
      </Card>

      {/* Gráficos visuais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:break-before-page">
        {/* Radar de Competências */}
        {radarData.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Competências Comportamentais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Candidato"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* DISC Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Perfil DISC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={discData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {discData.map((entry) => (
                      <Cell 
                        key={`cell-${entry.name}`} 
                        fill={DISC_COLORS[entry.name as keyof typeof DISC_COLORS]} 
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendação Final e Próximos Passos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            {relatorio.secoes.recomendacaoFinal.titulo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{relatorio.secoes.recomendacaoFinal.conteudo}</p>

          <Separator className="my-4" />

          <h4 className="font-medium mb-3 flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Próximos Passos Sugeridos
          </h4>
          <ul className="space-y-2">
            {relatorio.proximosPassos.map((passo, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="font-medium text-primary">{idx + 1}.</span>
                <span>{passo}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Footer com metadados */}
      <div className="text-xs text-muted-foreground text-center pt-4 border-t print:mt-8">
        Relatório gerado em {new Date(relatorio.geradoEm).toLocaleString('pt-BR')}
        {relatorio.geradoPor && ` por ${relatorio.geradoPor}`}
      </div>
    </div>
  );
}
