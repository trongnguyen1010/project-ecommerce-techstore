import { useState, useEffect } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface FilterSidebarProps {
    filters: {
        minPrice: string;
        maxPrice: string;
        sort: string;
    };
    onFilterChange: (newFilters: any) => void;
    onClear: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function FilterSidebar({
    filters,
    onFilterChange,
    onClear,
    isOpen,
    onClose,
}: FilterSidebarProps) {
    // Config min-max max định cho slider (Ví dụ 0 - 50 triệu)
    const MAX_PRICE = 50000000;

    // Local state for Price inputs to avoid triggering API on every keystroke
    const [localPrice, setLocalPrice] = useState({
        min: filters.minPrice,
        max: filters.maxPrice,
    });

    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isSortOpen, setIsSortOpen] = useState(true);

    // Sync Slider với Input
    const handleSliderChange = (val: number | number[]) => {
        if (Array.isArray(val)) {
            setLocalPrice({
                min: val[0].toString(),
                max: val[1].toString(),
            });
        }
    };

    const handleApplyPrice = () => {
        onFilterChange({
            minPrice: localPrice.min,
            maxPrice: localPrice.max,
        });
        // On mobile, close sidebar after applying? Maybe not.
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ sort: e.target.value });
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            <aside
                className={`
          fixed top-0 left-0 bottom-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto
          md:relative md:translate-x-0 md:bg-transparent md:shadow-none md:w-72 md:block
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="p-5">
                    <div className="flex items-center justify-between mb-6 md:hidden">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Filter size={20} /> Bộ lọc
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h3 className="font-bold text-gray-800 hidden md:block">Bộ lọc tìm kiếm</h3>
                        <button onClick={onClear} className="text-sm text-blue-600 hover:underline">
                            Xóa tất cả
                        </button>
                    </div>

                    {/* 1. KHOẢNG GIÁ */}
                    <div className="border-b pb-6 mb-6">
                        <button
                            onClick={() => setIsPriceOpen(!isPriceOpen)}
                            className="flex items-center justify-between w-full font-bold text-gray-700 mb-4"
                        >
                            <span>Khoảng giá</span>
                            {isPriceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {isPriceOpen && (
                            <div className="space-y-6 animate-in slide-in-from-top-2 duration-200 px-1">

                                {/* Thanh Slider */}
                                <div className="px-2">
                                    <Slider
                                        range
                                        min={0}
                                        max={MAX_PRICE}
                                        step={100000}
                                        value={[
                                            Number(localPrice.min) || 0,
                                            Number(localPrice.max) || MAX_PRICE
                                        ]}
                                        onChange={handleSliderChange}
                                        trackStyle={[{ backgroundColor: '#2563eb' }]}
                                        handleStyle={[
                                            { borderColor: '#2563eb', opacity: 1 },
                                            { borderColor: '#2563eb', opacity: 1 }
                                        ]}
                                        railStyle={{ backgroundColor: '#e5e7eb' }}
                                    />
                                </div>

                                {/* Inputs nhập số (Stacked layout cho rộng) */}
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="flex-1">
                                        <label className="text-gray-500 text-xs mb-1 block">Từ (₫)</label>
                                        <input
                                            type="number"
                                            value={localPrice.min}
                                            onChange={(e) =>
                                                setLocalPrice({ ...localPrice, min: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none font-medium"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="pt-5 text-gray-400">-</div>
                                    <div className="flex-1">
                                        <label className="text-gray-500 text-xs mb-1 block">Đến (₫)</label>
                                        <input
                                            type="number"
                                            value={localPrice.max}
                                            onChange={(e) =>
                                                setLocalPrice({ ...localPrice, max: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none font-medium"
                                            placeholder={MAX_PRICE.toString()}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleApplyPrice}
                                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 2. SẮP XẾP */}
                    <div className="border-b pb-6 mb-6">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center justify-between w-full font-bold text-gray-700 mb-3"
                        >
                            <span>Sắp xếp theo</span>
                            {isSortOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {isSortOpen && (
                            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="sort"
                                        value=""
                                        checked={filters.sort === ""}
                                        onChange={handleSortChange}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-gray-600 group-hover:text-blue-600 transition">
                                        Mới nhất
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="sort"
                                        value="price_asc"
                                        checked={filters.sort === "price_asc"}
                                        onChange={handleSortChange}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-gray-600 group-hover:text-blue-600 transition">
                                        Giá: Thấp đến Cao
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="sort"
                                        value="price_desc"
                                        checked={filters.sort === "price_desc"}
                                        onChange={handleSortChange}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-gray-600 group-hover:text-blue-600 transition">
                                        Giá: Cao đến Thấp
                                    </span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* More filters can go here */}
                </div>
            </aside>
        </>
    );
}
