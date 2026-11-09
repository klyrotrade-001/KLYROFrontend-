import type { Metadata } from 'next';
import AnnouncementBar from '@/src/components/layout/AnnouncementBar';
import Footer from '@/src/components/layout/Footer';
import Navbar from '@/src/components/layout/Navbar';
import Providers from '@/src/app/providers';
import ConditionalLayout from '@/src/components/layout/ConditionalLayout';
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
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
