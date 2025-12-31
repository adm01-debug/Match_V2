/**
 * @fileoverview Form type definitions and schemas
 * @module types
 */

export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'date' 
  | 'select' 
  | 'textarea' 
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'tel'
  | 'url';

export interface FormFieldOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

export interface FormFieldValidation {
  readonly min?: number;
  readonly max?: number;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;
  readonly message?: string;
  readonly custom?: (value: unknown) => string | null;
}

export interface FormField {
  readonly name: string;
  readonly label: string;
  readonly type: FormFieldType;
  readonly required?: boolean;
  readonly placeholder?: string;
  readonly defaultValue?: unknown;
  readonly options?: FormFieldOption[];
  readonly validation?: FormFieldValidation;
  readonly helpText?: string;
  readonly disabled?: boolean;
  readonly autoFocus?: boolean;
  readonly autoComplete?: string;
}

export interface FormState {
  readonly isSubmitting: boolean;
  readonly isValid: boolean;
  readonly isDirty: boolean;
  readonly isTouched: boolean;
  readonly errors: Record<string, string>;
  readonly values: Record<string, unknown>;
}

export interface FormConfig {
  readonly fields: FormField[];
  readonly submitLabel?: string;
  readonly cancelLabel?: string;
  readonly resetOnSubmit?: boolean;
  readonly validateOnChange?: boolean;
  readonly validateOnBlur?: boolean;
}

export interface FormSubmitResult<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly errors?: Record<string, string>;
  readonly message?: string;
}
