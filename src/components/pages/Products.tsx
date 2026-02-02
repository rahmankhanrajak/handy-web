import React from "react";
import foodData from "../productslist.json"

const Layout: React.FC = () => {
    const products = foodData.products;
    const categories: string[] = [
        "all",
        ...Array.from(new Set(products.map(p => p.category)))
    ];



    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* 🔝 Header */}
            <header className="h-16 bg-white border-b flex items-center px-4 gap-4">
                {/* Brand */}
                <div className="text-xl font-bold text-orange-500 shrink-0">
                    Alab
                </div>

                {/* Categories */}
                <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-2 py-2 min-w-max">
                      {categories.map((item,index)=>(<button key={index} className="px-4 py-1.5 rounded-full text-sm font-medium bg-orange-500 text-white">
                           {item}
                        </button>)
                    )}  <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-orange-500 text-white">
                            Category 1
                        </button>
                        <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-orange-500 text-white">
                            Category 1
                        </button>
                        <button className="px-4 py-1.5 rounded-full text-sm bg-gray-100 hover:bg-gray-200">
                            Category 2
                        </button>
                        <button className="px-4 py-1.5 rounded-full text-sm bg-gray-100 hover:bg-gray-200">
                            Category 3
                        </button>
                        <button className="px-4 py-1.5 rounded-full text-sm bg-gray-100 hover:bg-gray-200">
                            Category 4
                        </button>
                        <button className="px-4 py-1.5 rounded-full text-sm bg-gray-100 hover:bg-gray-200">
                            Category 5
                        </button>
                        <button className="px-4 py-1.5 rounded-full text-sm bg-gray-100 hover:bg-gray-200">
                            Category 6
                        </button>
                    </div>
                </div>
            </header>


            {/* ⬅️ Sidebar + Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* ⬅️ Subcategory Sidebar */}
                <aside className="lg:w-20 bg-white border-r overflow-y-auto">
                    <div className="px-4 py-3 text-sm font-semibold bg-orange-50 text-orange-600 border-l-4 border-orange-500">
                        Sub 1
                    </div>
                    <div className="px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer">
                        Sub  2
                    </div>
                    <div className="px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer">
                        Sub  3
                    </div>
                    <div className="px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer">
                        Sub  4
                    </div>
                </aside>

                {/* 📦 Main Content Area */}
                <main className="flex-1 p-4 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="h-36 bg-white rounded-lg shadow-sm" />
                        <div className="h-36 bg-white rounded-lg shadow-sm" />
                        <div className="h-36 bg-white rounded-lg shadow-sm" />
                        <div className="h-36 bg-white rounded-lg shadow-sm" />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
