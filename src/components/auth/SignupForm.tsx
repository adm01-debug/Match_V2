import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, User, Sparkles } from 'lucide-react';
import { z } from 'zod';

const signupSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

interface SignupFormProps {
  onSignup: (nome: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export function SignupForm({ onSignup, isLoading }: SignupFormProps) {
  const [signupData, setSignupData] = useState({ nome: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
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
    await onSignup(signupData.nome, signupData.email, signupData.password);
  };

  const fields = [
    { id: 'signup-nome', label: 'Nome completo', key: 'nome' as const, type: 'text', placeholder: 'Seu nome', Icon: User },
    { id: 'signup-email', label: 'Email', key: 'email' as const, type: 'email', placeholder: 'seu@email.com', Icon: Mail },
    { id: 'signup-password', label: 'Senha', key: 'password' as const, type: 'password', placeholder: '••••••••', Icon: Lock },
    { id: 'signup-confirm', label: 'Confirmar senha', key: 'confirmPassword' as const, type: 'password', placeholder: '••••••••', Icon: Lock },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Criar conta</CardTitle>
        <CardDescription>Preencha seus dados para criar uma nova conta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map(({ id, label, key, type, placeholder, Icon }) => (
          <div key={id} className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative group">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input id={id} type={type} placeholder={placeholder} className="pl-10 h-11 border-border focus:border-primary focus:ring-primary/20" value={signupData[key]} onChange={(e) => setSignupData({ ...signupData, [key]: e.target.value })} />
            </div>
            {errors[key] && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive">{errors[key]}</motion.p>}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full h-11 gradient-primary hover:opacity-90 transition-opacity text-white font-medium" disabled={isLoading}>
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Cadastrando...</>) : (<><Sparkles className="mr-2 h-4 w-4" />Criar conta</>)}
        </Button>
      </CardFooter>
    </form>
  );
}
