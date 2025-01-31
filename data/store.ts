export type ItemCategory =
  | "Bundle"
  | "Currency"
  | "Cosmetic"
  | "Character"
  | "Battle Pass";

export interface StoreItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  featured: boolean;
  tags: string[];
  category: ItemCategory;
  rating: number;
}

export const storeItems: StoreItem[] = [
  {
    id: 1,
    name: "Dragon Slayer Bundle",
    price: 29.99,
    image: "/3sis.png",
    description: "Premium character skins and exclusive weapons",
    featured: true,
    tags: ["Bundle", "Limited"],
    category: "Bundle",
    rating: 4.5,
  },
  {
    id: 2,
    name: "1000 Battle Coins",
    price: 9.99,
    image: "/3sis.png",
    description: "In-game currency for purchasing items and upgrades",
    tags: ["Currency"],
    category: "Currency",
    featured: false,
    rating: 4.0,
  },
  // Add more items...
];

export const categories: ItemCategory[] = [
  "Bundle",
  "Currency",
  "Cosmetic",
  "Character",
  "Battle Pass",
];
