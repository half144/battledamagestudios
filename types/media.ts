export interface Media {
  id: string;
  titulo: string;
  descricao: string;
  tipo_media: string;
  tipo: string;
  categoria: string;
  url: string;
  arquivo_principal_url: string;
  arquivo_secundario_url?: string;
  thumbnail_url?: string;
  tamanho_arquivo: number;
  tamanho: number;
  visualizacoes: number;
  tags: string[];
  data_criacao: string;
  created_at: string;
  formato?: string;
  duracao?: number;
}
