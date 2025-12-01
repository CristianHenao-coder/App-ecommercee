import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Product from "@/models/Product";
import * as yup from "yup";
import { productSchema } from "@/schema/product.schema";
import { uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

// Obtener productos
export async function GET() {
  try {
    await dbConnection();
    const products = await Product.find().lean();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { success: false, message: "Error al cargar productos" },
      { status: 500 }
    );
  }
}

// Crear producto (JSON o FormData + imagen) - Solo admin
export async function POST(request: Request) {
  try {
    const { requireAdmin } = await import("@/helpers/auth");
    const { isAdmin } = await requireAdmin(request);

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await dbConnection();

    const contentType = request.headers.get("content-type") || "";

    // MODO 1: JSON puro (compatibilidad)
    if (contentType.includes("application/json")) {
      const body = await request.json(); // { name, descripcion, precio, categoria, image, ... }

      await productSchema.validate(body, { abortEarly: false });

      const newProduct = await Product.create(body);
      return NextResponse.json(newProduct, { status: 201 });
    }

    // MODO 2: multipart/form-data (imagen desde el frontend)
    const formData = await request.formData();

    // Campos multiidioma
    const name_es = (formData.get("name_es") as string) || "";
    const name_en = (formData.get("name_en") as string) || "";
    const descripcion_es = (formData.get("descripcion_es") as string) || "";
    const descripcion_en = (formData.get("descripcion_en") as string) || "";

    // Legacy
    const nameLegacy = (formData.get("name") as string) || "";
    const descripcionLegacy = (formData.get("descripcion") as string) || "";

    const precio = Number(formData.get("precio"));
    const categoria = (formData.get("categoria") as string) || "";
    const stock = formData.get("stock")
      ? Number(formData.get("stock"))
      : undefined;
    const createdBy = (formData.get("createdBy") as string) || undefined;
    const imageFile = formData.get("image") as File | null;

    const finalName = name_es || nameLegacy;
    const finalDescripcion = descripcion_es || descripcionLegacy;

    await productSchema.validate(
      {
        name: finalName,
        descripcion: finalDescripcion,
        precio,
        categoria,
        stock,
        createdBy,
      },
      { abortEarly: false }
    );

    let imageUrl: string | undefined;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const newProduct = await Product.create({
      // multiidioma
      name_es: name_es || undefined,
      name_en: name_en || undefined,
      descripcion_es: descripcion_es || undefined,
      descripcion_en: descripcion_en || undefined,
      // legacy
      name: finalName,
      descripcion: finalDescripcion,
      precio,
      categoria,
      stock,
      createdBy,
      image: imageUrl, // no guardamos "" si no hay imagen
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
