export interface JobBoard {
  id: string;
  name: string;
  logo: string;
  color: string;
  isConnected: boolean;
  isPremium: boolean;
  stats?: {
    views: number;
    clicks: number;
    applications: number;
  };
}

export interface PublishResult {
  success: boolean;
  externalId?: string;
  url?: string;
  error?: string;
}

export const JOB_BOARDS: JobBoard[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn Jobs',
    logo: '🔗',
    color: 'from-blue-600 to-blue-700',
    isConnected: true,
    isPremium: true,
    stats: { views: 12500, clicks: 450, applications: 89 },
  },
  {
    id: 'indeed',
    name: 'Indeed',
    logo: '📋',
    color: 'from-indigo-500 to-purple-600',
    isConnected: true,
    isPremium: false,
    stats: { views: 8700, clicks: 320, applications: 67 },
  },
  {
    id: 'catho',
    name: 'Catho',
    logo: '🎯',
    color: 'from-orange-500 to-red-500',
    isConnected: true,
    isPremium: false,
    stats: { views: 5400, clicks: 180, applications: 42 },
  },
  {
    id: 'vagas',
    name: 'Vagas.com.br',
    logo: '💼',
    color: 'from-green-500 to-emerald-600',
    isConnected: true,
    isPremium: false,
    stats: { views: 4200, clicks: 156, applications: 38 },
  },
  {
    id: 'infojobs',
    name: 'InfoJobs',
    logo: '📝',
    color: 'from-cyan-500 to-blue-500',
    isConnected: true,
    isPremium: false,
    stats: { views: 3100, clicks: 98, applications: 24 },
  },
  {
    id: 'glassdoor',
    name: 'Glassdoor',
    logo: '🚪',
    color: 'from-green-600 to-teal-600',
    isConnected: false,
    isPremium: true,
    stats: { views: 0, clicks: 0, applications: 0 },
  },
];
