import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Product from "@/models/Product";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnection();
    const { id } = params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Producto eliminado correctamente" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error al eliminar producto" },
      { status: 500 }
    );
  }
}

