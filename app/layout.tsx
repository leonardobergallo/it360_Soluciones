import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import GlobalHeader from "@/components/GlobalHeader";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalHeader />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
