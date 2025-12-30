import type { Meta, StoryObj } from '@storybook/react';
import { AnalyticsDashboard } from './AnalyticsDashboard';

const meta: Meta<typeof AnalyticsDashboard> = {
  title: 'Analytics/AnalyticsDashboard',
  component: AnalyticsDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Dashboard completo de analytics com métricas de recrutamento.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = {
  timeToHire: 25,
  timeToHireTrend: -5,
  openPositions: 12,
  activeCandidates: 156,
  conversionRate: 8.5,
  sourcesData: [
    { name: 'LinkedIn', candidates: 45, hires: 5 },
    { name: 'Indeed', candidates: 38, hires: 3 },
    { name: 'Indicação', candidates: 25, hires: 6 },
    { name: 'Site', candidates: 48, hires: 2 },
  ],
  timeToHireData: [
    { month: 'Jan', days: 28 },
    { month: 'Fev', days: 26 },
    { month: 'Mar', days: 24 },
    { month: 'Abr', days: 25 },
  ],
};

export const Default: Story = {
  args: {
    data: mockData,
    dateRange: { from: new Date('2024-01-01'), to: new Date('2024-04-30') },
  },
};

export const HighPerformance: Story = {
  args: {
    data: {
      ...mockData,
      timeToHire: 15,
      conversionRate: 15.2,
    },
    dateRange: { from: new Date('2024-01-01'), to: new Date('2024-04-30') },
  },
};

export const LowPerformance: Story = {
  args: {
    data: {
      ...mockData,
      timeToHire: 45,
      conversionRate: 3.2,
    },
    dateRange: { from: new Date('2024-01-01'), to: new Date('2024-04-30') },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    data: null,
  },
};
