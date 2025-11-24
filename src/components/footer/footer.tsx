"use client";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              <span className="text-white">look</span>
              <span className="text-gray-300">GOD</span>
            </h2>
            <p className="text-gray-400 text-sm">
              © 2025 LookGod – Cristian Henao - coder
            </p>
          </div>

          <div className="max-w-2xl mx-auto mt-8">
            <p className="text-gray-300 leading-relaxed italic">
              Con una visión y una fe: expandir el evangelio a toda nación.{" "}
              <span className="text-green-400 font-semibold">
                El Verbo hecho estilo.
              </span>
            </p>
          </div>

          <div className="pt-8 border-t border-gray-800 mt-8">
            <p className="text-gray-500 text-sm">
              Marketplace de moda con propósito. Viste con poder, viste con
              propósito.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

