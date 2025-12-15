"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import React, { useState } from 'react'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart, UserRound, Menu, X, LogOut, Heart, Package } from 'lucide-react'
import { useSession, signOut } from "next-auth/react"

import { useCart } from '@/providers/cart-provider'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { data: session } = useSession()
    const { cartCount } = useCart()

    return (
        <nav className='bg-white border-b border-gray-100 sticky top-0 z-50'>
            <div className='container mx-auto flex h-20 justify-between items-center px-6'>
                <div className="nav-logo flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black text-white font-bold text-xl shadow-lg">
                        S
                    </div>
                    <Link href="/" className='font-bold text-2xl tracking-tight hover:text-gray-600 transition-colors'>
                        ShopMart
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList className='gap-4'>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className="text-base font-medium text-gray-600 hover:text-white transition-colors px-3 py-2">
                                        Home
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/products" legacyBehavior passHref>
                                    <NavigationMenuLink className="text-base font-medium text-gray-600 hover:text-white transition-colors px-3 py-2">
                                        Products
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/brand" legacyBehavior passHref>
                                    <NavigationMenuLink className="text-base font-medium text-gray-600 hover:text-white transition-colors px-3 py-2">
                                        Brands
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/categories" legacyBehavior passHref>
                                    <NavigationMenuLink className="text-base font-medium text-gray-600 hover:text-white transition-colors px-3 py-2">
                                        Categories
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Desktop Actions */}
                <div className='hidden md:flex nav-action gap-6 items-center'>

                    <Link href="/wishlist" className="text-gray-600 hover:text-black transition-colors">
                        <Heart className="w-6 h-6" />
                    </Link>

                    <Link href="/cart" className='relative text-gray-600 hover:text-black transition-colors'>
                        <ShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 h-5 w-5 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                            <div className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-full transition-colors border border-gray-200">
                                {session?.user?.image ? (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                                        <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <UserRound className='h-5 w-5 text-gray-600 m-1.5' />
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl p-2">
                            <DropdownMenuLabel className="px-2 py-1.5">
                                {session?.user ? (
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-semibold leading-none text-gray-900">{session.user.name}</p>
                                        <p className="text-xs leading-none text-gray-500">{session.user.email}</p>
                                    </div>
                                ) : (
                                    <span className="text-gray-900 font-semibold">My Account</span>
                                )}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-100 my-1" />
                            {!session ? (
                                <>
                                    <Link href="/login" className="w-full">
                                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50">Login</DropdownMenuItem>
                                    </Link>
                                    <Link href="/register" className="w-full">
                                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50">Register</DropdownMenuItem>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/orders" className="w-full block">
                                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50">
                                            <Package className="mr-2 h-4 w-4" />
                                            <span>Your Orders</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/wishlist" className="w-full block">
                                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50">
                                            <Heart className="mr-2 h-4 w-4" />
                                            <span>Wishlist</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator className="bg-gray-100 my-1" />
                                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="cursor-pointer text-red-600 hover:bg-red-50 rounded-lg">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <Link href="/cart" className='relative'>
                        <ShoppingCart className="h-6 w-6 text-gray-900" />
                        {cartCount > 0 && <span className="absolute -top-2 -right-2 h-4 w-4 bg-black text-[10px] flex items-center justify-center rounded-full text-white">{cartCount}</span>}
                    </Link>
                    <button
                        className="p-2 -mr-2 text-gray-900"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden flex flex-col p-4 gap-1 animate-in slide-in-from-top-5 border-t border-gray-100 min-h-screen z-50">
                    <Link href="/" className="text-lg font-medium px-4 py-3 hover:bg-gray-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link href="/products" className="text-lg font-medium px-4 py-3 hover:bg-gray-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
                    <Link href="/brand" className="text-lg font-medium px-4 py-3 hover:bg-gray-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Brands</Link>
                    <Link href="/categories" className="text-lg font-medium px-4 py-3 hover:bg-gray-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>

                    <div className="h-px bg-gray-100 my-2 mx-4"></div>

                    <div className="flex flex-col gap-1">
                        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">My Account</p>
                        {!session ? (
                            <>
                                <Link href="/login" className="flex items-center gap-2 text-base px-4 py-3 hover:bg-gray-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                                    Login
                                </Link>
                                <Link href="/register" className="flex items-center gap-2 text-base px-4 py-3 hover:bg-gray-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="px-4 py-2 flex items-center gap-3 mb-2">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={session.user?.image || ""} />
                                        <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-gray-900">{session.user?.name}</p>
                                        <p className="text-sm text-gray-500">{session.user?.email}</p>
                                    </div>
                                </div>
                                <Link href="/orders" className="flex items-center gap-3 text-base px-4 py-3 hover:bg-gray-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Package className="h-5 w-5" /> Your Orders
                                </Link>
                                <Link href="/wishlist" className="flex items-center gap-3 text-base px-4 py-3 hover:bg-gray-50 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Heart className="h-5 w-5" /> Wishlist
                                </Link>
                                <div className="flex items-center gap-3 text-base px-4 py-3 hover:bg-red-50 text-red-600 rounded-xl cursor-pointer" onClick={() => {
                                    signOut({ callbackUrl: "/login" })
                                    setIsMobileMenuOpen(false)
                                }}>
                                    <LogOut className="h-5 w-5" /> Log out
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
