"use client"

import { ThemeToggle } from '../theme-toggle'

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
        <nav className='bg-background border-b border-border sticky top-0 z-50'>
            <div className='container mx-auto flex h-20 justify-between items-center px-6'>
                <div className="nav-logo flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xl shadow-lg">
                        S
                    </div>
                    <Link href="/" className='font-bold text-2xl tracking-tight hover:text-muted-foreground transition-colors'>
                        ShopMart
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList className='gap-4'>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                                        Home
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/products" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                                        Products
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/brand" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                                        Brands
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/categories" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                                        Categories
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Desktop Actions */}
                <div className='hidden md:flex nav-action gap-4 items-center'>
                    <ThemeToggle />

                    <Link href="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Heart className="w-6 h-6" />
                    </Link>

                    <Link href="/cart" className='relative text-muted-foreground hover:text-foreground transition-colors'>
                        <ShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                            <div className="flex items-center gap-2 hover:bg-muted p-1.5 rounded-full transition-colors border border-border">
                                {session?.user?.image ? (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                                        <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <UserRound className='h-5 w-5 text-muted-foreground m-1.5' />
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2 bg-popover border border-border shadow-xl rounded-xl p-2">
                            <DropdownMenuLabel className="px-2 py-1.5">
                                {session?.user ? (
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-semibold leading-none text-foreground">{session.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                    </div>
                                ) : (
                                    <span className="text-foreground font-semibold">My Account</span>
                                )}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border my-1" />
                            {!session ? (
                                <>
                                    <Link href="/login" className="w-full">
                                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-muted">Login</DropdownMenuItem>
                                    </Link>
                                    <Link href="/register" className="w-full">
                                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-muted">Register</DropdownMenuItem>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/orders" className="w-full block">
                                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-muted">
                                            <Package className="mr-2 h-4 w-4" />
                                            <span>Your Orders</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/wishlist" className="w-full block">
                                        <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-muted">
                                            <Heart className="mr-2 h-4 w-4" />
                                            <span>Wishlist</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator className="bg-border my-1" />
                                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="cursor-pointer text-destructive hover:bg-destructive/10 rounded-lg">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

                <div className="flex md:hidden items-center gap-4">
                    <ThemeToggle />
                    <Link href="/cart" className='relative'>
                        <ShoppingCart className="h-6 w-6 text-foreground" />
                        {cartCount > 0 && <span className="absolute -top-2 -right-2 h-4 w-4 bg-black text-[10px] flex items-center justify-center rounded-full text-white">{cartCount}</span>}
                    </Link>
                    <button
                        className="p-2 -mr-2 text-foreground"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-background shadow-xl md:hidden flex flex-col p-4 gap-1 animate-in slide-in-from-top-5 border-t border-border min-h-screen z-50">
                    <Link href="/" className="text-lg font-medium px-4 py-3 hover:bg-muted rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link href="/products" className="text-lg font-medium px-4 py-3 hover:bg-muted rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
                    <Link href="/brand" className="text-lg font-medium px-4 py-3 hover:bg-muted rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Brands</Link>
                    <Link href="/categories" className="text-lg font-medium px-4 py-3 hover:bg-muted rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>

                    <div className="h-px bg-border my-2 mx-4"></div>

                    <div className="flex flex-col gap-1">
                        <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">My Account</p>
                        {!session ? (
                            <>
                                <Link href="/login" className="flex items-center gap-2 text-base px-4 py-3 hover:bg-muted rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                                    Login
                                </Link>
                                <Link href="/register" className="flex items-center gap-2 text-base px-4 py-3 hover:bg-muted rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
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
                                        <p className="font-semibold text-foreground">{session.user?.name}</p>
                                        <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                                    </div>
                                </div>
                                <Link href="/orders" className="flex items-center gap-3 text-base px-4 py-3 hover:bg-muted rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Package className="h-5 w-5" /> Your Orders
                                </Link>
                                <Link href="/wishlist" className="flex items-center gap-3 text-base px-4 py-3 hover:bg-muted rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Heart className="h-5 w-5" /> Wishlist
                                </Link>
                                <div className="flex items-center gap-3 text-base px-4 py-3 hover:bg-destructive/10 text-destructive rounded-xl cursor-pointer" onClick={() => {
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
