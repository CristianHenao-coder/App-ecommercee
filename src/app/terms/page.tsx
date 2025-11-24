"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Términos y Condiciones para Tiendas
          </h1>

          <div className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-green-400">
                Requisitos para ser tienda en LookGod
              </h2>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>
                    <strong>Negocio real o emprendimiento serio:</strong> Debes
                    tener un negocio legítimo o un emprendimiento con productos
                    reales. No se permiten cuentas falsas o de prueba.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>
                    <strong>Datos legales:</strong> Debes proporcionar
                    información verídica sobre tu negocio, incluyendo nombre,
                    descripción, y datos de contacto válidos.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>
                    <strong>Responsabilidad sobre los productos:</strong> Eres
                    responsable de la calidad, descripción y entrega de tus
                    productos. LookGod no se hace responsable por productos
                    defectuosos o entregas fallidas.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>
                    <strong>Contenido apropiado:</strong> Todo el contenido
                    (imágenes, descripciones, posts) debe ser apropiado y
                    alineado con los valores de LookGod.
                  </span>
                </li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">
                Responsabilidades
              </h2>
              <p>
                Como tienda en LookGod, te comprometes a mantener altos
                estándares de calidad, honestidad y servicio al cliente. Cualquier
                incumplimiento puede resultar en la suspensión o eliminación de
                tu cuenta.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-green-400">
                Política de Pagos
              </h2>
              <p>
                Los pagos se procesarán según los términos acordados. LookGod se
                reserva el derecho de retener pagos en caso de disputas o
                incumplimientos.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/profile"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Volver al perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

