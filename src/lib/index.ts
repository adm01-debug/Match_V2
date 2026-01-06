/**
 * @fileoverview Exportações centralizadas das libs
 * @module lib
 */

export * from './utils';
export * from './constants';
export { formatCurrency, formatPercent, formatNumber, formatPhone, formatCPF } from './formatters';
export * from './validators';
export * from './schemas';
export * from './queryConfig';
export { apiClient, handleApiError, createApiUrl } from './apiClient';
export { handleError } from './errorHandler';
export { formatDate, formatDateTime, formatRelative, isToday } from './dateUtils';
export * from './storageUtils';
export { a11y, announceToScreenReader, trapFocus, getAriaLabel } from './accessibilityUtils';
