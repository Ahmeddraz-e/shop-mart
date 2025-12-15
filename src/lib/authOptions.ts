import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { jwtDecode } from "jwt-decode";

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/login"
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
                    body: JSON.stringify(credentials),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "POST"
                })
                const data = await response.json()

                if (data.message === "success") {
                    const decodedToken: { id: string } = jwtDecode(data.token);

                    return {
                        id: decodedToken.id,
                        user: data.user,
                        token: data.token
                    }
                } else {
                    throw new Error(data.message || "Something went wrong")
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user.user
                token.token = user.token
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user = token.user
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}

