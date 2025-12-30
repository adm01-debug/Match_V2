import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReportScheduler } from './ReportScheduler';

describe('ReportScheduler', () => {
  const defaultProps = {
    onSchedule: vi.fn(),
    reportType: 'hiring_funnel',
  };

  it('renders scheduler form', () => {
    render(<ReportScheduler {...defaultProps} />);
    expect(screen.getByText(/agendar relatório/i)).toBeInTheDocument();
  });

  it('shows frequency options', () => {
    render(<ReportScheduler {...defaultProps} />);
    expect(screen.getByLabelText(/frequência/i)).toBeInTheDocument();
  });

  it('allows selecting daily frequency', () => {
    render(<ReportScheduler {...defaultProps} />);
    fireEvent.click(screen.getByLabelText(/diário/i));
    expect(screen.getByLabelText(/diário/i)).toBeChecked();
  });

  it('shows day picker for weekly', () => {
    render(<ReportScheduler {...defaultProps} />);
    fireEvent.click(screen.getByLabelText(/semanal/i));
    expect(screen.getByLabelText(/dia da semana/i)).toBeInTheDocument();
  });

  it('requires recipients', () => {
    render(<ReportScheduler {...defaultProps} />);
    expect(screen.getByLabelText(/destinatários/i)).toBeRequired();
  });

  it('calls onSchedule when submitted', () => {
    render(<ReportScheduler {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/destinatários/i), { target: { value: 'test@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /agendar/i }));
    expect(defaultProps.onSchedule).toHaveBeenCalled();
  });
});
