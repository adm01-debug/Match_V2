import { apiLogger } from './logger';

// Vagas.com Integration Service

export const vagasComService = {
  async publishJob(jobData: Record<string, unknown>) {
    apiLogger.info('Publishing job', jobData);
    return { success: false, message: 'Vagas.com API not configured' };
  },

  async importCandidates(jobId: string) {
    apiLogger.info('Import candidates', { jobId });
    return [];
  },

  isConfigured: () => false,
};