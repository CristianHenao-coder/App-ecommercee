import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Completar perfil de usuario de Google
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, phone, password } = await request.json();

    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Actualizar usuario existente
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.name = name;
      existingUser.phone = phone;
      existingUser.password = hashedPassword;
      await existingUser.save();

      return NextResponse.json({
        message: "Perfil actualizado",
        user: {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role,
        },
      });
    }

    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "client",
    });

    await newUser.save();

    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error completing profile:", error);
    return NextResponse.json(
      { message: "Error del servidor" },
      { status: 500 }
    );
  }
}
