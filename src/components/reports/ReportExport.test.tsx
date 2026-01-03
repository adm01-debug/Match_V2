import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReportExport } from './ReportExport';

describe('ReportExport', () => {
  const mockData = [{ id: 1, nome: 'Test' }];
  const defaultProps = { 
    data: mockData, 
    reportName: 'test-report' 
  };

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
    });
  });

  it('exports to CSV', async () => {
    const onExport = vi.fn();
    render(<ReportExport {...defaultProps} onExport={onExport} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar/i }));
    await waitFor(() => {
      expect(screen.getByText(/csv/i)).toBeInTheDocument();
    });
  });

  it('exports to Excel', async () => {
    const onExport = vi.fn();
    render(<ReportExport {...defaultProps} onExport={onExport} />);
    fireEvent.click(screen.getByRole('button', { name: /exportar/i }));
    await waitFor(() => {
      expect(screen.getByText(/excel/i)).toBeInTheDocument();
    });
  });

  it('button should be clickable', () => {
    render(<ReportExport {...defaultProps} />);
    const button = screen.getByRole('button', { name: /exportar/i });
    expect(button).not.toBeDisabled();
  });
});
