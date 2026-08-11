import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StatusIcon, StatusBadge } from './StatusIndicators';
import type { FunctionTest, TestResult } from './types';

interface Props {
  fn: FunctionTest;
  result: TestResult;
  isAuthenticated: boolean;
  onRun: () => void;
}

export const FunctionTestCard = ({ fn, result, isAuthenticated, onRun }: Props) => {
  const Icon = fn.icon;
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <StatusIcon status={result.status} />
          <div className={`p-2 rounded-lg ${fn.isProtected ? 'bg-primary/10' : 'bg-muted'}`}>
            <Icon className={`h-5 w-5 ${fn.isProtected ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{fn.label}</h3>
            <p className="text-sm text-muted-foreground">{fn.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={result.status} />
          <Button
            size="sm"
            variant={fn.isProtected && isAuthenticated ? 'default' : 'outline'}
            onClick={onRun}
            disabled={result.status === 'loading' || (fn.isProtected && !isAuthenticated)}
          >
            {fn.isProtected && !isAuthenticated ? 'Login Necessário' : 'Testar'}
          </Button>
        </div>
      </div>
      {result.status !== 'idle' && (
        <>
          <Separator />
          <div className="p-4 bg-muted/30">
            <p className="text-sm font-medium">Resultado:</p>
            <p className="text-sm text-muted-foreground">{result.message}</p>
            {result.data !== undefined && result.data !== null && (
              <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto max-h-32">
                {typeof result.data === 'object'
                  ? JSON.stringify(result.data, null, 2)
                  : String(result.data)}
              </pre>
            )}
          </div>
        </>
      )}
    </Card>
  );
};
