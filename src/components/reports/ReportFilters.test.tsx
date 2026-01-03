import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportFilters, ReportFiltersState } from './ReportFilters';
import { subDays } from 'date-fns';

describe('ReportFilters', () => {
  const createDefaultFilters = (): ReportFiltersState => ({
    dateRange: { from: subDays(new Date(), 30), to: new Date() },
    vagas: [],
    recrutadores: [],
    fontes: [],
    etapas: [],
  });

  const defaultProps = {
    filters: createDefaultFilters(),
    onFiltersChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders filter controls', () => {
    render(<ReportFilters {...defaultProps} />);
    expect(screen.getByText(/filtros/i)).toBeInTheDocument();
  });

  it('shows date range picker', () => {
    render(<ReportFilters {...defaultProps} />);
    expect(screen.getByText(/período/i)).toBeInTheDocument();
  });

  it('renders vaga selector', () => {
    render(<ReportFilters {...defaultProps} />);
    expect(screen.getByText(/todas as vagas/i)).toBeInTheDocument();
  });

  it('renders recrutador selector', () => {
    render(<ReportFilters {...defaultProps} />);
    expect(screen.getByText(/todos os recrutadores/i)).toBeInTheDocument();
  });

  it('shows active filter count when filters are applied', () => {
    const filtersWithActive: ReportFiltersState = {
      ...createDefaultFilters(),
      fontes: ['linkedin'],
      etapas: ['triagem'],
    };
    render(<ReportFilters {...defaultProps} filters={filtersWithActive} />);
    expect(screen.getByText(/2 ativos/i)).toBeInTheDocument();
  });

  it('shows clear button when filters are active', () => {
    const filtersWithActive: ReportFiltersState = {
      ...createDefaultFilters(),
      fontes: ['linkedin'],
    };
    render(<ReportFilters {...defaultProps} filters={filtersWithActive} />);
    expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
  });

  it('calls onFiltersChange when clearing filters', () => {
    const filtersWithActive: ReportFiltersState = {
      ...createDefaultFilters(),
      fontes: ['linkedin'],
    };
    render(<ReportFilters {...defaultProps} filters={filtersWithActive} />);
    fireEvent.click(screen.getByRole('button', { name: /limpar/i }));
    expect(defaultProps.onFiltersChange).toHaveBeenCalled();
  });
});
