import{describe,it,expect}from'vitest';import{formatCurrency}from'./formatters';describe('formatters',()=>{it('formatCurrency',()=>{expect(formatCurrency(100)).toContain('100');});});
