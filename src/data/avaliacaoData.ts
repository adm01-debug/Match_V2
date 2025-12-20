export const notasDescricao: Record<
  number,
  { label: string; descricao: string }
> = {
  1: { label: 'Insuficiente', descricao: 'Abaixo do esperado; precisa de desenvolvimento significativo.' },
  2: { label: 'Regular', descricao: 'Atende parcialmente; apresenta lacunas importantes.' },
  3: { label: 'Bom', descricao: 'Atende ao esperado para o nível; pequenas melhorias possíveis.' },
  4: { label: 'Muito bom', descricao: 'Acima da média; demonstra domínio e consistência.' },
  5: { label: 'Excelente', descricao: 'Referência; demonstra excelência e maturidade.' },
};
