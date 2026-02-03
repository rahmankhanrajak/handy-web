export  interface CategoryItem {
    name: string;
    thumbnail: string;
}

export  interface CartItem {
    productId: number;
    variantId?: string;
    qty: number;
}