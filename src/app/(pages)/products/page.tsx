import React from 'react'
import { ProductI } from '@/interfaces/product'
import ProductCard from '@/components/product/product-card'


export default async function ProductsPage() {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/products")
    const data = await response.json()
    const products = data as { data: ProductI[] }

    return (
        <main>
            <div className='container mx-auto py-8'>
                <div className="grid grid-cols-12 gap-6 justify-center items-center">
                    {products.data.map((product: ProductI) => (
                        <div key={product.id} className='col-span-12 md:col-span-6 lg:col-span-3'>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
