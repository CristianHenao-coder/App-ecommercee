import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
    await dbConnect();

    // Try to get session from NextAuth
    const session = await getServerSession(authOptions);
.

    let email = session?.user?.email;

    if (!email) {
        const { searchParams } = new URL(request.url);
        email = searchParams.get("email") || undefined;
    }

    if (!email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PUT(request: Request) {
    await dbConnect();
    const body = await request.json();
    const { email, name, phone, avatarUrl } = body;

    if (!email) {
        return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
        { email },
        { name, phone, avatarUrl },
        { new: true }
    ).select("-password");

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
}
