import { z } from "zod"

export const registerSchema = z.object({
    name: z.string().nonempty("Name is required").min(3, "Name must be at least 3 characters long"),
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    password: z.string().nonempty("Password is required")
        .min(6, "Password must be at least 6 characters long")
        .regex(/[@$!%*?&]/, "Password must contain a special character (e.g., @, $, !, %, *, ?, &)"),
    rePassword: z.string().nonempty("Confirm Password is required").min(6, "Password must be at least 6 characters long"),
    phone: z.string().nonempty("Phone Number is required").regex(/^01[0125][0-9]{8}$/, "Phone number must be at least 11 characters long")
}).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
})





export type RegisterSchemaType = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters long"),
})

export type LoginSchemaType = z.infer<typeof loginSchema>