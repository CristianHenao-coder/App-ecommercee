import { ToastContainer } from "react-toastify";
import "./globals.css";
import NavMain from "@/components/navMain/navMain";

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
      </body>
    </html>
  );
}
