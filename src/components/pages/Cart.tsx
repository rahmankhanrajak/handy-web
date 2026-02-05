import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { updateQty, clearCart } from "../../store/cartSlice";
import productslist from "../../data/productsList";
import type { Product } from "../types";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const products = productslist;
  const products: Product[] = productslist;

  /** 🔴 REDUX CART */
  const cart = useSelector((state: RootState) => state.cart.items);
  const cartEntries = Object.entries(cart);

  const increaseQty = (productId: number, variantId?: string) => {
    dispatch(updateQty({ productId, variantId, delta: 1 }));
  };

  const decreaseQty = (productId: number, variantId?: string) => {
    dispatch(updateQty({ productId, variantId, delta: -1 }));
  };

  const totalQty = cartEntries.reduce(
    (sum, [, item]) => sum + item.qty,
    0
  );

  const totalAmount = cartEntries.reduce((sum, [, item]) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return sum;

    if (item.variantId) {
      const variant = product.variants?.find(
        v => v.id === item.variantId
      );
      return (
        sum +
        (product.price + (variant?.price || 0)) * item.qty
      );
    }

    return sum + product.price * item.qty;
  }, 0);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="p-5 bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/50 animate-slide-down">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/products")}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div>
              <h1 className="text-2xl font-black text-gray-900">Shopping Cart</h1>
              <p className="text-xs text-gray-500 font-medium">Review your order</p>
            </div>
          </div>

          {/* {totalQty > 0 && (
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-2xl shadow-lg shadow-orange-500/30 animate-scale-in">
              <p className="text-xs font-bold opacity-90">Total Items</p>
              <p className="text-2xl font-black">{totalQty}</p>
            </div>
          )} */}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-modern">
        {cartEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6 animate-pulse-subtle shadow-xl shadow-orange-200/50">
              <svg className="w-16 h-16 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-400 mb-2">Your cart is empty</p>
            <p className="text-sm text-gray-400 mb-6">Add some delicious items to get started!</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl mx-auto">
            {cartEntries.map(([key, item], index) => {
              const product = products.find(
                p => p.id === item.productId
              );
              if (!product) return null;

              const variant = item.variantId
                ? product.variants?.find(
                  v => v.id === item.variantId
                )
                : null;

              const itemPrice =
                product.price + (variant?.price || 0);

              return (
                <div
                  key={key}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 shadow-lg hover:shadow-xl border border-gray-200/50 transition-all duration-500 hover:scale-[1.01] animate-fade-in-up group"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                        />
                      </div>
                      {/* Item Count Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg animate-scale-pop">
                        {item.qty}
                      </div>
                    </div>

                    {/* Product Info & Controls */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                          {product.title}
                        </h3>

                        {variant && (
                          <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-lg mb-2">
                            <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="text-xs font-bold text-orange-600">
                              {variant.name}
                            </span>
                          </div>
                        )}

                        <p className="text-sm text-gray-500 font-medium">
                          ₹{itemPrice.toFixed(2)} per item
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl shadow-inner p-1">
                          <button
                            onClick={() =>
                              decreaseQty(
                                item.productId,
                                item.variantId
                              )
                            }
                            className="w-9 h-9 rounded-xl bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 font-bold transition-all duration-200 hover:scale-110 active:scale-90 shadow-sm"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                          </button>

                          <span className="px-4 font-black text-lg text-gray-900 min-w-[3rem] text-center animate-number-change">
                            {item.qty}
                          </span>

                          <button
                            onClick={() =>
                              increaseQty(
                                item.productId,
                                item.variantId
                              )
                            }
                            className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-600 flex items-center justify-center text-white font-bold transition-all duration-200 hover:scale-110 active:scale-90 shadow-md shadow-orange-500/40"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        {/* Item Total Price */}
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Subtotal</p>
                          <p className="text-xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            ₹{(itemPrice * item.qty).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer - Checkout Section */}
      {totalQty > 0 && (
        <div className="p-5 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl shadow-black/10 animate-slide-up">
          <div className="max-w-4xl mx-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-3 border border-blue-200">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Items</p>
                <p className="text-2xl font-black text-blue-700">{totalQty}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-3 border border-purple-200">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">Tax</p>
                <p className="text-2xl font-black text-purple-700">₹{(totalAmount * 0.05).toFixed(2)}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-3 border border-orange-200">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Subtotal</p>
                <p className="text-2xl font-black text-orange-700">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Total & Actions */}
            {/* Total & Actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                  Grand Total
                </p>

                <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-none">
                  ₹{(totalAmount * 1.05).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 active:scale-95 flex items-center gap-1.5 text-sm"
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

                <button onClick={()=>navigate("/QrPage")} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-black shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 active:scale-95 flex items-center gap-2 text-sm">
                  <span>Order</span>
                  <svg
                    className="w-5 h-5"
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
        </div>
      )}

      <style>{`
        /* Scrollbar Styles */
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

        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
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

        @keyframes scalePop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        @keyframes pulseSoft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes numberChange {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        /* Apply Animations */
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-slide-down { animation: slideDown 0.4s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out backwards; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
        .animate-scale-pop { animation: scalePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-pulse-subtle { animation: pulseSoft 3s ease-in-out infinite; }
        .animate-number-change { animation: numberChange 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Cart;