/**
 * @fileoverview API type definitions for Match ATS
 * @module types
 */

export interface ApiResponse<T> {
  readonly  data: T | null;
  readonly  error: ApiError | null;
}

export interface ApiError {
  readonly code: string;
  readonly  message: string;
  readonly  details?: string;
}

export interface PaginatedResponse<T> {
  readonly  data: T[];
  readonly  total: number;
  readonly  page: number;
  readonly  pageSize: number;
  readonly  hasMore: boolean;
}

export interface QueryParams {
  readonly page?: number;
  readonly  pageSize?: number;
  readonly  sortBy?: string;
  readonly  sortOrder?: 'asc' | 'desc';
  readonly  search?: string;
  readonly  filters?: Record<string, unknown>;
}
