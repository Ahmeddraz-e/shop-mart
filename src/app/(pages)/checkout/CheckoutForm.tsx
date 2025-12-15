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
        <div className="h-[300px] w-full rounded-xl bg-gray-100 flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
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
        <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center pb-8 border-b border-gray-100">
                <CardTitle className="text-3xl font-bold bg-clip-text text-transparent text-black">
                    Checkout
                </CardTitle>
                <CardDescription className="text-lg">
                    Complete your order by providing your shipping details.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="details">Address Details</Label>
                            <Input
                                id="details"
                                placeholder="Street address, building, floor..."
                                {...register('details')}
                                className={errors.details ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.details && <p className="text-sm text-red-500">{errors.details.message}</p>}
                        </div>

                        {/* Map Picker Toggle */}
                        <div className="space-y-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowMap(!showMap)}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <MapPin className="w-4 h-4" />
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
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="01xxxxxxxxx"
                                    {...register('phone')}
                                    className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    placeholder="Cairo, Alexandria..."
                                    {...register('city')}
                                    className={errors.city ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Label className="text-base font-semibold">Payment Method</Label>
                        <RadioGroup defaultValue="cash" onValueChange={(val: string) => setPaymentMethod(val as 'cash' | 'card')} className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                                <Label
                                    htmlFor="cash"
                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                >
                                    <Banknote className="mb-3 h-6 w-6 text-green-600" />
                                    Cash on Delivery
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                <Label
                                    htmlFor="card"
                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                >
                                    <CreditCard className="mb-3 h-6 w-6 text-purple-600" />
                                    Online Payment
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all font-semibold rounded-xl mt-6 shadow-lg shadow-purple-500/20" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
    )
}
