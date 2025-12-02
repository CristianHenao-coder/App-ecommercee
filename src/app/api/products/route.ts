// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import * as yup from "yup";
import { productSchema } from "@/schema/product.schema";

export const runtime = "nodejs"; // Force Node.js environment for Buffer/Cloudinary

// GET /api/products
export async function GET() {
  try {
    await dbConnection();
    const products = await Product.find().lean();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Error loading products" },
      { status: 500 }
    );
  }
}

// POST /api/products (create product) - ADMIN ONLY
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

    // MODE 1: Pure JSON (legacy compatibility)
    if (contentType.includes("application/json")) {
      const body = await request.json(); // { name, descripcion, precio, categoria, image, ... }

      await productSchema.validate(body, { abortEarly: false });

      const newProduct = await Product.create(body);
      return NextResponse.json(newProduct, { status: 201 });
    }

    // MODE 2: multipart/form-data (for image upload from Dashboard)
    const formData = await request.formData();

    // Multilingual fields
    const name_es = formData.get("name_es") as string | null;
    const name_en = formData.get("name_en") as string | null;
    const descripcion_es = formData.get("descripcion_es") as string | null;
    const descripcion_en = formData.get("descripcion_en") as string | null;

    // Legacy fields (for backward compatibility)
    const name = formData.get("name") as string | null;
    const descripcion = formData.get("descripcion") as string | null;
    const precio = Number(formData.get("precio"));
    // Normalize category to lowercase for consistency
    const categoria = ((formData.get("categoria") as string) || "").toLowerCase();
    const stock = formData.get("stock")
      ? Number(formData.get("stock"))
      : undefined;
    const imageFile = formData.get("image") as File | null;

    const finalName = name_es || name || "";
    const finalDescripcion = descripcion_es || descripcion || "";

    // Validate with Yup
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

    let imageUrl = "";

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

    const newProduct = await Product.create({
      // multilingual
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
      // createdBy can be ignored if ObjectId causes issues
      image: imageUrl,
    });

    return NextResponse.json(newProduct, { status: 201 });
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

    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: "Error creating product" },
      { status: 500 }
    );
  }
}
