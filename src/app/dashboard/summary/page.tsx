"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdRemove, MdCheckCircle, MdDownload } from "react-icons/md";
import { jsPDF } from "jspdf";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeItem, clearCart } from "@/store/slices/cartSlice";

const SUBSIDY_AMOUNT = 1400;

export default function SummaryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(90);
  const [showSuccess, setShowSuccess] = useState(false);
  const [refNumber] = useState(
    () => "Ref" + Math.random().toString(36).substring(2, 10).toUpperCase()
  );
  const [paymentDate] = useState(() => new Date().toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }));

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const grandTotal = useMemo(
    () => products.reduce((sum, item) => sum + item.price * item.qty, 0),
    [products]
  );

  const deduction = useMemo(
    () => (grandTotal >= SUBSIDY_AMOUNT ? SUBSIDY_AMOUNT : grandTotal),
    [grandTotal]
  );

  const deductionTotal = useMemo(
    () =>
      products.reduce((sum, item) => {
        const itemTotal = item.price * item.qty;
        const itemShare = grandTotal > 0 ? itemTotal / grandTotal : 0;
        return sum + Math.round(deduction * itemShare * 100) / 100;
      }, 0),
    [products, grandTotal, deduction]
  );

  function removeProduct(id: number) {
    dispatch(removeItem(id));
  }

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const digit = value.slice(-1);
      setOtp((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });
      if (digit && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    },
    []
  );

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  }

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  function handlePay() {
    setShowSuccess(true);
  }

  function downloadReceipt() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT RECEIPT", pageWidth / 2, y, { align: "center" });
    y += 12;

    doc.setDrawColor(0, 148, 56);
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Ref Number: ${refNumber}`, 20, y);
    y += 7;
    doc.text(`Date: ${paymentDate}`, 20, y);
    y += 7;
    doc.text(`Customer: ${user?.firstName ?? ""} ${user?.lastName ?? ""}`, 20, y);
    y += 12;

    doc.setFont("helvetica", "bold");
    doc.text("Agrovet Product Purchase", 20, y);
    y += 10;

    // Table header
    doc.setFontSize(10);
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 5, pageWidth - 40, 8, "F");
    doc.text("Product", 22, y);
    doc.text("Qty", 100, y, { align: "center" });
    doc.text("Price", 130, y, { align: "right" });
    doc.text("Total", 160, y, { align: "right" });
    doc.text("Deduction", pageWidth - 22, y, { align: "right" });
    y += 8;

    // Table rows
    doc.setFont("helvetica", "normal");
    products.forEach((p) => {
      const itemTotal = p.price * p.qty;
      const itemShare = grandTotal > 0 ? itemTotal / grandTotal : 0;
      const itemDed = Math.round(deduction * itemShare * 100) / 100;

      doc.text(p.title.substring(0, 30), 22, y);
      doc.text(String(p.qty), 100, y, { align: "center" });
      doc.text(p.price.toFixed(2), 130, y, { align: "right" });
      doc.text(itemTotal.toFixed(2), 160, y, { align: "right" });
      doc.text(itemDed.toFixed(2), pageWidth - 22, y, { align: "right" });
      y += 7;
    });

    y += 3;
    doc.line(20, y, pageWidth - 20, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: Kes ${grandTotal.toFixed(2)}`, 20, y);
    y += 7;
    doc.setTextColor(0, 148, 56);
    doc.text(`Subsidy Deduction: Kes ${deductionTotal.toFixed(2)}`, 20, y);
    y += 7;
    doc.setTextColor(0, 0, 0);
    doc.text(`Amount Paid: Kes ${(grandTotal - deductionTotal).toFixed(2)}`, 20, y);
    y += 14;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for using Inua Mkulima Subsidy Program.", pageWidth / 2, y, { align: "center" });

    doc.save(`receipt-${refNumber}.pdf`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Summary</h1>

      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg bg-[#E8B40A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#D19C0A] transition-colors cursor-pointer"
        >
          <MdArrowBack />
          Back
        </button>
        <span className="text-sm text-gray-500">Product Details &gt; Summary</span>
      </div>

      <div className="space-y-6">
        {/* Selected Products Table - Full Width */}
        <div className="rounded-2xl bg-white p-4 md:p-5 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Selected Products
          </h2>

          {products.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              No products selected.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                  <div className="grid grid-cols-[1fr_60px_80px_80px_90px_36px] gap-2 text-xs font-semibold text-gray-500 uppercase px-2 pb-2 border-b border-gray-200">
                <span>Product</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Price</span>
                <span className="text-right">Total</span>
                <span className="text-right">Deduction</span>
                <span />
              </div>

              <div className="space-y-1 max-h-[400px] overflow-y-auto mt-2">
                {products.map((item) => {
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
                      <span className="text-sm text-gray-900 text-center">
                        {item.qty}
                      </span>
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
                        onClick={() => removeProduct(item.id)}
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

              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-sm text-gray-500">
                  Total: Kes{" "}
                  {grandTotal.toLocaleString("en-KE", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-sm font-semibold text-[#009438]">
                  Deduction:{" "}
                  {deductionTotal.toLocaleString("en-KE", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  Kes
                </span>
              </div>
            </>
          )}
        </div>

        {/* OTP Verification - Below Table */}
        <div className="rounded-2xl bg-white p-4 md:p-5 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Verification
          </h2>

          <p className="text-sm text-gray-600 mb-6">
            Enter the verification code sent to the parent at{" "}
            <span className="font-semibold">072******715</span> via SMS.
          </p>

          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border-2 border-gray-300 text-center text-lg font-semibold text-gray-900 focus:border-[#009438] focus:ring-2 focus:ring-[#009438] focus:outline-none transition-colors"
              />
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center mb-8">
            Didn&apos;t receive OTP?{" "}
            {countdown > 0 ? (
              <span className="font-medium text-gray-700">
                Resend in {minutes}min {seconds.toString().padStart(2, "0")}sec
              </span>
            ) : (
              <button
                onClick={() => setCountdown(90)}
                className="font-medium text-[#009438] hover:underline cursor-pointer"
              >
                Resend
              </button>
            )}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handlePay}
              className="flex-1 rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Pay: Kes{" "}
              {grandTotal.toLocaleString("en-KE", {
                minimumFractionDigits: 2,
              })}
            </button>
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            You will receive 1,400.00 kes from the subsidy program. If this does
            not cover the total cost of the purchase ensure you get the balance
            from the customer.
          </p>
        </div>
      )}

      {/* Payment Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000007C] p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 md:p-8 shadow-2xl text-center">

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful
            </h2>

            <div className="space-y-1 text-sm text-gray-600 mb-6">
              <p>
                Ref Number:{" "}
                <span className="font-semibold text-gray-900">{refNumber}</span>
              </p>
              <p>
                Date:{" "}
                <span className="font-semibold text-gray-900">{paymentDate}</span>
              </p>
                          <MdCheckCircle className="mx-auto text-6xl text-black mb-4" />

              <p className="mt-3 text-lg font-bold text-gray-900">
                Kes{" "}
                {grandTotal.toLocaleString("en-KE", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="mt-2 text-gray-500">
                Agrovet product purchase for{" "}
                <span className="font-semibold text-gray-900">
                  {user?.firstName ?? ""} {user?.lastName ?? ""}
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadReceipt}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <MdDownload className="text-lg" />
                Download Receipt
              </button>
              <button
                onClick={() => {
                  dispatch(clearCart());
                  router.push("/dashboard");
                }}
                className="flex-1 rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
