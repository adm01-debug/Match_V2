/**
 * @note Consider implementing rate limiting for production
 * @see https://www.npmjs.com/package/p-throttle
 */

/**
 * Logger Service - MATCH ATS
 * 
 * Substitui console.log/error/warn em produção.
 * Em desenvolvimento: log completo
 * Em produção: silencioso ou envia para serviço de monitoramento
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  context?: string;
}

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  sendToServer: boolean;
  serverEndpoint?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development';
    
    this.config = {
      enabled: true,
      minLevel: isDev ? 'debug' : 'warn',
      sendToServer: !isDev,
      serverEndpoint: '/api/logs',
    };

    // Flush logs periodicamente em produção
    if (this.config.sendToServer) {
      this.flushInterval = setInterval(() => this.flush(), 30000);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  private formatMessage(level: LogLevel, message: string, data?: any, context?: string): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context,
    };
  }

  private log(level: LogLevel, message: string, data?: any, context?: string): void {
    if (!this.shouldLog(level)) return;

    const entry = this.formatMessage(level, message, data, context);

    // Em desenvolvimento, usar console nativo
    if (import.meta.env.DEV) {
      const consoleMethod = level === 'debug' ? 'log' : level;
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]${context ? ` [${context}]` : ''}`;
      
      if (data !== undefined) {
        console[consoleMethod](prefix, message, data);
      } else {
        console[consoleMethod](prefix, message);
      }
    }

    // Em produção, adicionar ao buffer
    if (this.config.sendToServer) {
      this.buffer.push(entry);
      
      // Flush imediato para erros
      if (level === 'error') {
        this.flush();
      }
    }
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const logsToSend = [...this.buffer];
    this.buffer = [];

    try {
      if (this.config.serverEndpoint) {
        await fetch(this.config.serverEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logs: logsToSend }),
        });
      }
    } catch {
      // Silenciar erros de envio para não criar loops
    }
  }

  // Métodos públicos
  debug(message: string, data?: any, context?: string): void {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: any, context?: string): void {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: any, context?: string): void {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: any, context?: string): void {
    this.log('error', message, data, context);
  }

  // Configuração em runtime
  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Para testes
  disable(): void {
    this.config.enabled = false;
  }

  enable(): void {
    this.config.enabled = true;
  }

  // Cleanup
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }
}

// Instância singleton
export const logger = new Logger();

// Funções de conveniência para diferentes contextos
export const createContextLogger = (context: string) => ({
  debug: (message: string, data?: any) => logger.debug(message, data, context),
  info: (message: string, data?: any) => logger.info(message, data, context),
  warn: (message: string, data?: any) => logger.warn(message, data, context),
  error: (message: string, data?: any) => logger.error(message, data, context),
});

// Loggers pré-configurados para diferentes módulos
export const authLogger = createContextLogger('Auth');
export const apiLogger = createContextLogger('API');
export const supabaseLogger = createContextLogger('Supabase');
export const realtimeLogger = createContextLogger('Realtime');
export const edgeFunctionLogger = createContextLogger('EdgeFunction');

// Export default
export default logger;
