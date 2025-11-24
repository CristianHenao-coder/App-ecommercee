import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Tienda from "@/models/Tiendas";
import Wallet from "@/models/Wallet";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnection();
    const { id } = params;

    const tienda = await Tienda.findById(id).lean();

    if (!tienda) {
      return NextResponse.json(
        { success: false, message: "Tienda no encontrada" },
        { status: 404 }
      );
    }

    // Buscar o crear wallet
    let wallet = await Wallet.findOne({ tiendaId: id });
    if (!wallet) {
      wallet = await Wallet.create({ tiendaId: id, balance: 0, movements: [] });
    }

    return NextResponse.json(
      {
        success: true,
        balance: wallet.balance,
        movements: wallet.movements || [],
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error al obtener wallet:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al obtener wallet";
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

