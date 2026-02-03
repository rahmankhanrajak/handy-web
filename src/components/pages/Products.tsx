import React, { useMemo, useState } from "react";
import foodData from "../productslist.json";
import type { CategoryItem, CartItem } from "../types"

interface Variant {
    id: string;
    name: string;
    price: number;
}

interface Product {
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
}

/* ================= COMPONENT ================= */

const Layout: React.FC = () => {
    const products: Product[] = foodData.products;

    /* -------- Categories -------- */

    const categories: CategoryItem[] = useMemo(() => {
        const map = new Map<string, string>();
        products.forEach((p) => {
            if (!map.has(p.category)) map.set(p.category, p.thumbnail);
        });
        return Array.from(map.entries()).map(([name, thumbnail]) => ({
            name,
            thumbnail,
        }));
    }, [products]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] =
        useState<string | null>(null);


    const subCategories = useMemo(() => {
        if (!selectedCategory) return [];

        const map = new Map<string, string>();
        products
            .filter((p) => p.category === selectedCategory)
            .forEach((p) => {
                if (!map.has(p.subCategory)) map.set(p.subCategory, p.thumbnail);
            });

        return Array.from(map.entries()).map(([name, thumbnail]) => ({
            name,
            thumbnail,
        }));
    }, [products, selectedCategory]);

    const filteredProducts = useMemo(() => {
        if (!selectedCategory) return products;

        return products.filter(
            (p) =>
                p.category === selectedCategory &&
                (!selectedSubCategory || p.subCategory === selectedSubCategory)
        );
    }, [products, selectedCategory, selectedSubCategory]);

    const [cart, setCart] = useState<Record<string, CartItem>>({});

    const hasVariants = (product: Product) =>
        Array.isArray(product.variants) && product.variants.length > 0;

    const getSimpleKey = (productId: number) => `${productId}_base`;

    const addSimpleProduct = (product: Product) => {
        const key = getSimpleKey(product.id);
        setCart((prev) => ({
            ...prev,
            [key]: {
                productId: product.id,
                qty: (prev[key]?.qty || 0) + 1,
            },
        }));
    };

    const updateSimpleQty = (productId: number, delta: number) => {
        const key = getSimpleKey(productId);

        setCart((prev) => {
            const nextQty = (prev[key]?.qty || 0) + delta;

            if (nextQty <= 0) {
                const { [key]: _, ...rest } = prev;
                return rest;
            }

            return {
                ...prev,
                [key]: {
                    productId,
                    qty: nextQty,
                },
            };
        });
    };

    /* ================= VARIANT POPUP ================= */

    const [variantPopup, setVariantPopup] = useState<{
        product: Product | null;
        variant: Variant | null;
        qty: number;
    }>({
        product: null,
        variant: null,
        qty: 1,
    });

    const openVariantPopup = (product: Product) => {
        setVariantPopup({ product, variant: null, qty: 1 });
    };

    const closeVariantPopup = () => {
        setVariantPopup({ product: null, variant: null, qty: 1 });
    };

    const confirmAddVariant = () => {
        if (!variantPopup.product || !variantPopup.variant) return;

        const key = `${variantPopup.product.id}_${variantPopup.variant.id}`;

        setCart((prev) => ({
            ...prev,
            [key]: {
                productId: variantPopup.product!.id,
                variantId: variantPopup.variant!.id,
                qty: (prev[key]?.qty || 0) + variantPopup.qty,
            },
        }));

        closeVariantPopup();
    };

    /* ================= UI ================= */

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* ===== HEADER ===== */}
            {/* <header className="bg-white border-b px-3 py-2">
                <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-orange-500">Alab</div>

                    <div className="flex-1 overflow-x-auto">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`min-w-[60px] p-2 rounded-lg border ${selectedCategory === null
                                    ? "border-orange-500 bg-orange-50"
                                    : "border-gray-200 bg-white"
                                    }`}
                            >
                                All
                            </button>

                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => {
                                        setSelectedCategory(cat.name);
                                        setSelectedSubCategory(null);
                                    }}
                                    className={`min-w-[88px] h-[96px] flex flex-col items-center justify-center
    rounded-xl border-2 transition
    ${selectedCategory === cat.name
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200 bg-white"}
  `}
                                >
                                    <img
                                        src={cat.thumbnail}
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                    <span className="text-sm font-semibold mt-2 text-center leading-tight">
                                        {cat.name.replace(/-/g, " ")}
                                    </span>
                                </button>

                            ))}
                        </div>
                    </div>
                </div>
            </header> */}

            {/* ===== BODY ===== */}
            <div className="flex flex-1 overflow-hidden">
                {/* Subcategories */}
               <aside className="w-24 md:w-32 bg-white border-r overflow-y-auto">
  {/* Logo */}
  <div className="sticky top-0 z-10 bg-white border-b">
    <div className="flex justify-center items-center h-16 font-semibold">
      Logo
    </div>
  </div>

  {/* Sub Categories */}
  <div className="py-2">
    {subCategories.map((sub) => {
      const isActive = selectedSubCategory === sub.name;

      return (
        <button
          key={sub.name}
          onClick={() => setSelectedSubCategory(sub.name)}
          className={`w-full flex flex-col items-center py-3 cursor-pointer transition-all
            ${isActive ? "bg-orange-50 text-orange-600" : "hover:bg-gray-100"}
          `}
        >
          <img
            src={sub.thumbnail}
            alt={sub.name}
            className={`h-10 w-10 rounded-md object-cover 
              ${isActive ? "ring-2 ring-orange-500" : ""}
            `}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.png";
            }}
          />

          <span className="text-xs md:text-sm mt-1 text-center capitalize leading-tight">
            {sub.name.replace(/-/g, " ")}
          </span>
        </button>
      );
    })}
  </div>
