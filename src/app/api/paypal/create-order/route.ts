import { NextResponse } from "next/server";
import axios from "axios";

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

        const { cart } = await request.json();

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty or invalid" },
                { status: 400 }
            );
        }

        // Calculate total from cart items
        const total = cart.reduce((acc: number, item: any) => {
            const price = item.precio || 0;
            const quantity = item.quantity || 0;
            return acc + (price * quantity);
        }, 0);

        if (total <= 0) {
            return NextResponse.json(
                { error: "Invalid total amount" },
                { status: 400 }
            );
        }

        const accessToken = await generateAccessToken();

        const order = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders`,
            {
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: total.toFixed(2),
                        },
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return NextResponse.json(order.data);
    } catch (error: any) {
        console.error("Error creating PayPal order:", error);
        const errorMessage = error?.response?.data?.message || error?.message || "Error creating order";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
