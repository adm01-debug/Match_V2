// Vagas.com Integration Service

export const vagasComService = {
  async publishJob(jobData: Record<string, unknown>) {
    console.log('[VagasComService] Publishing job:', jobData);
    return { success: false, message: 'Vagas.com API not configured' };
  },

  async importCandidates(jobId: string) {
    console.log('[VagasComService] Import candidates:', jobId);
    return [];
  },

  isConfigured: () => false,
};
