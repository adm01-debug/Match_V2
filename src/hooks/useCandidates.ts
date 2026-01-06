import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  resumeUrl?: string;
  source: string;
  stage: string;
  jobId: string;
  jobTitle: string;
  score?: number;
  tags: string[];
  notes: string[];
  interviews: Interview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Interview {
  id: string;
  date: Date;
  type: 'phone' | 'video' | 'onsite' | 'technical';
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
  rating?: number;
}

interface CandidateFilters {
  search?: string;
  jobId?: string;
  stage?: string;
  source?: string;
  tags?: string[];
  minScore?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

interface CreateCandidateData {
  name: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  jobId: string;
  source: string;
  resumeFile?: File;
  tags?: string[];
}

// Mock data generator
const generateMockCandidates = (count: number): Candidate[] => {
  const stages = ['Novo', 'Triagem', 'Entrevista RH', 'Entrevista Técnica', 'Proposta', 'Contratado', 'Reprovado'];
  const sources = ['LinkedIn', 'Indeed', 'Catho', 'Indicação', 'Site Carreiras'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `cand-${i + 1}`,
    name: `Candidato ${i + 1}`,
    email: `candidato${i + 1}@email.com`,
    phone: `(11) 9${String(Math.random()).slice(2, 10)}`,
    source: sources[Math.floor(Math.random() * sources.length)] || 'LinkedIn',
    stage: stages[Math.floor(Math.random() * stages.length)] || 'Novo',
    jobId: `job-${Math.floor(Math.random() * 5) + 1}`,
    jobTitle: `Vaga ${Math.floor(Math.random() * 5) + 1}`,
    score: Math.floor(Math.random() * 40) + 60,
    tags: ['React', 'TypeScript', 'Node.js'].slice(0, Math.floor(Math.random() * 3) + 1),
    notes: [],
    interviews: [],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }));
};

const mockCandidates = generateMockCandidates(50);

export function useCandidates(filters?: CandidateFilters) {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    data: candidates = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['candidates', filters],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let filtered = [...mockCandidates];
      
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
          (c) => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)
        );
      }
      if (filters?.jobId) {
        filtered = filtered.filter((c) => c.jobId === filters.jobId);
      }
      if (filters?.stage) {
        filtered = filtered.filter((c) => c.stage === filters.stage);
      }
      if (filters?.source) {
        filtered = filtered.filter((c) => c.source === filters.source);
      }
      if (filters?.minScore) {
        filtered = filtered.filter((c) => (c.score || 0) >= filters.minScore!);
      }
      
      return filtered;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateCandidateData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newCandidate: Candidate = {
        id: `cand-${Date.now()}`,
        ...data,
        stage: 'Novo',
        score: Math.floor(Math.random() * 40) + 60,
        tags: data.tags || [],
        notes: [],
        interviews: [],
        jobTitle: `Vaga ${data.jobId}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockCandidates.unshift(newCandidate);
      return newCandidate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const candidate = mockCandidates.find((c) => c.id === id);
      if (candidate) {
        candidate.stage = stage;
        candidate.updatedAt = new Date();
      }
      return candidate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, updates }: { ids: string[]; updates: Partial<Candidate> }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      ids.forEach((id) => {
        const candidate = mockCandidates.find((c) => c.id === id);
        if (candidate) {
          Object.assign(candidate, updates, { updatedAt: new Date() });
        }
      });
      return ids.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      setSelectedIds([]);
    },
  });

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(candidates.map((c) => c.id));
  }, [candidates]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    candidates,
    isLoading,
    error,
    refetch,
    createCandidate: createMutation.mutateAsync,
    updateStage: updateStageMutation.mutateAsync,
    bulkUpdate: bulkUpdateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateStageMutation.isPending || bulkUpdateMutation.isPending,
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
  };
}
