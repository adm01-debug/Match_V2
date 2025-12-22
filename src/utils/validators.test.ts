import{describe,it,expect}from'vitest';import{isValidEmail}from'./validators';describe('validators',()=>{it('email',()=>{expect(isValidEmail('a@b.c')).toBe(true);});});
