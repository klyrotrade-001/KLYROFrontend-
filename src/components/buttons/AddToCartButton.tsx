'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  showPrice?: boolean;
  price?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function AddToCartButton({
  onClick,
  disabled = false,
  className = '',
  showPrice = false,
  price = 0,
  size = 'md'
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  // Auto-reset the "Added" state after 1.5 seconds
  useEffect(() => {
    if (added) {
      const timer = setTimeout(() => setAdded(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [added]);

  const handleClick = () => {
    onClick();
    setAdded(true);
  };

  // Size-based styling
  const sizeClasses = {
    sm: 'h-9 text-[10px]',
    md: 'h-10 text-[10px] sm:text-[11px]',
    lg: 'h-11 sm:h-12 text-xs sm:text-sm'
  };

  const baseClasses = `
    flex min-w-0 w-full items-center justify-center gap-1 overflow-hidden
    rounded-2xl border-2 border-[#005E23] bg-white
    font-bold tracking-tight
    transition-all duration-200 
    active:scale-95
    px-1 sm:px-2
    text-[#005E23]
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      style={{ 
        boxShadow: 'inset 0 1px 0 0 #005E23, inset 0 -1px 0 0 #005E23, inset 1px 0 0 0 #005E23, inset -1px 0 0 0 #005E23'
      }}
      className={`${baseClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {added ? (
        <>
          <Check size={size === 'lg' ? 18 : 14} strokeWidth={2.5} className="shrink-0" />
          <span className="min-w-0 text-center text-[#005E23]">Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart size={size === 'lg' ? 12 : 12} strokeWidth={2.2} className="shrink-0" />
          <span className="min-w-0 whitespace-nowrap text-center text-[#005E23]">Add to Cart</span>
          {showPrice && price > 0 && (
            <span className="shrink-0">· {`₹${price.toLocaleString('en-IN')}`}</span>
          )}
        </>
      )}
    </button>
  );
}
