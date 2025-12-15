import React from 'react'
import { getSpecificCategory, getCategoryProducts } from '@/services/category.services'
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
import { Separator } from "../../../../components/ui/separator"
import Image from 'next/image'

interface Props {
    params: Promise<{
        categoryId: string
    }>
}

export default async function CategoryDetailsPage({ params }: Props) {
    const { categoryId } = await params
    const categoryDataPromise = getSpecificCategory(categoryId)
    const categoryProductsPromise = getCategoryProducts(categoryId)

    // Fetch in parallel
    const [{ data: category }, { data: products }] = await Promise.all([
        categoryDataPromise,
        categoryProductsPromise
    ])

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <Breadcrumb className="mb-8">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/category">Categories</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{category.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col md:flex-row items-center gap-8 py-8">
                        <div className="relative w-40 h-40 rounded-2xl border-2 border-gray-100 bg-white shadow-lg p-6 flex-shrink-0 flex items-center justify-center">
                            <Image
                                src={category.image}
                                alt={category.name}
                                width={120}
                                height={120}
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                {category.name}
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-xl">
                                {products.length > 0
                                    ? `Browse our selection of ${products.length} products in ${category.name}.`
                                    : `Discover products in the ${category.name} category.`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-12 px-4">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Products in this Category</h2>
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
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <h2 className="text-2xl font-semibold text-gray-600">No products found.</h2>
                        <p className="text-muted-foreground">This category doesn&apos;t have any products yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
