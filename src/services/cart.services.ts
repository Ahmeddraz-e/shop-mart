"use server"
import { getUserToken } from "../lib/auth"

export async function addToCart(productId: string) {
    const token = await getUserToken()
    if (!token) {
        throw new Error("Unauthorized")
    }
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "POST",
        body: JSON.stringify({ productId: productId }),
        headers: {
            token: token,
            "Content-Type": "application/json",

        }
    })
    const data = await response.json()
    return data
}

export async function getCart() {
    const token = await getUserToken()
    if (!token) {
        return { status: "fail", message: "Unauthorized" }
    }
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "GET",
        headers: {
            token: token,
            "Content-Type": "application/json",
        }
    })
    const data = await response.json()
    return data
}

export async function deleteItem(productId: string) {
    const token = await getUserToken()
    if (!token) {
        throw new Error("Unauthorized")
    }
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
        method: "DELETE",
        headers: {
            token: token,
            "Content-Type": "application/json",
        }
    })
    const data = await response.json()
    return data
}

export async function updateItemCount(productId: string, count: number) {
    const token = await getUserToken()
    if (!token) {
        throw new Error("Unauthorized")
    }
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ count: count }),
        headers: {
            token: token,
            "Content-Type": "application/json",
        }
    })
    const data = await response.json()
    return data
}

export async function clearCart() {
    const token = await getUserToken()
    if (!token) {
        throw new Error("Unauthorized")
    }
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "DELETE",
        headers: {
            token: token,
            "Content-Type": "application/json",
        }
    })
    const data = await response.json()
    return data
}