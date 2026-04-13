import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Loader2, ShieldAlert } from 'lucide-react';
import { AuthBranding } from '@/components/auth/AuthBranding';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

interface LocationState {
  from?: string;
  requiresAuth?: boolean;
}

const AuthPage = () => {
  usePageTitle('Login');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const locationState = location.state as LocationState | null;
  const redirectedFrom = locationState?.from;
  const requiresAuth = locationState?.requiresAuth;

  useEffect(() => {
    if (user && !authLoading) {
      const destination = redirectedFrom || '/';
      navigate(destination, { replace: true });
    }
  }, [user, authLoading, navigate, redirectedFrom]);

  const handleDemoLogin = () => {
    // LoginForm manages its own state, so we need a ref or callback approach
    // For simplicity, we pass a callback that sets the demo credentials
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao entrar',
        description: error.message === 'Invalid login credentials' ? 'Email ou senha incorretos' : error.message,
      });
    } else {
      toast({ title: 'Bem-vindo!', description: 'Login realizado com sucesso.' });
      navigate('/');
    }
  };

  const handleSignup = async (nome: string, email: string, password: string) => {
    setIsLoading(true);
    const { error } = await signUp(email, password, nome);
    setIsLoading(false);
    if (error) {
      let errorMessage = error.message;
      if (error.message.includes('already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      }
      toast({ variant: 'destructive', title: 'Erro ao cadastrar', description: errorMessage });
    } else {
      toast({ title: 'Conta criada!', description: 'Cadastro realizado com sucesso. Você já pode acessar o sistema.' });
      navigate('/');
    }
  };

  const handleCreateDemoAccount = async () => {
    setIsLoading(true);
    const randomId = Math.random().toString(36).substring(2, 8);
    const demoEmail = `demo_${randomId}@matchats.demo`;
    const demoPassword = '123456';
    const demoName = `Usuário Demo ${randomId}`;
    const { error: signUpError } = await signUp(demoEmail, demoPassword, demoName);
    if (signUpError) {
      setIsLoading(false);
      toast({ variant: 'destructive', title: 'Erro ao criar conta demo', description: signUpError.message });
      return;
    }
    toast({ title: 'Conta demo criada!', description: `Email: ${demoEmail} | Senha: ${demoPassword}` });
    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative p-4 rounded-full gradient-primary"><Briefcase className="h-8 w-8 text-white" /></div>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AuthBranding />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-background">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-8 lg:hidden">
            <div className="p-3 rounded-xl gradient-primary shadow-glow mb-4"><Briefcase className="h-8 w-8 text-white" /></div>
            <h1 className="text-2xl font-bold text-foreground">People Lovers</h1>
            <p className="text-muted-foreground">Sistema de Recrutamento</p>
          </motion.div>

          <AnimatePresence>
            {requiresAuth && redirectedFrom && (
              <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                <Alert className="mb-6 border-warning/50 bg-warning/10">
                  <ShieldAlert className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-warning-foreground">Você precisa fazer login para acessar essa página.</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
            <Card className="border-border/50 shadow-elevated-lg overflow-hidden">
              <div className="h-1 gradient-primary" />
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 m-4 mb-0 w-[calc(100%-2rem)]">
                  <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Entrar</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Cadastrar</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="mt-0">
                  <LoginForm
                    onLogin={handleLogin}
                    onDemoLogin={() => {}}
                    onCreateDemo={handleCreateDemoAccount}
                    isLoading={isLoading}
                  />
                </TabsContent>
                <TabsContent value="signup" className="mt-0">
                  <SignupForm onSignup={handleSignup} isLoading={isLoading} />
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-sm text-muted-foreground mt-6">
            Novos usuários recebem automaticamente permissão de RH
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
