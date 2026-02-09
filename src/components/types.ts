export interface Addon {
  id: string;
  name: string;
  price: number;
}


export  interface CategoryItem {
    name: string;
    thumbnail: string;
}

export  interface CartItem {
    productId: number;
    variantId?: string;
    qty: number;
    addons?: string[];  

}

export interface Variant {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  variants?: Variant[];
    addons?: Addon[];
}