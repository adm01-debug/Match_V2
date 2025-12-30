import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  date: Date;
  duration: number; // minutes
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'cultural';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  interviewers: Interviewer[];
  location?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: InterviewFeedback;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interviewer {
  id: string;
  name: string;
  email: string;
  role: string;
  confirmed: boolean;
}

export interface InterviewFeedback {
  rating: number; // 1-5
  recommendation: 'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire';
  strengths: string[];
  weaknesses: string[];
  notes: string;
  submittedAt: Date;
  submittedBy: string;
}

interface InterviewFilters {
  candidateId?: string;
  jobId?: string;
  status?: Interview['status'];
  type?: Interview['type'];
  dateFrom?: Date;
  dateTo?: Date;
  interviewerId?: string;
}

interface ScheduleInterviewData {
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  date: Date;
  duration: number;
  type: Interview['type'];
  interviewers: Omit<Interviewer, 'confirmed'>[];
  location?: string;
  meetingLink?: string;
}

// Mock data
const mockInterviews: Interview[] = [
  {
    id: 'int-1',
    candidateId: 'cand-1',
    candidateName: 'João Silva',
    jobId: 'job-1',
    jobTitle: 'Desenvolvedor Full Stack Senior',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    duration: 60,
    type: 'video',
    status: 'confirmed',
    interviewers: [
      { id: 'user-1', name: 'Maria Santos', email: 'maria@empresa.com', role: 'Tech Lead', confirmed: true },
      { id: 'user-2', name: 'Pedro Costa', email: 'pedro@empresa.com', role: 'Senior Dev', confirmed: true },
    ],
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'int-2',
    candidateId: 'cand-2',
    candidateName: 'Ana Oliveira',
    jobId: 'job-2',
    jobTitle: 'Product Manager',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    duration: 45,
    type: 'phone',
    status: 'scheduled',
    interviewers: [
      { id: 'user-3', name: 'Carlos Lima', email: 'carlos@empresa.com', role: 'HR', confirmed: false },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function useInterviews(filters?: InterviewFilters) {
  const queryClient = useQueryClient();

  // Fetch interviews
  const {
    data: interviews = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['interviews', filters],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let filtered = [...mockInterviews];
      
      if (filters?.candidateId) {
        filtered = filtered.filter((i) => i.candidateId === filters.candidateId);
      }
      if (filters?.jobId) {
        filtered = filtered.filter((i) => i.jobId === filters.jobId);
      }
      if (filters?.status) {
        filtered = filtered.filter((i) => i.status === filters.status);
      }
      if (filters?.type) {
        filtered = filtered.filter((i) => i.type === filters.type);
      }
      if (filters?.dateFrom) {
        filtered = filtered.filter((i) => new Date(i.date) >= filters.dateFrom!);
      }
      if (filters?.dateTo) {
        filtered = filtered.filter((i) => new Date(i.date) <= filters.dateTo!);
      }
      
      return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
  });

  // Schedule interview
  const scheduleMutation = useMutation({
    mutationFn: async (data: ScheduleInterviewData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newInterview: Interview = {
        id: `int-${Date.now()}`,
        ...data,
        status: 'scheduled',
        interviewers: data.interviewers.map((i) => ({ ...i, confirmed: false })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockInterviews.push(newInterview);
      return newInterview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });

  // Update status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Interview['status'] }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const interview = mockInterviews.find((i) => i.id === id);
      if (interview) {
        interview.status = status;
        interview.updatedAt = new Date();
      }
      return interview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });

  // Submit feedback
  const submitFeedbackMutation = useMutation({
    mutationFn: async ({ id, feedback }: { id: string; feedback: Omit<InterviewFeedback, 'submittedAt'> }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const interview = mockInterviews.find((i) => i.id === id);
      if (interview) {
        interview.feedback = {
          ...feedback,
          submittedAt: new Date(),
        };
        interview.status = 'completed';
        interview.updatedAt = new Date();
      }
      return interview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });

  // Reschedule
  const rescheduleMutation = useMutation({
    mutationFn: async ({ id, newDate, newDuration }: { id: string; newDate: Date; newDuration?: number }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const interview = mockInterviews.find((i) => i.id === id);
      if (interview) {
        interview.date = newDate;
        if (newDuration) interview.duration = newDuration;
        interview.status = 'scheduled';
        interview.interviewers = interview.interviewers.map((i) => ({ ...i, confirmed: false }));
        interview.updatedAt = new Date();
      }
      return interview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });

  // Stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const stats = {
    total: interviews.length,
    today: interviews.filter((i) => {
      const d = new Date(i.date);
      return d >= today && d < tomorrow;
    }).length,
    thisWeek: interviews.filter((i) => {
      const d = new Date(i.date);
      return d >= today && d < weekEnd;
    }).length,
    pending: interviews.filter((i) => i.status === 'scheduled').length,
    completed: interviews.filter((i) => i.status === 'completed').length,
  };

  return {
    interviews,
    isLoading,
    error,
    refetch,
    stats,
    scheduleInterview: scheduleMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    submitFeedback: submitFeedbackMutation.mutateAsync,
    reschedule: rescheduleMutation.mutateAsync,
    isScheduling: scheduleMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
  };
}
