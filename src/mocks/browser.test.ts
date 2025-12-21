import{describe,it,expect}from'vitest';describe('browser',()=>{it('x',async()=>{expect(await import('./browser')).toBeDefined();});});
