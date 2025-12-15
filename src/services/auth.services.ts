import { RegisterSchemaType, LoginSchemaType } from "@/schema/auth.schema"

export async function registerUser(formData: RegisterSchemaType) {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signup", {
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    })
    const data = await response.json()
    return data
}

export async function loginUser(formData: LoginSchemaType) {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    })
    const data = await response.json()
    return data
}

export async function forgotPassword(email: string) {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", {
        body: JSON.stringify({ email }),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    })
    const data = await response.json()
    return data
}

export async function verifyResetCode(resetCode: string) {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode", {
        body: JSON.stringify({ resetCode: resetCode }),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    })
    const data = await response.json()
    return data
}

export async function resetPassword(email: string, newPassword: string) {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/resetPassword", {
        body: JSON.stringify({ email, newPassword }),
        headers: {
            "Content-Type": "application/json"
        },
        method: "PUT"
    })
    const data = await response.json()
    return data
}