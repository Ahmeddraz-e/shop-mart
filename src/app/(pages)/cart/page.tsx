"use client"
import React, { useEffect, useState } from 'react'
import { getCart, deleteItem, updateItemCount, clearCart } from '@/services/cart.services'
import { Loader2, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCart } from '@/providers/cart-provider'

interface CartItem {
    _id: string
    count: number
    price: number
    product: {
        _id: string
        title: string
        imageCover: string
        category: {
            name: string
        }
    }
}

interface CartData {
    totalCartPrice: number
    products: CartItem[]
    _id: string
}

export default function CartPage() {
    const [cart, setCart] = useState<CartData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState<string | null>(null)
    const [isClearing, setIsClearing] = useState(false)
    const { updateCartCount } = useCart()

    useEffect(() => {
        async function fetchCart() {
            try {
                const response = await getCart()
                if (response.status === 'success') {
                    setCart(response.data)
                    updateCartCount()
                } else {
                    setCart(null)
                    updateCartCount()
                }
            } catch (error) {
                console.error("Failed to fetch cart", error)
                toast.error("Failed to load cart")
            } finally {
                setIsLoading(false)
            }
        }
        fetchCart()
    }, [updateCartCount])

    async function handleRemoveItem(productId: string) {
        setIsUpdating(productId)
        try {
            const response = await deleteItem(productId)
            if (response.status === 'success') {
                setCart(response.data)
                toast.success("Item removed from cart")
                updateCartCount()
            }
        } catch (error) {
            console.error("Failed to remove item", error)
            toast.error("Failed to remove item")
        } finally {
            setIsUpdating(null)
        }
    }

    async function handleUpdateQuantity(productId: string, newCount: number) {
        if (newCount < 1) return
        setIsUpdating(productId)
        try {
            const response = await updateItemCount(productId, newCount)
            if (response.status === 'success') {
                setCart(response.data)
                updateCartCount()
            }
        } catch (error) {
            console.error("Failed to update quantity", error)
            toast.error("Failed to update quantity")
        } finally {
            setIsUpdating(null)
        }
    }

    async function handleClearCart() {
        setIsClearing(true)
        try {
            const response = await clearCart()
            if (response.message === 'success') {
                setCart(null)
                toast.success("Cart cleared successfully")
                updateCartCount()
            }
        } catch (error) {
            console.error("Failed to clear cart", error)
            toast.error("Failed to clear cart")
        } finally {
            setIsClearing(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading your cart...</p>
            </div>
        )
    }

    if (!cart || cart.products.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
                <div className="bg-gray-100 p-6 rounded-full">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Your cart is empty</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Looks like you haven&apos;t added anything to your cart yet.
                    </p>
                </div>
                <Link href="/products">
                    <Button size="lg" className="rounded-full px-8">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <ShoppingBag className="w-8 h-8" />
                    Shopping Cart
                    <span className="text-base font-normal text-muted-foreground ml-2">
                        ({cart.products.length} items)
                    </span>
                </h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                >
                    {isClearing ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Clear Cart
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Cart Items List */}
                <div className="flex-1 space-y-6">
                    {cart.products.map((item) => (
                        <div
                            key={item._id}
                            className="group flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow duration-300 relative overflow-hidden"
                        >
                            {/* Product Image */}
                            <div className="relative w-full sm:w-32 aspect-4/3 sm:aspect-square rounded-xl overflow-hidden bg-white shrink-0">
                                <Image
                                    src={item.product.imageCover}
                                    alt={item.product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 flex flex-col justify-between gap-4">
                                <div>
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
                                            {item.product.title}
                                        </h3>
                                        <p className="font-bold text-lg whitespace-nowrap">
                                            EGP {item.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {item.product.category.name}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 bg-muted rounded-full px-1 border border-border">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product._id, item.count - 1)}
                                            disabled={item.count <= 1 || isUpdating === item.product._id}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-card text-muted-foreground disabled:opacity-50 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-medium font-mono text-sm">
                                            {isUpdating === item.product._id ? (
                                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                            ) : (
                                                item.count
                                            )}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product._id, item.count + 1)}
                                            disabled={isUpdating === item.product._id}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-card text-muted-foreground transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveItem(item.product._id)}
                                        disabled={isUpdating === item.product._id}
                                        className="text-sm font-medium text-destructive hover:text-destructive flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:w-80 xl:w-96 shrink-0 h-fit space-y-4">
                    <div className="bg-card p-6 rounded-2xl border border-border space-y-4 shadow-sm">
                        <h2 className="font-bold text-lg">Order Summary</h2>
                        <div className="space-y-3 pt-2 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>EGP {cart.totalCartPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Shipping estimate</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                                <span>Order Total</span>
                                <span>EGP {cart.totalCartPrice.toLocaleString()}</span>
                            </div>
                        </div>
                        <Link href="/checkout">
                            <Button size="lg" className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-4 shadow-lg shadow-primary/20">
                                Checkout
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                        <div className="p-1 px-1.5 h-fit bg-white dark:bg-blue-900/40 rounded-md shadow-sm border border-blue-100 dark:border-blue-800 font-bold shrink-0">
                            Note
                        </div>
                        <p>Prices and shipping costs are confirmed at checkout.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
