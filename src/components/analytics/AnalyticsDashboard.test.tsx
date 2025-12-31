import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AnalyticsDashboard } from './AnalyticsDashboard';

// Mock recharts to avoid canvas issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: () => <div data-testid="bar-chart" />,
  Bar: () => null,
  LineChart: () => <div data-testid="line-chart" />,
  Line: () => null,
  PieChart: () => <div data-testid="pie-chart" />,
  Pie: () => null,
  Cell: () => null,
  AreaChart: () => <div data-testid="area-chart" />,
  Area: () => null,
  FunnelChart: () => <div data-testid="funnel-chart" />,
  Funnel: () => null,
  LabelList: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe('AnalyticsDashboard', () => {
  it('renders dashboard with KPIs', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText(/total de candidatos/i)).toBeInTheDocument();
  });

  it('shows time to hire metric', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText(/tempo médio/i)).toBeInTheDocument();
  });

  it('shows open positions', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText(/vagas abertas/i)).toBeInTheDocument();
  });

  it('shows hire rate', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText(/taxa de contratação/i)).toBeInTheDocument();
  });

  it('shows funnel tab', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByRole('tab', { name: /funil/i })).toBeInTheDocument();
  });

  it('shows sources tab', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByRole('tab', { name: /fontes/i })).toBeInTheDocument();
  });

  it('shows timeline tab', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByRole('tab', { name: /timeline/i })).toBeInTheDocument();
  });
});
