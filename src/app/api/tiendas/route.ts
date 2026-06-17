import { NextResponse } from "next/server";
import Tienda from "@/models/Tiendas";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const tienda = await Tienda.create(body);
  return NextResponse.json(tienda);
}

export async function GET() {
  await connectDB();
  const tiendas = await Tienda.find();
  return NextResponse.json(tiendas);
}
