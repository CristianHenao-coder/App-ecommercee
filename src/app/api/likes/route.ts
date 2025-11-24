import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Like from "@/models/Like";

export async function GET(request: Request) {
  try {
    await dbConnection();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (productId) {
      const count = await Like.countDocuments({ productId });
      return NextResponse.json({ success: true, count }, { status: 200 });
    }

    const userId = searchParams.get("userId");
    if (userId) {
      const likes = await Like.find({ userId });
      return NextResponse.json({ success: true, likes }, { status: 200 });
    }

    return NextResponse.json(
      { success: false, message: "productId o userId requerido" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("Error al obtener likes:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al obtener likes";
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

    const like = await Like.create({ userId, productId });
    return NextResponse.json({ success: true, like }, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: number })?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Ya le diste like" },
        { status: 400 }
      );
    }
    console.error("Error al dar like:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al dar like";
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

    await Like.findOneAndDelete({ userId, productId });
    return NextResponse.json(
      { success: true, message: "Like eliminado" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error al eliminar like:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al eliminar like";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

