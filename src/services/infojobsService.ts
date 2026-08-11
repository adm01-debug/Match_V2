import { apiLogger } from './logger';

// InfoJobs Integration Service

export const infojobsService = {
  async publishJob(jobData: Record<string, unknown>) {
    apiLogger.info('Publishing job', { jobData });
    return { success: false, message: 'InfoJobs API not configured' };
  },

  async importCandidates(jobId: string) {
    apiLogger.info('Import candidates', { jobId });
    return [];
  },

  isConfigured: () => false,
};