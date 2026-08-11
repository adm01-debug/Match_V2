/**
 * @fileoverview Hook for optimistic updates with automatic rollback
 * @module useOptimisticUpdate
 */

import { useState, useCallback, useRef } from 'react';
import { successToast, errorToast } from '@/lib/toast-utils';

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error, rollbackData: T) => void;
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
}

interface OptimisticUpdateResult<T> {
  data: T;
  isUpdating: boolean;
  error: Error | null;
  update: <R>(
    optimisticData: T,
    asyncOperation: () => Promise<R>,
    options?: OptimisticUpdateOptions<R>
  ) => Promise<R | null>;
  reset: () => void;
}

/**
 * Hook for performing optimistic updates with automatic rollback on failure
 * 
 * @example
 * const { data, update, isUpdating } = useOptimisticUpdate(initialCandidatos);
 * 
 * const handleMove = async (candidatoId: string, novaEtapa: string) => {
 *   const optimisticData = data.map(c => 
 *     c.id === candidatoId ? { ...c, etapa: novaEtapa } : c
 *   );
 *   
 *   await update(optimisticData, async () => {
 *     return await api.moveCandidato(candidatoId, novaEtapa);
 *   }, {
 *     successMessage: 'Candidato movido com sucesso!',
 *     errorMessage: 'Erro ao mover candidato',
 *   });
 * };
 */
