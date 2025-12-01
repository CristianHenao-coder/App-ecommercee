import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const email = formData.get("email") as string;

        if (!file || !email) {
            return NextResponse.json(
                { message: "File and email are required" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "ecommerce-users" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        const avatarUrl = result.secure_url;

        const user = await User.findOneAndUpdate(
            { email },
            { avatarUrl },
            { new: true }
        ).select("-password");

        return NextResponse.json({ avatarUrl, user });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { message: "Error uploading image" },
            { status: 500 }
        );
    }
}
