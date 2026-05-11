import type { Metadata } from "next";
import { inter, playfairDisplay, dmSans } from "./fonts";
import AppLayoutClient from "./components/layout/AppLayoutClient";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "CobraTú - Generador de Facturas",
  description: "Crea facturas profesionales sin cuenta. En menos de 2 minutos.",
  keywords: ["facturas", "invoices", "generador", "freelancer", "IA"],
  other: {
    "lh3k-verify": "905ed942a935b44b601debcafa1af1ec"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfairDisplay.variable} ${dmSans.variable} antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
        <AppLayoutClient className="h-full">{children}</AppLayoutClient>
    </html>
  );
}