export function useOptimisticUpdate<T>(initialData: T): OptimisticUpdateResult<T> {
  const [data, setData] = useState<T>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const previousDataRef = useRef<T>(initialData);

  const update = useCallback(async <R>(
    optimisticData: T,
    asyncOperation: () => Promise<R>,
    options: OptimisticUpdateOptions<R> = {}
  ): Promise<R | null> => {
    const {
      onSuccess,
      onError,
      successMessage,
      errorMessage,
      showToast = true,
    } = options;

    // Store previous data for rollback
    previousDataRef.current = data;
    
    // Apply optimistic update immediately
    setData(optimisticData);
    setIsUpdating(true);
    setError(null);

    try {
      const result = await asyncOperation();
      
      // Success - keep the optimistic update
      onSuccess?.(result);
      
      if (showToast && successMessage) {
        successToast({
          title: successMessage,
          onUndo: () => {
            // Allow undo within toast
            setData(previousDataRef.current);
          },
        });
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      // Rollback to previous data
      setData(previousDataRef.current);
      setError(error);
      
      onError?.(error, previousDataRef.current as unknown as R);
      
      if (showToast && errorMessage) {
        errorToast({
          title: errorMessage,
          description: error.message,
          onRetry: async () => {
            // Retry the operation
            await update(optimisticData, asyncOperation, options);
          },
        });
      }
      
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [data]);

  const reset = useCallback(() => {
    setData(previousDataRef.current);
    setError(null);
    setIsUpdating(false);
  }, []);

  return {
    data,
    isUpdating,
    error,
    update,
    reset,
  };
}

/**
 * Hook for batch optimistic updates
 */
interface BatchUpdate<T> {
  id: string;
  optimisticData: T;
  operation: () => Promise<unknown>;
}

interface BatchOptimisticUpdateResult<T> {
  data: T;
  pendingUpdates: string[];
  updateBatch: (updates: BatchUpdate<T>[]) => Promise<void>;
  cancelUpdate: (id: string) => void;
}

export function useBatchOptimisticUpdate<T>(initialData: T): BatchOptimisticUpdateResult<T> {
  const [data, setData] = useState<T>(initialData);
  const [pendingUpdates, setPendingUpdates] = useState<string[]>([]);
  const rollbackMapRef = useRef<Map<string, T>>(new Map());

  const updateBatch = useCallback(async (updates: BatchUpdate<T>[]) => {
    // Store rollback points and apply all optimistic updates
    for (const update of updates) {
      rollbackMapRef.current.set(update.id, data);
      setPendingUpdates(prev => [...prev, update.id]);
    }

    // Apply the last optimistic state
    const lastUpdate = updates[updates.length - 1];
    if (lastUpdate) {
      setData(lastUpdate.optimisticData);
    }

    // Execute all operations in parallel
    const results = await Promise.allSettled(
      updates.map(async (update) => {
        try {
          await update.operation();
          return { id: update.id, success: true };
        } catch (error) {
          return { id: update.id, success: false, error };
        }
      })
    );

    // Handle failures - rollback those that failed
    const failures = results
      .filter((r): r is PromiseFulfilledResult<{ id: string; success: false; error: unknown }> => 
        r.status === 'fulfilled' && !r.value.success
      )
      .map(r => r.value.id);

    if (failures.length > 0) {
      // For simplicity, rollback to the state before the batch
      const firstRollback = rollbackMapRef.current.get(updates[0]?.id ?? '');
      if (firstRollback) {
        setData(firstRollback);
      }
      
      errorToast({
        title: 'Algumas operações falharam',
        description: `${failures.length} de ${updates.length} operações falharam`,
      });
    }

    // Clean up
    setPendingUpdates(prev => prev.filter(id => !updates.some(u => u.id === id)));
    updates.forEach(u => rollbackMapRef.current.delete(u.id));
  }, [data]);

  const cancelUpdate = useCallback((id: string) => {
    const rollbackData = rollbackMapRef.current.get(id);
    if (rollbackData) {
      setData(rollbackData);
      rollbackMapRef.current.delete(id);
      setPendingUpdates(prev => prev.filter(uid => uid !== id));
    }
  }, []);

  return {
    data,
    pendingUpdates,
    updateBatch,
    cancelUpdate,
  };
}

/**
 * Hook for optimistic list operations (add, remove, update items)
 */
interface OptimisticListResult<T extends { id: string }> {
  items: T[];
  isUpdating: boolean;
  addItem: (item: T, operation: () => Promise<T>) => Promise<void>;
  removeItem: (id: string, operation: () => Promise<void>) => Promise<void>;
  updateItem: (id: string, updates: Partial<T>, operation: () => Promise<T>) => Promise<void>;
  reorderItems: (fromIndex: number, toIndex: number, operation: () => Promise<void>) => Promise<void>;
}

export function useOptimisticList<T extends { id: string }>(
  initialItems: T[]
): OptimisticListResult<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isUpdating, setIsUpdating] = useState(false);
  const previousItemsRef = useRef<T[]>(initialItems);

  const addItem = useCallback(async (item: T, operation: () => Promise<T>) => {
    previousItemsRef.current = items;
    setItems(prev => [...prev, item]);
    setIsUpdating(true);

    try {
      const result = await operation();
      // Update with server response (might have different ID)
      setItems(prev => prev.map(i => i.id === item.id ? result : i));
    } catch (error) {
      setItems(previousItemsRef.current);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [items]);

  const removeItem = useCallback(async (id: string, operation: () => Promise<void>) => {
    previousItemsRef.current = items;
    setItems(prev => prev.filter(i => i.id !== id));
    setIsUpdating(true);

    try {
      await operation();
      successToast({
        title: 'Item removido',
        onUndo: () => setItems(previousItemsRef.current),
      });
    } catch (error) {
      setItems(previousItemsRef.current);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [items]);

  const updateItem = useCallback(async (
    id: string, 
    updates: Partial<T>, 
    operation: () => Promise<T>
  ) => {
    previousItemsRef.current = items;
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    setIsUpdating(true);

    try {
      const result = await operation();
      setItems(prev => prev.map(i => i.id === id ? result : i));
    } catch (error) {
      setItems(previousItemsRef.current);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [items]);

  const reorderItems = useCallback(async (
    fromIndex: number, 
    toIndex: number, 
    operation: () => Promise<void>
  ) => {
    previousItemsRef.current = items;
    
    const newItems = [...items];
    const [removed] = newItems.splice(fromIndex, 1);
    if (removed) {
      newItems.splice(toIndex, 0, removed);
    }
    setItems(newItems);
    setIsUpdating(true);

    try {
      await operation();
    } catch (error) {
      setItems(previousItemsRef.current);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [items]);

  return {
    items,
    isUpdating,
    addItem,
    removeItem,
    updateItem,
    reorderItems,
  };
}
