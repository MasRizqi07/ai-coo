import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI COO — Asisten Operasional Cerdas untuk UMKM',
  description:
    'AI COO membantu pemilik UMKM Indonesia mengelola bisnis dengan insight harian berbasis AI. Ketahui apa yang harus dilakukan hari ini.',
  keywords: ['AI', 'UMKM', 'Indonesia', 'bisnis', 'operasional', 'insight'],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
