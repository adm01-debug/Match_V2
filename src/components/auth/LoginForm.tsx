import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, User, Sparkles } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onDemoLogin: () => void;
  onCreateDemo: () => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onLogin, onDemoLogin, onCreateDemo, isLoading }: LoginFormProps) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
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
    await onLogin(loginData.email, loginData.password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
        <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input id="login-email" type="email" placeholder="seu@email.com" className="pl-10 h-11 border-border focus:border-primary focus:ring-primary/20" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
          </div>
          {errors['email'] && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive">{errors['email']}</motion.p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Senha</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input id="login-password" type="password" placeholder="••••••••" className="pl-10 h-11 border-border focus:border-primary focus:ring-primary/20" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
          </div>
          {errors['password'] && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive">{errors['password']}</motion.p>}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" className="w-full h-11 gradient-primary hover:opacity-90 transition-opacity text-white font-medium" disabled={isLoading}>
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Entrando...</>) : (<><Sparkles className="mr-2 h-4 w-4" />Entrar no Sistema</>)}
        </Button>
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">ou</span></div>
        </div>
        <Button type="button" variant="outline" className="w-full h-11 border-dashed border-primary/50 hover:bg-primary/5 hover:border-primary transition-all" onClick={onDemoLogin} disabled={isLoading}>
          <User className="mr-2 h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Preencher credenciais</span>
          <span className="ml-1 font-semibold text-primary">demo</span>
        </Button>
        <Button type="button" variant="default" className="w-full h-11 gradient-success hover:opacity-90 transition-opacity text-white font-medium" onClick={onCreateDemo} disabled={isLoading}>
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Criando conta...</>) : (<><Sparkles className="mr-2 h-4 w-4" />Criar conta demo automática</>)}
        </Button>
      </CardFooter>
    </form>
  );
}
