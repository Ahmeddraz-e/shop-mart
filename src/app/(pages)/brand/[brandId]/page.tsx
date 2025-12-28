import React from 'react'
import { getSpecificBrand, getBrandProducts } from '@/services/brand.services'

import { ProductI } from '@/interfaces/product'
import ProductCard from '@/components/product/product-card'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'

interface Props {
    params: Promise<{
        brandId: string
    }>
}

export default async function BrandDetailsPage({ params }: Props) {
    const { brandId } = await params
    const brandDataPromise = getSpecificBrand(brandId)
    const brandProductsPromise = getBrandProducts(brandId)

    // Fetch in parallel
    const [{ data: brand }, { data: products }] = await Promise.all([
        brandDataPromise,
        brandProductsPromise
    ])

    return (
        <div className="min-h-screen bg-background/50">
            {/* Hero Section with detailed background */}
            <div className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-8">
                    <Breadcrumb className="mb-8">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/brand">Brands</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{brand.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col md:flex-row items-center gap-8 py-8">
                        <div className="relative w-40 h-40 rounded-2xl border-2 border-border bg-white shadow-lg p-6 shrink-0 flex items-center justify-center">
                            <Image
                                src={brand.image}
                                alt={brand.name}
                                width={120}
                                height={120}
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-foreground">
                                {brand.name}
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                {products.length > 0
                                    ? `Explore our collection of ${products.length} premium products from ${brand.name}.`
                                    : `Discover extraordinary products from ${brand.name}.`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-12 px-4">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Available Products</h2>
                    <Separator className="flex-1" />
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product: ProductI) => (
                            <div key={product._id}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/50 rounded-xl">
                        <h2 className="text-2xl font-semibold text-foreground">No products available at the moment.</h2>
                        <p className="text-muted-foreground mt-2">Check back later for new arrivals from {brand.name}.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
