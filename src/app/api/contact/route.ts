import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnection from "@/lib/db";
import Contact from "@/models/Contact";
import { userConfirmationTemplate } from "@/utils/emailTemplates";

export async function POST(request: Request) {
  try {
    await dbConnection();
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    //  1. Guarda el mensaje en MongoDB
    await Contact.create({ name, email, message });

    //  2. Configura transporte de correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //  3. Correo para ti (administrador)
    const adminMail = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Nuevo mensaje de ${name}`,
      text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`,
    };

    //  4. Correo automático al usuario
    const userMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Gracias por contactarte con LookGood 💚",
      html: userConfirmationTemplate(name),
    };

    // ✅ 5. Envía ambos correos
    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    return NextResponse.json(
      { success: true, message: "Mensaje enviado y guardado correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en POST /api/contact:", error);
    return NextResponse.json(
      { success: false, message: "Error al enviar el correo." },
      { status: 500 }
    );
  }
}
