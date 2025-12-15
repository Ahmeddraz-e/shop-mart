import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export async function getUserToken() {
    const cookieStore = await cookies()
    const decodedToken = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value
    const token = await decode({ token: decodedToken, secret: process.env.NEXTAUTH_SECRET! })

    return token?.token
}