/**
 * @fileoverview API type definitions for Match ATS
 * @module types
 */

export interface ApiResponse<T> {
  readonly data: T | null;
  readonly error: ApiError | null;
  readonly status?: number;
  readonly timestamp?: string;
}

export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: string;
  readonly field?: string;
  readonly stack?: string;
}

export interface PaginatedResponse<T> {
  readonly data: T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
  readonly totalPages?: number;
}

export interface QueryParams {
  readonly page?: number;
  readonly pageSize?: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
  readonly search?: string;
  readonly filters?: Record<string, unknown>;
}

export interface RequestConfig {
  readonly headers?: Record<string, string>;
  readonly timeout?: number;
  readonly retries?: number;
  readonly signal?: AbortSignal;
}

export interface MutationResult<T> {
  readonly data: T | null;
  readonly error: ApiError | null;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiEndpoint {
  readonly method: HttpMethod;
  readonly path: string;
  readonly params?: QueryParams;
  readonly body?: unknown;
}
