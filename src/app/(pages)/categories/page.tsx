import React from 'react'
import { getAllCategories } from '@/services/category.services'
import CategoriesClient from './CategoriesClient'

export default async function CategoriesPage() {
    const { data: categories } = await getAllCategories()

    return <CategoriesClient initialCategories={categories} />
}
