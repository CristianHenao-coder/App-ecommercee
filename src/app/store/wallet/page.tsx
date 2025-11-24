"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import axios from "axios";

interface Movement {
  _id: string;
  tipo: string;
  monto: number;
  descripcion: string;
  fecha: string;
}

export default function WalletPage() {
  const { user } = useSession();
  const [balance, setBalance] = useState(0);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.tiendaId) {
      fetchWallet();
    }
  }, [user]);

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`/api/tiendas/${user?.tiendaId}/wallet`);
      if (res.data.success) {
        setBalance(res.data.balance || 0);
        setMovements(res.data.movements || []);
      }
    } catch (error) {
      console.error("Error al cargar wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400">Cargando wallet...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Wallet</h1>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-8">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">Saldo Total</p>
          <p className="text-5xl font-bold text-green-400">
            ${balance.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Dinero acumulado por ventas
          </p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h2 className="text-2xl font-semibold mb-4">Historial de Movimientos</h2>

        {movements.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No hay movimientos aún. Las ventas aparecerán aquí.
          </p>
        ) : (
          <div className="space-y-4">
            {movements.map((movement) => (
              <div
                key={movement._id}
                className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div>
                  <p className="text-white font-semibold">
                    {movement.descripcion}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(movement.fecha).toLocaleDateString()}
                  </p>
                </div>
                <p
                  className={`text-lg font-bold ${
                    movement.tipo === "ingreso"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {movement.tipo === "ingreso" ? "+" : "-"}$
                  {movement.monto.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

