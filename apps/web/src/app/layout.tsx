import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from 'sonner';

const inter = localFont({
  src: '../../public/fonts/Inter-Variable.ttf',
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI COO',
  description: 'AI Chief Operating Officer for Indonesian UMKM',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster theme="dark" richColors position="top-right" />
      </body>
    </html>
  );
}
