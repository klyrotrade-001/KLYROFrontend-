import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
