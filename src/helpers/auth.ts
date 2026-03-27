import dbConnect from "@/lib/db";
import User from "@/models/User";

interface UserRole {
    role?: string;
}

export async function checkAdmin(email: string): Promise<boolean> {
    try {
        await dbConnect();
        const user = await User.findOne({ email }).select("role").lean<UserRole>();
        return user?.role === "admin";
    } catch (error) {
        console.error("Error checking admin:", error);
        return false;
    }
}

export async function requireAdmin(request: Request): Promise<{ isAdmin: boolean; email?: string }> {
    const email = request.headers.get("x-user-email");
    
    if (!email) {
        return { isAdmin: false };
    }

    const isAdmin = await checkAdmin(email);
    return { isAdmin, email };
}

