export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
}

export interface ProductsResponse {
  products: Product[];
}

export const WALLET_BALANCE = 2400;
export const SUBSIDY_AMOUNT = 1400;
