"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgImage from "@/app/assets/images/bg.png";
import { MdKeyboardArrowRight, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { storeAuth } from "@/lib/auth";
import { loginUser } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<"username" | "password">("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      storeAuth(data);
      dispatch(
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          image: data.image,
        })
      );
      router.push("/dashboard");
    },
  });

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setUsernameError("Username is required");
      return;
    }
    if (trimmed.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }
    setUsernameError("");
    setStep("password");
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    }
    setPasswordError("");
    loginMutation.mutate({ username: username.trim(), password });
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={bgImage}
          alt="Farm field"
          fill
          className="object-cover"
          priority
        />
     
      </div>

      {/* Right side - Login Card */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-4 sm:p-8 bg-gray-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl py-12 sm:py-20">
          <div className="mb-8 text-center">
            <div className="text-lg font-semibold text-[#707070]">
              Welcome to 
            </div>
            <div className="mt-2 text-2xl sm:text-4xl font-semibold text-[#009438]">Inua Mkulima Subsidy Program</div>
          </div>

          {step === "username" ? (
            <form onSubmit={handleContinue} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError) setUsernameError("");
                  }}
                  placeholder="Enter your username"
                  className={`mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:outline-none ${
                    usernameError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  }`}
                />
                {usernameError && (
                  <p className="mt-1 text-sm text-red-600">{usernameError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-between rounded-lg bg-[#E8B40A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#D19C0A] focus:ring-2 focus:ring-[#E8B40A] focus:ring-offset-2 focus:outline-none transition-colors cursor-pointer"
              >
                <span className="flex-1 text-center">Continue</span>
                <MdKeyboardArrowRight className="text-xl" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    placeholder="Enter your password"
                    className={`mt-1 block w-full rounded-lg border px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:ring-2 focus:outline-none ${
                      passwordError
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <MdVisibilityOff className="text-lg" />
                    ) : (
                      <MdVisibility className="text-lg" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>

              {loginMutation.isError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {loginMutation.error.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full flex items-center justify-between rounded-lg bg-[#E8B40A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#D19C0A] focus:ring-2 focus:ring-[#E8B40A] focus:ring-offset-2 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="flex-1 text-center flex items-center justify-center gap-2">
                  {loginMutation.isPending && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </span>
                <MdKeyboardArrowRight className="text-xl" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
