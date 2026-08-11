/**
 * @fileoverview Centralized exports for all services
 * @module services
 */

export { logger, createContextLogger, authLogger, apiLogger, supabaseLogger, realtimeLogger, edgeFunctionLogger } from './logger';
export { 
  getClientIP, 
  getAllowedIPsFromDB, 
  isIPAllowed,
  logBlockedAttempt,
  addIPToWhitelist,
  removeIPFromWhitelist,
  clearIPCache
} from './ipService';
export { checkPasswordBreach, type BreachCheckResult } from './passwordBreachService';
export { 
  createPasswordResetRequest, 
  getPasswordResetRequests, 
  processResetRequest, 
  validateResetToken, 
  completePasswordReset,
  type PasswordResetRequest
} from './passwordResetService';
export { evolutionApi, evolutionInstances, evolutionMessages, evolutionChats } from './evolutionApiService';
export { whatsappService } from './whatsappService';
