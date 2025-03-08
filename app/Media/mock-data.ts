import { Media } from "./page";

// Mock data for media library
export const mockMedias: Media[] = [
  // Images
  {
    id: "img-001",
    titulo: "Sunset Landscape Concept Art",
    descricao:
      "A beautiful sunset landscape concept art for our upcoming game with vibrant colors and peaceful atmosphere.",
    tipo_media: "imagem",
    categoria: "Terrestrian Era",
    thumbnail_url:
      "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=1470&auto=format&fit=crop",
    arquivo_principal_url:
      "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=1470&auto=format&fit=crop",
    data_criacao: "2023-11-15",
    tamanho_arquivo: 2500,
    formato: "jpg",
    tags: ["landscape", "concept art", "sunset", "environment"],
    visualizacoes: 857,
  },
  {
    id: "img-002",
    titulo: "Character Design - Hero",
    descricao:
      "Final character design for the main hero of Legends of Terrestria, showing different angles and expressions.",
    tipo_media: "imagem",
    categoria: "Legends of Terrestria",
    thumbnail_url:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1470&auto=format&fit=crop",
    arquivo_principal_url:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1470&auto=format&fit=crop",
    data_criacao: "2023-10-22",
    tamanho_arquivo: 3100,
    formato: "png",
    tags: ["character", "hero", "design", "terrestria"],
    visualizacoes: 1204,
  },
  {
    id: "img-003",
    titulo: "Game UI Design - Main Menu",
    descricao:
      "UI design for the main menu interface with all navigation options and visual styling.",
    tipo_media: "imagem",
    categoria: "Terrestria At War",
    thumbnail_url:
      "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?q=80&w=1470&auto=format&fit=crop",
    arquivo_principal_url:
      "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?q=80&w=1470&auto=format&fit=crop",
    data_criacao: "2023-12-05",
    tamanho_arquivo: 1800,
    formato: "png",
    tags: ["ui", "interface", "menu", "design"],
    visualizacoes: 732,
  },

  // Videos
  {
    id: "vid-001",
    titulo: "Game Trailer - Legends of Terrestria",
    descricao:
      "Official game trailer for Legends of Terrestria showcasing gameplay, story elements, and key features.",
    tipo_media: "video",
    categoria: "Legends of Terrestria",
    thumbnail_url:
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=1470&auto=format&fit=crop",
    arquivo_principal_url: "https://example.com/videos/trailer.mp4",
    data_criacao: "2023-12-15",
    tamanho_arquivo: 75000,
    formato: "mp4",
    duracao: 187,
    tags: ["trailer", "gameplay", "marketing", "terrestria"],
    visualizacoes: 3450,
  },
  {
    id: "vid-002",
    titulo: "Developer Diary #1 - Art Direction",
    descricao:
      "First developer diary entry discussing the art direction and visual style of the game.",
    tipo_media: "video",
    categoria: "Terrestria At War",
    thumbnail_url:
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1374&auto=format&fit=crop",
    arquivo_principal_url: "https://example.com/videos/dev-diary-1.mp4",
    data_criacao: "2023-11-10",
    tamanho_arquivo: 62000,
    formato: "mp4",
    duracao: 645,
    tags: ["dev diary", "art direction", "behind the scenes"],
    visualizacoes: 982,
  },

  // Music
  {
    id: "mus-001",
    titulo: "Main Theme - Legends of Terrestria",
    descricao:
      "The main orchestral theme music for Legends of Terrestria, composed by our award-winning music team.",
    tipo_media: "musica",
    categoria: "Legends of Terrestria",
    thumbnail_url:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1470&auto=format&fit=crop",
    arquivo_principal_url: "https://example.com/music/main-theme.mp3",
    data_criacao: "2023-09-28",
    tamanho_arquivo: 12000,
    formato: "mp3",
    duracao: 248,
    tags: ["soundtrack", "theme", "orchestral", "music"],
    visualizacoes: 1876,
  },
  {
    id: "mus-002",
    titulo: "Battle Music - Epic Encounter",
    descricao:
      "Dynamic battle music that plays during major boss encounters and important battles.",
    tipo_media: "musica",
    categoria: "Terrestria At War",
    thumbnail_url:
      "https://images.unsplash.com/photo-1519859646-1a7e69e7c5d6?q=80&w=1453&auto=format&fit=crop",
    arquivo_principal_url: "https://example.com/music/battle-epic.mp3",
    data_criacao: "2023-10-15",
    tamanho_arquivo: 15000,
    formato: "mp3",
    duracao: 312,
    tags: ["soundtrack", "battle", "boss", "epic"],
    visualizacoes: 1254,
  },
  {
    id: "mus-003",
    titulo: "Ambient Track - Forest of Whispers",
    descricao:
      "Ambient background music for the Forest of Whispers area in the game, featuring subtle natural sounds and atmospheric elements.",
    tipo_media: "musica",
    categoria: "Terrestrian Era",
    thumbnail_url:
      "https://images.unsplash.com/photo-1644425570350-aacc12892153?q=80&w=1470&auto=format&fit=crop",
    arquivo_principal_url: "https://example.com/music/forest-ambient.mp3",
    data_criacao: "2023-11-02",
    tamanho_arquivo: 18000,
    formato: "mp3",
    duracao: 562,
    tags: ["soundtrack", "ambient", "forest", "background"],
    visualizacoes: 892,
  },

  // 3D Models
  {
    id: "stl-001",
    titulo: "Hero Sword - 3D Model",
    descricao:
      "3D model of the hero's legendary sword with detailed textures and multiple material variants.",
    tipo_media: "stl",
    categoria: "Legends of Terrestria",
    thumbnail_url:
      "https://images.unsplash.com/photo-1629138144127-fd6bf7b146ab?q=80&w=1528&auto=format&fit=crop",
    arquivo_principal_url: "https://example.com/models/hero-sword.stl",
    arquivo_secundario_url:
      "https://example.com/models/hero-sword-textures.zip",
    data_criacao: "2023-10-10",
    tamanho_arquivo: 25000,
    formato: "stl",
    tags: ["3d model", "weapon", "sword", "hero equipment"],
    visualizacoes: 764,
  },
  {
    id: "stl-002",
    titulo: "Ancient Temple Environment",
    descricao:
      "Complete 3D environment model of the Ancient Temple location with all architectural elements and decorations.",
    tipo_media: "stl",
    categoria: "Terrestrian Era",
    thumbnail_url:
      "https://images.unsplash.com/photo-1630911052999-1d9482862bd2?q=80&w=1470&auto=format&fit=crop",
    arquivo_principal_url: "https://example.com/models/ancient-temple.stl",
    arquivo_secundario_url: "https://example.com/models/temple-textures.zip",
    data_criacao: "2023-11-28",
    tamanho_arquivo: 85000,
    formato: "stl",
    tags: ["3d model", "environment", "temple", "architecture"],
    visualizacoes: 653,
  },
];
