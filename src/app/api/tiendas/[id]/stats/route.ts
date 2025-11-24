import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Product from "@/models/Product";
import Tienda from "@/models/Tiendas";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnection();
    const { id } = params;

    // Obtener tienda
    const tienda = await Tienda.findById(id).lean();
    if (!tienda) {
      return NextResponse.json(
        { success: false, message: "Tienda no encontrada" },
        { status: 404 }
      );
    }

    // Contar productos de la tienda
    const productosCount = await Product.countDocuments({ tiendaId: id });

    // Por ahora, estadísticas básicas (se pueden expandir con modelo de Pedidos)
    const stats = {
      totalVentas: tienda.productosVendidos * 100000 || 0, // Placeholder
      totalPedidos: 0, // Se implementará con modelo de Pedidos
      productosVendidos: tienda.productosVendidos || 0,
      alcance: productosCount * 10 || 0, // Placeholder
    };

    return NextResponse.json(
      { success: true, stats },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener estadísticas",
      },
      { status: 500 }
    );
  }
}

