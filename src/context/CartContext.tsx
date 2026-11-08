'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CustomerDetails } from '@/src/types';
import { siteConfig } from '@/src/data/products';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: string, openDrawer?: boolean) => void;
  removeFromCart: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'klyro_cart_v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
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
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.error('Error saving cart to localStorage', e);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedVariant?: string,
    openDrawer: boolean = true
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedVariant }];
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string, selectedVariant?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedVariant === selectedVariant)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, selectedVariant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedVariant === selectedVariant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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
    cart.forEach((item, index) => {
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
