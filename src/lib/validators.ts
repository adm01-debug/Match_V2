/**
 * @fileoverview Validation utilities and schemas
 * @module lib/validators
 */

// Validadores de formulário

export const validators = {
  required: (value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'Campo obrigatório';
    }
    return null;
  },

  email: (value: string) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email inválido';
    }
    return null;
  },

  minLength: (min: number) => (value: string) => {
    if (!value) return null;
    if (value.length < min) {
      return `Mínimo de ${min} caracteres`;
    }
    return null;
  },

  maxLength: (max: number) => (value: string) => {
    if (!value) return null;
    if (value.length > max) {
      return `Máximo de ${max} caracteres`;
    }
    return null;
  },

  min: (min: number) => (value: number) => {
    if (value === null || value === undefined) return null;
    if (value < min) {
      return `Valor mínimo: ${min}`;
    }
    return null;
  },

  max: (max: number) => (value: number) => {
    if (value === null || value === undefined) return null;
    if (value > max) {
      return `Valor máximo: ${max}`;
    }
    return null;
  },

  phone: (value: string) => {
    if (!value) return null;
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 11) {
      return 'Telefone inválido';
    }
    return null;
  },

  cpf: (value: string) => {
    if (!value) return null;
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 11) {
      return 'CPF inválido';
    }
    // Validação de dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (parseInt(cleaned[9]) !== digit) return 'CPF inválido';
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned[i]) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (parseInt(cleaned[10]) !== digit) return 'CPF inválido';
    
    return null;
  },

  url: (value: string) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'URL inválida';
    }
  },

  date: (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return null;
  },

  futureDate: (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    if (date <= new Date()) {
      return 'Data deve ser futura';
    }
    return null;
  },

  salary: (value: number) => {
    if (value === null || value === undefined) return null;
    if (value < 0) {
      return 'Salário não pode ser negativo';
    }
    if (value > 1000000) {
      return 'Valor muito alto';
    }
    return null;
  },
};

// Função para validar múltiplos campos
export function validate(
  values: Record<string, any>,
  rules: Record<string, Array<(value: any) => string | null>>
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      const error = rule(values[field]);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }
  
  return errors;
}

// Validações específicas de vaga
export const vagaValidations = {
  titulo: [validators.required, validators.minLength(5), validators.maxLength(100)],
  departamento: [validators.required],
  descricao: [validators.required, validators.minLength(50)],
  requisitos: [validators.required],
  salario_min: [validators.salary],
  salario_max: [validators.salary],
};

// Validações específicas de candidato
export const candidatoValidations = {
  nome: [validators.required, validators.minLength(3)],
  email: [validators.required, validators.email],
  telefone: [validators.phone],
};

export default validators;
