import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ourFileRouter } from './api/uploadthing/core';
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ThemeProvider } from '@/components/theme-provider';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The maths quiz - Test Your Knowledge',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        <Toaster />
      </ThemeProvider>
      </body>
    </html>
  );
}