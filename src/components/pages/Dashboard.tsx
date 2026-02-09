import React, { useMemo, useState, useEffect } from "react";
import productslist from "../../data/productsList";
import type { CategoryItem } from "../types";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { addItem, updateQty } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import type { Product, Variant } from "../types";
import ProductCard from "../ProductCard";
import Pagination from "../Pagination";
import "../../index.css"

const ITEMS_PER_PAGE = 9;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products: Product[] = productslist;
  const cart = useSelector((state: RootState) => state.cart.items);
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

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedSubCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page]);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxButtons = 5;

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);

    return pages;
  }, [page, totalPages]);

  const hasVariants = (product: Product) =>
    Array.isArray(product.variants) && product.variants.length > 0;

  const getSimpleKey = (productId: number) => `${productId}_base`;
  const getVariantQty = (productId: number) => {
    return Object.values(cart)
      .filter((item: any) => item.productId === productId && item.variantId)
      .reduce((sum: number, item: any) => sum + item.qty, 0);
  };

  const updateVariantQty = (productId: number, delta: number) => {
    dispatch(updateQty({ productId, delta }));
  };

  const addSimpleProduct = (product: Product) => {
    dispatch(addItem({ productId: product.id, qty: 1 }));
  };

  const updateSimpleQty = (productId: number, delta: number) => {
    dispatch(updateQty({ productId, delta }));
  };

  const [variantPopup, setVariantPopup] = useState<{
    product: Product | null;
    variant: Variant | null;
    qty: number;
    addons: string[];
    step: "variant" | "addons";
  }>({
    product: null,
    variant: null,
    qty: 1,
    addons: [],
    step: "variant",
  });



  const openVariantPopup = (product: Product) => {
    setVariantPopup({
      product,
      variant: null,   // ❗ force user to select variant
      qty: 1,
      addons: [],
      step: "variant",
    });
  };



  const closeVariantPopup = () => {
    setVariantPopup({
      product: null,
      variant: null,
      qty: 1,
      addons: [],
      step: "variant",
    });
  };



  const confirmAddVariant = () => {
    if (!variantPopup.product || !variantPopup.variant) return;

    dispatch(
      addItem({
        productId: variantPopup.product.id,
        variantId: variantPopup.variant.id,
        addons: variantPopup.addons,
        qty: variantPopup.qty,
      })
    );


    closeVariantPopup();
  };

  const cartItems = Object.values(cart);
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);
  const startIndex = (page - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(page * ITEMS_PER_PAGE, filteredProducts.length);
  const addonTotal =
    variantPopup.product?.addons
      ?.filter((a) => variantPopup.addons.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0) || 0;

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50 relative overflow-hidden font-sans">
      <aside className="w-16 sm:w-28 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 flex flex-col items-center py-3 sm:py-6 shadow-xl shadow-black/5 z-30 animate-slide-in-left">
        <div className="w-9 h-9 sm:w-12 sm:h-12   rounded-xl flex items-center justify-center  mb-4 sm:mb-8 ">
          {/* <span className="text-white font-black text-base sm:text-xl">H</span> */}
          <img
            src="/Logo.png"
            alt="Logo"
            className="w-10 h-10 sm:w-8 sm:h-8 object-contain"
          />

        </div>
        <div className="flex-1 w-full  px-1 sm:px-2 space-y-2 sm:space-y-4 overflow-y-auto scrollbar-hide">
          {selectedCategory ? (
            <>
              {subCategories.map((subCat, index) => {
                const isActive = selectedSubCategory === subCat.name;
                return (
                  <button
                    key={subCat.name}
                    onClick={() => setSelectedSubCategory(subCat.name)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="w-full cursor-pointer flex  flex-col items-center gap-1 group transition-all duration-300 animate-fade-in-up"
                  >
                    <div
                      className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:scale-105 ${isActive
                        ? " scale-105 shadow-lg shadow-orange-500/20"
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
                      className={`text-[8px] sm:text-[10px] font-bold text-center capitalize max-w-full truncate transition-colors ${isActive ? "text-orange-600" : "text-gray-500"
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

            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-transparent relative">
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/60">
          <div className="px-3 sm:px-6 py-2 sm:py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth">

              {/* ALL ITEMS */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-300 shadow-sm
          ${selectedCategory === null
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-400/40 scale-[1.03]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All Items
              </button>

              {/* CATEGORY BUTTONS */}
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.name;

                return (

                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSelectedSubCategory(null);
                    }}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-300 shadow-sm
              ${isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-400/40 scale-[1.03]"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <img
                      src={cat.thumbnail}
                      alt={cat.name}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-white shadow"
                    />

                    <span className="capitalize whitespace-nowrap">
                      {cat.name.replace(/-/g, " ")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>




        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Products Scroll Area */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-6 scrollbar-modern">
            <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4">
              {paginatedProducts.map((product, index) => {
                const simpleKey = getSimpleKey(product.id);
                const simpleItem = cart[simpleKey];

                const variantQty = getVariantQty(product.id);

                const added = !!simpleItem || variantQty > 0;

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    added={added}
                    simpleItem={simpleItem}
                    variantQty={variantQty}
                    hasVariants={hasVariants}
                    openVariantPopup={openVariantPopup}
                    updateSimpleQty={updateSimpleQty}
                    updateVariantQty={updateVariantQty}
                    addSimpleProduct={addSimpleProduct}
                    index={index}
                  />
                );
              })}

            </div>
          </div>

          <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-40 bg-transparent">
            <Pagination
              page={page}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={filteredProducts.length}
              setPage={setPage}
            />
          </div>
        </div>

      </div>
      <div className="fixed bottom-4 sm:bottom-8 left-4 sm:right-8 z-50">
        <button
          onClick={() => navigate("/cart")}
          className={`flex items-center gap-3 sm:gap-4 pl-4 sm:pl-6 pr-5 sm:pr-8 py-3 sm:py-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 ${totalQty > 0
            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/50 animate-cart-pulse"
            : "bg-gray-800 text-white shadow-gray-900/50"
            }`}
        >
          <div className="relative">
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[9px] sm:text-[10px] font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-scale-pop">
                {totalQty}
              </span>
            )}
          </div>

          <div className="text-left cursor-pointer">
            <p
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${totalQty > 0 ? "text-orange-100" : "text-gray-400"
                }`}
            >
              {totalQty > 0 ? "View Cart" : "Cart Empty"}
            </p>
          </div>
        </button>
      </div>


      {variantPopup.product && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-bounce">
            <div className="relative h-40 bg-gradient-to-br from-orange-400 to-red-500 overflow-hidden">
              <img
                src={variantPopup.product.thumbnail}
                className="w-full h-full object-cover opacity-40 scale-110 blur-sm"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <div className="text-orange-200 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Select Your Variant
                  </div>
                  <h2 className="text-2xl font-black text-white drop-shadow-lg">
                    {variantPopup.product.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={closeVariantPopup}
                className="absolute cursor-pointer top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur transition-all duration-300 hover:rotate-90 active:scale-90 shadow-lg"
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

            <div className="p-6">
              <div className="flex-1 overflow-y-auto p-2 sm:p-6 pb-24 scrollbar-modern">

                {/* STEP 1: VARIANT SELECTION */}
                {variantPopup.step === "variant" && (
                  <div className="space-y-2">
                    {variantPopup.product?.variants?.map((v) => {
                      const isSelected = variantPopup.variant?.id === v.id;

                      return (
                        <button
                          key={v.id}
                          onClick={() =>
                            setVariantPopup((p) => ({
                              ...p,
                              variant: v,
                              step: "addons", // ✅ go next step
                            }))
                          }
                          className={`w-full cursor-pointer flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 animate-fade-in-up ${isSelected
                            ? "border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 shadow-lg shadow-orange-200/50 scale-[1.02]"
                            : "border-gray-100 hover:border-gray-200 text-gray-600"
                            }`}
                        >
                          <span className="font-bold">{v.name}</span>

                          <span className="font-black">
                            ₹{variantPopup.product!.price + v.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* STEP 2: ADDONS */}
                {variantPopup.step === "addons" && (
                  <div className="space-y-4">

                    {/* Back Button */}
                    <button
                      onClick={() =>
                        setVariantPopup((p) => ({
                          ...p,
                          step: "variant",
                        }))
                      }
                      className="text-orange-600 font-bold text-sm hover:underline cursor-pointer"
                    >
                      ← Back to Variants
                    </button>

                    {/* ADDONS LIST */}
                    {variantPopup.product?.addons && variantPopup.product.addons.length > 0 && (
                      <div>
                        <h3 className="font-black text-gray-800 mb-2">Add-ons</h3>

                        <div className="space-y-2">
                          {variantPopup.product.addons.map((addon) => {
                            const checked = variantPopup.addons.includes(addon.id);

                            return (
                              <label
                                key={addon.id}
                                className="flex items-center justify-between p-3 rounded-xl border cursor-pointer hover:bg-orange-50 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      setVariantPopup((p) => ({
                                        ...p,
                                        addons: checked
                                          ? p.addons.filter((a) => a !== addon.id)
                                          : [...p.addons, addon.id],
                                      }));
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <span className="font-bold text-gray-700">{addon.name}</span>
                                </div>

                                <span className="font-black text-gray-800">₹{addon.price}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>


              <div className=" flex items-center gap-4">
                <div className="flex items-center gap-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl px-4 py-3 shadow-inner">
                  <button
                    onClick={() =>
                      setVariantPopup((p) => ({
                        ...p,
                        qty: Math.max(1, p.qty - 1),
                      }))
                    }
                    className="text-xl cursor-pointer font-bold text-gray-600 hover:text-gray-900 transition-all duration-200 active:scale-90"
                  >
                    −
                  </button>
                  <span className="font-black text-lg w-6 text-center">
                    {variantPopup.qty}
                  </span>
                  <button
                    onClick={() =>
                      setVariantPopup((p) => ({ ...p, qty: p.qty + 1 }))
                    }
                    className="text-xl cursor-pointer font-bold text-gray-600 hover:text-gray-900 transition-all duration-200 active:scale-90"
                  >
                    +
                  </button>
                </div>

                <button
                  disabled={!variantPopup.variant}
                  onClick={confirmAddVariant}
                  className={`flex-1 font-bold py-4 rounded-xl shadow-xl transition-all duration-300 transform active:scale-95
  ${!variantPopup.variant
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white cursor-pointer hover:scale-105"
                    }`}
                >
                  Add to Cart • ₹
                  {(
                    (variantPopup.product.price +
                      (variantPopup.variant?.price || 0) +
                      addonTotal) *
                    variantPopup.qty
                  ).toFixed(2)}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
