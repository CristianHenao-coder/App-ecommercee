import { ToastContainer } from "react-toastify";
import "./globals.css";
import NavMain from "@/components/navMain/navMain";
import Footer from "@/components/footer/footer";

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
      
        <NavMain />
        {children}
        <ToastContainer/>
        <Footer/>
      </body>
    </html>
  );
}
