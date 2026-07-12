export interface TestResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  data?: unknown;
  statusCode?: number;
}

export const defaultResult: TestResult = { status: 'idle', message: 'Não testado' };

export interface FunctionTest {
  name: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  body: Record<string, unknown>;
  isProtected: boolean;
}
