
import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import * as yup from "yup";
import { productSchema } from "@/schema/product.schema"

export const runtime = "nodejs"; // aseguramos entorno Node para Cloudinary


export async function GET(request: Request) {
  try {
    await dbConnection();
    const { searchParams } = new URL(request.url);
    const tiendaId = searchParams.get("tiendaId");

    let query: any = {};
    if (tiendaId) {
      query.tiendaId = tiendaId;
    }

    const products = await Product.find(query).lean();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { success: false, message: "Error al cargar productos" },
      { status: 500 }
    );
  }
}

// Crear producto (JSON o FormData + imagen)
export async function POST(request: Request) {
  try {
    await dbConnection();

    const contentType = request.headers.get("content-type") || "";

    // MODO 1: JSON puro (compatibilidad con lo que ya tenías)
    if (contentType.includes("application/json")) {
      const body = await request.json(); // { name, descripcion, precio, categoria, image, ... }

      await productSchema.validate(body, { abortEarly: false });

      const newProduct = await Product.create(body);
      return NextResponse.json(newProduct, { status: 201 });
    }

    // MODO 2: multipart/form-data (para subir imagen desde el frontend)
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const descripcion = formData.get("descripcion") as string;
    const precio = Number(formData.get("precio"));
    const categoria = formData.get("categoria") as string;
    const stock = formData.get("stock")
      ? Number(formData.get("stock"))
      : undefined;
    const createdBy = formData.get("createdBy") as string | null;
    const tiendaId = formData.get("tiendaId") as string | null;
    const imageFile = formData.get("image") as File | null;

    // Validar con Yup usando los mismos campos que el modelo
    await productSchema.validate(
      { name, descripcion, precio, categoria, stock, createdBy: createdBy || undefined },
      { abortEarly: false }
    );

    let imageUrl = "";

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      imageUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "lookgod/products" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    }

    const newProduct = await Product.create({
      name,
      descripcion,
      precio,
      categoria,
      stock,
      createdBy: createdBy || undefined,
      tiendaId: tiendaId || undefined,
      image: imageUrl,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error("Errores de validación producto:", error.errors);
      return NextResponse.json(
        { success: false, message: "Errores de validación", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { success: false, message: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
  