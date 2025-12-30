import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnalyticsDashboard } from './AnalyticsDashboard';

describe('AnalyticsDashboard', () => {
  const mockData = {
    timeToHire: 25,
    openPositions: 12,
    activeCandidates: 156,
    conversionRate: 8.5,
  };

  it('renders dashboard', () => {
    render(<AnalyticsDashboard data={mockData} />);
    expect(screen.getByText(/analytics/i)).toBeInTheDocument();
  });

  it('shows time to hire metric', () => {
    render(<AnalyticsDashboard data={mockData} />);
    expect(screen.getByText(/tempo médio/i)).toBeInTheDocument();
    expect(screen.getByText(/25/)).toBeInTheDocument();
  });

  it('shows open positions', () => {
    render(<AnalyticsDashboard data={mockData} />);
    expect(screen.getByText(/vagas abertas/i)).toBeInTheDocument();
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  it('shows active candidates', () => {
    render(<AnalyticsDashboard data={mockData} />);
    expect(screen.getByText(/candidatos ativos/i)).toBeInTheDocument();
    expect(screen.getByText(/156/)).toBeInTheDocument();
  });

  it('shows conversion rate', () => {
    render(<AnalyticsDashboard data={mockData} />);
    expect(screen.getByText(/taxa de conversão/i)).toBeInTheDocument();
    expect(screen.getByText(/8.5%/)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<AnalyticsDashboard isLoading />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<AnalyticsDashboard data={null} />);
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument();
  });
});
