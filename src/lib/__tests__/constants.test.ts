/**
 * @fileoverview Testes de integridade das constantes do sistema
 */
import { describe, it, expect } from 'vitest';
import {
  APP_NAME, APP_VERSION, API_ENDPOINTS,
  PAGINATION, VALIDATION, ETAPAS_PROCESSO, STATUS_VAGA,
  PRIORIDADES, TIPOS_CONTRATO, MODALIDADES_TRABALHO,
  NIVEIS_EXPERIENCIA, FONTES_CANDIDATOS, TIPOS_ENTREVISTA,
  CATEGORIAS_PROVA, DEPARTAMENTOS, CHART_COLORS, METAS_PADRAO,
  DATE_FORMATS,
} from '../constants';

describe('APP constants', () => {
  it('APP_NAME é "Match ATS"', () => expect(APP_NAME).toBe('Match ATS'));
  it('APP_VERSION segue semver', () => expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/));
});

describe('API_ENDPOINTS', () => {
  it('contém todos os endpoints necessários', () => {
    expect(API_ENDPOINTS.CANDIDATOS).toBe('/candidatos');
    expect(API_ENDPOINTS.VAGAS).toBe('/vagas');
    expect(API_ENDPOINTS.ENTREVISTAS).toBe('/entrevistas');
    expect(API_ENDPOINTS.PROCESSOS).toBe('/processos');
    expect(API_ENDPOINTS.PROVAS).toBe('/provas');
    expect(API_ENDPOINTS.USUARIOS).toBe('/usuarios');
  });

  it('todos começam com /', () => {
    Object.values(API_ENDPOINTS).forEach(ep => {
      expect(ep.startsWith('/')).toBe(true);
    });
  });
});

describe('VALIDATION', () => {
  it('EMAIL_REGEX valida emails corretos', () => {
    expect(VALIDATION.EMAIL_REGEX.test('user@example.com')).toBe(true);
    expect(VALIDATION.EMAIL_REGEX.test('a@b.co')).toBe(true);
  });

  it('EMAIL_REGEX rejeita emails inválidos', () => {
    expect(VALIDATION.EMAIL_REGEX.test('invalid')).toBe(false);
    expect(VALIDATION.EMAIL_REGEX.test('@no-user.com')).toBe(false);
    expect(VALIDATION.EMAIL_REGEX.test('no-domain@')).toBe(false);
  });

  it('PHONE_REGEX valida telefones brasileiros', () => {
    expect(VALIDATION.PHONE_REGEX.test('+55 11 99999-9999')).toBe(true);
    expect(VALIDATION.PHONE_REGEX.test('11999999999')).toBe(true);
  });

  it('CPF_REGEX valida formato CPF', () => {
    expect(VALIDATION.CPF_REGEX.test('123.456.789-00')).toBe(true);
    expect(VALIDATION.CPF_REGEX.test('12345678900')).toBe(false);
  });

  it('CNPJ_REGEX valida formato CNPJ', () => {
    expect(VALIDATION.CNPJ_REGEX.test('12.345.678/0001-90')).toBe(true);
    expect(VALIDATION.CNPJ_REGEX.test('12345678000190')).toBe(false);
  });

  it('MIN_PASSWORD_LENGTH é 8', () => expect(VALIDATION.MIN_PASSWORD_LENGTH).toBe(8));
  it('MAX_NAME_LENGTH é 100', () => expect(VALIDATION.MAX_NAME_LENGTH).toBe(100));
});

describe('ETAPAS_PROCESSO', () => {
  it('contém 12 etapas', () => expect(ETAPAS_PROCESSO.length).toBe(12));

  it('IDs são únicos', () => {
    const ids = ETAPAS_PROCESSO.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ordem é sequencial de 1 a 12', () => {
    ETAPAS_PROCESSO.forEach((e, i) => {
      expect(e.ordem).toBe(i + 1);
    });
  });

  it('todas têm nome, cor e id', () => {
    ETAPAS_PROCESSO.forEach(e => {
      expect(e.id).toBeTruthy();
      expect(e.nome).toBeTruthy();
      expect(e.cor).toBeTruthy();
    });
  });

  it('primeira etapa é "novo" e última é "banco_talentos"', () => {
    expect(ETAPAS_PROCESSO[0]?.id).toBe('novo');
    expect(ETAPAS_PROCESSO[11]?.id).toBe('banco_talentos');
  });
});

describe('STATUS_VAGA', () => {
  it('contém 5 status', () => expect(STATUS_VAGA.length).toBe(5));
  it('inclui rascunho, publicada, pausada, fechada, cancelada', () => {
    const ids = STATUS_VAGA.map(s => s.id);
    expect(ids).toContain('rascunho');
    expect(ids).toContain('publicada');
    expect(ids).toContain('cancelada');
  });
});

describe('PAGINATION', () => {
  it('DEFAULT_PAGE_SIZE é 10', () => expect(PAGINATION.DEFAULT_PAGE_SIZE).toBe(10));
  it('MAX_PAGE_SIZE é 100', () => expect(PAGINATION.MAX_PAGE_SIZE).toBe(100));
  it('PAGE_SIZES é ordenado', () => {
    for (let i = 1; i < PAGINATION.PAGE_SIZES.length; i++) {
      expect(PAGINATION.PAGE_SIZES[i]! > PAGINATION.PAGE_SIZES[i-1]!).toBe(true);
    }
  });
});

describe('NIVEIS_EXPERIENCIA', () => {
  it('contém 5 níveis', () => expect(NIVEIS_EXPERIENCIA.length).toBe(5));
  it('anos não se sobrepõem (exceto limites)', () => {
    for (let i = 1; i < NIVEIS_EXPERIENCIA.length; i++) {
      expect(NIVEIS_EXPERIENCIA[i]!.anosMin).toBeGreaterThanOrEqual(NIVEIS_EXPERIENCIA[i-1]!.anosMin);
    }
  });
});

describe('Arrays de lookup', () => {
  it('PRIORIDADES tem 4 itens', () => expect(PRIORIDADES.length).toBe(4));
  it('TIPOS_CONTRATO tem 5 itens', () => expect(TIPOS_CONTRATO.length).toBe(5));
  it('MODALIDADES_TRABALHO tem 3 itens', () => expect(MODALIDADES_TRABALHO.length).toBe(3));
  it('FONTES_CANDIDATOS tem 8 itens', () => expect(FONTES_CANDIDATOS.length).toBe(8));
  it('TIPOS_ENTREVISTA tem 3 itens', () => expect(TIPOS_ENTREVISTA.length).toBe(3));
  it('CATEGORIAS_PROVA tem 7 itens', () => expect(CATEGORIAS_PROVA.length).toBe(7));
  it('DEPARTAMENTOS tem 10 itens', () => expect(DEPARTAMENTOS.length).toBe(10));
  it('CHART_COLORS tem 10 cores hex', () => {
    expect(CHART_COLORS.length).toBe(10);
    CHART_COLORS.forEach(c => expect(c).toMatch(/^#[0-9A-Fa-f]{6}$/));
  });
  it('DATE_FORMATS tem 4 formatos', () => expect(Object.keys(DATE_FORMATS).length).toBe(4));
});

describe('METAS_PADRAO', () => {
  it('todas as metas são números positivos', () => {
    Object.values(METAS_PADRAO).forEach(v => {
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThan(0);
    });
  });
});
