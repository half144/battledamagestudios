export type ItemCategory =
  | "Bickering Bunch"
  | "Legends of Terrestria"
  | "Terrestria At War"
  | "Terrestrian Era"
  | "ChatFishes";

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
}

export const storeItems: StoreItem[] = [
  {
    id: "1",
    name: "Dragon Slayer Bundle",
    price: 29.99,
    image: "/3sis.png",
    description: "Premium character skins and exclusive weapons",
    featured: true,
    tags: ["Bundle", "Limited"],
    category: "Bickering Bunch",
    rating: 4.5,
  },
  {
    id: "2",
    name: "1000 Battle Coins",
    price: 9.99,
    image: "/3sis.png",
    description: "In-game currency for purchasing items and upgrades",
    tags: ["Currency"],
    category: "Bickering Bunch",
    featured: false,
    rating: 4.0,
  },
  // Add more items...
];

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
  author?: {
    name: string;
    avatar: string;
  };
}

export function addBlogPost(newPost: BlogPost) {
  return;
}

export const categories: ItemCategory[] = [
  "Bickering Bunch",
  "Legends of Terrestria",
  "Terrestria At War",
  "Terrestrian Era",
  "ChatFishes",
];

export interface Media {
  id: string;
  titulo: string;
  descricao: string;
  tipo_media: "imagem" | "video" | "musica" | "stl";
  categoria: string;
  thumbnail_url: string;
  arquivo_principal_url: string;
  arquivo_secundario_url?: string;
  data_criacao: string;
  tamanho_arquivo?: number;
  formato?: string;
  duracao?: number;
  tags?: string[];
  visualizacoes: number;
}
