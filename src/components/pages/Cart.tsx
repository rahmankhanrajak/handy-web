import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { updateQty, clearCart } from "../../store/cartSlice";
import foodData from "../productslist.json";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = foodData.products;

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
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-white shadow font-bold text-lg flex justify-between">
        <span>Cart</span>
        <button
          onClick={() => navigate("/products")}
          className="text-sm text-orange-500"
        >
          Back
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cartEntries.length === 0 && (
          <p className="text-center text-gray-500">
            Cart is empty
          </p>
        )}

        {cartEntries.map(([key, item]) => {
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
              className="bg-white rounded-xl p-4 shadow flex justify-between items-center"
            >
              {/* Left */}
              <div>
                <p className="font-semibold">
                  {product.title}
                </p>

                {variant && (
                  <p className="text-xs text-gray-500">
                    {variant.name}
                  </p>
                )}

                <p className="text-sm text-gray-500">
                  ₹{itemPrice} each
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                {/* Qty */}
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      decreaseQty(
                        item.productId,
                        item.variantId
                      )
                    }
                    className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200"
                  >
                    −
                  </button>

                  <span className="px-4 font-medium">
                    {item.qty}
                  </span>

                  <button
                    onClick={() =>
                      increaseQty(
                        item.productId,
                        item.variantId
                      )
                    }
                    className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <p className="font-bold w-20 text-right">
                  ₹{itemPrice * item.qty}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {totalQty > 0 && (
        <div className="p-4 bg-white border-t flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              Total ({totalQty} items)
            </p>
            <p className="text-xl font-bold">
              ₹{totalAmount}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => dispatch(clearCart())}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Clear
            </button>

            <button className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold">
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
