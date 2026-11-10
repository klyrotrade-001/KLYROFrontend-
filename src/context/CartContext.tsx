'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, CustomerDetails } from '@/src/types';
import { siteConfig } from '@/src/data/products';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: string, openDrawer?: boolean) => { success: boolean; message: string };
  removeFromCart: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => { success: boolean; message: string };
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  generateWhatsAppOrderUrl: (customerDetails: CustomerDetails) => string;
  generateSingleProductWhatsAppUrl: (product: Product, quantity: number, variant?: string) => string;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'klyro_cart_v2';
const MAX_QUANTITY_PER_ITEM = 10; // Maximum quantity allowed per product

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Only access localStorage in browser environment
    if (typeof window === 'undefined') {
      setIsLoaded(true);
      return;
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTimeout(() => setCart(parsed), 0);
        }
      }
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Only access localStorage in browser environment
    if (typeof window === 'undefined') return;
    
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.error('Error saving cart to localStorage', e);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((
    product: Product,
    quantity: number = 1,
    selectedVariant?: string,
    openDrawer: boolean = false
  ): { success: boolean; message: string } => {
    // Validation
    if (!product || !product.id) {
      return { success: false, message: 'Invalid product' };
    }

    if (quantity <= 0) {
      return { success: false, message: 'Quantity must be at least 1' };
    }

    if (!product.inStock) {
      return { success: false, message: `${product.name} is currently out of stock` };
    }

    // Check if adding this quantity would exceed max
    const existingItem = cart.find(
      (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
    );
    const newTotalQuantity = (existingItem?.quantity || 0) + quantity;

    if (newTotalQuantity > MAX_QUANTITY_PER_ITEM) {
      return { 
        success: false, 
        message: `Maximum ${MAX_QUANTITY_PER_ITEM} items allowed per product` 
      };
    }

    setIsLoading(true);
    try {
      setCart((prev: CartItem[]) => {
        const existingIndex = prev.findIndex(
          (item: CartItem) => item.product.id === product.id && item.selectedVariant === selectedVariant
        );
        
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity
          };
          return updated;
        }
        
        return [...prev, { product, quantity, selectedVariant }];
      });

      if (openDrawer) {
        setTimeout(() => setIsCartOpen(true), 100);
      }

      return { 
        success: true, 
        message: `${product.name} added to cart` 
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add item to cart' };
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const removeFromCart = (productId: string, selectedVariant?: string) => {
    setCart((prev: CartItem[]) =>
      prev.filter(
        (item: CartItem) => !(item.product.id === productId && item.selectedVariant === selectedVariant)
      )
    );
  };

  const updateQuantity = useCallback((
    productId: string, 
    quantity: number, 
    selectedVariant?: string
  ): { success: boolean; message: string } => {
    if (quantity < 0) {
      return { success: false, message: 'Invalid quantity' };
    }

    if (quantity === 0) {
      removeFromCart(productId, selectedVariant);
      return { success: true, message: 'Item removed from cart' };
    }

    if (quantity > MAX_QUANTITY_PER_ITEM) {
      return { 
        success: false, 
        message: `Maximum ${MAX_QUANTITY_PER_ITEM} items allowed` 
      };
    }

    const item = cart.find(
      (item) => item.product.id === productId && item.selectedVariant === selectedVariant
    );

    if (!item) {
      return { success: false, message: 'Item not found in cart' };
    }

    if (!item.product.inStock) {
      return { success: false, message: 'This item is out of stock' };
    }

    setCart((prev: CartItem[]) =>
      prev.map((item: CartItem) =>
        item.product.id === productId && item.selectedVariant === selectedVariant
          ? { ...item, quantity }
          : item
      )
    );

    return { success: true, message: 'Quantity updated' };
  }, [cart]);

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= siteConfig.freeShippingThreshold || subtotal === 0 ? 0 : siteConfig.standardShippingFee;
  const totalAmount = subtotal + shippingFee;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const generateWhatsAppOrderUrl = (customer: CustomerDetails): string => {
    const lines = [
      `*NEW ORDER REQUEST — ${siteConfig.name}*`,
      `_${siteConfig.tagline}_`,
      "",
      "*Customer Details*",
      `Name: ${customer.fullName.trim()}`,
      `Mobile: ${customer.mobileNumber.trim()}`,
    ];

    if (customer.email?.trim()) {
      lines.push(`Email: ${customer.email.trim()}`);
    }

    lines.push(
      "",
      "*Delivery Address*",
      `${customer.houseBuilding.trim()}, ${customer.streetLocality.trim()}`,
      `${customer.city.trim()}, ${customer.state.trim()} - ${customer.pinCode.trim()}`
    );

    if (customer.landmark?.trim()) {
      lines.push(`Landmark: ${customer.landmark.trim()}`);
    }
    if (customer.orderNotes?.trim()) {
      lines.push(`Order Notes: ${customer.orderNotes.trim()}`);
    }

    lines.push("", "*Order Summary*");
    cart.forEach((item: CartItem, index: number) => {
      const lineTotal = item.product.price * item.quantity;
      const variantText = item.selectedVariant ? ` [${item.selectedVariant}]` : '';
      lines.push(
        `${index + 1}. ${item.product.name}${variantText} (Qty: ${item.quantity}) — ${formatPrice(item.product.price)} each = *${formatPrice(lineTotal)}*`
      );
    });

    lines.push(
      "",
      `Subtotal: ${formatPrice(subtotal)}`,
      `Shipping: ${shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}`,
      `*Total Payable: ${formatPrice(totalAmount)}*`,
      "",
      "Please review my order details and share confirmation & delivery timeline."
    );

    const message = lines.join("\n");
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const generateSingleProductWhatsAppUrl = (product: Product, quantity: number, variant?: string): string => {
    const total = product.price * quantity;
    const variantText = variant ? ` (${variant})` : '';
    const message = [
      `*DIRECT INQUIRY & ORDER — ${siteConfig.name}*`,
      `_${siteConfig.tagline}_`,
      "",
      `Product: *${product.name}*${variantText}`,
      `Quantity: ${quantity}`,
      `Unit Price: ${formatPrice(product.price)}`,
      `Total: *${formatPrice(total)}*`,
      "",
      "Hello KLYRO Team, I would like to place an order for this item. Please share payment and delivery details."
    ].join("\n");

    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        totalAmount,
        isCartOpen,
        openCart,
        closeCart,
        isSearchOpen,
        openSearch,
        closeSearch,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        generateWhatsAppOrderUrl,
        generateSingleProductWhatsAppUrl,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
