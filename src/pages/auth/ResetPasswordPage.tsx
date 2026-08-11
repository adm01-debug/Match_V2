import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Loader2, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { z } from 'zod';

const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128)
    .regex(/[A-Z]/, 'Senha deve ter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve ter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve ter pelo menos um número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

const passwordRequirements = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Uma letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Uma letra minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Um número', test: (p: string) => /[0-9]/.test(p) },
];

export default function ResetPasswordPage() {
  usePageTitle('Redefinir Senha');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Check if user has a valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
      setCheckingSession(false);
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError(null);
    
    const validation = passwordSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    
    const { error: updateError } = await supabase.auth.updateUser({
      password: formData.password,
    });
    
    setIsLoading(false);

    if (updateError) {
      setError('Erro ao redefinir senha. O link pode ter expirado.');
    } else {
      setSuccess(true);
      toast({
        title: 'Senha redefinida!',
        description: 'Sua senha foi alterada com sucesso.',
      });
      setTimeout(() => navigate('/auth/login'), 3000);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-xl bg-primary/10 mb-4">
            <Briefcase className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">People Lovers</h1>
          <p className="text-muted-foreground">Redefinição de Senha</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          {!isValidSession ? (
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-16 w-16 text-warning mx-auto" />
                <h2 className="text-xl font-semibold">Link Inválido ou Expirado</h2>
                <p className="text-muted-foreground">
                  Este link de redefinição de senha não é válido ou já expirou.
                </p>
                <Button asChild className="w-full mt-4">
                  <Link to="/auth/forgot-password">
                    Solicitar Novo Link
                  </Link>
                </Button>
              </div>
            </CardContent>
          ) : success ? (
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
                <h2 className="text-xl font-semibold">Senha Redefinida!</h2>
                <p className="text-muted-foreground">
                  Sua senha foi alterada com sucesso. Você será redirecionado para o login...
                </p>
                <Button asChild className="w-full mt-4">
                  <Link to="/auth/login">Ir para Login</Link>
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Nova Senha</CardTitle>
                <CardDescription>
                  Digite sua nova senha
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {passwordRequirements.map((req) => (
                      <div key={req.label} className="flex items-center gap-1 text-xs">
                        <CheckCircle2 
                          className={`h-3 w-3 ${req.test(formData.password) ? 'text-success' : 'text-muted-foreground'}`} 
                        />
                        <span className={req.test(formData.password) ? 'text-success' : 'text-muted-foreground'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {errors['password'] && <p className="text-sm text-destructive">{errors['password']}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      autoComplete="new-password"
                    />
                  </div>
                  {errors['confirmPassword'] && <p className="text-sm text-destructive">{errors['confirmPassword']}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redefinindo...
                    </>
                  ) : (
                    'Redefinir Senha'
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
