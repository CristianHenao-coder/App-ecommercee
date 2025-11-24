import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Favorite from "@/models/Favorite";

export async function GET(request: Request) {
  try {
    await dbConnection();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId requerido" },
        { status: 400 }
      );
    }

    const favorites = await Favorite.find({ userId }).populate("productId");
    return NextResponse.json({ success: true, favorites }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error al obtener favoritos:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al obtener favoritos";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnection();
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "userId y productId requeridos" },
        { status: 400 }
      );
    }

    const favorite = await Favorite.create({ userId, productId });
    return NextResponse.json(
      { success: true, favorite },
      { status: 201 }
    );
  } catch (error: unknown) {
    if ((error as { code?: number })?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Ya está en favoritos" },
        { status: 400 }
      );
    }
    console.error("Error al agregar favorito:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al agregar favorito";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnection();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: "userId y productId requeridos" },
        { status: 400 }
      );
    }

    await Favorite.findOneAndDelete({ userId, productId });
    return NextResponse.json(
      { success: true, message: "Favorito eliminado" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error al eliminar favorito:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al eliminar favorito";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

