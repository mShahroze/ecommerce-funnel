import AntStyledComponentsRegistry from '@/components/ui/ant/AntRegistryClient';
import RootLayoutClient from '@/components/ui/layout/RootLayoutClient';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Dashboard',
  description: 'Scout technical exercise',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AntStyledComponentsRegistry>
          <RootLayoutClient>{children}</RootLayoutClient>
        </AntStyledComponentsRegistry>
      </body>
    </html>
  );
}
