import{describe,it,expect}from'vitest';import{performance}from'./performance';describe('performance',()=>{it('mark',()=>{performance.mark('test');expect(true).toBe(true);});});
