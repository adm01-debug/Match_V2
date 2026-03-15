import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Loader2, Mail, Lock, User, ShieldAlert, Users, Target, TrendingUp, Sparkles } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const signupSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

interface LocationState {
  from?: string;
  requiresAuth?: boolean;
}

const features = [
  {
    icon: Users,
    title: 'Banco de Talentos',
    description: 'Gerencie candidatos de forma inteligente',
  },
  {
    icon: Target,
    title: 'Match Score',
    description: 'IA para encontrar o candidato ideal',
  },
  {
    icon: TrendingUp,
    title: 'Pipeline Visual',
    description: 'Acompanhe todo o processo seletivo',
  },
];

const AuthPage = () => {
  usePageTitle('Login');

  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ nome: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Demo login handler - pre-fill existing demo credentials
  const handleDemoLogin = () => {
    setLoginData({ email: 'adm01@promobrindes.com.br', password: '123456' });
  };

  // Auto-create demo account and login
  const handleCreateDemoAccount = async () => {
    setIsLoading(true);
    const randomId = Math.random().toString(36).substring(2, 8);
    const demoEmail = `demo_${randomId}@matchats.demo`;
    const demoPassword = '123456';
    const demoName = `Usuário Demo ${randomId}`;

    // First, try to sign up
    const { error: signUpError } = await signUp(demoEmail, demoPassword, demoName);
    
    if (signUpError) {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta demo',
        description: signUpError.message,
      });
      return;
    }

    // With auto-confirm enabled, the user should be logged in automatically
    // Just show success message
    toast({
      title: 'Conta demo criada!',
      description: `Email: ${demoEmail} | Senha: ${demoPassword}`,
    });
    setIsLoading(false);
  };

  // Get redirect info from location state
  const locationState = location.state as LocationState | null;
  const redirectedFrom = locationState?.from;
  const requiresAuth = locationState?.requiresAuth;

  useEffect(() => {
    if (user && !authLoading) {
      // Redirect back to the original page or dashboard
      const destination = redirectedFrom || '/';
      navigate(destination, { replace: true });
    }
  }, [user, authLoading, navigate, redirectedFrom]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const validation = loginSchema.safeParse(loginData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao entrar',
        description: error.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos' 
          : error.message,
      });
    } else {
      toast({
        title: 'Bem-vindo!',
        description: 'Login realizado com sucesso.',
      });
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const validation = signupSchema.safeParse(signupData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(signupData.email, signupData.password, signupData.nome);
    setIsLoading(false);

    if (error) {
      let errorMessage = error.message;
      if (error.message.includes('already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      }
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: errorMessage,
      });
    } else {
      toast({
        title: 'Conta criada!',
        description: 'Cadastro realizado com sucesso. Você já pode acessar o sistema.',
      });
      navigate('/');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative p-4 rounded-full gradient-primary">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        
        {/* Floating Shapes */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 rounded-xl gradient-primary shadow-glow">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">People Lovers</h1>
                <p className="text-white/60 text-sm">Sistema de Recrutamento</p>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Encontre os
              <span className="block text-gradient-success">melhores talentos</span>
              para sua empresa
            </h2>
            
            <p className="text-lg text-white/70 mb-12 max-w-md">
              Plataforma completa de recrutamento e seleção com inteligência artificial 
              para otimizar seus processos.
            </p>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-white/60">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent" />
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-8 lg:hidden"
          >
            <div className="p-3 rounded-xl gradient-primary shadow-glow mb-4">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Match ATS</h1>
            <p className="text-muted-foreground">Sistema de Recrutamento</p>
          </motion.div>

          {/* Auth Required Alert */}
          <AnimatePresence>
            {requiresAuth && redirectedFrom && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Alert className="mb-6 border-warning/50 bg-warning/10">
                  <ShieldAlert className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-warning-foreground">
                    Você precisa fazer login para acessar essa página.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="border-border/50 shadow-elevated-lg overflow-hidden">
              {/* Card Gradient Border */}
              <div className="h-1 gradient-primary" />
              
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 m-4 mb-0 w-[calc(100%-2rem)]">
                  <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Cadastrar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin}>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
                      <CardDescription>
                        Entre com suas credenciais para acessar o sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-10 h-11 border-border focus:border-primary focus:ring-primary/20"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          />
                        </div>
                        {errors['email'] && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors['email']}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Senha</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 h-11 border-border focus:border-primary focus:ring-primary/20"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          />
                        </div>
                        {errors['password'] && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors['password']}
                          </motion.p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                      <Button 
                        type="submit" 
                        className="w-full h-11 gradient-primary hover:opacity-90 transition-opacity text-white font-medium" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Entrando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Entrar no Sistema
                          </>
                        )}
                      </Button>
                      
                      <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">ou</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full h-11 border-dashed border-primary/50 hover:bg-primary/5 hover:border-primary transition-all"
                        onClick={handleDemoLogin}
                        disabled={isLoading}
                      >
                        <User className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Preencher credenciais</span>
                        <span className="ml-1 font-semibold text-primary">demo</span>
                      </Button>

                      <Button 
                        type="button"
                        variant="default"
                        className="w-full h-11 gradient-success hover:opacity-90 transition-opacity text-white font-medium"
                        onClick={handleCreateDemoAccount}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Criando conta...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Criar conta demo automática
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleSignup}>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl">Criar conta</CardTitle>
                      <CardDescription>
                        Preencha seus dados para criar uma nova conta
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-nome">Nome completo</Label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            id="signup-nome"
                            type="text"
                            placeholder="Seu nome"
                            className="pl-10 h-11 border-border focus:border-primary focus:ring-primary/20"
                            value={signupData.nome}
                            onChange={(e) => setSignupData({ ...signupData, nome: e.target.value })}
                          />
                        </div>
                        {errors['nome'] && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors['nome']}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-10 h-11 border-border focus:border-primary focus:ring-primary/20"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          />
                        </div>
                        {errors['email'] && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors['email']}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Senha</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 h-11 border-border focus:border-primary focus:ring-primary/20"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          />
                        </div>
                        {errors['password'] && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors['password']}
                          </motion.p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm">Confirmar senha</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            id="signup-confirm"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 h-11 border-border focus:border-primary focus:ring-primary/20"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          />
                        </div>
                        {errors['confirmPassword'] && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors['confirmPassword']}
                          </motion.p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full h-11 gradient-primary hover:opacity-90 transition-opacity text-white font-medium" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cadastrando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Criar conta
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            Novos usuários recebem automaticamente permissão de RH
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
