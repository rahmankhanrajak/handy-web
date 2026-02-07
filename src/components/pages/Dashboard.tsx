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

const ITEMS_PER_PAGE = 12;

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

  const cartItems = Object.values(cart);
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);
  const startIndex = (page - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(page * ITEMS_PER_PAGE, filteredProducts.length);

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50 relative overflow-hidden font-sans">
      <aside className="w-16 sm:w-28 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 flex flex-col items-center py-3 sm:py-6 shadow-xl shadow-black/5 z-30 animate-slide-in-left">
        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-orange-500  rounded-xl flex items-center justify-center  mb-4 sm:mb-8 animate-pulse-subtle">
          <span className="text-white font-black text-base sm:text-xl">H</span>
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
        <header className="sticky top-0 z-40  backdrop-blur-xl ">
          <div className="px-3 sm:px-6 py-1 sm:py-4">
            <div className="overflow-x-auto scrollbar-hide scroll-smooth">
              <div className="flex w-max gap-3 sm:gap-5 pb-2">

                {/* ALL ITEMS */}
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubCategory(null);
                  }}
                  className="flex-shrink-0 flex flex-col items-center gap-1 sm:gap-2"
                >
                  <div
                    className={`w-12 h-12 cursor-pointer sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300
              ${selectedCategory === null
                        ? "bg-orange-500  text-white "
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </div>
                  <span
                    className={`text-[10px]  sm:text-xs font-bold text-center max-w-[70px] truncate 
              ${selectedCategory === null
                        ? "text-orange-500"
                        : "text-gray-500"
                      }`}
                  >
                    All Items
                  </span>
                </button>

                {/* CATEGORY LIST */}
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.name;

                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSelectedSubCategory(null);
                      }}
                      className="flex-shrink-0 cursor-pointer flex flex-col items-center gap-1 sm:gap-2 group"
                    >
                      <div
                        className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md transition-all duration-300
                  ${isActive
                            ? " scale-105 shadow-lg shadow-orange-300/40"
                            : "ring-1 ring-gray-200 hover:scale-105"
                          }`}
                      >
                        <img
                          src={cat.thumbnail}
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      <span
                        className={`text-[10px] sm:text-xs font-bold text-center capitalize max-w-[70px] truncate transition-colors
                  ${isActive
                            ? "text-orange-500"
                            : "text-gray-500"
                          }`}
                      >
                        {cat.name.replace(/-/g, " ")}
                      </span>
                    </button>
                  );
                })}
              </div>
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
                const added =
                  !!simpleItem ||
                  Object.values(cart).some((item: any) => item.productId === product.id);
                // const added = isProductAdded(product.id);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    added={added}
                    simpleItem={simpleItem}
                    hasVariants={hasVariants}
                    openVariantPopup={openVariantPopup}
                    updateSimpleQty={updateSimpleQty}
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
    className={`flex items-center gap-3 sm:gap-4 pl-4 sm:pl-6 pr-5 sm:pr-8 py-3 sm:py-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 ${
      totalQty > 0
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
        className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
          totalQty > 0 ? "text-orange-100" : "text-gray-400"
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
                {variantPopup.product.variants?.map((v, index) => {
                  const isSelected = variantPopup.variant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() =>
                        setVariantPopup((p) => ({ ...p, variant: v }))
                      }
                      style={{ animationDelay: `${index * 50}ms` }}
                      className={`w-full cursor-pointer flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 animate-fade-in-up ${isSelected
                        ? "border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 shadow-lg shadow-orange-200/50 scale-[1.02]"
                        : "border-gray-100 hover:border-gray-200 text-gray-600"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {isSelected && (
                          <div className="w-6 h-6  rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center animate-scale-pop">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
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
                  onClick={confirmAddVariant}
                  className="flex-1  cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
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
    </div>
  );
};

export default Dashboard;
