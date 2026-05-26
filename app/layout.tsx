import type { Metadata } from "next";
import { Geist } from "next/font/google";
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
    type: "website",
    locale: "es_CL",
    siteName: "Corporación PLOC Puerto Octay",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
