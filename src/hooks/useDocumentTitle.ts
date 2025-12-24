import { useEffect } from 'react';

/**
 * Hook para definir o título da página dinamicamente
 * @param title - Título da página
 * @param suffix - Sufixo opcional (default: " | Match ATS")
 */
/**
 * Hook para definir título da página
 * @description Hook para definir título da página
 * @returns {Object} Query result with data, isLoading, error, and mutations
 * @example
 * const { data, isLoading } = useDocumentTitle();
 */
export const useDocumentTitle = (title: string, suffix = ' | Match ATS') => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title}${suffix}`;

    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
};

export default useDocumentTitle;
