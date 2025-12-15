
export const getAllBrands = async () => {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/brands', {
        next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) {
        throw new Error('Failed to fetch brands');
    }
    return res.json();
};

export const getSpecificBrand = async (brandId: string) => {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${brandId}`, {
        next: { revalidate: 3600 }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch brand details');
    }
    return res.json();
};

export const getBrandProducts = async (brandId: string) => {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products?brand=${brandId}`, {
        next: { revalidate: 3600 }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch brand products');
    }
    return res.json();
};
