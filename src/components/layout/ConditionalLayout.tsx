'use client';

import { usePathname } from 'next/navigation';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';

// Routes that should NOT show Navbar/Footer
const NO_LAYOUT_ROUTES = ['/admin'];

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = NO_LAYOUT_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));

  if (hideLayout) {
    return <main>{children}</main>;
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Navbar />
      </div>
      <main>{children}</main>
      <Footer />
    </>
  );
}
