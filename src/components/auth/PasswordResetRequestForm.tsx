/**
 * @fileoverview Password Reset Request Form
 * @description Formulário para solicitar reset de senha com aprovação
 */

import React, { useState, memo } from 'react';
import { Mail, Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createPasswordResetRequest } from '@/services/passwordResetService';

interface PasswordResetRequestFormProps {
  readonly onSuccess?: () => void;
}

export const PasswordResetRequestForm = memo(({ onSuccess }: PasswordResetRequestFormProps) => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await createPasswordResetRequest(email, reason);
      setResult(response);
      
      if (response.success) {
        setEmail('');
        setReason('');
        onSuccess?.();
      }
    } catch {
      setResult({ success: false, message: 'Erro ao enviar solicitação.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result?.success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-success mx-auto" />
            <h3 className="text-lg font-semibold">Solicitação Enviada</h3>
            <p className="text-muted-foreground">{result.message}</p>
            <Button variant="outline" onClick={() => setResult(null)}>
              Fazer Nova Solicitação
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Recuperar Senha
        </CardTitle>
        <CardDescription>
          Sua solicitação será analisada por um administrador antes do envio do link de reset.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Textarea
              id="reason"
              placeholder="Descreva por que precisa redefinir sua senha..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {result && !result.success && (
            <Alert variant="destructive">
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Enviar Solicitação
          </Button>
        </form>
      </CardContent>
    </Card>
  );
});

PasswordResetRequestForm.displayName = 'PasswordResetRequestForm';

export default PasswordResetRequestForm;
