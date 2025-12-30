import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReportChart } from './ReportChart';

describe('ReportChart', () => {
  const mockData = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 150 },
    { name: 'Mar', value: 200 },
  ];

  it('renders chart container', () => {
    render(<ReportChart type="bar" data={mockData} dataKey="value" nameKey="name" />);
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('renders bar chart', () => {
    render(<ReportChart type="bar" data={mockData} dataKey="value" nameKey="name" />);
    expect(document.querySelector('.recharts-bar')).toBeInTheDocument();
  });

  it('renders line chart', () => {
    render(<ReportChart type="line" data={mockData} dataKey="value" nameKey="name" />);
    expect(document.querySelector('.recharts-line')).toBeInTheDocument();
  });

  it('renders pie chart', () => {
    render(<ReportChart type="pie" data={mockData} dataKey="value" nameKey="name" />);
    expect(document.querySelector('.recharts-pie')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<ReportChart type="bar" data={[]} dataKey="value" nameKey="name" loading />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<ReportChart type="bar" data={[]} dataKey="value" nameKey="name" />);
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument();
  });
});
