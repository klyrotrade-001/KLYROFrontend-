import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';

// Force dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005E23] mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutClient />
    </Suspense>
  );
}
