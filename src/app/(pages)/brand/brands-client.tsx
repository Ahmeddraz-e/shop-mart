"use client"

import React, { useState } from 'react'
import { Brand } from '@/interfaces/Brand'
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

interface BrandsClientProps {
    initialBrands: Brand[]
}

export default function BrandsClient({ initialBrands }: BrandsClientProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredBrands = initialBrands.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-foreground">
                    Discover Brands
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Explore our curated collection of premium brands. Find your favorites and discover new ones.
                </p>
            </div>

            <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                    type="text"
                    placeholder="Search brands..."
                    className="pl-10 h-12 rounded-full border-2 border-border focus:border-primary/50 transition-all text-lg shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredBrands.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-muted-foreground">No brands found matching &quot;{searchQuery}&quot;</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredBrands.map((brand: Brand) => (
                        <Link key={brand._id} href={`/brand/${brand._id}`} className="group">
                            <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card overflow-hidden rounded-2xl group-hover:-translate-y-1">
                                <CardContent className="p-6 flex flex-col items-center justify-center h-full gap-4">
                                    <div className="relative w-full aspect-4/3 flex items-center justify-center p-4 bg-muted rounded-xl group-hover:bg-primary/5 transition-colors duration-300">
                                        <Image
                                            src={brand.image}
                                            alt={brand.name}
                                            width={150}
                                            height={150}
                                            className="object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors text-center">
                                        {brand.name}
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
