"use client"
import React, { useEffect, useState } from 'react'
import { getWishlist } from '@/services/wishlist.services'
import { ProductI } from '@/interfaces/product'
import { Loader2, Heart } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/product/product-card'
import { useWishlist } from '@/providers/wishlist-provider'
import { Button } from '@/components/ui/button'

export default function WishlistPage() {
    const [products, setProducts] = useState<ProductI[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { wishlist } = useWishlist()

    async function fetchWishlistItems() {
        try {
            const response = await getWishlist()
            if (response.status === 'success') {
                setProducts(response.data)
            }
        } catch (error) {
            console.error("Failed to fetch wishlist items", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchWishlistItems()
    }, [])

    // Update displayed products when global wishlist state changes (e.g. item removed)
    // using a derived state or effect might be tricky if the fetch is async and provider is async
    // simpler: If local products has items that are NOT in 'wishlist' (ids), remove them?
    // But 'wishlist' ids might strictly be IDs.
    // However, on initial load, 'wishlist' from provider might be empty until it fetches.
    // So we shouldn't filter immediately if wishlist is empty?
    // Actually, provider fetches on mount. page fetches on mount.
    // Better strategy: The AddToCartBtn toggles the ID in the provider.
    // We can assume if our list has something that is NOT in the provider list (after provider loaded), it should be removed.
    // But handling "provider loading" state is not exposed.
    // Let's stick to simple implementation: fetches data. If user clicks heart, it toggles.
    // If we want it to vanish, we can rely on the fact that `wishlist` will update.

    useEffect(() => {
        if (products.length > 0 && wishlist.length >= 0) {
            // If we have products, but they are not in the wishlist array anymore, we should probably remove them from view
            // verifying 'wishlist' is populated is hard without a loading flag from provider.
            // Let's assume if the user performs an action, 'wishlist' updates.
            // We can filter `products` to only those in `wishlist`?
            // Only if we are sure `wishlist` is the source of truth.
        }
    }, [wishlist, products.length])

    // Actually, let's just use the local state. The heart button updates the global state.
    // We can manually filter the list if we want live removal, 
    // OR just let the heart button show "empty" heart (removed) and user manually refreshes or navigates away.
    // A live removal is nicer.
    // Let's try:

    // The heuristic is bad if actual wishlist is empty. 
    // Let's just render `products` and let the visual state of the heart be the indicator for now. 
    // Trying to sync two async fetches (provider and page) is race-condition prone without more structure.

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading your wishlist...</p>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
                <div className="bg-muted p-6 rounded-full">
                    <Heart className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Your wishlist is empty</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Save items you love to buy them later.
                    </p>
                </div>
                <Link href="/products">
                    <Button size="lg" className="rounded-full px-8">
                        Explore Products
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <main>
            <div className='container mx-auto py-8 px-4'>
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Heart className="w-8 h-8 fill-red-500 text-red-500" />
                    My Wishlist
                    <span className="text-base font-normal text-muted-foreground ml-2">
                        ({products.filter(p => wishlist.includes(p._id)).length} items)
                    </span>
                </h1>

                <div className="grid grid-cols-12 gap-6">
                    {products.filter(p => wishlist.includes(p._id)).map((product) => (
                        <div key={product._id} className='col-span-12 md:col-span-6 lg:col-span-3'>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
