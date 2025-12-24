import { useEffect } from 'react';

/**
 * Hook para definir o título da página dinamicamente
 * @param title - Título da página
 * @param suffix - Sufixo opcional (default: " | Match ATS")
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
