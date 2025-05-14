import type { Metadata } from "next";
import { Inter } from "next/font/google";
import CookieConsent from '../components/CookieConsent';
import Navbar from "../components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Se.Sec.Pro',
  description: 'Soluciones integrales de ciberseguridad',
};

import { LanguageProvider } from "../lib/LanguageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <body className="antialiased">
        <LanguageProvider>
          <CookieConsent />
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
