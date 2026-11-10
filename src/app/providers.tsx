'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/src/context/CartContext';
import { ToastProvider } from '@/src/hooks/useToast';
import CartDrawer from '@/src/components/cart/CartDrawer';
import ProductDetailModal from '@/src/components/product/ProductDetailModal';
import SearchModal from '@/src/components/search/SearchModal';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <ProductDetailModal />
        <SearchModal />
      </CartProvider>
    </ToastProvider>
  );
}
