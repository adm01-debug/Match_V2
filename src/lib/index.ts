/**
 * @fileoverview Exportações centralizadas das libs
 * @module lib
 */

export * from './utils';
export * from './constants';
export * from './schemas';
export * from './queryConfig';
export { apiClient, createApiUrl } from './apiClient';
export { handleError, handleApiError } from './errorHandler';
export { formatDate, formatDateTime, formatRelative, isToday } from './dateUtils';
export * from './storageUtils';
export { generateDeviceFingerprint, getDeviceName, type DeviceInfo } from './deviceFingerprint';
