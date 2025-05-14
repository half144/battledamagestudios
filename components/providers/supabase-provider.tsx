"use client";

import { createContext, useContext } from "react";
import {
  fetchMediasApi,
  fetchMediaByIdApi,
  deleteMediaApi,
} from "@/lib/mediaApi";
import {
  uploadFileApi,
  getPublicUrlApi,
  removeFileApi,
  listFilesApi,
} from "@/lib/storageApi";

// Compatibilidade com o código existente que ainda usa o cliente Supabase
// Este é um arquivo temporário até que todos os componentes sejam migrados para a API REST

// Contexto mock para simular o contexto do Supabase
const SupabaseContext = createContext<{ supabase: any }>({
  supabase: null,
});

// Provider mock que fornece uma versão do cliente Supabase que usa a API REST
export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Mock do cliente Supabase que redireciona para as funções de API REST
  const mockSupabaseClient = {
    // Storage API mock
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => {
          console.warn(
            "SupabaseProvider: usando cliente Storage. Considere migrar para storageApi.ts"
          );

          // Usar API REST para fazer upload
          const publicUrl = await uploadFileApi(bucket, path, file);

          return {
            error: publicUrl ? null : new Error("Falha no upload"),
            data: publicUrl ? { path } : null,
          };
        },
        getPublicUrl: (path: string) => {
          console.warn(
            "SupabaseProvider: getPublicUrl está sendo chamado. Considere migrar para storageApi.ts"
          );

          const publicUrl = getPublicUrlApi(bucket, path);
          return {
            data: {
              publicUrl: publicUrl || "",
            },
          };
        },
        remove: async (paths: string[]) => {
          console.warn(
            "SupabaseProvider: remove está sendo chamado. Considere migrar para storageApi.ts"
          );

          // Remover cada arquivo
          const results = await Promise.all(
            paths.map((path) => removeFileApi(bucket, path))
          );

          const allSuccess = results.every((result) => result === true);
          return {
            error: allSuccess
              ? null
              : new Error("Falha ao remover alguns arquivos"),
          };
        },
        list: async (prefix?: string) => {
          console.warn(
            "SupabaseProvider: list está sendo chamado. Considere migrar para storageApi.ts"
          );

          // Listar arquivos
          const files = await listFilesApi(bucket, prefix || "");
          return {
            error: null,
            data: files,
          };
        },
      }),
    },

    // Database API mock
    from: (table: string) => {
      return {
        select: () => {
          const query = {
            eq: (column: string, value: any) => {
              return {
                single: async () => {
                  if (table === "medias") {
                    const data = await fetchMediaByIdApi(value);
                    return {
                      data,
                      error: data ? null : new Error("Not found"),
                    };
                  }
                  return { data: null, error: new Error("Não implementado") };
                },
                order: () => query,
              };
            },
            order: (column: string, { ascending = true } = {}) => {
              return {
                then: async (callback: any) => {
                  if (table === "medias") {
                    const data = await fetchMediasApi();
                    if (data) {
                      // Ordenar os dados se necessário
                      const sortedData = [...data].sort((a, b) => {
                        const aValue = a[column as keyof typeof a];
                        const bValue = b[column as keyof typeof b];
                        if (
                          typeof aValue === "string" &&
                          typeof bValue === "string"
                        ) {
                          return ascending
                            ? aValue.localeCompare(bValue)
                            : bValue.localeCompare(aValue);
                        }
                        return 0;
                      });
                      return callback({ data: sortedData, error: null });
                    }
                  }
                  return callback({ data: [], error: null });
                },
              };
            },
          };
          return query;
        },

        delete: () => {
          return {
            eq: async (column: string, value: any) => {
              if (table === "medias") {
                const success = await deleteMediaApi(value);
                return {
                  error: success ? null : new Error("Falha ao excluir"),
                };
              }
              return { error: new Error("Não implementado") };
            },
          };
        },
      };
    },
  };

  return (
    <SupabaseContext.Provider value={{ supabase: mockSupabaseClient }}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Hook de compatibilidade
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase deve ser usado dentro de SupabaseProvider");
  }
  return context;
};
