export * from './config';
export * from './pt-BR';

export const t = (key: string, params?: Record<string, string>): string => {
  // Simple translation function
  let text = key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{{${k}}}`, v);
    });
  }
  return text;
};
