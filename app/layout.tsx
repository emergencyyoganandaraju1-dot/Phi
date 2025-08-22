import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PhiAI Curie - Advanced AI Chatbot',
  description: 'Experience the future of AI conversation with Curie, powered by PhiAI. Get intelligent, web-sourced answers with real-time citations.',
  keywords: 'AI chatbot, PhiAI, Curie, artificial intelligence, web search, citations',
  authors: [{ name: 'PhiAI', url: 'https://phiai.com' }],
  creator: 'PhiAI',
  publisher: 'PhiAI',
  robots: 'index, follow',
  openGraph: {
    title: 'PhiAI Curie - Advanced AI Chatbot',
    description: 'Experience the future of AI conversation with Curie, powered by PhiAI.',
    url: 'https://curie.phiai.com',
    siteName: 'PhiAI Curie',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PhiAI Curie - Advanced AI Chatbot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhiAI Curie - Advanced AI Chatbot',
    description: 'Experience the future of AI conversation with Curie, powered by PhiAI.',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #374151',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}