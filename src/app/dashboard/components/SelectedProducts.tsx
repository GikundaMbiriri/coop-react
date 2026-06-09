"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MdRemove } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeItem, updateItemQty } from "@/store/slices/cartSlice";
import { SUBSIDY_AMOUNT } from "../types";

export default function SelectedProducts() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.cart.items);

  const grandTotal = useMemo(
    () => selected.reduce((sum, item) => sum + item.price * item.qty, 0),
    [selected]
  );

  const deduction = useMemo(
    () => (grandTotal >= SUBSIDY_AMOUNT ? SUBSIDY_AMOUNT : grandTotal),
    [grandTotal]
  );

  function handleRemove(id: number) {
    dispatch(removeItem(id));
  }

  function handleUpdateQty(id: number, qty: number) {
    if (qty < 1) return;
    dispatch(updateItemQty({ id, qty }));
  }

  return (
    <div className="rounded-2xl bg-white p-4 md:p-5 shadow-lg flex flex-col h-auto lg:h-[75vh]">
      <h2 className="text-lg font-semibold text-[#3E3E3E] mb-4">
        Selected Products
      </h2>

      {selected.length === 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center rounded-lg bg-[#FFFBEF] p-8">
            <p className="text-sm text-gray-500 text-center">
              Please select a product from the products panel first
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-right">
            <span className="text-sm font-semibold text-gray-700">
              Deduct 0.00 Kes
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="overflow-x-auto">
            {/* Table header */}
            <div className="min-w-[500px]">
              <div className="grid grid-cols-[1fr_60px_80px_80px_90px_36px] gap-2 text-xs font-semibold text-gray-500 uppercase px-2 pb-2 border-b border-gray-200">
            <span>Product</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
            <span className="text-right">Deduction</span>
            <span />
          </div>

          {/* Items */}
          <div className="space-y-1 mt-2">
            {selected.map((item) => {
              const itemTotal = item.price * item.qty;
              const itemShare =
                grandTotal > 0 ? itemTotal / grandTotal : 0;
              const itemDeduction =
                Math.round(deduction * itemShare * 100) / 100;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_60px_80px_80px_90px_36px] gap-2 items-center rounded-lg px-2 py-2 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-900 truncate">
                    {item.title}
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) =>
                      handleUpdateQty(
                        item.id,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full rounded border border-gray-300 px-2 py-1 text-center text-sm text-gray-900 focus:border-[#009438] focus:ring-1 focus:ring-[#009438] focus:outline-none"
                  />
                  <span className="text-sm text-gray-600 text-right">
                    {item.price.toLocaleString("en-KE", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-sm font-medium text-gray-900 text-right">
                    {itemTotal.toLocaleString("en-KE", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-sm font-medium text-[#009438] text-right">
                    {itemDeduction.toLocaleString("en-KE", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="flex items-center justify-center rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    <MdRemove className="text-base" />
                  </button>
                </div>
              );
            })}
          </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-sm text-gray-500">
              Total: Kes{" "}
              {grandTotal.toLocaleString("en-KE", {
                minimumFractionDigits: 2,
              })}
            </span>
            <button
              onClick={() => {
                router.push("/dashboard/summary");
              }}
              className="rounded-lg bg-[#E8B40A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#D19C0A] transition-colors cursor-pointer"
            >
              Deduct{" "}
              {selected
                .reduce((sum, item) => {
                  const itemTotal = item.price * item.qty;
                  const itemShare =
                    grandTotal > 0 ? itemTotal / grandTotal : 0;
                  return (
                    sum + Math.round(deduction * itemShare * 100) / 100
                  );
                }, 0)
                .toLocaleString("en-KE", { minimumFractionDigits: 2 })}{" "}
              Kes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
