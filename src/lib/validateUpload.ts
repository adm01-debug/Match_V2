/**
 * File upload validation utilities
 */

export interface UploadValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];

export const validateUpload = (
  file: File,
  options: UploadValidationOptions = {}
): ValidationResult => {
  const {
    maxSize = MAX_FILE_SIZE,
    allowedTypes = ALLOWED_FILE_TYPES,
    allowedExtensions = ALLOWED_FILE_EXTENSIONS,
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido: ${file.type}`,
    };
  }

  // Check extension
  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Extensão não permitida: ${ext}`,
    };
  }

  return { valid: true };
};
