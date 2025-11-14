import { NextResponse } from "next/server";
import ProductTienda from "@/models/ProductTienda";
import connectDB from "@/lib/db";

export async function GET() {
  await connectDB();
  const products = await ProductTienda.find().populate("tiendaId");
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const product = await ProductTienda.create(body);
  return NextResponse.json(product);
}
