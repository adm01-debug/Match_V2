import type { Meta, StoryObj } from "@storybook/react";
import { ReportChart } from "./ReportChart";

const meta: Meta<typeof ReportChart> = {
  title: "Reports/ReportChart",
  component: ReportChart,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ReportChart>;

const sampleData = [
  { name: "Jan", value: 400 },
  { name: "Fev", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Abr", value: 280 },
  { name: "Mai", value: 590 },
  { name: "Jun", value: 320 },
];

const funnelData = [
  { name: "Candidaturas", value: 1000 },
  { name: "Triagem", value: 750 },
  { name: "Entrevista RH", value: 400 },
  { name: "Entrevista Técnica", value: 200 },
  { name: "Proposta", value: 80 },
  { name: "Contratados", value: 50 },
];

export const BarChart: Story = {
  args: {
    title: "Candidatos por Mês",
    description: "Quantidade de candidatos recebidos",
    type: "bar",
    data: sampleData,
    height: 300,
  },
};

export const LineChart: Story = {
  args: {
    title: "Evolução de Contratações",
    type: "line",
    data: sampleData,
    height: 300,
  },
};

export const PieChart: Story = {
  args: {
    title: "Distribuição por Fonte",
    type: "pie",
    data: [
      { name: "LinkedIn", value: 450 },
      { name: "Indeed", value: 320 },
      { name: "Indicação", value: 180 },
      { name: "Site", value: 150 },
    ],
    height: 300,
  },
};

export const FunnelChart: Story = {
  args: {
    title: "Funil de Contratação",
    description: "Conversão entre etapas do processo",
    type: "funnel",
    data: funnelData,
    height: 400,
  },
};

export const AreaChart: Story = {
  args: {
    title: "Pipeline Velocity",
    type: "area",
    data: sampleData,
    height: 300,
  },
};
