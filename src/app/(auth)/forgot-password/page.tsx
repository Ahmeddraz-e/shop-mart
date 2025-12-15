"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { forgotPassword, verifyResetCode, resetPassword } from '@/services/auth.services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Loader2, ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPassword() {
    const router = useRouter()
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [isLoading, setIsLoading] = useState(false)

    // Form States
    const [email, setEmail] = useState('')
    const [resetCode, setResetCode] = useState('')
    const [newPassword, setNewPassword] = useState('')

    async function handleSendCode(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await forgotPassword(email)
            if (response.statusMsg === 'success') {
                toast.success(response.message || "Reset code sent to your email", {
                    style: { backgroundColor: '#dc2626', color: 'white', borderColor: '#dc2626' }
                })
                setStep(2)
            } else {
                toast.error(response.message || "Failed to send code", {
                    style: { backgroundColor: '#dc2626', color: 'white', borderColor: '#dc2626' }
                })
            }
        } catch (error) {
            console.error("Forgot password error", error)
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleVerifyCode(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await verifyResetCode(resetCode)
            if (response.status === 'Success') {
                toast.success("Code verified successfully", {
                    style: { backgroundColor: '#dc2626', color: 'white', borderColor: '#dc2626' }
                })
                setStep(3)
            } else {
                toast.error(response.message || "Invalid or expired code", {
                    style: { backgroundColor: '#dc2626', color: 'white', borderColor: '#dc2626' }
                })
            }
        } catch (error) {
            console.error("Verify code error", error)
            toast.error("Failed to verify code")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleResetPassword(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await resetPassword(email, newPassword)
            // The API might return a token or just success message
            // Based on typical flow, we redirect to login
            if (response.token || response.message === 'success' || response.statusMsg === 'success') {
                toast.success("Password reset successfully", {
                    style: { backgroundColor: '#dc2626', color: 'white', borderColor: '#dc2626' }
                })
                router.push('/login')
            } else {
                toast.error(response.message || "Failed to reset password", {
                    style: { backgroundColor: '#dc2626', color: 'white', borderColor: '#dc2626' }
                })
            }
        } catch (error) {
            console.error("Reset password error", error)
            toast.error("Failed to reset password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md shadow-lg border-none bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                        {step === 1 && <Mail className="w-6 h-6 text-primary" />}
                        {step === 2 && <ShieldCheck className="w-6 h-6 text-primary" />}
                        {step === 3 && <KeyRound className="w-6 h-6 text-primary" />}
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Verify Code"}
                        {step === 3 && "Reset Password"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === 1 && "Enter your email to receive a reset code"}
                        {step === 2 && `Enter the code sent to ${email}`}
                        {step === 3 && "Create a new strong password"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <form onSubmit={handleSendCode} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-black text-white hover:bg-black/80" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Code"
                                )}
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Enter reset code"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    required
                                    className="bg-white text-center text-lg tracking-widest"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-black text-white hover:bg-black/80" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Code"
                                )}
                            </Button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Change Email
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="bg-white"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-black text-white hover:bg-black/80" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter>
                    <Link href="/login" className="w-full">
                        <Button variant="ghost" className="w-full gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
