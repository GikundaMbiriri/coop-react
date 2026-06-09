"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { useAppDispatch } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import ProductList from "./components/ProductList";
import SelectedProducts from "./components/SelectedProducts";
import ProductDetailModal from "./components/ProductDetailModal";
import { WALLET_BALANCE, type Product } from "./types";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  function addProduct(product: Product) {
    dispatch(addItem(product));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Product Details
      </h1>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg bg-[#E8B40A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#D19C0A] transition-colors cursor-pointer"
        >
          <MdArrowBack className="" />
          Back
        </button>
        <span className="text-sm text-gray-500">Product Details</span>
      </div>

      <div className="mb-6 rounded-lg  px-4 py-3">
        <p className="text-sm text-black">
          <span className="font-bold">Inua Mkulima Wallet</span> Balance:{" "}
          <span className="text-base font-bold">Kes {WALLET_BALANCE.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductList onAdd={addProduct} onView={setViewProduct} />
        <SelectedProducts />
      </div>

      {viewProduct && (
        <ProductDetailModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          onAdd={addProduct}
        />
      )}
    </div>
  );
}
