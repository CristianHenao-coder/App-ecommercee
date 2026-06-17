import { ToastContainer } from "react-toastify";
import "./globals.css";
import NavMain from "@/components/navMain/navMain";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Providers } from "@/components/Providers";
import { Oswald, Playfair_Display } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "LookGod | Moda Oversize con Propósito",
  description: "Ropa oversize cristiana con propósito. Camisetas, buzos y camisas que transmiten fe, esperanza y amor. Tela peruana y qatar de la mejor calidad.",
  keywords: "ropa cristiana, moda oversize, camisetas con mensaje, ropa espiritual, fe, bendición",
  authors: [{ name: "LookGod" }],
  openGraph: {
    title: "LookGod | Viste tu Fe",
    description: "Moda oversize con propósito. Ropa que refleja tu esencia espiritual.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${oswald.variable} ${playfair.variable}`}>
      <body className="bg-black text-white flex flex-col min-h-screen overflow-x-hidden font-sans">
        <Providers>
          <AuthProvider>
            <LanguageProvider>
              <CartProvider>
                <NavMain />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
                <ToastContainer 
                  theme="dark"
                  position="top-right"
                  style={{ position: 'fixed' }}
                />
              </CartProvider>
            </LanguageProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
