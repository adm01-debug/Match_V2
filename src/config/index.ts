/**
 * @fileoverview Centralized config exports
 * @module config
 */

export * from './pipelineConfig';
export * from './testsConfig';
export * from './ipWhitelist';
export * from './behavioralPillars';

import { APP_NAME, APP_VERSION, DATE_FORMATS, PAGINATION } from '@/lib/constants';

export const APP_CONFIG = {
  name: APP_NAME,
  version: APP_VERSION,
  defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  maxFileSize: 5 * 1024 * 1024,
  supportedFileTypes: ['pdf', 'doc', 'docx'],
  dateFormat: DATE_FORMATS.SHORT,
  timeFormat: 'HH:mm',
};
