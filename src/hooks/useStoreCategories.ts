'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '@/src/lib/api';
import { CategoryInfo } from '@/src/types';

export function useStoreCategories(): CategoryInfo[] {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error: unknown) => {
        console.error('Failed to load categories from the backend:', error);
      });
  }, []);

  return categories;
}
