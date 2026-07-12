import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TestResult } from './types';

export const StatusIcon = ({ status }: { status: TestResult['status'] }) => {
  switch (status) {
    case 'loading':
      return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-destructive" />;
    default:
      return <div className="h-5 w-5 rounded-full border-2 border-muted" />;
  }
};

export const StatusBadge = ({ status }: { status: TestResult['status'] }) => {
  switch (status) {
    case 'loading':
      return <Badge variant="secondary">Testando...</Badge>;
    case 'success':
      return <Badge className="bg-success text-success-foreground">Sucesso</Badge>;
    case 'error':
      return <Badge variant="destructive">Erro</Badge>;
    default:
      return <Badge variant="outline">Pendente</Badge>;
  }
};
