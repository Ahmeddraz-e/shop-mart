import React from 'react'
import CheckoutForm from './CheckoutForm'
import { getCart } from '@/services/cart.services'
import { redirect } from 'next/navigation'

export default async function CheckoutPage() {
    const cartData = await getCart()

    if (!cartData || cartData.status === 'fail' || !cartData.data) {
        // If no cart, redirect to home or cart page
        redirect('/cart')
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 flex items-center justify-center">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px]" />
                <div className="absolute bottom-[0%] left-[10%] w-[30%] h-[30%] bg-blue-200/40 rounded-full blur-[100px]" />
            </div>
            <CheckoutForm cartId={cartData.cartId || cartData.data._id} />
        </div>
    )
}
