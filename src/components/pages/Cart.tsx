import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { updateQty, clearCart, removeItem } from "../../store/cartSlice";
import productslist from "../../data/productsList";
import type { Product } from "../types";

const TAX_PERCENT = 0.05;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products: Product[] = productslist;

  /** 🔴 REDUX CART */
  const cart = useSelector((state: RootState) => state.cart.items);
  const cartEntries = Object.entries(cart);

  const [showBill, setShowBill] = useState(false);

  const increaseQty = (productId: number, variantId?: string) => {
    dispatch(updateQty({ productId, variantId, delta: 1 }));
  };

  const decreaseQty = (productId: number, variantId?: string) => {
    dispatch(updateQty({ productId, variantId, delta: -1 }));
  };

  const cartItems = useMemo(() => {
    return cartEntries
      .map(([key, item]) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        const variant = item.variantId
          ? product.variants?.find((v) => v.id === item.variantId)
          : null;

        const itemPrice = product.price + (variant?.price || 0);

        return {
          key,
          title: product.title,
          variantName: variant?.name || null,
          qty: item.qty,
          price: itemPrice,
          total: itemPrice * item.qty,
          thumbnail: product.thumbnail,
          productId: item.productId,
          variantId: item.variantId,
        };
      })
      .filter(Boolean);
  }, [cartEntries, products]);

  const totalQty = cartItems.reduce((sum, item: any) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item: any) => sum + item.total, 0);
  const taxAmount = subtotal * TAX_PERCENT;
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="p-4 bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/50 animate-slide-down">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 flex items-center justify-center transition-all duration-300 active:scale-95 shadow-md"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div>
              <h1 className="text-xl font-black text-gray-900">Shopping Cart</h1>
            </div>
          </div>

          {totalQty > 0 && (
            <button
              onClick={() => setShowBill(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black shadow-md shadow-orange-500/30 active:scale-95 text-sm"
            >
              View Bill
            </button>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-modern">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="w-28 h-28 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-orange-200/50">
              <svg
                className="w-14 h-14 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>

            <p className="text-lg font-bold text-gray-400 mb-2">
              Your cart is empty
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/30 active:scale-95"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl mx-auto">
            {cartItems.map((item: any, index: number) => (
              <div
                key={item.key}
                style={{ animationDelay: `${index * 50}ms` }}
                className="relative  bg-white/90 backdrop-blur-sm rounded-3xl p-3 shadow-lg border border-gray-200/50 transition-all duration-500 animate-fade-in-up"
              >{/* Delete Button (Top Right) */}
                <button
                  onClick={() =>
                    dispatch(removeItem({ productId: item.productId, variantId: item.variantId }))
                  }
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center active:scale-95 transition shadow-sm"
                  title="Remove Item"
                >
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg">
                      {item.qty}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-gray-900 text-sm leading-tight">
                        {item.title}
                      </h3>

                      {item.variantName && (
                        <p className="text-xs text-orange-600 font-bold">
                          {item.variantName}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 font-medium mt-1">
                        ₹{item.price.toFixed(2)} per item
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() =>
                            decreaseQty(item.productId, item.variantId)
                          }
                          className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-700 font-bold shadow-sm active:scale-95"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>

                        <span className="px-3 font-black text-sm text-gray-900 min-w-[2rem] text-center">
                          {item.qty}
                        </span>

                        <button
                          onClick={() =>
                            increaseQty(item.productId, item.variantId)
                          }
                          className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold shadow-md active:scale-95"
                        >
                          <svg
                            className="w-4 h-4"
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
                      </div>

                      {/* Total */}
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-gray-900">
                          ₹{item.total.toFixed(2)}
                        </p>


                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {totalQty > 0 && (
        <div className="px-4 py-3 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-xl shadow-black/5 animate-slide-up">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Grand Total
              </p>
              <p className="text-xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-none">
                ₹{grandTotal.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => dispatch(clearCart())}
                className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold shadow-sm active:scale-95 flex items-center gap-1 text-xs"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear
              </button>

              <button
                onClick={() => setShowBill(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-black shadow-md active:scale-95 flex items-center gap-1 text-xs"
              >
                Bill
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BILL POPUP MODAL */}
      {showBill && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">Bill Summary</h2>

              <button
                onClick={() => setShowBill(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
              {cartItems.map((item: any) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      {item.title}
                    </p>
                    {item.variantName && (
                      <p className="text-xs text-orange-600 font-semibold">
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {item.qty} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>

                  <p className="font-black text-gray-900 text-sm">
                    ₹{item.total.toFixed(2)}
                  </p>
                </div>
              ))}

              {/* Summary */}
              <div className="bg-gray-50 rounded-2xl p-3 mt-3 space-y-2 border">
                <div className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>Tax (5%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-gray-900 border-t pt-2">
                  <span>Grand Total</span>
                  <span className="text-orange-600">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t flex gap-2">
              <button
                onClick={() => setShowBill(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-200 font-bold text-gray-800 active:scale-95"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setShowBill(false);
                  navigate("/qrcode");
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black shadow-md active:scale-95"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-modern::-webkit-scrollbar { width: 6px; }
        .scrollbar-modern::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-modern::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #fb923c, #f97316);
          border-radius: 10px; 
        }

        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        .animate-slide-down { animation: slideDown 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out backwards; }
      `}</style>
    </div>
  );
};

export default Cart;
