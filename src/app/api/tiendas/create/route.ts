import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Tienda from "@/models/Tiendas";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await dbConnection();
    const body = await request.json();
    const { ownerId } = body;

    if (!ownerId) {
      return NextResponse.json(
        { success: false, message: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await User.findById(ownerId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que el usuario no tenga ya una tienda
    if (user.tiendaId) {
      return NextResponse.json(
        { success: false, message: "Ya tienes una tienda creada" },
        { status: 400 }
      );
    }

    // Crear la tienda
    const nuevaTienda = await Tienda.create({
      ownerId: user._id,
      nombre: `${user.name}'s Store`,
      descripcion: "Mi tienda en LookGod",
      estado: "activa",
    });

    // Actualizar el usuario: cambiar rol y asociar tiendaId
    await User.findByIdAndUpdate(user._id, {
      role: "tienda",
      tiendaId: nuevaTienda._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tienda creada exitosamente",
        tienda: nuevaTienda,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error al crear tienda:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error al crear la tienda" },
      { status: 500 }
    );
  }
}

