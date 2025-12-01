import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import * as yup from "yup";
import { loginSchema } from "@/schema/auth.schema";
import type { IUser } from "@/interfaces/interfaces";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validación con Yup
    const validatedData = await loginSchema.validate(body, { abortEarly: false });
    const { email, password } = validatedData;

    // Buscar usuario
    const user = await User.findOne({ email }).lean<IUser>();

    if (!user) {
      return NextResponse.json(
        { message: "El usuario no existe" },
        { status: 404 }
      );
    }

    // Comparar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Contraseña incorrecta" },
        { status: 400 }
      );
    }

    // Ocultar contraseña antes de responder
    const { password: _password, ...userSafe } = user;

    return NextResponse.json(
      { message: "Login exitoso", user: userSafe },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Error desconocido" },
      { status: 500 }
    );
  }
}
