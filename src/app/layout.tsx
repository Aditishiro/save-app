import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist to Inter
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ // Instantiate Inter
  subsets: ['latin'],
  variable: '--font-inter', // Define CSS variable for Inter
});

export const metadata: Metadata = {
  title: 'FormFlow Finance',
  description: 'No-code form builder for banking and finance professionals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
