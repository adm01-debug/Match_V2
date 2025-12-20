import { describe, it, expect } from 'vitest';
import { vagaSchema, candidatoSchema, avaliacaoSchema } from '@/lib/schemas';

describe('Schemas de Validação', () => {
  describe('vagaSchema', () => {
    it('deve validar uma vaga válida', () => {
      const vagaValida = {
        titulo: 'Desenvolvedor Frontend',
        departamento: 'Tecnologia',
        nivel: 'pleno',
        tipo_contrato: 'clt',
        modalidade: 'hibrido',
        descricao: 'Descrição detalhada da vaga para desenvolvedor',
        requisitos: 'Requisitos mínimos: React, TypeScript, CSS',
      };

      const result = vagaSchema.safeParse(vagaValida);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar vaga sem título', () => {
      const vagaInvalida = {
        departamento: 'Tecnologia',
        nivel: 'pleno',
        tipo_contrato: 'clt',
        modalidade: 'hibrido',
        descricao: 'Descrição detalhada da vaga',
        requisitos: 'Requisitos mínimos',
      };

      const result = vagaSchema.safeParse(vagaInvalida);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar título muito curto', () => {
      const vagaInvalida = {
        titulo: 'AB',
        departamento: 'Tecnologia',
        nivel: 'pleno',
        tipo_contrato: 'clt',
        modalidade: 'hibrido',
        descricao: 'Descrição da vaga',
        requisitos: 'Requisitos mínimos',
      };

      const result = vagaSchema.safeParse(vagaInvalida);
      expect(result.success).toBe(false);
    });
  });

  describe('candidatoSchema', () => {
    it('deve validar um candidato válido', () => {
      const candidatoValido = {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999',
      };

      const result = candidatoSchema.safeParse(candidatoValido);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar email inválido', () => {
      const candidatoInvalido = {
        nome: 'João Silva',
        email: 'email-invalido',
      };

      const result = candidatoSchema.safeParse(candidatoInvalido);
      expect(result.success).toBe(false);
    });
  });

  describe('avaliacaoSchema', () => {
    it('deve validar avaliação com competências', () => {
      const avaliacaoValida = {
        tipo: 'tecnica',
        competencias: [
          { nome: 'React', nota: 8, peso: 3 },
          { nome: 'TypeScript', nota: 7, peso: 2 },
        ],
        nota_geral: 7.5,
        parecer: 'aprovar',
      };

      const result = avaliacaoSchema.safeParse(avaliacaoValida);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar avaliação sem competências', () => {
      const avaliacaoInvalida = {
        tipo: 'tecnica',
        competencias: [],
        nota_geral: 7.5,
        parecer: 'aprovar',
      };

      const result = avaliacaoSchema.safeParse(avaliacaoInvalida);
      expect(result.success).toBe(false);
    });
  });
});
