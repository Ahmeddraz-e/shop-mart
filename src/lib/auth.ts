import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export async function getUserToken() {
    const decodedToken = (await cookies()).get("next-auth.session-token")?.value
    const token = await decode({ token: decodedToken, secret: process.env.AUTH_SECRET! })
    
    return token?.token
}