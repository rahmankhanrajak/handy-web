import React, { useMemo, useState } from "react";
import foodData from "../productslist.json";
import type { CategoryItem } from "../types";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { addItem, updateQty, clearCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";

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

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products: Product[] = foodData.products;

  /* ================= REDUX CART ================= */
  const cart = useSelector((state: RootState) => state.cart.items);

  /* ================= CATEGORY ================= */
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

  /* ================= HELPERS ================= */
  const hasVariants = (product: Product) =>
    Array.isArray(product.variants) && product.variants.length > 0;

  const getSimpleKey = (productId: number) => `${productId}_base`;

  /* ================= SIMPLE ITEM ================= */
  const addSimpleProduct = (product: Product) => {
    dispatch(addItem({ productId: product.id, qty: 1 }));
  };

  const updateSimpleQty = (productId: number, delta: number) => {
    dispatch(updateQty({ productId, delta }));
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
    setVariantPopup({
      product,
      variant: product.variants?.[0] || null, // ✅ first variant auto-selected
      qty: 1,
    });
  };

  const closeVariantPopup = () => {
    setVariantPopup({ product: null, variant: null, qty: 1 });
  };

  const confirmAddVariant = () => {
    if (!variantPopup.product || !variantPopup.variant) return;

    dispatch(
      addItem({
        productId: variantPopup.product.id,
        variantId: variantPopup.variant.id,
        qty: variantPopup.qty,
      })
    );

    closeVariantPopup();
  };

  /* ================= TOTALS ================= */
  const cartItems = Object.values(cart);

  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);

  const totalAmount = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return sum;

    if (item.variantId) {
      const variant = product.variants?.find(
        (v) => v.id === item.variantId
      );
      return (
        sum +
        (product.price + (variant?.price || 0)) * item.qty
      );
    }

    return sum + product.price * item.qty;
  }, 0);

  /* ================= UI ================= */
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {/* SUBCATEGORY SIDEBAR */}
        <aside className="w-24 md:w-32 bg-white border-r overflow-y-auto">
          <div className="h-14 flex items-center justify-center font-semibold border-b">
            Handy
          </div>

          <div className="py-2">
            {subCategories.map((sub) => {
              const active = selectedSubCategory === sub.name;
              return (
                <button
                  key={sub.name}
                  onClick={() => setSelectedSubCategory(sub.name)}
                  className={`w-full py-3 flex flex-col items-center
                    ${active ? "bg-orange-50" : "hover:bg-gray-100"}
                  `}
                >
                  <img
                    src={sub.thumbnail}
                    className={`h-10 w-10 rounded-md
                      ${active ? "ring-2 ring-orange-500" : ""}
                    `}
                  />
                  <span className="text-xs mt-1 capitalize">
                    {sub.name.replace(/-/g, " ")}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-3 overflow-y-auto">
          {/* CATEGORY BAR */}
          <div className="flex gap-2 overflow-x-auto mb-3">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubCategory(null);
              }}
              className={`min-w-[72px] h-[88px] rounded-xl border-2
                ${
                  selectedCategory === null
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white"
                }
              `}
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
                className={`min-w-[88px] h-[96px] rounded-xl border-2
                  ${
                    selectedCategory === cat.name
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }
                `}
              >
                <img
                  src={cat.thumbnail}
                  className="h-12 w-12 mx-auto rounded-lg"
                />
                <span className="text-sm font-semibold mt-2 block">
                  {cat.name.replace(/-/g, " ")}
                </span>
              </button>
            ))}
          </div>

          {/* PRODUCTS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => {
              const simpleKey = getSimpleKey(product.id);
              const simpleItem = cart[simpleKey];

              return (
                <div key={product.id} className="bg-white p-3 rounded shadow">
                  <img
                    src={product.thumbnail}
                    className="h-28 w-full rounded"
                  />

                  <p className="mt-2 font-semibold text-sm">
                    {product.title}
                  </p>

                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-sm">
                      ₹{product.price}
                    </span>

                    {hasVariants(product) ? (
                      <button
                        onClick={() => openVariantPopup(product)}
                        className="w-[72px] h-[28px] bg-orange-500 text-white rounded text-xs"
                      >
                        ADD
                      </button>
                    ) : simpleItem ? (
                      <div className="w-[72px] h-[28px] flex items-center justify-between border border-green-500 rounded px-1">
                        <button
                          onClick={() =>
                            updateSimpleQty(product.id, -1)
                          }
                        >
                          −
                        </button>
                        <span className="text-xs font-semibold">
                          {simpleItem.qty}
                        </span>
                        <button
                          onClick={() =>
                            updateSimpleQty(product.id, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addSimpleProduct(product)}
                        className="w-[72px] h-[28px] bg-orange-500 text-white rounded text-xs"
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

      {/* FOOTER */}
      {totalQty > 0 && (
        <div className="bg-white border-t p-3 flex justify-between items-center">
          <button
            onClick={() => dispatch(clearCart())}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

          <div className="text-center">
            <p className="text-xs">Items: {totalQty}</p>
            <p className="font-bold text-lg">₹{totalAmount}</p>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="bg-green-600 text-white px-5 py-2 rounded"
          >
            Proceed
          </button>
        </div>
      )}

      {/* VARIANT POPUP */}
      {variantPopup.product && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-80 rounded-xl p-4 relative">
            <button
              onClick={closeVariantPopup}
              className="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full"
            >
              ✕
            </button>

            <h2 className="font-semibold mb-3">
              {variantPopup.product.title}
            </h2>

            {variantPopup.product.variants?.map((v) => (
              <button
                key={v.id}
                onClick={() =>
                  setVariantPopup((p) => ({ ...p, variant: v }))
                }
                className={`w-full flex justify-between p-2 border rounded mb-2
                  ${
                    variantPopup.variant?.id === v.id
                      ? "border-orange-500 bg-orange-50"
                      : ""
                  }
                `}
              >
                <span>{v.name}</span>
                <span>
                  ₹{variantPopup.product.price + v.price}
                </span>
              </button>
            ))}

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4 border rounded px-3 py-1">
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
                onClick={confirmAddVariant}
                className="bg-orange-500 text-white px-4 py-2 rounded"
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
