import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import GlobalHeader from "@/components/GlobalHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IT360 Soluciones - Servicios Informáticos",
  description: "Soluciones tecnológicas integrales para tu empresa. Desarrollo web, soporte técnico y venta de productos tecnológicos.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-x-hidden`}
      >
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-1/4 left-1/4 animate-float"></div>
          <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-1/4 right-1/4 animate-float animation-delay-2000"></div>
          <div className="absolute w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float animation-delay-4000"></div>
        </div>
        
        <GlobalHeader />
        <main className="min-h-screen relative z-10">
          {children}
          {/* Botón flotante de WhatsApp global */}
          <WhatsAppButton />
        </main>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
            },
          }}
        />
      </body>
    </html>
  );
}
