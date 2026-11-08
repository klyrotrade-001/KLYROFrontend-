import type { Metadata } from 'next';
import AnnouncementBar from '@/src/components/layout/AnnouncementBar';
import Footer from '@/src/components/layout/Footer';
import Navbar from '@/src/components/layout/Navbar';
import Providers from '@/src/app/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'KLYRO | Smart Living. Better Choices.',
  description: 'Thoughtfully selected smart home and everyday essentials.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
