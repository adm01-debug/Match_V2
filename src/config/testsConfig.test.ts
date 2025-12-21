import{describe,it,expect}from'vitest';describe('testsConfig',()=>{it('x',async()=>{expect(await import('./testsConfig')).toBeDefined();});});
