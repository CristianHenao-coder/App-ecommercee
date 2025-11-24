import { ToastContainer } from "react-toastify";
import "./globals.css";
import NavMain from "@/components/navMain/navMain";
import Footer from "@/components/footer/footer";
import { SessionProvider } from "@/contexts/SessionContext";
import { CartProvider } from "@/contexts/CartContext";
import { I18nProvider } from "@/contexts/I18nContext";

export const metadata = {
  title: "LookGod - El Verbo hecho Style",
  description: "Marketplace de moda con propósito. Viste con poder, viste con propósito.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white min-h-screen flex flex-col">
        <I18nProvider>
          <SessionProvider>
            <CartProvider>
              <NavMain />
              <main className="flex-1">{children}</main>
              <Footer />
              <ToastContainer/>
            </CartProvider>
          </SessionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
