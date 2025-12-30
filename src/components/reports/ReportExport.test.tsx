import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReportExport } from './ReportExport';

describe('ReportExport', () => {
  const mockData = [{ id: 1, nome: 'Test' }];
  const defaultProps = { data: mockData, filename: 'report' };

  it('renders export button', () => {
    render(<ReportExport {...defaultProps} />);
    expect(screen.getByRole('button', { name: /exportar/i })).toBeInTheDocument();
  });

  it('shows format options on click', async () => {
    render(<ReportExport {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar/i }));
    await waitFor(() => {
      expect(screen.getByText(/csv/i)).toBeInTheDocument();
      expect(screen.getByText(/excel/i)).toBeInTheDocument();
      expect(screen.getByText(/pdf/i)).toBeInTheDocument();
    });
  });

  it('exports to CSV', async () => {
    const onExport = vi.fn();
    render(<ReportExport {...defaultProps} onExport={onExport} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar/i }));
    fireEvent.click(screen.getByText(/csv/i));
    await waitFor(() => expect(onExport).toHaveBeenCalledWith('csv'));
  });

  it('exports to Excel', async () => {
    const onExport = vi.fn();
    render(<ReportExport {...defaultProps} onExport={onExport} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar/i }));
    fireEvent.click(screen.getByText(/excel/i));
    await waitFor(() => expect(onExport).toHaveBeenCalledWith('xlsx'));
  });

  it('disables when no data', () => {
    render(<ReportExport data={[]} filename="report" />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
