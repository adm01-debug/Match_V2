// Generic Job Board Service
import { linkedinService } from './linkedinService';
import { indeedService } from './indeedService';
import { cathoService } from './cathoService';
import { infojobsService } from './infojobsService';
import { vagasComService } from './vagasService';

export type JobBoard = 'linkedin' | 'indeed' | 'catho' | 'infojobs' | 'vagas';

const boardMap = {
  linkedin: linkedinService,
  indeed: indeedService,
  catho: cathoService,
  infojobs: infojobsService,
  vagas: vagasComService,
};

export const jobBoardService = {
  async publishToBoard(board: JobBoard, jobData: Record<string, unknown>) {
    return boardMap[board].publishJob(jobData);
  },

  async publishToAll(jobData: Record<string, unknown>) {
    const results = await Promise.allSettled(
      Object.entries(boardMap).map(([name, service]) =>
        service.publishJob(jobData).then((r) => ({ board: name, ...r }))
      )
    );
    return results;
  },

  getConfiguredBoards(): JobBoard[] {
    return (Object.entries(boardMap) as [JobBoard, typeof linkedinService][])
      .filter(([, s]) => s.isConfigured())
      .map(([name]) => name);
  },
};
