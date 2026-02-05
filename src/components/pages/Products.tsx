import React, { useMemo, useState } from "react";
import foodData from "../productslist.json";
import type { CategoryItem } from "../types";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { addItem, updateQty } from "../../store/cartSlice";
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

  const isProductAdded = (productId: number) => {
    const key = getSimpleKey(productId);
    return !!cart[key];
  };

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
      const variant = product.variants?.find((v) => v.id === item.variantId);
      return sum + (product.price + (variant?.price || 0)) * item.qty;
    }

    return sum + product.price * item.qty;
  }, 0);

  /* ================= UI ================= */
  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50 relative overflow-hidden font-sans">
      {/* SIDEBAR - SUBCATEGORIES */}
      <aside className="w-28 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 flex flex-col items-center py-6 shadow-xl shadow-black/5 z-30 animate-slide-in-left">
        {/* Brand */}
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/40 mb-8 animate-pulse-subtle">
          <span className="text-white font-black text-xl">H</span>
        </div>

        {/* SubCategories List */}
        <div className="flex-1 w-full px-2 space-y-4 overflow-y-auto scrollbar-hide">
          {selectedCategory ? (
            <>
              {/* ALL Subcategories Button */}
              <button
                onClick={() => setSelectedSubCategory(null)}
                className="w-full flex flex-col items-center gap-1 group transition-all duration-300 animate-fade-in"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 ${
                    selectedSubCategory === null
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white ring-4 ring-orange-200 scale-105 shadow-lg shadow-orange-500/30"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-600"
                  }`}
                >
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <span
                  className={`text-[10px] font-bold transition-colors ${
                    selectedSubCategory === null
                      ? "text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  View All
                </span>
              </button>

              {subCategories.map((subCat, index) => {
                const isActive = selectedSubCategory === subCat.name;
                return (
                  <button
                    key={subCat.name}
                    onClick={() => setSelectedSubCategory(subCat.name)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="w-full flex flex-col items-center gap-1 group transition-all duration-300 animate-fade-in-up"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:scale-105 ${
                        isActive
                          ? "ring-4 ring-orange-200 scale-105 shadow-lg shadow-orange-500/20"
                          : "ring-1 ring-gray-100 hover:ring-gray-200"
                      }`}
                    >
                      <img
                        src={subCat.thumbnail}
                        alt={subCat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <span
                      className={`text-[10px] font-bold text-center capitalize max-w-full truncate transition-colors ${
                        isActive ? "text-orange-600" : "text-gray-500"
                      }`}
                    >
                      {subCat.name.replace(/-/g, " ")}
                    </span>
                  </button>
                );
              })}
            </>
          ) : (
            <div className="flex items-start justify-center h-full">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                }}
                className="flex-shrink-0 flex flex-col items-center gap-2 group transition-all duration-300 animate-fade-in"
              >
               <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 ${
                    selectedSubCategory === null
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white ring-4 ring-orange-200 scale-105 shadow-lg shadow-orange-500/30"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-600"
                  }`}
                >
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <span className="text-xs font-bold ">All Items</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col bg-transparent relative">
        {/* Header Bar - Categories */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-black/5 animate-slide-down">
          <div className="px-6 py-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {/* ALL Button */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                }}
                className="flex-shrink-0 flex flex-col items-center gap-2 group transition-all duration-300 animate-fade-in"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105 ${
                    selectedCategory === null
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white ring-4 ring-orange-200 scale-105 shadow-lg shadow-orange-500/40"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-600"
                  }`}
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <span
                  className={`text-xs font-bold transition-colors ${
                    selectedCategory === null
                      ? "text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  All Items
                </span>
              </button>

              {categories.map((cat, index) => {
                const isActive = selectedCategory === cat.name;

                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSelectedSubCategory(null);
                    }}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="flex-shrink-0 flex flex-col items-center gap-2 transition-all duration-300 animate-fade-in-up"
                  >
                    {/* Image Tile */}
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-gray-100 group">
                      <img
                        src={cat.thumbnail}
                        alt={cat.name}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                          isActive ? "brightness-110" : "brightness-95"
                        }`}
                      />

                      {/* Highlight Border */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-2xl ring-4 ring-orange-400 ring-offset-2 ring-offset-white animate-scale-in"></div>
                      )}
                    </div>

                    {/* Name */}
                    <span
                      className={`text-xs font-bold text-center capitalize max-w-[80px] truncate transition-colors ${
                        isActive ? "text-orange-600" : "text-gray-500"
                      }`}
                    >
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
            {filteredProducts.map((product, index) => {
              const simpleKey = getSimpleKey(product.id);
              const simpleItem = cart[simpleKey];
              const added = isProductAdded(product.id);

              return (
                <div
                  key={product.id}
                  style={{ animationDelay: `${index * 30}ms` }}
                  className={`rounded-3xl p-3 transition-all duration-500 group flex flex-col border relative backdrop-blur-sm animate-fade-in-up hover:scale-[1.02] active:scale-[0.98] ${
                    added
                      ? "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-300 shadow-xl shadow-orange-200/50 ring-2 ring-orange-400/30"
                      : "bg-white/90 border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/50"
                  }`}
                >
                  {/* Added Badge */}
                  {added && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg animate-scale-pop z-10">
                      ✓ ADDED
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm text-gray-700 transition-transform duration-300 group-hover:scale-110">
                      ★ {product.rating}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1 line-clamp-2 transition-colors duration-300 group-hover:text-orange-600">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-1">
                      {product.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-black text-gray-800">
                        ₹{product.price}
                      </span>

                      {/* Action Button */}
                      {hasVariants(product) ? (
                        <button
                          onClick={() => openVariantPopup(product)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg ${
                            added
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400 shadow-orange-500/40"
                              : "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100 shadow-orange-200/50"
                          }`}
                        >
                          +
                        </button>
                      ) : simpleItem ? (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-1 rounded-xl font-black text-sm shadow-lg shadow-orange-500/40 animate-scale-in">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSimpleQty(product.id, -1);
                            }}
                            className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 active:scale-90"
                          >
                            −
                          </button>
                          <span className="animate-number-change">{simpleItem.qty}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSimpleQty(product.id, 1);
                            }}
                            className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 active:scale-90"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addSimpleProduct(product)}
                          className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-500/50 hover:scale-110 transition-all duration-300 transform active:scale-95 group/btn"
                        >
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover/btn:rotate-90"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                            />
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

      {/* Floating Cart Button - Always Visible & Enhanced */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => navigate("/cart")}
          className={`flex items-center gap-4 pl-6 pr-8 py-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 ${
            totalQty > 0
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/50 animate-cart-pulse"
              : "bg-gray-800 text-white shadow-gray-900/50"
          }`}
        >
          <div className="relative">
            <span className={`text-2xl ${totalQty > 0 ? 'animate-bounce-soft' : ''}`}>🛍️</span>
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-pink-600 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-scale-pop">
                {totalQty}
              </span>
            )}
          </div>
          <div className="text-left">
            <p className={`text-xs font-bold uppercase tracking-wider ${totalQty > 0 ? 'text-orange-100' : 'text-gray-400'}`}>
              {totalQty > 0 ? `${totalQty} Item${totalQty > 1 ? 's' : ''}` : 'Cart Empty'}
            </p>
            <p className="text-xl font-black">₹{totalAmount.toFixed(2)}</p>
          </div>
        </button>
      </div>

      {/* Variant Modal */}
      {variantPopup.product && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-bounce">
            {/* Header */}
            <div className="relative h-40 bg-gradient-to-br from-orange-400 to-red-500 overflow-hidden">
              <img
                src={variantPopup.product.thumbnail}
                className="w-full h-full object-cover opacity-40 scale-110 blur-sm"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <div className="text-orange-200 text-[10px] font-bold uppercase tracking-wider mb-1">Select Your Variant</div>
                  <h2 className="text-2xl font-black text-white drop-shadow-lg">
                    {variantPopup.product.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={closeVariantPopup}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur transition-all duration-300 hover:rotate-90 active:scale-90 shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-modern">
                {variantPopup.product.variants?.map((v, index) => {
                  const isSelected = variantPopup.variant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVariantPopup((p) => ({ ...p, variant: v }))}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 animate-fade-in-up ${
                        isSelected
                          ? "border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 shadow-lg shadow-orange-200/50 scale-[1.02]"
                          : "border-gray-100 hover:border-gray-200 text-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center animate-scale-pop">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <span className="font-bold">{v.name}</span>
                      </div>
                      <span className="font-black">
                        ₹{variantPopup.product!.price + v.price}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl px-4 py-3 shadow-inner">
                  <button
                    onClick={() =>
                      setVariantPopup((p) => ({
                        ...p,
                        qty: Math.max(1, p.qty - 1),
                      }))
                    }
                    className="text-xl font-bold text-gray-600 hover:text-gray-900 transition-all duration-200 active:scale-90"
                  >
                    −
                  </button>
                  <span className="font-black text-lg w-6 text-center animate-number-change">
                    {variantPopup.qty}
                  </span>
                  <button
                    onClick={() =>
                      setVariantPopup((p) => ({ ...p, qty: p.qty + 1 }))
                    }
                    className="text-xl font-bold text-gray-600 hover:text-gray-900 transition-all duration-200 active:scale-90"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={confirmAddVariant}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Add to Cart • ₹
                  {(
                    (variantPopup.product.price +
                      (variantPopup.variant?.price || 0)) *
                    variantPopup.qty
                  ).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Scrollbar Styles */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-modern::-webkit-scrollbar { width: 6px; }
        .scrollbar-modern::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-modern::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #fb923c, #f97316);
          border-radius: 10px; 
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes scaleBounce {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes scalePop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        @keyframes pulseSoft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes cartPulse {
          0%, 100% { box-shadow: 0 20px 35px -5px rgba(251, 146, 60, 0.5); }
          50% { box-shadow: 0 25px 45px -5px rgba(251, 146, 60, 0.7); }
        }

        @keyframes numberChange {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        /* Apply Animations */
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-slide-in-left { animation: slideInLeft 0.5s ease-out; }
        .animate-slide-down { animation: slideDown 0.4s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out backwards; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
        .animate-scale-bounce { animation: scaleBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-scale-pop { animation: scalePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-pulse-subtle { animation: pulseSoft 3s ease-in-out infinite; }
        .animate-bounce-soft { animation: bounceSoft 2s ease-in-out infinite; }
        .animate-cart-pulse { animation: cartPulse 2s ease-in-out infinite; }
        .animate-number-change { animation: numberChange 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Layout;