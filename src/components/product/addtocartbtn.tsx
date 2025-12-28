"use client"
import React, { useState } from 'react'
import { addToCart } from '@/services/cart.services'
import { ShoppingCart, Heart, Loader2 } from 'lucide-react'
import { CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import { useCart } from '@/providers/cart-provider'
import { useWishlist } from '@/providers/wishlist-provider'

export default function AddToCartBtn({ productId, price }: { productId: string, price: number }) {
    const [isLoading, setIsLoading] = useState(false)
    const { updateCartCount } = useCart()
    const { isInWishlist, toggleWishlist } = useWishlist()

    const isWishlisted = isInWishlist(productId)

    async function addProductToCart(productId: string) {
        setIsLoading(true)
        try {
            const response = await addToCart(productId)
            if (response.status === 'fail' && response.message === 'Unauthorized') {
                toast.error("Please login to add items to cart", { position: "top-center", duration: 3000 })
                return;
            }
            if (response.status === 'fail') {
                throw new Error(response.message);
            }
            toast.success("Product added to cart", { position: "top-center", duration: 3000 })
            updateCartCount()

        } catch (error) {
            console.error("Failed to add to cart:", error)
            toast.error("Failed to add to cart", { position: "top-center", duration: 3000 })
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            <div className='px-4 md:px-6 pb-2 w-full'>
                <h4 className='card-price font-bold text-xl md:text-2xl'>EGP {price}</h4>
            </div>
            <CardFooter className='flex justify-between items-center gap-2 md:gap-4 p-4 md:p-6 pt-2 w-full'>
                <button
                    onClick={() => addProductToCart(productId)}
                    disabled={isLoading}
                    className={`bg-primary text-primary-foreground px-4 py-2.5 md:px-8 md:py-3.5 rounded-full flex items-center justify-center gap-2 text-xs md:text-sm font-semibold tracking-wide flex-1 hover:bg-primary/90 active:scale-95 transition-all duration-300 shadow-md md:shadow-lg hover:shadow-xl hover:shadow-primary/20 whitespace-nowrap ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5px]" />
                            Add to Cart
                        </>
                    )}
                </button>
                <button
                    onClick={() => toggleWishlist(productId)}
                    className="p-2 md:p-3 rounded-full hover:bg-muted transition-colors shrink-0"
                >
                    <Heart
                        className={`w-5 h-5 md:w-6 md:h-6 cursor-pointer transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                            }`}
                    />
                </button>
            </CardFooter>
        </>
    )
}
