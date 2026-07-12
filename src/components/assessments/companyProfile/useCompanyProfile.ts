import { useState, useMemo } from 'react';
import { BEHAVIORAL_PILLARS, type CompanyProfile } from '@/config/behavioralPillars';
import { DEFAULT_CULTURA_DIMENSOES } from './types';

export function useCompanyProfile(initialProfile?: Partial<CompanyProfile>, vagaId?: string) {
  const [nome, setNome] = useState(initialProfile?.nome || '');
  const [descricao, setDescricao] = useState(initialProfile?.descricao || '');
  const [pilaresValorizados, setPilaresValorizados] = useState<Record<string, number>>(
    initialProfile?.pilaresValorizados ||
      Object.fromEntries(BEHAVIORAL_PILLARS.map((p) => [p.id, 5])),
  );
  const [culturaDimensoes, setCulturaDimensoes] = useState<Record<string, number>>({
    ...DEFAULT_CULTURA_DIMENSOES,
  });
  const [dealbreakers, setDealbreakers] = useState<string[]>(initialProfile?.dealbreakers || []);
  const [customDealbreaker, setCustomDealbreaker] = useState('');

  const handlePilarChange = (pilarId: string, value: number[]) => {
    setPilaresValorizados((prev) => ({ ...prev, [pilarId]: value[0] ?? 5 }));
  };

  const handleCulturaChange = (dimensao: string, value: number[]) => {
    setCulturaDimensoes((prev) => ({ ...prev, [dimensao]: value[0] ?? 50 }));
  };

  const toggleDealbreaker = (item: string) => {
    setDealbreakers((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item],
    );
  };

  const addCustomDealbreaker = () => {
    const trimmed = customDealbreaker.trim();
    if (trimmed && !dealbreakers.includes(trimmed)) {
      setDealbreakers((prev) => [...prev, trimmed]);
      setCustomDealbreaker('');
    }
  };

  const resetToDefaults = () => {
    setPilaresValorizados(Object.fromEntries(BEHAVIORAL_PILLARS.map((p) => [p.id, 5])));
    setCulturaDimensoes({ ...DEFAULT_CULTURA_DIMENSOES });
    setDealbreakers([]);
  };

  const buildProfile = (): CompanyProfile => {
    const velocidade = culturaDimensoes['velocidade'] ?? 50;
    const hierarquia = culturaDimensoes['hierarquia'] ?? 50;
    return {
      id: vagaId || crypto.randomUUID(),
      nome,
      descricao,
      valores: [],
      cultura: 'hibrida',
      ritmo: velocidade > 60 ? 'intenso' : velocidade < 40 ? 'tranquilo' : 'moderado',
      hierarquia: hierarquia > 60 ? 'vertical' : hierarquia < 40 ? 'horizontal' : 'matricial',
      pilaresValorizados,
      dealbreakers,
    };
  };

  const topPilares = useMemo(
    () =>
      Object.entries(pilaresValorizados)
        .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
        .slice(0, 3)
        .map(([id]) => BEHAVIORAL_PILLARS.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => p !== undefined),
    [pilaresValorizados],
  );

  const lowPilares = useMemo(
    () =>
      Object.entries(pilaresValorizados)
        .sort(([, a], [, b]) => (a ?? 0) - (b ?? 0))
        .slice(0, 2)
        .filter(([, v]) => (v ?? 0) <= 4)
        .map(([id]) => BEHAVIORAL_PILLARS.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => p !== undefined),
    [pilaresValorizados],
  );

  return {
    nome, setNome,
    descricao, setDescricao,
    pilaresValorizados, handlePilarChange,
    culturaDimensoes, handleCulturaChange,
    dealbreakers, toggleDealbreaker,
    customDealbreaker, setCustomDealbreaker, addCustomDealbreaker,
    resetToDefaults,
    buildProfile,
    topPilares, lowPilares,
  };
}
