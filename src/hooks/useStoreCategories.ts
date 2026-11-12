'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCategories } from '@/src/lib/api';
import { CategoryInfo } from '@/src/types';

// Module-level cache — shared across all hook instances, survives re-renders
let cachedCategories: CategoryInfo[] | null = null;
let fetchPromise: Promise<CategoryInfo[]> | null = null;

export function useStoreCategories(): CategoryInfo[] {
  const [categories, setCategories] = useState<CategoryInfo[]>(
    cachedCategories ?? []
  );

  const load = useCallback(async (retries = 3) => {
    // Already cached — use it immediately
    if (cachedCategories && cachedCategories.length > 0) {
      setCategories(cachedCategories);
      return;
    }

    // De-duplicate concurrent fetches
    if (!fetchPromise) {
      fetchPromise = getCategories().finally(() => {
        fetchPromise = null;
      });
    }

    try {
      const data = await fetchPromise;
      if (data && data.length > 0) {
        cachedCategories = data;
        setCategories(data);
      } else if (retries > 0) {
        const id = setTimeout(() => load(retries - 1), 1500);
        return () => clearTimeout(id);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      if (retries > 0) {
        const id = setTimeout(() => load(retries - 1), 2000);
        return () => clearTimeout(id);
      }
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return categories;
}
