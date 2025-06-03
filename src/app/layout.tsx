import type { Metadata } from "next";
import {  Sacramento, Open_Sans, Orbitron} from "next/font/google";
import React from "react";
import "@/styles/globals.css";
import Providers from "./providers";
import Script from "next/script";
import type { Viewport } from 'next'

const SacramentoFont = Sacramento({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sacramento",
});
const OpenSansFont = Open_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-open-sans",
});
const OrbitronFont = Orbitron({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-orbitron",
});
export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
}
export const metadata: Metadata = {
  title: "Sheru's App Library",
  description: "A collection of apps by Sheru",
  openGraph: {
    title: "Sheru's App Library",
    description: "A collection of apps by Sheru",
    url: "http://sheru.vercel.app/",
    siteName: "Sheru's App Library",
    images: [{ url: "https://example.com/og-image.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheru's App Library",
    description: "A collection of apps by Sheru",
    images: ["https://example.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${SacramentoFont.variable} ${OpenSansFont.variable} ${OrbitronFont.variable}`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8ZLWW9RZD3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8ZLWW9RZD3');
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
