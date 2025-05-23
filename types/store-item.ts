export type ItemCategory =
  | "Bickering Bunch"
  | "Legends of Terrestria"
  | "Terrestria At War"
  | "Terrestrian Era"
  | "ChatFishes";

/**
 * Interface para produtos da loja
 * Mapeado exatamente com a tabela products do banco de dados
 */
export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  file_url?: string;
  created_at: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
  active: boolean;
}

/**
 * Interface para itens da loja
 * Mapeamento com a tabela products:
 * - id -> id
 * - name -> name
 * - price -> price
 * - description -> description
 * - image -> image_url
 * - featured -> active
 * - category -> category
 * - createdAt -> created_at
 *
 * Campos que não existem na tabela products e são gerenciados apenas no frontend:
 * - tags, rating, stock, availableColors, availableSizes, discount, updatedAt
 */
export interface StoreItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  featured: boolean;
  tags: string[];
  category: ItemCategory;
  rating: number;
  stock?: number;
  availableColors?: string[];
  availableSizes?: string[];
  discount?: number;
  createdAt: string;
  updatedAt?: string;
}
