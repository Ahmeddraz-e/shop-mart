import React from 'react'
import { getSubCategoriesOnCategory } from '@/services/category.services'
import { getCategoryProducts, getSpecificCategory } from '@/services/category.services'
import Image from 'next/image'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import ProductCard from '@/components/product/product-card'
import { ProductI } from '@/interfaces/product'
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SubCategory } from '@/interfaces/Category'

export default async function CategoryDetailsPage({ params }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await params

    // Fetch data in parallel
    const categoryData = getSpecificCategory(categoryId)
    const subCategoriesData = getSubCategoriesOnCategory(categoryId)
    const productsData = getCategoryProducts(categoryId)

    const [
        { data: category },
        { data: subCategories },
        { data: products }
    ] = await Promise.all([categoryData, subCategoriesData, productsData])

    return (
        <div className="container mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" className="hover:text-foreground transition-colors">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/categories" className="hover:text-foreground transition-colors">Categories</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-semibold text-primary">{category.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Category Header */}
            <div className="flex flex-col md:flex-row gap-8 items-center bg-card rounded-2xl p-8 border border-border shadow-sm">
                <div className="relative w-full max-w-[200px] aspect-square bg-muted/20 rounded-xl p-4 flex items-center justify-center">
                    <Image
                        src={category.image}
                        alt={category.name}
                        width={200}
                        height={200}
                        className="object-contain drop-shadow-md"
                    />
                </div>
                <div className="space-y-4 text-center md:text-left flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{category.name}</h1>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {subCategories.length > 0 ? (
                            subCategories.map((sub: SubCategory) => (
                                <Badge key={sub._id} variant="secondary" className="px-3 py-1 text-sm bg-muted/50 hover:bg-muted/80 text-foreground transition-colors border border-border/50">
                                    {sub.name}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground italic text-sm">No subcategories available</span>
                        )}
                    </div>
                </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Products Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                    Products in <span className="text-primary">{category.name}</span>
                    <span className="ml-2 text-sm font-normal text-muted-foreground">({products.length} items)</span>
                </h2>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border/50">
                        <p className="text-lg font-medium text-foreground">No products found</p>
                        <p className="text-muted-foreground">This category doesn&apos;t have any products yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product: ProductI) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
