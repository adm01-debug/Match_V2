import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: 'onsite' | 'remote' | 'hybrid';
  salary?: { min: number; max: number; currency: string };
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'draft' | 'open' | 'paused' | 'closed';
  hiringManager: string;
  recruiters: string[];
  candidatesCount: number;
  publishedChannels: string[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

interface JobFilters {
  search?: string;
  status?: Job['status'];
  department?: string;
  location?: string;
  type?: Job['type'];
}

interface CreateJobData {
  title: string;
  department: string;
  location: string;
  type: Job['type'];
  remote: Job['remote'];
  salary?: Job['salary'];
  description: string;
  requirements: string[];
  benefits?: string[];
  hiringManager: string;
  recruiters?: string[];
}

// Mock data
const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Desenvolvedor Full Stack Senior',
    department: 'Tecnologia',
    location: 'São Paulo, SP',
    type: 'full-time',
    remote: 'hybrid',
    salary: { min: 15000, max: 25000, currency: 'BRL' },
    description: 'Buscamos um desenvolvedor experiente...',
    requirements: ['5+ anos de experiência', 'React', 'Node.js', 'TypeScript'],
    benefits: ['VR/VA', 'Plano de Saúde', 'Home Office'],
    status: 'open',
    hiringManager: 'João Silva',
    recruiters: ['Maria Santos'],
    candidatesCount: 45,
    publishedChannels: ['LinkedIn', 'Indeed', 'Site Carreiras'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: 'job-2',
    title: 'Product Manager',
    department: 'Produto',
    location: 'Rio de Janeiro, RJ',
    type: 'full-time',
    remote: 'remote',
    salary: { min: 18000, max: 28000, currency: 'BRL' },
    description: 'Procuramos um PM para liderar...',
    requirements: ['3+ anos como PM', 'Metodologias ágeis', 'Análise de dados'],
    benefits: ['VR/VA', 'Plano de Saúde', 'Stock Options'],
    status: 'open',
    hiringManager: 'Ana Costa',
    recruiters: ['Pedro Oliveira'],
    candidatesCount: 32,
    publishedChannels: ['LinkedIn', 'Catho'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
  {
    id: 'job-3',
    title: 'Designer UX/UI',
    department: 'Design',
    location: 'São Paulo, SP',
    type: 'full-time',
    remote: 'hybrid',
    salary: { min: 10000, max: 16000, currency: 'BRL' },
    description: 'Designer para criar experiências...',
    requirements: ['Figma', 'Design System', 'Prototipagem'],
    benefits: ['VR/VA', 'Plano de Saúde'],
    status: 'paused',
    hiringManager: 'Carlos Lima',
    recruiters: ['Maria Santos'],
    candidatesCount: 28,
    publishedChannels: ['LinkedIn'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
  },
];

export function useJobs(filters?: JobFilters) {
  const queryClient = useQueryClient();

  // Fetch jobs
  const {
    data: jobs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let filtered = [...mockJobs];
      
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
          (j) => j.title.toLowerCase().includes(search) || j.department.toLowerCase().includes(search)
        );
      }
      if (filters?.status) {
        filtered = filtered.filter((j) => j.status === filters.status);
      }
      if (filters?.department) {
        filtered = filtered.filter((j) => j.department === filters.department);
      }
      if (filters?.location) {
        filtered = filtered.filter((j) => j.location.includes(filters.location!));
      }
      if (filters?.type) {
        filtered = filtered.filter((j) => j.type === filters.type);
      }
      
      return filtered;
    },
  });

  // Get single job
  const useJob = (id: string) => {
    return useQuery({
      queryKey: ['jobs', id],
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockJobs.find((j) => j.id === id) || null;
      },
    });
  };

  // Create job
  const createMutation = useMutation({
    mutationFn: async (data: CreateJobData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newJob: Job = {
        id: `job-${Date.now()}`,
        ...data,
        status: 'draft',
        candidatesCount: 0,
        publishedChannels: [],
        benefits: data.benefits || [],
        recruiters: data.recruiters || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockJobs.unshift(newJob);
      return newJob;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  // Update job
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Job> }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const job = mockJobs.find((j) => j.id === id);
      if (job) {
        Object.assign(job, updates, { updatedAt: new Date() });
      }
      return job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  // Publish job to channels
  const publishMutation = useMutation({
    mutationFn: async ({ id, channels }: { id: string; channels: string[] }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const job = mockJobs.find((j) => j.id === id);
      if (job) {
        job.publishedChannels = [...new Set([...job.publishedChannels, ...channels])];
        job.status = 'open';
        job.updatedAt = new Date();
      }
      return job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  // Close job
  const closeMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const job = mockJobs.find((j) => j.id === id);
      if (job) {
        job.status = 'closed';
        job.closedAt = new Date();
        job.updatedAt = new Date();
      }
      return job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  // Stats
  const stats = {
    total: jobs.length,
    open: jobs.filter((j) => j.status === 'open').length,
    paused: jobs.filter((j) => j.status === 'paused').length,
    closed: jobs.filter((j) => j.status === 'closed').length,
    totalCandidates: jobs.reduce((sum, j) => sum + j.candidatesCount, 0),
  };

  return {
    jobs,
    isLoading,
    error,
    refetch,
    useJob,
    stats,
    createJob: createMutation.mutateAsync,
    updateJob: updateMutation.mutateAsync,
    publishJob: publishMutation.mutateAsync,
    closeJob: closeMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isPublishing: publishMutation.isPending,
  };
}
