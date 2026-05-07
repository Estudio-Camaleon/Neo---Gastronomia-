import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "NEO | Gestión de Catálogos",
  description: "Tu catálogo digital profesional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${montserrat.className} antialiased selection:bg-primary selection:text-black`}
      >
        <CartProvider>
          {children}

          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: "12px",
                border: "3px solid black",
                fontFamily: "var(--font-montserrat)",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "12px",
                boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
