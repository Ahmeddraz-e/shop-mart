"use server"
import { getUserToken } from "@/lib/auth";

export async function createCashOrder(cartId: string, shippingAddress: { details: string; phone: string; city: string }) {
    const token = await getUserToken();
    if (!token) return { status: "fail", message: "Unauthorized" };

    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`, {
        method: "POST",
        headers: {
            token: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ shippingAddress }),
    });

    const data = await res.json();
    return data;
}

export async function createCheckoutSession(cartId: string, shippingAddress: { details: string; phone: string; city: string }) {
    const token = await getUserToken();
    if (!token) return { status: "fail", message: "Unauthorized" };

    // Note: The API likely takes a return_url query param or similar, but for now we follow the standard structure
    // Based on common Route Misr API usage, the url is usually something like:
    // /api/v1/orders/checkout-session/{cartId}?url=http://localhost:3000
    const returnUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${returnUrl}`, {
        method: "POST",
        headers: {
            token: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ shippingAddress }),
    });

    const data = await res.json();
    return data;
}

export async function getUserOrders(userId: string) {
    // Orders are usually public or require token depending on implementation. 
    // Assuming it might need a token if it's user specific, but the API endpoint often just takes userId.
    // We will pass token just in case if we have it, but it might not be strictly enforced for GET in some APIs.
    // However, often /api/v1/orders/user/:userId is open or user-protected.
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`, {
        method: "GET",
        next: { revalidate: 0 } // No cache for orders
    });

    if (!res.ok) {
        return [];
    }

    const data = await res.json();
    return data;
}
