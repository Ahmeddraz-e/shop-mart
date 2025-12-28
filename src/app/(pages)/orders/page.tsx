import React from 'react'
import { getUserToken } from '@/lib/auth'
import { getUserOrders } from '@/services/order.services'
import { jwtDecode } from "jwt-decode";
import { Order } from '@/interfaces/Order';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Package, CreditCard, Truck } from 'lucide-react'
import Link from 'next/link';

export default async function OrdersPage() {
    const token = await getUserToken()

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-muted-foreground">Please log in to view your orders.</p>
            </div>
        )
    }

    let userId: string = "";
    try {
        const decoded = jwtDecode(token) as { id: string };
        userId = decoded.id;
    } catch (error) {
        console.error("Token decode error:", error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-500">Error loading user data.</p>
            </div>
        )
    }

    const orders: Order[] = await getUserOrders(userId);

    return (
        <div className="min-h-screen bg-background/50 py-12 px-4">
            <div className="container mx-auto max-w-4xl space-y-8">
                <h1 className="text-4xl font-bold text-foreground mb-8">Your Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-2xl shadow-sm">
                        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold text-foreground">No orders found</h2>
                        <p className="text-muted-foreground mt-2">Looks like you haven&apos;t placed any orders yet.</p>
                        <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Card key={order.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-card">
                                <CardHeader className="bg-muted/50 border-b border-border py-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-medium text-foreground">Order #{order.id}</CardTitle>
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant={order.isPaid ? "default" : "secondary"} className={order.isPaid ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700 text-white"}>
                                                {order.isPaid ? "Paid" : "Unpaid"}
                                            </Badge>
                                            <Badge variant={order.isDelivered ? "default" : "outline"} className={order.isDelivered ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300 text-gray-500"}>
                                                {order.isDelivered ? "Delivered" : "Processing"}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {/* Items */}
                                        <div className="space-y-4">
                                            {order.cartItems.map((item) => (
                                                <div key={item._id} className="flex items-center gap-4">
                                                    <div className="relative w-16 h-16 rounded-lg border border-border bg-white p-1 shrink-0">
                                                        <Image
                                                            src={item.product.imageCover}
                                                            alt={item.product.title}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-foreground line-clamp-1">{item.product.title}</p>
                                                        <p className="text-sm text-muted-foreground">{item.product.brand.name} • Qty: {item.count}</p>
                                                    </div>
                                                    <div className="font-semibold text-foreground">
                                                        EGP {item.price}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator />

                                        {/* Summary */}
                                        <div className="flex flex-col md:flex-row justify-between gap-6 text-sm">
                                            <div className="space-y-1">
                                                <p className="font-semibold text-foreground flex items-center gap-2">
                                                    <Truck className="w-4 h-4" /> Shipping Address
                                                </p>
                                                <p className="text-muted-foreground">{order.shippingAddress.details}</p>
                                                <p className="text-muted-foreground">{order.shippingAddress.city} - {order.shippingAddress.phone}</p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="font-semibold text-foreground flex items-center justify-end gap-2">
                                                    <CreditCard className="w-4 h-4" /> Payment Method
                                                </p>
                                                <p className="text-muted-foreground capitalize">{order.paymentMethodType}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4 border-t border-border">
                                            <div className="text-xl font-bold text-foreground flex items-center gap-2">
                                                Total: <span className="text-green-600">EGP {order.totalOrderPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
