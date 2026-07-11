import type { Entrevistador } from './types';

export const mockEntrevistadores: Entrevistador[] = [
  {
    id: '1',
    nome: 'Ana Silva',
    cargo: 'Tech Lead',
    disponibilidade: [
      { dia: 1, inicio: '09:00', fim: '12:00' },
      { dia: 1, inicio: '14:00', fim: '17:00' },
      { dia: 3, inicio: '10:00', fim: '16:00' },
      { dia: 5, inicio: '09:00', fim: '12:00' },
    ],
  },
  {
    id: '2',
    nome: 'Carlos Santos',
    cargo: 'Engineering Manager',
    disponibilidade: [
      { dia: 1, inicio: '10:00', fim: '12:00' },
      { dia: 2, inicio: '14:00', fim: '18:00' },
      { dia: 4, inicio: '09:00', fim: '11:00' },
    ],
  },
  {
    id: '3',
    nome: 'Marina Costa',
    cargo: 'HR Business Partner',
    disponibilidade: [
      { dia: 1, inicio: '09:00', fim: '18:00' },
      { dia: 2, inicio: '09:00', fim: '18:00' },
      { dia: 3, inicio: '09:00', fim: '18:00' },
      { dia: 4, inicio: '09:00', fim: '18:00' },
      { dia: 5, inicio: '09:00', fim: '18:00' },
    ],
  },
];
