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
    <div className="h-screen flex bg-[#0A0B0F] relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent animate-pulse-slow"></div>
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-bl from-orange-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-float-delayed"></div>

      {/* LEFT SIDEBAR - CATEGORIES */}
      <aside className="w-32 bg-[#0F1116]/90 backdrop-blur-2xl border-r border-white/5 flex flex-col relative z-20">
        {/* Logo */}
        <div className="p-4 border-b border-white/5">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-full aspect-square bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-black text-3xl">H</span>
            </div>
          </div>
        </div>

        {/* Categories with Images */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-hide">
          {/* All Items */}
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubCategory(null);
            }}
            className={`w-full px-3 transition-all duration-300 ${selectedCategory === null ? "scale-105" : ""
              }`}
          >
            <div className={`relative rounded-2xl overflow-hidden ${selectedCategory === null
                ? "ring-2 ring-orange-500 shadow-lg shadow-orange-500/50"
                : "hover:ring-2 hover:ring-white/20"
              }`}>
              <div className={`aspect-square bg-gradient-to-br ${selectedCategory === null
                  ? "from-orange-500 via-pink-500 to-purple-500"
                  : "from-white/10 to-white/5"
                } flex items-center justify-center`}>
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
            </div>
            <p className={`text-[10px] font-bold text-center mt-2 leading-tight ${selectedCategory === null ? "text-orange-400" : "text-white/60"
              }`}>
              All
            </p>
          </button>

          {/* Category Items */}
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedSubCategory(null);
                }}
                className={`w-full px-3 transition-all duration-300 ${isActive ? "scale-105" : ""
                  }`}
              >
                <div className={`relative rounded-2xl overflow-hidden ${isActive
                    ? "ring-2 ring-orange-500 shadow-lg shadow-orange-500/50"
                    : "hover:ring-2 hover:ring-white/20"
                  }`}>
                  <img
                    src={cat.thumbnail}
                    alt={cat.name}
                    className="w-full aspect-square object-cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/40 to-transparent"></div>
                  )}
                </div>
                <p className={`text-[10px] font-bold text-center mt-2 leading-tight capitalize ${isActive ? "text-orange-400" : "text-white/60"
                  }`}>
                  {cat.name.replace(/-/g, " ")}
                </p>
              </button>
            );
          })}
        </div>

        {/* Settings */}
        <div className="p-3 border-t border-white/5">
          <button className="w-full aspect-square bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all">
            <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* HEADER */}
        <header className="bg-[#0F1116]/80 backdrop-blur-2xl border-b border-white/5 px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-white via-orange-200 to-pink-200 bg-clip-text text-transparent">
                {selectedCategory ? selectedCategory.replace(/-/g, " ").toUpperCase() : "ALL PRODUCTS"}
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{filteredProducts.length} items available</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-5 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold text-white transition-all">
                Analytics
              </button>
            </div>
          </div>
        </header>

        {/* SUBCATEGORIES (if category selected) */}
        {selectedCategory && subCategories.length > 0 && (
          <div className="bg-[#0F1116]/60 backdrop-blur-xl border-b border-white/5 px-6 py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {subCategories.map((sub) => {
                const active = selectedSubCategory === sub.name;
                return (
                  <button
                    key={sub.name}
                    onClick={() => setSelectedSubCategory(active ? null : sub.name)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all duration-300 ${active
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50"
                        : "bg-white/5 backdrop-blur-xl text-white/60 hover:bg-white/10 border border-white/10 hover:border-white/20 hover:text-white"
                      }`}
                  >
                    {sub.name.replace(/-/g, " ")}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PRODUCTS GRID */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-modern">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
            {filteredProducts.map((product) => {
              const simpleKey = getSimpleKey(product.id);
              const simpleItem = cart[simpleKey];
              const isInCart = !!simpleItem;

              return (
                <div
                  key={product.id}
                  className={`product-card group relative rounded-2xl overflow-hidden transition-all duration-500 ${isInCart
                      ? "bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-green-500/50 shadow-2xl shadow-green-500/30 scale-105 ring-4 ring-green-500/20"
                      : "bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-orange-500/20"
                    }`}
                >
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-orange-500/10 group-hover:via-pink-500/10 group-hover:to-purple-500/10 transition-all duration-500 rounded-2xl"></div>

                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-black/20">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-10">
                      {product.stock < 10 && (
                        <div className="px-2 py-1 bg-red-500/90 backdrop-blur-xl rounded-lg border border-red-400/30 shadow-lg">
                          <span className="text-white text-[9px] font-black uppercase tracking-wide">Low</span>
                        </div>
                      )}
                      <div className="ml-auto px-2 py-1 bg-black/40 backdrop-blur-xl rounded-lg flex items-center gap-1 border border-white/10 shadow-lg">
                        <svg className="w-2.5 h-2.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="text-[10px] font-black text-white">{product.rating}</span>
                      </div>
                    </div>

                    {/* Quantity Badge - Animated */}
                    {simpleItem && !hasVariants(product) && (
                      <div className="absolute bottom-2 right-2 animate-scale-bounce">
                        <div className="relative">
                          <div className="absolute inset-0 bg-green-500 rounded-xl blur-lg opacity-60 animate-pulse"></div>
                          <div className="relative w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl border-2 border-white/20">
                            <span className="text-white text-sm font-black">{simpleItem.qty}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 relative z-10">
                    <h3 className="font-bold text-white text-xs mb-1.5 line-clamp-2 min-h-[2rem] group-hover:text-orange-300 transition-colors leading-tight">
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-lg font-black bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                          ₹{product.price}
                        </span>
                      </div>

                      {hasVariants(product) ? (
                        <button
                          onClick={() => openVariantPopup(product)}
                          className="group/btn relative px-3 py-1.5 rounded-lg text-[10px] font-black transition-all duration-300 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 group-hover/btn:scale-110 transition-transform duration-500"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                          <span className="relative text-white flex items-center gap-1">
                            Options
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </button>
                      ) : simpleItem ? (
                        <div className="flex items-center gap-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-2 border-green-500 rounded-lg px-1.5 py-1 shadow-lg shadow-green-500/30">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSimpleQty(product.id, -1);
                            }}
                            className="w-5 h-5 flex items-center justify-center text-green-400 font-black text-sm hover:bg-green-500/30 rounded transition-all active:scale-90"
                          >
                            −
                          </button>
                          <span className="text-xs font-black text-green-300 min-w-[1rem] text-center">
                            {simpleItem.qty}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSimpleQty(product.id, 1);
                            }}
                            className="w-5 h-5 flex items-center justify-center text-green-400 font-black text-sm hover:bg-green-500/30 rounded transition-all active:scale-90"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addSimpleProduct(product)}
                          className="group/btn relative px-3 py-1.5 rounded-lg text-[10px] font-black transition-all duration-300 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 group-hover/btn:scale-110 transition-transform duration-500"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                          <span className="relative text-white flex items-center gap-1">
                            Add
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </span>
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

      {/* FLOATING CART BUTTON */}
      {totalQty > 0 && (
        <div className="fixed bottom-10 right-10 z-50 animate-slide-up-bounce">
          <button
            onClick={() => navigate("/cart")}
            className="group relative"
          >
            {/* Mega Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 animate-pulse-glow transition-opacity"></div>

            {/* Button */}
            <div className="relative flex items-center gap-5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-400 hover:via-pink-400 hover:to-purple-400 text-white pl-7 pr-9 py-6 rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-orange-500/50">
              {/* Cart Icon with Badge */}
              <div className="relative">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce-subtle">
                  <span className="text-orange-600 text-xs font-black">{totalQty}</span>
                </div>
              </div>

              {/* Text */}
              <div className="text-left">
                <p className="text-xs font-bold opacity-90 tracking-wide uppercase">View Cart</p>
                <p className="text-2xl font-black">₹{totalAmount.toFixed(2)}</p>
              </div>

              {/* Arrow */}
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>

          {/* Quick Action */}
          <div className="mt-4">
            <button
              onClick={() => dispatch(clearCart())}
              className="w-full bg-white/10 backdrop-blur-2xl hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Clear All Items
            </button>
          </div>
        </div>
      )}

      {/* ULTRA MODERN VARIANT MODAL */}
      {variantPopup.product && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#0F1116] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up-modal border border-white/10">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-10">
              <div className="absolute inset-0 bg-black/20"></div>
              <button
                onClick={closeVariantPopup}
                className="absolute top-5 right-5 w-12 h-12 bg-white/20 backdrop-blur-xl hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/20 z-10 hover:rotate-90 hover:scale-110"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative z-10">
                <h2 className="font-black text-3xl text-white mb-3">
                  {variantPopup.product.title}
                </h2>
                <p className="text-white/80 text-sm font-semibold tracking-wide">Select your preferred variant</p>
              </div>
            </div>

            {/* Variants */}
            <div className="p-8 bg-gradient-to-br from-[#0F1116] to-[#1A1B23] max-h-96 overflow-y-auto scrollbar-modern">
              <div className="grid grid-cols-2 gap-4">
                {variantPopup.product.variants?.map((v) => {
                  const isSelected = variantPopup.variant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVariantPopup((p) => ({ ...p, variant: v }))}
                      className={`group relative p-6 rounded-2xl transition-all duration-300 ${isSelected
                          ? "bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 text-white shadow-2xl shadow-orange-500/50 scale-105 border-2 border-white/20"
                          : "bg-white/5 backdrop-blur-xl text-white/70 border-2 border-white/10 hover:border-white/20 hover:bg-white/10 hover:scale-105 hover:text-white"
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center animate-scale-in">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}

                      <div className="text-left">
                        <p className={`font-bold text-lg mb-3 ${isSelected ? 'text-white' : 'text-white/90'}`}>
                          {v.name}
                        </p>
                        <p className={`text-3xl font-black ${isSelected ? 'text-white' : 'bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent'}`}>
                          ₹{variantPopup.product.price + v.price}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#0F1116] px-8 py-6 border-t-2 border-white/10 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-white/60 font-bold text-sm uppercase tracking-wide">Qty:</span>
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-white/10">
                  <button
                    onClick={() =>
                      setVariantPopup((p) => ({
                        ...p,
                        qty: Math.max(1, p.qty - 1),
                      }))
                    }
                    className="w-14 h-14 flex items-center justify-center text-white/70 hover:text-white font-black text-2xl hover:bg-white/10 rounded-l-2xl transition-all active:scale-90"
                  >
                    −
                  </button>
                  <span className="w-16 text-center font-black text-2xl text-white">
                    {variantPopup.qty}
                  </span>
                  <button
                    onClick={() =>
                      setVariantPopup((p) => ({
                        ...p,
                        qty: p.qty + 1,
                      }))
                    }
                    className="w-14 h-14 flex items-center justify-center text-white/70 hover:text-white font-black text-2xl hover:bg-white/10 rounded-r-2xl transition-all active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={confirmAddVariant}
                disabled={!variantPopup.variant}
                className="relative flex-1 group/add overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-60 group-hover/add:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-400 hover:via-emerald-400 hover:to-teal-400 disabled:from-white/10 disabled:to-white/5 text-white px-8 py-5 rounded-2xl font-black text-lg shadow-2xl transition-all duration-300 group-hover/add:scale-105 flex items-center justify-between active:scale-95">
                  <span>ADD TO CART</span>
                  <span className="bg-white/20 backdrop-blur-xl px-4 py-2 rounded-xl text-base border border-white/20">
                    ₹{((variantPopup.product.price + (variantPopup.variant?.price || 0)) * variantPopup.qty).toFixed(2)}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(3deg); }
          66% { transform: translate(-20px, 20px) rotate(-3deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, 30px) rotate(-3deg); }
          66% { transform: translate(20px, -20px) rotate(3deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes scale-bounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes scale-in {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes slide-up-bounce {
          0% { transform: translateY(100px); opacity: 0; }
          60% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up-modal {
          from { transform: translateY(50px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-scale-bounce { animation: scale-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-slide-up-bounce { animation: slide-up-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up-modal { animation: slide-up-modal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        .scrollbar-modern::-webkit-scrollbar { width: 10px; }
        .scrollbar-modern::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .scrollbar-modern::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #f97316, #ec4899, #a855f7);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        .scrollbar-modern::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(to bottom, #fb923c, #f472b6, #c084fc);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-card {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .product-card:hover {
          transform: translateY(-10px) scale(1.05) rotateX(5deg);
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default Layout;