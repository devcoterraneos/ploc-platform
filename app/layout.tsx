import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Corporación PLOC | Plataforma de Donaciones Puerto Octay",
    template: "%s | PLOC Puerto Octay",
  },
  description:
    "Apoya proyectos comunitarios, culturales y territoriales que fortalecen la vida local del sur de Chile. Corporación PLOC — Plan Desarrollo Integrado Puerto Octay.",
  keywords: ["Puerto Octay", "PLOC", "donaciones", "proyectos comunitarios", "Los Lagos", "Chile"],
  openGraph: {
    type:      "website",
    locale:    "es_CL",
    siteName:  "Corporación PLOC Puerto Octay",
    images: [
      {
        url:    "/images/hero-puerto-octay-2.jpg",
        width:  1200,
        height: 630,
        alt:    "Corporación PLOC — Puerto Octay",
      },
    ],
  },
  twitter: {
    card:  "summary_large_image",
    images: ["/images/hero-puerto-octay-2.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} scroll-smooth`}>
      <body className="antialiased">
        {children}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "7771499b07fc4098bd1fd38315ce4510"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
