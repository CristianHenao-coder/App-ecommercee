import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnection();
    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    return NextResponse.json(
      { success: false, message: "Error al cargar productos" },
      { status: 500 }
    );
  }
}
