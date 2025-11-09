// /app/layout.tsx
'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../globals.css';
import { SnackbarProvider } from 'notistack';

const inter = Inter({ subsets: ['latin'] });

 const metadata: Metadata = {
  title: 'Platform Bootstrap',
  description: 'Bootstrap platform master tables',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          {children}
        </SnackbarProvider>
      </body>
    </html>
  );
}