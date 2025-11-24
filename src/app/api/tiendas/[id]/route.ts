import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Tienda from "@/models/Tiendas";

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

    return NextResponse.json(
      { success: true, tienda },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al obtener tienda:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error al obtener tienda" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnection();
    const { id } = params;
    const body = await request.json();

    const updatedTienda = await Tienda.findByIdAndUpdate(id, body, {
      new: true,
    }).lean();

    if (!updatedTienda) {
      return NextResponse.json(
        { success: false, message: "Tienda no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Tienda actualizada correctamente",
        tienda: updatedTienda,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al actualizar tienda:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al actualizar tienda",
      },
      { status: 500 }
    );
  }
}

