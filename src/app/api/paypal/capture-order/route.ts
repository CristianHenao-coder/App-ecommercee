import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE = "sandbox" } = process.env;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    console.warn("PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env");
}

const PAYPAL_API = PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

const generateAccessToken = async () => {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("PayPal credentials not configured");
    }
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, "grant_type=client_credentials", {
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    return response.data.access_token;
};

export async function POST(request: Request) {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            return NextResponse.json(
                { error: "PayPal not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in environment variables." },
                { status: 500 }
            );
        }

        const { orderID, email, items } = await request.json();

        if (!orderID) {
            return NextResponse.json({ error: "Order ID required" }, { status: 400 });
        }

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const accessToken = await generateAccessToken();

        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const captureData = response.data;

        if (captureData.status === "COMPLETED") {
            await dbConnect();

            const user = await User.findOne({ email });
            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            // Clear user cart
            await User.findOneAndUpdate({ email }, { cart: [] });

            // Create Order document with items
            const orderItems = (items || []).map((item: { productId: string; quantity: number; price: number }) => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
            }));

            await Order.create({
                user: user._id,
                items: orderItems,
                total: parseFloat(captureData.purchase_units[0].payments.captures[0].amount.value),
                status: "paid",
                paymentId: captureData.id,
                paymentStatus: captureData.status,
            });

            return NextResponse.json({ status: "COMPLETED", data: captureData });
        }

        return NextResponse.json({ status: captureData.status }, { status: 400 });
    } catch (error: any) {
        console.error("Error capturing PayPal order:", error);
        const errorMessage = error?.response?.data?.message || error?.message || "Error capturing order";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
