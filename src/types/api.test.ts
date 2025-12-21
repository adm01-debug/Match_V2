import{describe,it,expect}from'vitest';describe('api',()=>{it('x',async()=>{expect(await import('./api')).toBeDefined();});});
