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
      <div className="flex items-center gap-2 bg-transparent px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-none border-none overflow-x-auto scrollbar-hide max-w-full flex-nowrap">

       <button
  disabled={page === 1}
  onClick={() => setPage((p) => Math.max(1, p - 1))}
  className="px-2 sm:px-3 py-2 rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/30"
>
  ◀
</button>


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
  className="px-2 sm:px-3 py-2 rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/30"
>
  ▶
</button>

      </div>
    </div>
  );
};

export default Pagination;
