import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  pageNumbers: number[];
  startIndex: number;
  endIndex: number;
  totalItems: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  pageNumbers,
  startIndex,
  endIndex,
  totalItems,
  setPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <p className="text-[10px] sm:text-xs font-bold text-gray-500">
        Showing <span className="text-orange-600">{startIndex}</span> -{" "}
        <span className="text-orange-600">{endIndex}</span> of{" "}
        <span className="text-gray-700">{totalItems}</span>
      </p>

      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-lg border border-gray-200/50 overflow-x-auto scrollbar-hide max-w-full flex-nowrap">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-2 sm:px-3 py-2 rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          ◀
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => setPage(1)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-[10px] sm:text-xs font-black bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300"
            >
              1
            </button>
            <span className="text-gray-400 font-black px-1">...</span>
          </>
        )}

        {pageNumbers.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 ${
              page === p
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-110"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {p}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            <span className="text-gray-400 font-black px-1">...</span>
            <button
              onClick={() => setPage(totalPages)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-[10px] sm:text-xs font-black bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-2 sm:px-3 py-2 rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Pagination;
