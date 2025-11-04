import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Contact from "@/models/User";
import User from "@/models/User";


export async function GET() {
  try {
    await dbConnection();
    const users = await Contact.find();

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: "No hay usuarios registrados." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: users.length,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en GET /api/contact:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
};



export async function POST(request: Request) {
  try {
    await dbConnection();
    const { name, email, password, phone, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    
    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "client", 
    });


    
    return NextResponse.json(
      { success: true, message: "Usuario registrado correctamente", data: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error en POST /api/user:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// 👉 Login
export async function PUT(request: Request) {
  try {
    await dbConnection();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Login exitoso", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en PUT /api/user:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}