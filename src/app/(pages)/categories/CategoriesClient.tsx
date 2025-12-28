"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { Category } from '@/interfaces/Category'

interface CategoriesClientProps {
    initialCategories: Category[]
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredCategories = initialCategories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="container mx-auto py-12 px-4 space-y-8 min-h-screen">
            {/* Header Section */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Browse Categories
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Explore our curated collections and find exactly what you need.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                    type="text"
                    placeholder="Search categories..."
                    className="pl-10 h-11 rounded-full border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base bg-background shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Grid Section */}
            {filteredCategories.length === 0 ? (
                <div className="text-center py-20">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                        <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-foreground">No categories found</p>
                    <p className="text-muted-foreground">Try adjusting your search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredCategories.map((category: Category) => (
                        <Link
                            key={category._id}
                            href={`/categories/${category._id}`}
                            className="group block"
                        >
                            <Card className="h-full border-0 bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden rounded-2xl">
                                <CardContent className="p-0">
                                    <div className="relative aspect-square bg-white p-8 flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            width={200}
                                            height={200}
                                            className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                                            {category.name}
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
