import React from "react";
import type { Product } from "../components/types";

interface ProductCardProps {
  product: Product;
  added: boolean;
  simpleItem: any;
  variantQty: number;

  hasVariants: (product: Product) => boolean;
  openVariantPopup: (product: Product) => void;

  updateSimpleQty: (productId: number, delta: number) => void;
  updateVariantQty: (productId: number, delta: number) => void;

  addSimpleProduct: (product: Product) => void;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  added,
  simpleItem,
  variantQty,
  hasVariants,
  openVariantPopup,
  updateSimpleQty,
  updateVariantQty,
  addSimpleProduct,
  index,
}) => {
  const isVariant = hasVariants(product);

  return (
    <div
      style={{ animationDelay: `${index * 30}ms` }}
      className={`rounded-2xl sm:rounded-3xl p-2 sm:p-3 transition-all duration-500 group flex flex-col border relative backdrop-blur-sm animate-fade-in-up hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${added
          ? "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-300 shadow-xl shadow-orange-200/50 ring-2 ring-orange-400/30"
          : "bg-white/90 border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/50"
        }`}
    >
      {/* Image */}
      <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden mb-2 sm:mb-3 bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-gray-800 text-[11px] sm:text-sm leading-tight mb-1 line-clamp-2 transition-colors duration-300 group-hover:text-orange-600">
          {product.title}
        </h3>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm sm:text-sm font-black text-gray-800">
            ₹{product.price}
          </span>

          {/* VARIANT PRODUCT */}
          {isVariant ? (
            variantQty > 0 ? (
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white sm:px-2 py-1 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-sm shadow-lg shadow-orange-500/40 animate-scale-in max-w-full overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateVariantQty(product.id, -1);
                  }}
                  className="w-4 h-4 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 active:scale-90 flex items-center justify-center leading-none"
                >
                  −
                </button>

                <span className="animate-number-change min-w-[14px] text-center">
                  {variantQty}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openVariantPopup(product);
                  }}
                  className="w-4 h-4 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 active:scale-90 flex items-center justify-center leading-none"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => openVariantPopup(product)}
                className="w-7 h-7 cursor-pointer sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-500/50 hover:scale-110 transition-all duration-300 transform active:scale-95 group/btn"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:rotate-90"
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
            )
          ) : simpleItem ? (
            /* SIMPLE PRODUCT */
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white sm:px-2 py-1 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-sm shadow-lg shadow-orange-500/40 animate-scale-in max-w-full overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateSimpleQty(product.id, -1);
                }}
                className="w-4 h-4 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 active:scale-90 flex items-center justify-center leading-none"
              >
                −
              </button>

              <span className="animate-number-change min-w-[14px] text-center">
                {simpleItem.qty}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateSimpleQty(product.id, 1);
                }}
                className="w-4 h-4 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 active:scale-90 flex items-center justify-center leading-none"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addSimpleProduct(product)}
              className="w-7 h-7 cursor-pointer sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-500/50 hover:scale-110 transition-all duration-300 transform active:scale-95 group/btn"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:rotate-90"
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
};

export default ProductCard;
