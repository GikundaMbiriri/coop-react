"use client";

import { useMemo } from "react";
import Image from "next/image";
import { MdClose, MdStar } from "react-icons/md";
import { useAppSelector } from "@/store/hooks";
import type { Product } from "../types";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAdd,
}: ProductDetailModalProps) {
  const selected = useAppSelector((state) => state.cart.items);

  const isSelected = useMemo(
    () => selected.some((s) => s.id === product.id),
    [selected, product.id]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000007C] p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="relative h-40 sm:h-56 w-full bg-gray-100">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-contain"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full bg-white/80 p-1.5 text-gray-700 hover:bg-white transition-colors cursor-pointer"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-1">
            <h2 className="text-xl font-bold text-gray-900">
              {product.title}
            </h2>
            <span className="text-lg font-bold text-[#009438]">
              Kes{" "}
              {product.price.toLocaleString("en-KE", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 capitalize mb-3">
            {product.category}
          </span>

          <div className="flex items-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <MdStar
                key={star}
                className={`text-lg ${
                  star <= Math.round(product.rating)
                    ? "text-[#E8B40A]"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-gray-500">
              {product.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            {!isSelected && (
              <button
                onClick={() => {
                  onAdd(product);
                  onClose();
                }}
                className="flex-1 rounded-lg bg-[#009438] px-4 py-3 text-sm font-semibold text-white hover:bg-[#007a2e] transition-colors cursor-pointer"
              >
                Add to Selection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
