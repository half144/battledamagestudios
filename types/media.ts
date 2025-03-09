export interface Media {
  id: string;
  titulo: string;
  descricao: string;
  tipo_media: "imagem" | "video" | "musica" | "stl";
  categoria: string; // Representa o jogo: Ex: Mixers Universe, The Bickering Bunch
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
