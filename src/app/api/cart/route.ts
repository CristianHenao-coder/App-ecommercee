import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

interface UserCart {
    cart?: Array<{ productId: string; quantity: number }>;
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ message: "Email required" }, { status: 400 });
        }

        const user = await User.findOne({ email }).select("cart").lean<UserCart>();

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ cart: user.cart || [] });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json({ message: "Error fetching cart" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { email, items } = body;

        if (!email) {
            return NextResponse.json({ message: "Email required" }, { status: 400 });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { cart: items },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Cart synced", cart: user.cart });
    } catch (error) {
        console.error("Error syncing cart:", error);
        return NextResponse.json({ message: "Error syncing cart" }, { status: 500 });
    }
}
