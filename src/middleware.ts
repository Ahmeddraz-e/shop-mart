import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware( request: NextRequest) {
    const token = await getToken ({req: request})

    if(token) {
        return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/login', request.url))
}
export const config = {
    matcher: ['/products','/brand','/categories','/orders','/cart']
}