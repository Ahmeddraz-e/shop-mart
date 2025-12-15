import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function getUserToken() {
    const session = await getServerSession(authOptions)
    return session?.token
}