
import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import * as yup from "yup";
import { productSchema } from "@/schema/product.schema";

export const runtime = "nodejs";

// PUT /api/products/:id (update product)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
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

    // Handle both Promise and direct params for Next.js compatibility
    const resolvedParams = params instanceof Promise ? await params : params;
    const productId = resolvedParams.id;

    const contentType = request.headers.get("content-type") || "";
    let updateData: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      // JSON mode
      const body = await request.json();
      await productSchema.validate(body, { abortEarly: false });
      updateData = body;
    } else {
      // multipart/form-data mode (from EditProductModal)
      const formData = await request.formData();

      const name_es = formData.get("name_es") as string | null;
      const name_en = formData.get("name_en") as string | null;
      const descripcion_es = formData.get("descripcion_es") as string | null;
      const descripcion_en = formData.get("descripcion_en") as string | null;

      const name = formData.get("name") as string | null;
      const descripcion = formData.get("descripcion") as string | null;
      const precio = Number(formData.get("precio"));
      // Normalize category to lowercase
      const categoria = ((formData.get("categoria") as string) || "").toLowerCase();
      const stock = formData.get("stock")
        ? Number(formData.get("stock"))
        : undefined;

      const imageFile = formData.get("image") as File | null;

      const finalName = name_es || name || "";
      const finalDescripcion = descripcion_es || descripcion || "";

      await productSchema.validate(
        {
          name: finalName,
          descripcion: finalDescripcion,
          precio,
          categoria,
          stock,
        },
        { abortEarly: false }
      );

      let imageUrl: string | undefined;
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        imageUrl = await new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: process.env.CLOUDINARY_FOLDER ?? "lookgod/products",
              transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
            },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result.secure_url);
            }
          );
          uploadStream.end(buffer);
        });
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

    const updated = await Product.findByIdAndUpdate(productId, updateData, {
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
      console.error("Product validation errors:", error.errors);
      return NextResponse.json(
        {
          success: false,
          message: "Validation errors",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Error updating product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id (delete product)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
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

    // Handle both Promise and direct params for Next.js compatibility
    const resolvedParams = params instanceof Promise ? await params : params;
    const productId = resolvedParams.id;

    const deleted = await Product.findByIdAndDelete(productId);

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
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting product" },
      { status: 500 }
    );
  }
}
