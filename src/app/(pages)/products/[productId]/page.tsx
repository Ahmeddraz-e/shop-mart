import React from 'react'
import { Params } from 'next/dist/server/request/params'
import { ProductI } from '@/interfaces/product'
import Link from "next/link"
import Image from "next/image"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Star from '@/components/ui/star'

import ProductCarousel from '@/components/product/product-carousel'
import AddToCartBtn from '@/components/product/addtocartbtn'



export default async function ProductDetails({ params }: { params: Promise<Params> }) {
    const { productId } = await params

    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${productId}`)
    const data = await response.json()
    const { data: product } = data as { data: ProductI }

    





    return (
        <main>
            <div className="container mx-auto px-4 py-15">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link className='text-xl' href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link className='text-xl' href="/products">Products</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className='text-xl'>{product.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Card className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-15 overflow-hidden">
                    <div className="col-span-1 flex items-center justify-center bg-gray-50 ">
                        <ProductCarousel images={product.images} title={product.title} />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex flex-col justify-center items-center">
                        <div className="w-full">
                            <CardHeader>
                                <h4 className='card-brand text-sm font-semibold text-gray-500'>{product.brand.name}</h4>
                                <CardTitle className='text-2xl font-bold' title={product.title}>{product.title}</CardTitle>
                                <CardDescription className='text-sm font-semibold text-gray-500'>{product.category.name}</CardDescription>
                            </CardHeader>
                            <CardContent className='flex flex-col gap-5'>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, index) => {
                                            const rating = product.ratingsAverage;
                                            const fillValue = Math.max(0, Math.min(1, rating - index));
                                            return (
                                                <Star
                                                    key={index}
                                                    percentage={fillValue * 100}
                                                    className="text-yellow-500 fill-yellow-400"
                                                />
                                            )
                                        })}
                                    </div>
                                    <span className='text-sm font-semibold text-gray-600'>({product.ratingsQuantity} reviews)</span>
                                </div>
                                <p className="text-gray-600 leading-relaxed font-medium py-3">{product.description}</p>
                            </CardContent>
                        </div>
                        <AddToCartBtn productId={product._id} price={product.price} />

                    </div>
                </Card>
            </div>
        </main>
    )
}
