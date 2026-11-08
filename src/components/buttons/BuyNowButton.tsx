'use client';

import { ShoppingBag } from 'lucide-react';

interface BuyNowButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BuyNowButton({
  onClick,
  disabled = false,
  className = '',
  size = 'md'
}: BuyNowButtonProps) {
  // Size-based styling
  const sizeClasses = {
    sm: 'h-9 text-[11px]',
    md: 'h-10 text-[11px] sm:text-xs',
    lg: 'h-11 sm:h-12 text-xs sm:text-sm'
  };

  const baseClasses = `
    flex min-w-0 w-full items-center justify-center gap-1 overflow-hidden
    rounded-2xl border-2 border-[#005E23] bg-[#005E23]
    font-bold tracking-tight
    transition-all duration-200 
    active:scale-95
    px-1 sm:px-2
    text-white
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ 
        boxShadow: 'inset 0 1px 0 0 #003D17, inset 0 -1px 0 0 #003D17, inset 1px 0 0 0 #003D17, inset -1px 0 0 0 #003D17'
      }}
      className={`${baseClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <ShoppingBag size={size === 'lg' ? 18 : 14} strokeWidth={2.2} className="shrink-0" />
      <span className="min-w-0 whitespace-nowrap text-center">Buy Now</span>
    </button>
  );
}
