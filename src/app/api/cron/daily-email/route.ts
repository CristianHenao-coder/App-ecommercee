import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/helpers/email";
import { dailyPromoEmailTemplate } from "@/utils/emailTemplates";

/**
 * Cron job endpoint for sending daily promotional emails
 * Can be called by external cron services (e.g., cron-job.org, Vercel Cron)
 * 
 * Example cron setup:
 * - URL: https://yourdomain.com/api/cron/daily-email
 * - Method: GET
 * - Schedule: Daily at 9 AM
 */
export async function GET(request: Request) {
    try {
        // Optional: Add authentication header check for security
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnection();

        // Get all users (in production, you might want to filter by preferences)
        const users = await User.find({}).select("name email").lean();

        if (users.length === 0) {
            return NextResponse.json({ message: "No users found", count: 0 });
        }

        let successCount = 0;
        let errorCount = 0;

        // Send emails to all users
        for (const user of users) {
            if (!user.email) continue;

            const result = await sendEmail(
                user.email,
                "Ofertas Especiales de LookGod 🏍️",
                dailyPromoEmailTemplate(user.name || "Cliente")
            );

            if (result.success) {
                successCount++;
            } else {
                errorCount++;
                console.error(`Failed to send email to ${user.email}:`, result.error);
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return NextResponse.json({
            message: "Daily emails processed",
            total: users.length,
            success: successCount,
            errors: errorCount,
        });
    } catch (error: any) {
        console.error("Error in daily email cron job:", error);
        return NextResponse.json(
            { error: "Error processing daily emails", message: error.message },
            { status: 500 }
        );
    }
}
