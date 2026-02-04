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
      variant: product.variants?.[0] || null,
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
    <div className="h-screen flex bg-slate-50 relative overflow-hidden font-sans">

      {/* SIDEBAR - SUBCATEGORIES */}
      <aside className="w-18 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-md z-30">
        {/* Brand */}
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mb-8">
          <span className="text-white font-black text-xl">H</span>
        </div>

        {/* SubCategories List */}
        <div className="flex-1 w-full px-2 space-y-4 overflow-y-auto scrollbar-hide">
          {selectedCategory ? (
            <>
              {/* ALL Subcategories Button */}
              <button
                onClick={() => setSelectedSubCategory(null)}
                className={`w-full flex flex-col items-center gap-1 group transition-all ${selectedSubCategory === null ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${selectedSubCategory === null ? 'bg-orange-100 ring-2 ring-orange-500' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                  <span className={`text-2xl ${selectedSubCategory === null ? 'grayscale-0' : 'grayscale'}`}>📋</span>
                </div>
                <span className={`text-[10px] font-bold ${selectedSubCategory === null ? 'text-orange-600' : 'text-gray-500'}`}>All</span>
              </button>

              {subCategories.map((subCat) => {
                const isActive = selectedSubCategory === subCat.name;
                return (
                  <button
                    key={subCat.name}
                    onClick={() => setSelectedSubCategory(subCat.name)}
                    className={`w-full flex flex-col items-center gap-1 group transition-all ${isActive ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl overflow-hidden shadow-sm transition-all ${isActive ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}>
                      <img src={subCat.thumbnail} alt={subCat.name} className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-[10px] font-bold text-center capitalize max-w-full truncate ${isActive ? 'text-orange-600' : 'text-gray-500'}`}>
                      {subCat.name.replace(/-/g, " ")}
                    </span>
                  </button>
                );
              })}
            </>
          ) : (
            <div className="flex items-start justify-center h-full">
                <button
                onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all ${selectedCategory === null ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm ${selectedCategory === null ? 'bg-orange-100 ring-2 ring-orange-500' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                  <span className={`text-3xl ${selectedCategory === null ? 'grayscale-0' : 'grayscale'}`}>🍽️</span>
                </div>
                <span className={`text-xs font-bold ${selectedCategory === null ? 'text-orange-600' : 'text-gray-500'}`}>All</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col bg-slate-50 relative">
        {/* Header Bar - Categories */}
        <header >
          <div className="px-6 py-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {/* ALL Button */}
              <button
                onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all ${selectedCategory === null ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm ${selectedCategory === null ? 'bg-orange-100 ring-2 ring-orange-500' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                  <span className={`text-3xl ${selectedCategory === null ? 'grayscale-0' : 'grayscale'}`}>🍽️</span>
                </div>
                <span className={`text-xs font-bold ${selectedCategory === null ? 'text-orange-600' : 'text-gray-500'}`}>All</span>
              </button>

              {categories.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => { setSelectedCategory(cat.name); setSelectedSubCategory(null); }}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all ${isActive ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <div className={`w-16 h-16 rounded-2xl overflow-hidden shadow-sm transition-all ${isActive ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}>
                      <img src={cat.thumbnail} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-xs font-bold text-center capitalize max-w-[80px] truncate ${isActive ? 'text-orange-600' : 'text-gray-500'}`}>
                      {cat.name.replace(/-/g, " ")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-modern">
          <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => {
              const simpleKey = getSimpleKey(product.id);
              const simpleItem = cart[simpleKey];

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl p-3 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 border border-gray-100 transition-all duration-300 group flex flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-50">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badge */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm text-gray-700">
                      ★ {product.rating}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-1">{product.description}</p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-black text-gray-800">₹{product.price}</span>

                      {/* Action Button */}
                      {hasVariants(product) ? (
                        <button
                          onClick={() => openVariantPopup(product)}
                          className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-100 hover:bg-orange-100 transition-colors"
                        >
                          + 
                        </button>
                      ) : simpleItem ? (
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-2 py-1 rounded-xl font-bold text-sm border border-green-100">
                          <button onClick={(e) => { e.stopPropagation(); updateSimpleQty(product.id, -1) }}>−</button>
                          <span>{simpleItem.qty}</span>
                          <button onClick={(e) => { e.stopPropagation(); updateSimpleQty(product.id, 1) }}>+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addSimpleProduct(product)}
                          className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200 hover:scale-110 transition-transform active:scale-95"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Cart Button (Light Mode) */}
      {totalQty > 0 && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce-subtle">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-4 bg-gray-900 text-white pl-6 pr-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform"
          >
            <div className="relative">
              <span className="text-2xl">🛍️</span>
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-900">
                {totalQty}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total</p>
              <p className="text-xl font-black">₹{totalAmount.toFixed(2)}</p>
            </div>
          </button>
        </div>
      )}

      {/* Variant Modal (Light Mode) */}
      {variantPopup.product && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden scale-100 animate-scale-in">
            {/* Header */}
            <div className="relative h-40 bg-gray-100">
              <img src={variantPopup.product.thumbnail} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h2 className="text-2xl font-black text-white">{variantPopup.product.title}</h2>
              </div>
              <button
                onClick={closeVariantPopup}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Select Variant</p>
              <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                {variantPopup.product.variants?.map((v) => {
                  const isSelected = variantPopup.variant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVariantPopup(p => ({ ...p, variant: v }))}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isSelected
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-100 hover:border-gray-200 text-gray-600'
                        }`}
                    >
                      <span className="font-bold">{v.name}</span>
                      <span className="font-black">₹{variantPopup.product!.price + v.price}</span>
                    </button>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-4 bg-gray-100 rounded-xl px-4 py-3">
                  <button onClick={() => setVariantPopup(p => ({ ...p, qty: Math.max(1, p.qty - 1) }))} className="text-xl font-bold text-gray-400 hover:text-gray-800">−</button>
                  <span className="font-black text-lg w-6 text-center">{variantPopup.qty}</span>
                  <button onClick={() => setVariantPopup(p => ({ ...p, qty: p.qty + 1 }))} className="text-xl font-bold text-gray-400 hover:text-gray-800">+</button>
                </div>
                <button
                  onClick={confirmAddVariant}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-orange-200 transition-transform active:scale-95"
                >
                  Add • ₹{((variantPopup.product.price + (variantPopup.variant?.price || 0)) * variantPopup.qty).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-modern::-webkit-scrollbar { width: 6px; }
        .scrollbar-modern::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-modern::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }}
        
        .animate-bounce-subtle { animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      `}</style>
    </div>
  );
};

export default Layout;