import { Layout } from "@/components/layout/Layout";
import { KPICard } from "@/components/dashboard/KPICard";
import { FunilChart } from "@/components/dashboard/FunilChart";
import { VagasUrgentes } from "@/components/dashboard/VagasUrgentes";
import { AcoesPendentes } from "@/components/dashboard/AcoesPendentes";
import { AgendaHoje } from "@/components/dashboard/AgendaHoje";
import { AcoesRapidas } from "@/components/dashboard/AcoesRapidas";
import { SmartInsights } from "@/components/dashboard/SmartInsights";
import { AlertasInteligentes } from "@/components/dashboard/AlertasInteligentes";
import { TopCandidatos } from "@/components/dashboard/TopCandidatos";
import { EntrevistasStats } from "@/components/dashboard/EntrevistasStats";
import { EntrevistasChart } from "@/components/dashboard/EntrevistasChart";
import {
  kpiData,
  funilData,
  vagasUrgentes,
  acoesPendentes,
  agendaDia,
  processos,
} from "@/data/mockData";
import { Briefcase, Users, Target, UserCheck, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  return (
    <Layout title="Dashboard">
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Visão Geral</h2>
            <p className="text-muted-foreground">
              Acompanhe o processo de recrutamento em tempo real
            </p>
          </div>
          <Select defaultValue="dez">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dez">Dezembro 2025</SelectItem>
              <SelectItem value="nov">Novembro 2025</SelectItem>
              <SelectItem value="out">Outubro 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            title="Vagas Abertas"
            value={kpiData.vagasAbertas}
            subtitle={`+${kpiData.vagasNovas} novas`}
            icon={Briefcase}
            variant="primary"
          />
          <KPICard
            title="Candidatos Total"
            value={kpiData.candidatosTotal}
            subtitle={`+${kpiData.candidatosNovos} este mês`}
            icon={Users}
            trend={{ value: "+45", positive: true }}
            variant="default"
          />
          <KPICard
            title="Em Processo"
            value={kpiData.emProcesso}
            subtitle={`em ${kpiData.vagasEmProcesso} vagas`}
            icon={Target}
            variant="warning"
          />
          <KPICard
            title="Contratados no Mês"
            value={kpiData.contratadosMes}
            subtitle={`meta: ${kpiData.metaContratacao}`}
            icon={UserCheck}
            variant="success"
          />
          <KPICard
            title="Tempo Médio"
            value={`${kpiData.tempoMedio} dias`}
            subtitle={`meta: ${kpiData.metaTempo}`}
            icon={Clock}
            variant={kpiData.tempoMedio > kpiData.metaTempo ? "danger" : "success"}
          />
        </div>

        {/* Insights e Alertas Inteligentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SmartInsights kpiData={kpiData} funilData={funilData} />
          <AlertasInteligentes acoesPendentes={acoesPendentes} vagasUrgentes={vagasUrgentes} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funil - Takes 2 columns */}
          <div className="lg:col-span-2">
            <FunilChart data={funilData} />
          </div>

          {/* Top Candidatos */}
          <div>
            <TopCandidatos processos={processos} />
          </div>
        </div>

        {/* Entrevistas Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Evolução */}
          <div className="lg:col-span-2">
            <EntrevistasChart />
          </div>

          {/* Estatísticas de Entrevistas */}
          <div>
            <EntrevistasStats />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vagas Urgentes */}
          <div className="lg:col-span-2">
            <VagasUrgentes vagas={vagasUrgentes} />
          </div>

          {/* Agenda do Dia */}
          <div>
            <AgendaHoje agenda={agendaDia} />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ações Pendentes */}
          <div className="lg:col-span-2">
            <AcoesPendentes acoes={acoesPendentes} />
          </div>

          {/* Agenda do Dia */}
          <div>
            <AgendaHoje agenda={agendaDia} />
          </div>
        </div>

        {/* Ações Pendentes Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <AcoesPendentes acoes={acoesPendentes} />
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Ações Rápidas</h3>
          <AcoesRapidas />
        </div>
      </div>
    </Layout>
  );
}
