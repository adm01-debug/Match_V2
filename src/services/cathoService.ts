import { apiLogger } from './logger';

// Catho Integration Service

export const cathoService = {
  async publishJob(jobData: Record<string, unknown>) {
    apiLogger.info('Publishing job', { jobData });
    return { success: false, message: 'Catho API not configured' };
  },

  async importCandidates(jobId: string) {
    apiLogger.info('Import candidates', { jobId });
    return [];
  },

  isConfigured: () => false,
};