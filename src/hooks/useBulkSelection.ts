import { useState, useCallback, useMemo } from 'react';

export function useBulkSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map((i) => i.id)));
  }, [items]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const selectedItems = useMemo(
    () => items.filter((i) => selectedIds.has(i.id)),
    [items, selectedIds]
  );

  const allSelected = useMemo(
    () => items.length > 0 && selectedIds.size === items.length,
    [items, selectedIds]
  );

  const someSelected = useMemo(() => selectedIds.size > 0, [selectedIds]);

  return {
    selectedIds: Array.from(selectedIds),
    selectedItems,
    selectedCount: selectedIds.size,
    toggle,
    selectAll,
    deselectAll,
    isSelected,
    allSelected,
    someSelected,
  };
}
