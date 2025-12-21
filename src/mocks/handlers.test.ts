import{describe,it,expect}from'vitest';describe('handlers',()=>{it('x',async()=>{expect(await import('./handlers')).toBeDefined();});});
