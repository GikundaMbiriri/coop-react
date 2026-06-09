"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdAdd } from "react-icons/md";
import { useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/lib/api";
import type { Product } from "../types";

interface ProductListProps {
  onAdd: (product: Product) => void;
  onView: (product: Product) => void;
}

export default function ProductList({ onAdd, onView }: ProductListProps) {
  const selected = useAppSelector((state) => state.cart.items);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filteredProducts = useMemo(
    () => products.filter((p) => p.title.includes(search)),
    [products, search]
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filteredProducts, page]
  );

  const selectedIds = useMemo(
    () => new Set(selected.map((s) => s.id)),
    [selected]
  );

  return (
    <div className="rounded-2xl bg-white p-4 md:p-5 shadow-lg h-auto lg:h-[75vh] flex flex-col">
      <h2 className="text-lg font-semibold text-[#3E3E3E] mb-4">Products</h2>

      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search by product name..."
        className="mb-4 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#009438] focus:ring-1 focus:ring-[#009438] focus:outline-none"
      />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-6 w-6 text-[#009438]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-600 py-4">
          Failed to load products. Please try again.
        </p>
      )}

      <div className="grid grid-cols-[2fr_2fr_1fr] gap-2 text-xs font-semibold text-gray-500 uppercase px-4 pb-2 border-b border-gray-200">
        <span>Product</span>
        <span className="text-center">Price</span>
        <span />
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto mt-2">
        {paginatedProducts.map((product) => {
          const isSelected = selectedIds.has(product.id);
          return (
            <div
              key={product.id}
              className="grid grid-cols-[2fr_2fr_1fr] gap-2 items-center rounded-lg border border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onView(product)}
            >
              <span className="text-sm font-medium text-gray-900 truncate">
                {product.title}
              </span>
              <span className="text-sm text-gray-500 text-center">
                Kes{" "}
                {product.price.toLocaleString("en-KE", {
                  minimumFractionDigits: 2,
                })}
              </span>
              {!isSelected && (
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd(product);
                    }}
                    className="flex items-center justify-center rounded-full border border-black p-2 py-2 text-black transition-colors cursor-pointer hover:bg-gray-100"
                  >
                    <MdAdd className="text-lg" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages} ({filteredProducts.length} items)
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
