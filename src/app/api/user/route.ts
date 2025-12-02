import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import * as yup from "yup";
import { registerSchema } from "@/schema/auth.schema";
import { sendEmail } from "@/helpers/email";
import { welcomeEmailTemplate } from "@/utils/emailTemplates";

export async function POST(request: Request) {
  try {
    await dbConnection();
    const body = await request.json();

    // Validate with Yup on BACKEND
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
      avatarUrl: newUser.avatarUrl,
      phone: newUser.phone,
      role: newUser.role,
      tiendaId: newUser.tiendaId,
    };

    // Send welcome email (non-blocking)
    sendEmail(
      newUser.email,
      "¡Bienvenido a LookGod! ",
      welcomeEmailTemplate(newUser.name)
    ).catch((error) => {
      console.error("Error sending welcome email (non-critical):", error);
      // Don't fail registration if email fails
    });

    return NextResponse.json(
      {
        success: true,
        message: "Usuario registrado correctamente",
        data: userSafe,
      },
      { status: 201 }
    );
  } catch (error) {
    // If Yup fails, return validation message directly
    if (error instanceof yup.ValidationError) {
      const firstError = error.errors[0] ?? "Invalid data";
      return NextResponse.json(
        {
          success: false,
          message: firstError, // "Please enter a valid phone number"
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
