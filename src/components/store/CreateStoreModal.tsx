"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import axios from "axios";
import { Notificaction } from "@/helpers/utils";
import Link from "next/link";

interface CreateStoreModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateStoreModal({
  onClose,
  onSuccess,
}: CreateStoreModalProps) {
  const { user, updateUser } = useSession();
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateStore = async () => {
    if (!acceptedTerms) {
      Notificaction("Debes aceptar los términos y condiciones", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/tiendas/create", {
        ownerId: user?._id,
      });

      if (res.data.success) {
        updateUser({
          role: "tienda",
          tiendaId: res.data.tienda._id,
        });
        Notificaction("✅ Tu negocio ha sido creado exitosamente", "success");
        onSuccess();
        router.push("/store/dashboard");
      }
    } catch (err: any) {
      Notificaction(
        err?.response?.data?.message || "Error al crear el negocio",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Crear mi negocio en LookGod
        </h2>

        <div className="space-y-6 mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-400">
              ¿Qué es ser tienda en LookGod?
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Ser tienda en LookGod significa formar parte de una comunidad de
              emprendedores y marcas que buscan expandir el evangelio a través
              del estilo. No solo vendes productos, compartes un mensaje de fe
              y propósito.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-400">
              Beneficios de ser tienda:
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✨</span>
                <span>
                  <strong>Visibilidad:</strong> Tu marca será visible en todo el
                  marketplace
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">👥</span>
                <span>
                  <strong>Comunidad:</strong> Conecta con clientes que comparten
                  tus valores
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">📈</span>
                <span>
                  <strong>Movimiento:</strong> Gestiona tus productos, pedidos
                  y ventas desde un panel centralizado
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">📢</span>
                <span>
                  <strong>Publicidad gratuita:</strong> Publica contenido y
                  productos que aparecerán en el feed del marketplace
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 mr-3 w-5 h-5 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
            />
            <span className="text-gray-300">
              Acepto los{" "}
              <Link
                href="/terms"
                target="_blank"
                className="text-green-400 hover:text-green-500 underline"
              >
                términos y condiciones
              </Link>{" "}
              para crear mi negocio en LookGod
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCreateStore}
            disabled={!acceptedTerms || loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            {loading ? "Creando..." : "Continuar"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

