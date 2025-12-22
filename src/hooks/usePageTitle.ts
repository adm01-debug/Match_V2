import { useEffect } from 'react';

const APP_NAME = 'Match ATS';

/**
 * Hook para definir título dinâmico da página
 * @param title - Título da página (será concatenado com o nome do app)
 * @param dependencies - Array de dependências para re-executar o efeito
 */
export function usePageTitle(title: string, dependencies: unknown[] = []) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;

    return () => {
      document.title = previousTitle;
    };
  }, [title, ...dependencies]);
}

/**
 * Títulos padrão para cada rota
 */
export const PAGE_TITLES = {
  dashboard: 'Dashboard',
  vagas: 'Vagas',
  vagaNova: 'Nova Vaga',
  vagaDetalhes: 'Detalhes da Vaga',
  pipeline: 'Pipeline',
  candidatos: 'Candidatos',
  candidatoPerfil: 'Perfil do Candidato',
  testes: 'Testes',
  testesNovo: 'Nova Prova',
  testesEditor: 'Editor de Prova',
  agenda: 'Agenda',
  comunicacao: 'Comunicação',
  relatorios: 'Relatórios',
  indicacoes: 'Indicações',
  admin: 'Administração',
  login: 'Login',
  portal: 'Portal do Candidato',
} as const;

export default usePageTitle;

export type UsePageTitleReturn = ReturnType<typeof usePageTitle>;
