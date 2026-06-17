import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

// Obtener usuario actual por email
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const email = request.nextUrl.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
