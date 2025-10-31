import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email, nombre } = await req.json();

    await sendMail({
      to: email,
      subject: "Registro exitoso 🎉",
      html: `
        <h1>¡Hola ${nombre}!</h1>
        <p>Gracias por registrarte en nuestra tienda. ¡Tu cuenta fue creada exitosamente!</p>
        <p>Te esperamos en <a href="https://tuapp.com">tuapp.com</a></p>
      `,
    });

    return NextResponse.json({ success: true, message: "Correo enviado" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
