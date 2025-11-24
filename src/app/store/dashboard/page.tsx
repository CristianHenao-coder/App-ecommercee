"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import axios from "axios";

export default function StoreDashboard() {
  const { user } = useSession();
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalPedidos: 0,
    productosVendidos: 0,
    alcance: 0,
  });

  useEffect(() => {
    if (user?.tiendaId) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`/api/tiendas/${user?.tiendaId}/stats`);
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-gray-400 text-sm mb-2">Total Ventas</div>
          <div className="text-3xl font-bold text-green-400">
            ${stats.totalVentas.toLocaleString()}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-gray-400 text-sm mb-2">Pedidos</div>
          <div className="text-3xl font-bold text-blue-400">
            {stats.totalPedidos}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-gray-400 text-sm mb-2">Productos Vendidos</div>
          <div className="text-3xl font-bold text-purple-400">
            {stats.productosVendidos}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-gray-400 text-sm mb-2">Alcance</div>
          <div className="text-3xl font-bold text-yellow-400">
            {stats.alcance}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-semibold mb-4">Resumen</h2>
        <p className="text-gray-300">
          Bienvenido a tu panel de control. Aquí podrás ver todas las
          estadísticas de tu negocio. A medida que realices ventas, estos datos
          se actualizarán automáticamente.
        </p>
      </div>
    </div>
  );
}

