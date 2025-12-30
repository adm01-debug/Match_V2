import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reportingService } from './reportingService';

describe('reportingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateReport', () => {
    it('generates hiring funnel report', async () => {
      const result = await reportingService.generateReport('hiring_funnel', {
        dateRange: { from: new Date('2024-01-01'), to: new Date('2024-03-31') },
      });
      expect(result).toBeDefined();
      expect(result.type).toBe('hiring_funnel');
    });

    it('generates time to hire report', async () => {
      const result = await reportingService.generateReport('time_to_hire', {
        dateRange: { from: new Date('2024-01-01'), to: new Date('2024-03-31') },
      });
      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('averageTime');
    });

    it('generates source effectiveness report', async () => {
      const result = await reportingService.generateReport('source_effectiveness', {});
      expect(result).toBeDefined();
      expect(result.data).toHaveProperty('sources');
    });
  });

  describe('exportReport', () => {
    it('exports to CSV format', async () => {
      const data = [{ name: 'Test', value: 100 }];
      const result = await reportingService.exportReport(data, 'csv');
      expect(result).toBeDefined();
      expect(result.mimeType).toBe('text/csv');
    });

    it('exports to Excel format', async () => {
      const data = [{ name: 'Test', value: 100 }];
      const result = await reportingService.exportReport(data, 'xlsx');
      expect(result).toBeDefined();
    });

    it('exports to PDF format', async () => {
      const data = [{ name: 'Test', value: 100 }];
      const result = await reportingService.exportReport(data, 'pdf');
      expect(result).toBeDefined();
      expect(result.mimeType).toBe('application/pdf');
    });
  });

  describe('scheduleReport', () => {
    it('schedules a daily report', async () => {
      const schedule = await reportingService.scheduleReport({
        type: 'hiring_funnel',
        frequency: 'daily',
        recipients: ['test@example.com'],
      });
      expect(schedule).toBeDefined();
      expect(schedule.frequency).toBe('daily');
    });

    it('schedules a weekly report', async () => {
      const schedule = await reportingService.scheduleReport({
        type: 'time_to_hire',
        frequency: 'weekly',
        dayOfWeek: 1,
        recipients: ['test@example.com'],
      });
      expect(schedule.dayOfWeek).toBe(1);
    });
  });
});
