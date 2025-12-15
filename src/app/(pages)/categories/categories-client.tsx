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
        <div className="container mx-auto py-12 px-4 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-black">
                    Browse Categories
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Find exactly what you&apos;re looking for by browsing our wide range of product categories.
                </p>
            </div>

            <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                    type="text"
                    placeholder="Search categories..."
                    className="pl-10 h-12 rounded-full border-2 border-primary/20 focus:border-primary/50 transition-all text-lg shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredCategories.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-muted-foreground">No categories found matching &quot;{searchQuery}&quot;</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredCategories.map((category: Category) => (
                        <Link key={category._id} href={`/categories/${category._id}`} className="group">
                            <Card className="h-full border-0 shadow-sm hover:shadow-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm overflow-hidden rounded-2xl group-hover:-translate-y-1">
                                <CardContent className="p-6 flex flex-col items-center justify-center h-full gap-4">
                                    <div className="relative w-full aspect-[4/3] flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl group-hover:bg-primary/5 transition-colors duration-300">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            width={150}
                                            height={150}
                                            className="object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors text-center">
                                        {category.name}
                                    </h3>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
