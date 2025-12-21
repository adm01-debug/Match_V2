import{describe,it,expect}from'vitest';describe('server',()=>{it('x',async()=>{expect(await import('./server')).toBeDefined();});});
