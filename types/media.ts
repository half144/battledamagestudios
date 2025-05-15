export interface Media {
  id: string;
  titulo: string;
  descricao?: string;
  tipo_media: "imagem" | "video" | "musica" | "stl" | "outro" | "youtube_embed";
  categoria: string;
  arquivo_principal_url: string;
  arquivo_secundario_url?: string;
  thumbnail_url?: string;
  data_criacao: string;
  visualizacoes: number;
  tags?: string[];
  formato?: string;
  duracao?: number;
  tamanho_arquivo?: number;
}
