// Catho Integration Service

export const cathoService = {
  async publishJob(jobData: Record<string, unknown>) {
    console.log('[CathoService] Publishing job:', jobData);
    return { success: false, message: 'Catho API not configured' };
  },

  async importCandidates(jobId: string) {
    console.log('[CathoService] Import candidates:', jobId);
    return [];
  },

  isConfigured: () => false,
};
