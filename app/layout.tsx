'use client';

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProdiver";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'PUSH_TOKEN_REGISTERED') {
        localStorage.setItem('push_token', data.token);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="flex justify-center h-screen">
      <div className="w-full max-w-md bg-white shadow-lg h-screen overflow-hidden flex flex-col safe-area-container">
        {children}
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black safe-area-body`}>
        <QueryProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </QueryProvider>
      </body>
    </html>
  );
}
