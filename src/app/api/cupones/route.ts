import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cupon from "@/models/Cupon";

// Validar un cupón
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { codigo } = await request.json();

    if (!codigo) {
      return NextResponse.json({ error: "Código requerido" }, { status: 400 });
    }

    const cupon = await Cupon.findOne({
      codigo: codigo.toUpperCase(),
      activo: true,
    });

    if (!cupon) {
      return NextResponse.json({ error: "Cupón no válido" }, { status: 404 });
    }

    // Verificar fecha de expiración
    if (cupon.fechaExpiracion && new Date() > cupon.fechaExpiracion) {
      return NextResponse.json({ error: "Cupón expirado" }, { status: 400 });
    }

    // Verificar uso máximo
    if (cupon.usoActual >= cupon.usoMaximo) {
      return NextResponse.json({ error: "Cupón agotado" }, { status: 400 });
    }

    return NextResponse.json({
      valido: true,
      cupon: {
        codigo: cupon.codigo,
        descuento: cupon.descuento,
        tipo: cupon.tipo,
      },
    });
  } catch (error) {
    console.error("Error validando cupón:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

// Obtener todos los cupones (admin)
export async function GET() {
  try {
    await connectDB();
    const cupones = await Cupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(cupones);
  } catch (error) {
    console.error("Error obteniendo cupones:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

// Crear cupón (admin)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    const cupon = new Cupon({
      ...data,
      codigo: data.codigo.toUpperCase(),
    });

    await cupon.save();
    return NextResponse.json(cupon, { status: 201 });
  } catch (error: any) {
    console.error("Error creando cupón:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "El código ya existe" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
