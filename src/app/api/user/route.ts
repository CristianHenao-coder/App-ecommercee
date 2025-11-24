import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import * as yup from "yup";
import { registerSchema } from "@/schema/register.schema";

export async function POST(request: Request) {
  try {
    await dbConnection();
    const body = await request.json();

    // Validación con Yup en el BACKEND
    const { name, email, password, phone, role } =
      await registerSchema.validate(body, { abortEarly: false });

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Este correo ya está registrado." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role === "client" ? "cliente" : role || undefined,
    });

    const userSafe = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      phone: newUser.phone,
      role: newUser.role,
      tiendaId: newUser.tiendaId,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Usuario registrado correctamente",
        data: userSafe,
      },
      { status: 201 }
    );
  } catch (error) {
    //  Si falla Yup, devolvemos directamente el mensaje de validación
    if (error instanceof yup.ValidationError) {
      const firstError = error.errors[0] ?? "Datos inválidos";
      return NextResponse.json(
        {
          success: false,
          message: firstError,
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Error en POST /api/user:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnection();
    const body = await request.json();
    const { _id, name, phone, avatar } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, phone, avatar },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Perfil actualizado correctamente",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error en PUT /api/user:", error);
    const errorMessage = error instanceof Error ? error.message : "Error al actualizar perfil";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
