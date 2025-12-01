import { ToastContainer } from "react-toastify";
import "./globals.css";
import NavMain from "@/components/navMain/navMain";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

export const metadata = {
  title: "Ecommerce App",
  description: "Aplicación ecommerce profesional con Next.js y MongoDB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <NavMain />
              {children}
              <ToastContainer />
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
