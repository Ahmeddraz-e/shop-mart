"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCart } from '@/services/cart.services'
import { useSession } from 'next-auth/react'

interface CartContextType {
    cartCount: number
    updateCartCount: () => Promise<void>
    setCartCount: (count: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartCount, setCartCount] = useState(0)
    const { data: session } = useSession()

    const updateCartCount = React.useCallback(async () => {
        if (!session) {
            setCartCount(0)
            return
        }
        try {
            const response = await getCart()
            if (response.status === 'success') {
                setCartCount(response.numOfCartItems || 0)
            } else {
                setCartCount(0)
            }
        } catch (error) {
            console.error("Failed to update cart count", error)
        }
    }, [session])

    useEffect(() => {
        updateCartCount()
    }, [updateCartCount])

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
