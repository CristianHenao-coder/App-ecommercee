import { NextResponse } from "next/server";

export async function GET() {
    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
    
    if (!clientId) {
        return NextResponse.json(
            { error: "PayPal client ID not configured" },
            { status: 500 }
        );
    }

    return NextResponse.json({ clientId });
}

