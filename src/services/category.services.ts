
export const getAllCategories = async () => {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/categories', {
        next: { revalidate: 3600 }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }
    return res.json();
};

export const getSpecificCategory = async (categoryId: string) => {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${categoryId}`, {
        next: { revalidate: 3600 }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch category details');
    }
    return res.json();
};

export const getCategoryProducts = async (categoryId: string) => {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}`, {
        next: { revalidate: 3600 }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch category products');
    }
    return res.json();
};

export const getSubCategoriesOnCategory = async (categoryId: string) => {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${categoryId}/subcategories`, {
        next: { revalidate: 3600 }
    });
    if (!res.ok) {
        // It's possible a category has no subcategories, or the API returns 404/error.
        // For now, we'll throw, but we might want to return empty array in a robust implementation
        // if the API behaves that way for empty subs.
        // However, usually API returns 200 with empty list. If it errors, it's a real error.
        console.warn(`Failed to fetch subcategories for category ${categoryId}, returning empty list.`);
        return { data: [] };
    }
    return res.json();
};
