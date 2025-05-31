export interface StripePrice {
  id: string;
  unit_amount: number;
  currency: string;
}

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  images: string[];
  active: boolean;
  created: number;
  unit_label: string;
  metadata: Record<string, string>;
  default_price: StripePrice;
}

export interface StripeProductsResponse {
  success: boolean;
  count: number;
  products: StripeProduct[];
  error?: string;
}
