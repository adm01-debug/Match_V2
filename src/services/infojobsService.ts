// InfoJobs Integration Service

export const infojobsService = {
  async publishJob(jobData: Record<string, unknown>) {
    console.log('[InfoJobsService] Publishing job:', jobData);
    return { success: false, message: 'InfoJobs API not configured' };
  },

  async importCandidates(jobId: string) {
    console.log('[InfoJobsService] Import candidates:', jobId);
    return [];
  },

  isConfigured: () => false,
};
