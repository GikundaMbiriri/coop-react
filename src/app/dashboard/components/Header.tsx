"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdLogout, MdWarningAmber } from "react-icons/md";
import headerBg from "@/app/assets/images/small header.png";
import { getUser, clearAuth } from "@/lib/auth";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser, logout as logoutAction } from "@/store/slices/authSlice";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!user) {
      const storedUser = getUser();
      if (storedUser) {
        dispatch(setUser(storedUser));
      }
    }
  }, [user, dispatch]);

  function handleLogout() {
    clearAuth();
    dispatch(logoutAction());
    router.push("/login");
  }

  return (
    <>
      <header className="relative h-16 w-full shrink-0">
        <Image
          src={headerBg}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 flex h-full items-center justify-between px-4 md:px-6">
          <h1 className="text-sm md:text-lg font-bold text-white truncate">
            Inua Mkulima Subsidy Program
          </h1>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {user && (
              <span className="hidden sm:inline text-sm text-white/90">
                Logged in as: <span className="font-semibold">{user.username}</span>
              </span>
            )}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/25 transition-colors cursor-pointer"
            >
              <MdLogout className="text-base" />
              Log Out
            </button>
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000007C] p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 md:p-8 shadow-2xl text-center">
            <h2 className="text-xl font-bold text-[#000000] mb-4">Log Out?</h2>
            <MdLogout className="mx-auto text-5xl text-[#E8B40A] mb-4" />
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-[#000000] px-4 py-3 text-sm font-semibold text-white hover:bg-[#333333] transition-colors cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
