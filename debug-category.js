
const testCategoryProducts = async () => {
    const categoryId = "6439d5b90049ad0b52b90048"; // Men's Fashion

    const endpoints = [
        `https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}`,
        `https://ecommerce.routemisr.com/api/v1/products?category[in]=${categoryId}`,
        `https://ecommerce.routemisr.com/api/v1/products?categoryId=${categoryId}`
    ];

    for (const url of endpoints) {
        try {
            console.log(`Testing URL: ${url}`);
            const res = await fetch(url);
            const data = await res.json();
            console.log(`Status: ${res.status}`);
            console.log(`Results: ${data.results || data.data?.length || 0}`);
            if (data.results > 0 || (Array.isArray(data.data) && data.data.length > 0)) {
                console.log("SUCCESS found!");
                break;
            }
        } catch (e) {
            console.error(`Error fetching ${url}:`, e.message);
        }
        console.log("-------------------");
    }
};

testCategoryProducts();
