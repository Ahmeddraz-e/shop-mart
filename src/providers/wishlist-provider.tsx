"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { getWishlist, addToWishlist, removeFromWishlist } from '@/services/wishlist.services'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface WishlistContextType {
    wishlist: string[]
    isInWishlist: (productId: string) => boolean
    toggleWishlist: (productId: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<string[]>([])
    const { data: session } = useSession()

    const fetchWishlist = React.useCallback(async () => {
        if (!session) {
            setWishlist([])
            return
        }
        try {
            const response = await getWishlist()
            if (response.status === 'success') {
                const ids = response.data.map((item: { _id: string }) => item._id)
                setWishlist(ids)
            }
        } catch (error) {
            console.error("Failed to fetch wishlist", error)
        }
    }, [session])

    useEffect(() => {
        fetchWishlist()
    }, [fetchWishlist])

    function isInWishlist(productId: string) {
        return wishlist.includes(productId)
    }

    async function toggleWishlist(productId: string) {
        if (!session) {
            toast.error("Please login to add to wishlist")
            return
        }

        // Optimistic update
        const isCurrentlyInWishlist = isInWishlist(productId)
        if (isCurrentlyInWishlist) {
            setWishlist(prev => prev.filter(id => id !== productId))
            try {
                const response = await removeFromWishlist(productId)
                if (response.status === 'success') {
                    toast.success("Removed from wishlist")
                    // Ideally, we might want to sync with server response, but optimistic is smoother
                    // response.data gives the list of IDs, we could use that:
                    if (response.data) setWishlist(response.data)
                } else {
                    // Revert if failed
                    setWishlist(prev => [...prev, productId])
                    toast.error("Failed to remove from wishlist")
                }
            } catch (error) {
                setWishlist(prev => [...prev, productId])
                console.error("Remove form wishlist error", error)
                toast.error("Something went wrong")
            }
        } else {
            setWishlist(prev => [...prev, productId])
            try {
                const response = await addToWishlist(productId)
                if (response.status === 'success') {
                    toast.success("Added to wishlist")
                    if (response.data) setWishlist(response.data)
                } else if (response.status === 'fail' && response.message === 'Unauthorized') {
                    setWishlist(prev => prev.filter(id => id !== productId))
                    toast.error("Please login to add to wishlist")
                } else {
                    setWishlist(prev => prev.filter(id => id !== productId))
                    toast.error("Failed to add to wishlist")
                }
            } catch (error) {
                setWishlist(prev => prev.filter(id => id !== productId))
                console.error("Add to wishlist error", error)
                toast.error("Something went wrong")
            }
        }
    }

    return (
        <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}