</aside>


                {/* Products */}
                <main className="flex-1 p-3 overflow-y-auto">
                     <div className="flex items-center gap-3">
                    <div className="flex-1 overflow-x-auto">
                        <div className="flex py-2 gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`min-w-[60px] p-2 rounded-lg border ${selectedCategory === null
                                    ? "border-orange-500 bg-orange-50"
                                    : "border-gray-200 bg-white"
                                    }`}
                            >
                                All
                            </button>

                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => {
                                        setSelectedCategory(cat.name);
                                        setSelectedSubCategory(null);
                                    }}
                                    className={`min-w-[88px] h-[96px] flex flex-col items-center justify-center
    rounded-xl border-2 transition
    ${selectedCategory === cat.name
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200 bg-white"}
  `}
                                >
                                    <img
                                        src={cat.thumbnail}
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                    <span className="text-sm font-semibold mt-2 text-center leading-tight">
                                        {cat.name.replace(/-/g, " ")}
                                    </span>
                                </button>

                            ))}
                        </div>
                    </div>
                </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredProducts.map((product) => {
                            const simpleKey = getSimpleKey(product.id);
                            const simpleItem = cart[simpleKey];

                            return (
                                <div key={product.id} className="bg-white p-3 rounded shadow">
                                    <img src={product.thumbnail} className="h-28 w-full rounded" />
                                    <p className="text-sm font-semibold mt-2">
                                        {product.title}
                                    </p>

                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="font-bold text-sm">
                                            ₹{product.price}
                                        </span>

                                        {hasVariants(product) ? (
                                            <button
                                                onClick={() => openVariantPopup(product)}
                                                className="w-[72px] h-[28px] flex items-center justify-center text-xs bg-orange-500 text-white rounded"
                                            >
                                                ADD
                                            </button>
                                        ) : simpleItem ? (
                                            <div className="w-[72px] h-[28px] flex items-center justify-between border border-green-500 rounded px-1">
                                                <button
                                                    onClick={() => updateSimpleQty(product.id, -1)}
                                                    className="w-6 h-full flex items-center justify-center font-bold text-green-600"
                                                >
                                                    −
                                                </button>

                                                <span className="text-xs font-semibold text-green-700">
                                                    {simpleItem.qty}
                                                </span>

                                                <button
                                                    onClick={() => updateSimpleQty(product.id, 1)}
                                                    className="w-6 h-full flex items-center justify-center font-bold text-green-600"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addSimpleProduct(product)}
                                                className="w-[72px] h-[28px] flex items-center justify-center text-xs bg-orange-500 text-white rounded"
                                            >
                                                ADD
                                            </button>
                                        )}

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>

            {/* ===== VARIANT POPUP ===== */}
            {variantPopup.product && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-80 md:w-96 rounded-lg p-4 shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-semibold text-sm">
                                {variantPopup.product.title}
                            </h2>
                            <button onClick={closeVariantPopup}>✕</button>
                        </div>

                        <div className="space-y-2">
                            {variantPopup.product.variants?.map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() =>
                                        setVariantPopup((prev) => ({
                                            ...prev,
                                            variant: v,
                                        }))
                                    }
                                    className={`w-full flex justify-between px-3 py-2 border rounded ${variantPopup.variant?.id === v.id
                                        ? "border-orange-500 bg-orange-50"
                                        : "hover:bg-gray-50"
                                        }`}
                                >
                                    <span>{v.name}</span>
                                    <span>
                                        ₹{variantPopup.product!.price + v.price}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-3 border rounded px-3 py-1">
                                <button
                                    onClick={() =>
                                        setVariantPopup((p) => ({
                                            ...p,
                                            qty: Math.max(1, p.qty - 1),
                                        }))
                                    }
                                >
                                    −
                                </button>
                                <span>{variantPopup.qty}</span>
                                <button
                                    onClick={() =>
                                        setVariantPopup((p) => ({
                                            ...p,
                                            qty: p.qty + 1,
                                        }))
                                    }
                                >
                                    +
                                </button>
                            </div>

                            <button
                                disabled={!variantPopup.variant}
                                onClick={confirmAddVariant}
                                className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Add ₹
                                {(variantPopup.product.price +
                                    (variantPopup.variant?.price || 0)) *
                                    variantPopup.qty}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
