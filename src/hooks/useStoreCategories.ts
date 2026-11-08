'use client';

import { useEffect, useState } from 'react';
import { categories as fallbackCategories } from '@/src/data/products';
import { getCategories } from '@/src/lib/api';
import { CategoryInfo } from '@/src/types';

export function useStoreCategories(): CategoryInfo[] {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error: unknown) => {
        console.error('Failed to load categories from the backend:', error);
      });
  }, []);

  return categories;
}
