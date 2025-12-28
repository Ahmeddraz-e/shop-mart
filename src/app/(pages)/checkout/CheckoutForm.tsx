"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, CreditCard, Banknote, Truck, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createCashOrder, createCheckoutSession } from '@/services/order.services'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import dynamic from 'next/dynamic'

// Dynamically import MapPicker to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import('@/components/ui/map-picker'), {
    ssr: false,
    loading: () => (
        <div className="h-[300px] w-full rounded-xl bg-muted flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
        </div>
    )
})

const formSchema = z.object({
    details: z.string().min(5, "Address details must be at least 5 characters"),
    phone: z.string().regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),
    city: z.string().min(2, "City name is too short"),
})

interface CheckoutFormProps {
    cartId: string
}

export default function CheckoutForm({ cartId }: CheckoutFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
    const [showMap, setShowMap] = useState(false)
    const router = useRouter()

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const handleLocationSelect = (location: string) => {
        const currentDetails = getValues('details') || '';
        // Split by the common prefix to replace existing location
        const cleanDetails = currentDetails.split(' | Location: ')[0];
        setValue('details', `${cleanDetails} | Location: ${location}`, { shouldValidate: true });
        toast.success("Coordinates updated in address details!");
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)

        try {
            if (paymentMethod === 'cash') {
                const res = await createCashOrder(cartId, values) // details already updated in form
                if (res.status === 'success') {
                    toast.success("Order placed successfully!")
                    router.push('/orders')
                } else {
                    toast.error("Failed to place order")
                }
            } else {
                const res = await createCheckoutSession(cartId, values) // details already updated in form
                if (res.status === 'success' && res.session.url) {
                    window.location.href = res.session.url
                } else {
                    toast.error(res.message || "Failed to initiate checkout")
                }
            }
        } catch (error) {
            console.error(error)
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl font-bold text-foreground">
                    Checkout
                </h1>
                <p className="text-lg text-muted-foreground">
                    Complete your order by providing your shipping details.
                </p>
            </div>

             <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="details" className="text-base font-semibold text-foreground">Address Details</Label>
                                <Input
                                    id="details"
                                    placeholder="Street address, building, floor..."
                                    {...register('details')}
                                    className={`h-12 border-input rounded-lg ${errors.details ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                />
                                {errors.details && <p className="text-sm text-red-500">{errors.details.message}</p>}
                            </div>

                            {/* Map Picker Toggle */}
                            <div className="space-y-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowMap(!showMap)}
                                    className="w-full h-12 flex items-center justify-center gap-2 border-input text-foreground hover:bg-muted rounded-lg text-base font-semibold"
                                >
                                    <MapPin className="w-5 h-5" />
                                    {showMap ? "Hide Map" : "Pin Location on Map"}
                                </Button>

                                {showMap && (
                                    <div className="mt-4 animate-in fade-in zoom-in duration-300">
                                        <MapPicker onLocationSelect={handleLocationSelect} />
                                        <p className="text-xs text-muted-foreground mt-2 text-center">
                                            Drag the marker to your precise location. We&apos;ll send this location with your order.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-base font-semibold text-foreground">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="01xxxxxxxxx"
                                        {...register('phone')}
                                        className={`h-12 border-input rounded-lg ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-base font-semibold text-foreground">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="Cairo, Alexandria..."
                                        {...register('city')}
                                        className={`h-12 border-input rounded-lg ${errors.city ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                    {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <Label className="text-lg font-bold text-foreground">Payment Method</Label>
                            <RadioGroup defaultValue="cash" onValueChange={(val: string) => setPaymentMethod(val as 'cash' | 'card')} className="grid grid-cols-2 gap-4">
                                <div>
                                    <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                                    <Label
                                        htmlFor="cash"
                                        className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-border text-foreground bg-card hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary cursor-pointer transition-all"
                                    >
                                        <Banknote className="mb-3 h-8 w-8 text-green-600" />
                                        <span className="font-semibold text-base">Cash on Delivery</span>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                    <Label
                                        htmlFor="card"
                                        className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-border text-foreground bg-card hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary cursor-pointer transition-all"
                                    >
                                        <CreditCard className="mb-3 h-8 w-8 text-purple-600" />
                                        <span className="font-semibold text-base">Online Payment</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <Button type="submit" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white font-bold rounded-xl mt-8 shadow-none" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Truck className="w-5 h-5" />
                                    {paymentMethod === 'cash' ? 'Place Order' : 'Proceed to Payment'}
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
