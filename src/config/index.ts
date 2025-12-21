export * from './pipelineConfig';
export * from './testsConfig';

export const APP_CONFIG = {
  name: 'Match ATS',
  version: '1.0.0',
  defaultPageSize: 10,
  maxFileSize: 5 * 1024 * 1024,
  supportedFileTypes: ['pdf', 'doc', 'docx'],
  dateFormat: 'dd/MM/yyyy',
  timeFormat: 'HH:mm',
};
