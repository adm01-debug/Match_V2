import { apiLogger } from './logger';

// Indeed Integration Service

export const indeedService = {
  async publishJob(jobData: Record<string, unknown>) {
    apiLogger.info('Publishing job', { jobData });
    return { success: false, message: 'Indeed API not configured' };
  },

  async importCandidates(jobId: string) {
    apiLogger.info('Import candidates for job', { jobId });
    return [];
  },

  async getJobAnalytics(jobId: string) {
    apiLogger.info('Get analytics for job', { jobId });
    return { views: 0, applies: 0, clicks: 0 };
  },

  isConfigured(): boolean {
    return false;
  },
};