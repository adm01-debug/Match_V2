/**
 * @fileoverview Type definitions tests for tests
 * @module types/tests
 */

import{describe,it,expect}from'vitest';describe('types',()=>{it('x',async()=>{expect(await import('./tests')).toBeDefined();});});
