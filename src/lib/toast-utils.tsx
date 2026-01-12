/**
 * @fileoverview Enhanced toast utilities with undo actions
 * @module lib/toast-utils
 */

import { toast } from '@/hooks/use-toast';
import { ToastAction, type ToastActionElement } from '@/components/ui/toast';

import { Undo2 } from 'lucide-react';

type ToastVariant = 'default' | 'destructive';

interface ActionableToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onUndo?: () => void | Promise<void>;
  undoLabel?: string;
}

interface SuccessToastOptions {
  title: string;
  description?: string;
  duration?: number;
  onUndo?: () => void | Promise<void>;
}

interface ErrorToastOptions {
  title: string;
  description?: string;
  duration?: number;
  onRetry?: () => void | Promise<void>;
}

interface WarningToastOptions {
  title: string;
  description?: string;
  duration?: number;
  onConfirm?: () => void | Promise<void>;
  confirmLabel?: string;
}

interface InfoToastOptions {
  title: string;
  description?: string;
  duration?: number;
  onAction?: () => void | Promise<void>;
  actionLabel?: string;
}

// Component para action com undo icon
function UndoAction({ 
  onClick, 
  label = 'Desfazer' 
}: { 
  onClick: () => void | Promise<void>; 
  label?: string;
}) {
  return (
    <ToastAction 
      altText={label} 
      onClick={() => onClick()}
      className="gap-1 flex items-center"
    >
      <Undo2 className="h-3 w-3" />
      {label}
    </ToastAction>
  );
}

// Component para action simples
function SimpleAction({ 
  onClick, 
  label 
}: { 
  onClick: () => void | Promise<void>; 
  label: string;
}) {
  return (
    <ToastAction altText={label} onClick={() => onClick()}>
      {label}
    </ToastAction>
  );
}

/**
 * Toast de sucesso com opção de desfazer
 */
export function successToast({
  title,
  description,
  duration = 5000,
  onUndo
}: SuccessToastOptions) {
  return toast({
    title: `✓ ${title}`,
    description,
    duration,
    action: onUndo 
      ? <UndoAction onClick={onUndo} /> as ToastActionElement
      : undefined
  });
}

/**
 * Toast de erro com opção de retry
 */
export function errorToast({
  title,
  description,
  duration = 8000,
  onRetry
}: ErrorToastOptions) {
  return toast({
    title: `✕ ${title}`,
    description,
    variant: 'destructive',
    duration,
    action: onRetry
      ? <SimpleAction onClick={onRetry} label="Tentar novamente" /> as ToastActionElement
      : undefined
  });
}

/**
 * Toast de aviso com ação de confirmação
 */
export function warningToast({
  title,
  description,
  duration = 6000,
  onConfirm,
  confirmLabel = 'Confirmar'
}: WarningToastOptions) {
  return toast({
    title: `⚠ ${title}`,
    description,
    duration,
    action: onConfirm
      ? <SimpleAction onClick={onConfirm} label={confirmLabel} /> as ToastActionElement
      : undefined
  });
}

/**
 * Toast informativo com ação customizada
 */
export function infoToast({
  title,
  description,
  duration = 5000,
  onAction,
  actionLabel = 'Ver mais'
}: InfoToastOptions) {
  return toast({
    title: `ℹ ${title}`,
    description,
    duration,
    action: onAction
      ? <SimpleAction onClick={onAction} label={actionLabel} /> as ToastActionElement
      : undefined
  });
}

/**
 * Toast genérico com undo
 */
export function actionableToast({
  title,
  description,
  variant = 'default',
  duration = 5000,
  onUndo,
  undoLabel = 'Desfazer'
}: ActionableToastOptions) {
  return toast({
    title,
    description,
    variant,
    duration,
    action: onUndo
      ? <UndoAction onClick={onUndo} label={undoLabel} /> as ToastActionElement
      : undefined
  });
}

/**
 * Toast de loading que pode ser atualizado
 */
export function loadingToast(title: string, description?: string) {
  const { id, dismiss, update } = toast({
    title: `⏳ ${title}`,
    description,
    duration: Infinity,
  });

  return {
    id,
    dismiss,
    success: (successTitle: string, successDescription?: string) => {
      update({
        id,
        title: `✓ ${successTitle}`,
        description: successDescription,
        duration: 3000,
      });
    },
    error: (errorTitle: string, errorDescription?: string) => {
      update({
        id,
        title: `✕ ${errorTitle}`,
        description: errorDescription,
        variant: 'destructive',
        duration: 5000,
      });
    },
  };
}

/**
 * Promise toast - mostra loading e depois sucesso/erro
 */
export async function promiseToast<T>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: Error) => string);
  }
): Promise<T> {
  const loadingState = loadingToast(loading);

  try {
    const result = await promise;
    const successMessage = typeof success === 'function' ? success(result) : success;
    loadingState.success(successMessage);
    return result;
  } catch (err) {
    const errorMessage = typeof error === 'function' ? error(err as Error) : error;
    loadingState.error(errorMessage);
    throw err;
  }
}
