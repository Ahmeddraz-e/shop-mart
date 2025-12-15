export interface Category {
    _id: string
    name: string
    slug: string
    image: string
}

export interface SubCategory {
    _id: string
    name: string
    slug: string
    category: string
    createdAt: string
    updatedAt: string
}
