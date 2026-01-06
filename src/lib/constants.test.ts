import { describe, it, expect } from 'vitest';
import { 
  APP_NAME,
  API_ENDPOINTS,
  STATUS_COLORS,
  PAGINATION,
  DATE_FORMATS,
  VALIDATION
} from './constants';

describe('constants', () => {
  describe('APP_NAME', () => {
    it('is defined', () => {
      expect(APP_NAME).toBeDefined();
    });

    it('is a non-empty string', () => {
      expect(typeof APP_NAME).toBe('string');
      expect(APP_NAME.length).toBeGreaterThan(0);
    });
  });

  describe('API_ENDPOINTS', () => {
    it('contains required endpoints', () => {
      expect(API_ENDPOINTS).toBeDefined();
    });

    it('endpoints are strings', () => {
      Object.values(API_ENDPOINTS).forEach(endpoint => {
        expect(typeof endpoint).toBe('string');
      });
    });
  });

  describe('STATUS_COLORS', () => {
    it('is defined', () => {
      expect(STATUS_COLORS).toBeDefined();
    });

    it('contains valid color values', () => {
      Object.values(STATUS_COLORS).forEach(color => {
        expect(typeof color).toBe('string');
      });
    });
  });

  describe('PAGINATION', () => {
    it('has default page size', () => {
      expect(PAGINATION.DEFAULT_PAGE_SIZE).toBeGreaterThan(0);
    });

    it('has max page size', () => {
      expect(PAGINATION.MAX_PAGE_SIZE).toBeGreaterThan(PAGINATION.DEFAULT_PAGE_SIZE);
    });
  });

  describe('DATE_FORMATS', () => {
    it('contains date format strings', () => {
      expect(DATE_FORMATS).toBeDefined();
    });
  });

  describe('VALIDATION', () => {
    it('contains validation rules', () => {
      expect(VALIDATION).toBeDefined();
    });
  });
});
