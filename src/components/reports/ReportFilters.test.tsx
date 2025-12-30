import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReportFilters } from './ReportFilters';

describe('ReportFilters', () => {
  const defaultProps = {
    filters: { dateRange: { from: new Date(), to: new Date() }, status: 'all' },
    onFiltersChange: vi.fn(),
  };

  it('renders filter controls', () => {
    render(<ReportFilters {...defaultProps} />);
    expect(screen.getByText(/filtros/i)).toBeInTheDocument();
  });

  it('shows date range picker', () => {
    render(<ReportFilters {...defaultProps} />);
    expect(screen.getByText(/período/i)).toBeInTheDocument();
  });

  it('calls onFiltersChange when date changes', () => {
    render(<ReportFilters {...defaultProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'last_30_days' } });
    expect(defaultProps.onFiltersChange).toHaveBeenCalled();
  });

  it('shows status filter', () => {
    render(<ReportFilters {...defaultProps} />);
    expect(screen.getByText(/status/i)).toBeInTheDocument();
  });

  it('allows clearing filters', () => {
    render(<ReportFilters {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /limpar/i }));
    expect(defaultProps.onFiltersChange).toHaveBeenCalled();
  });

  it('shows active filter count', () => {
    const filters = { ...defaultProps.filters, status: 'active', source: 'linkedin' };
    render(<ReportFilters {...defaultProps} filters={filters} />);
    expect(screen.getByText(/2 filtros/i)).toBeInTheDocument();
  });
});
