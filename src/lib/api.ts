import type { Product, ProductsResponse } from "@/app/dashboard/types";

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

const API_BASE = "https://dummyjson.com";

export async function loginUser(credentials: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  return res.json();
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(
    `${API_BASE}/products?select=title,price,thumbnail,category,rating`
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  const data: ProductsResponse = await res.json();
  return data.products;
}
