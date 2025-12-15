import React from 'react'
import { getAllBrands } from '@/services/brand.services'
import BrandsClient from './brands-client'

export default async function BrandsPage() {
    const { data: brands } = await getAllBrands()

    return <BrandsClient initialBrands={brands} />
}
