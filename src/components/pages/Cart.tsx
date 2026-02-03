import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Cart = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state || !state.cart || !state.products) {
        return (
            <div className="p-6">
                <p>No cart data found</p>
                <button
                    onClick={() => navigate("/products")}
                    className="mt-3 px-4 py-2 bg-orange-500 text-white rounded"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const { cart, products } = state;

    // Local cart state (important for + / -)
    const [cartState, setCartState] = useState(cart);

    // Keep ORIGINAL cart keys
    const cartEntries = Object.entries(cartState);

    const increaseQty = (key: string) => {
        setCartState((prev: any) => {
            if (!prev[key]) return prev;
            return {
                ...prev,
                [key]: {
                    ...prev[key],
                    qty: prev[key].qty + 1,
                },
            };
        });
    };

    const decreaseQty = (key: string) => {
        setCartState((prev: any) => {
            if (!prev[key]) return prev;

            if (prev[key].qty === 1) {
                const copy = { ...prev };
                delete copy[key];
                return copy;
            }

            return {
                ...prev,
                [key]: {
                    ...prev[key],
                    qty: prev[key].qty - 1,
                },
            };
        });
    };

    const totalQty = cartEntries.reduce(
        (sum: number, [, item]: any) => sum + item.qty,
        0
    );

    const totalAmount = cartEntries.reduce(
        (sum: number, [, item]: any) => {
            const product = products.find(
                (p: any) => p.id === item.productId
            );
            return sum + (product?.price || 0) * item.qty;
        },
        0
    );

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="p-4 bg-white shadow font-bold text-lg">
                Cart
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartEntries.length === 0 && (
                    <p className="text-center text-gray-500">
                        Cart is empty
                    </p>
                )}

                {cartEntries.map(([key, item]: any) => {
                    const product = products.find(
                        (p: any) => p.id === item.productId
                    );
                    if (!product) return null;

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
                                <p className="text-sm text-gray-500">
                                    ₹{product.price} each
                                </p>
                            </div>

                            {/* Right */}
                            <div className="flex items-center gap-4">
                                {/* Qty */}
                                <div className="flex items-center border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => decreaseQty(key)}
                                        className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 font-medium">
                                        {item.qty}
                                    </span>
                                    <button
                                        onClick={() => increaseQty(key)}
                                        className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Price */}
                                <p className="font-bold w-20 text-right">
                                    ₹{product.price * item.qty}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">
                        Total ({totalQty} items)
                    </p>
                    <p className="text-xl font-bold">
                        ₹{totalAmount}
                    </p>
                </div>

                <button className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold">
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default Cart;
