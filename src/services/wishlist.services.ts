"use server"
import { getUserToken } from "../lib/auth"

export async function addToWishlist(productId: string) {
    const token = await getUserToken()
    console.log("Wishlist Action - Token:", token ? "Present" : "Missing");
    if (!token) {
        return { status: "fail", message: "Unauthorized" }
    }
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId }),
        headers: {
            token: token,
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()
    console.log("Wishlist API Response:", data);
    return data
}

export async function removeFromWishlist(productId: string) {
    const token = await getUserToken()
    if (!token) {
        return { status: "fail", message: "Unauthorized" }
    }
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
            token: token,
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()
    return data
}

export async function getWishlist() {
    const token = await getUserToken()
    if (!token) {
        return { status: "fail", message: "Unauthorized" }
    }
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
        method: "GET",
        headers: {
            token: token,
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()
    return data
}
