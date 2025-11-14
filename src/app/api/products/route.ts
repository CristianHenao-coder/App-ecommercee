import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnection();
    //lean() para evitar problemas de serialización
    const products = await Product.find().lean();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    return NextResponse.json(
      { success: false, message: "Error al cargar productos" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  await dbConnection();
  const body = await request.json();
  // Esperar body: { name, descripcion, precio, categoria, image, ownerId, brandName }
  const newProduct = await Product.create(body);
  return NextResponse.json(newProduct, { status: 201 });
}
