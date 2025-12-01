// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Product from "@/models/Product";
import * as yup from "yup";
import { productSchema } from "@/schema/product.schema";
import { uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

//  Actualizar producto (PUT /api/products/:id)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    let updateData: any = {};

    if (contentType.includes("application/json")) {
      // Modo JSON
      const body = await request.json();
      await productSchema.validate(body, { abortEarly: false });
      updateData = body;
    } else {
      // Modo multipart/form-data
      const formData = await request.formData();

      const name_es = (formData.get("name_es") as string) || "";
      const name_en = (formData.get("name_en") as string) || "";
      const descripcion_es = (formData.get("descripcion_es") as string) || "";
      const descripcion_en = (formData.get("descripcion_en") as string) || "";

      const nameLegacy = (formData.get("name") as string) || "";
      const descripcionLegacy = (formData.get("descripcion") as string) || "";

      const precio = Number(formData.get("precio"));
      const categoria = (formData.get("categoria") as string) || "";
      const stock = formData.get("stock")
        ? Number(formData.get("stock"))
        : undefined;

      const imageFile = formData.get("image") as File | null;

      const finalName = name_es || nameLegacy;
      const finalDescripcion = descripcion_es || descripcionLegacy;

      await productSchema.validate(
        { name: finalName, descripcion: finalDescripcion, precio, categoria, stock },
        { abortEarly: false }
      );

      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      updateData = {
        name_es: name_es || undefined,
        name_en: name_en || undefined,
        descripcion_es: descripcion_es || undefined,
        descripcion_en: descripcion_en || undefined,
        name: finalName,
        descripcion: finalDescripcion,
        precio,
        categoria,
        stock,
      };

      if (imageUrl) {
        updateData.image = imageUrl;
      }
    }

    const updated = await Product.findByIdAndUpdate(params.id, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error("Errores de validación producto:", error.errors);
      return NextResponse.json(
        {
          success: false,
          message: "Errores de validación",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
}

//  Eliminar producto (DELETE /api/products/:id)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const deleted = await Product.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Product deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { success: false, message: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}
