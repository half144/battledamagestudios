import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useSupabase } from "@/components/providers/supabase-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Media } from "@/types/media";

// Types for accepted files
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const ACCEPTED_AUDIO_TYPES = ["audio/mpeg", "audio/ogg", "audio/wav"];
const ACCEPTED_MODEL_TYPES = ["model/stl", "application/octet-stream", ".stl"];

// Form validation schema
const formSchema = z.object({
  titulo: z.string().min(1, { message: "Title is required" }),
  descricao: z.string().min(1, { message: "Description is required" }),
  tipo_media: z.enum(["imagem", "video", "musica", "stl"], {
    required_error: "Media type is required",
  }),
  categoria: z.string().min(1, { message: "Category is required" }),
  thumbnail: z
    .any()
    .refine(
      (files) =>
        (files instanceof FileList && files.length > 0) ||
        typeof files === "string",
      "Thumbnail is required"
    ),
  arquivo_principal: z
    .any()
    .refine(
      (files) =>
        (files instanceof FileList && files.length > 0) ||
        typeof files === "string",
      "Main file is required"
    ),
  arquivo_secundario: z.any().optional(),
  tags: z.string().optional(),
});

interface MediaFormProps {
  mode: "create" | "edit";
  existingMedia?: Media;
  onComplete?: () => void;
}

export function MediaForm({ mode, existingMedia, onComplete }: MediaFormProps) {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: existingMedia?.titulo || "",
      descricao: existingMedia?.descricao || "",
      tipo_media:
        (existingMedia?.tipo_media as "imagem" | "video" | "musica" | "stl") ||
        undefined,
      categoria: existingMedia?.categoria || "",
      thumbnail: existingMedia?.thumbnail_url || undefined,
      arquivo_principal: existingMedia?.arquivo_principal_url || undefined,
      arquivo_secundario: existingMedia?.arquivo_secundario_url || undefined,
      tags: existingMedia?.tags?.join(", ") || "",
    },
  });

  // Upload file to Supabase Storage
  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      console.log(`Iniciando upload para ${filePath}...`, {
        tamanhoArquivo: file.size,
        tipoArquivo: file.type,
      });

      // Modificando os parâmetros do upload para resolver problemas intermitentes
      const { error } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          // Removendo cacheControl que pode estar causando problemas
          // Removendo upsert que pode causar conflitos
        });

      if (error) {
        console.error("Erro no upload:", error);
        throw error;
      }

      console.log("Upload completado com sucesso");

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(filePath);

      console.log("URL pública obtida:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("Exceção durante o upload:", error);
      throw error;
    }
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      console.log("Iniciando processo de envio do formulário...");

      // Generate ID for new media or use existing
      const mediaId = existingMedia?.id || uuidv4();
      console.log("ID da mídia:", mediaId);

      // Upload files if they're not strings (URLs from existing media)
      let thumbnailUrl = values.thumbnail;
      if (values.thumbnail instanceof FileList && values.thumbnail.length > 0) {
        console.log("Uploading thumbnail...");
        thumbnailUrl = await uploadFile(
          values.thumbnail[0],
          `thumbnails/${mediaId}`
        );
      }

      let arquivoPrincipalUrl = values.arquivo_principal;
      if (
        values.arquivo_principal instanceof FileList &&
        values.arquivo_principal.length > 0
      ) {
        console.log("Uploading arquivo principal...");
        arquivoPrincipalUrl = await uploadFile(
          values.arquivo_principal[0],
          `${values.tipo_media}/${mediaId}`
        );
      }

      let arquivoSecundarioUrl = values.arquivo_secundario;
      if (
        values.arquivo_secundario instanceof FileList &&
        values.arquivo_secundario.length > 0
      ) {
        console.log("Uploading arquivo secundario...");
        arquivoSecundarioUrl = await uploadFile(
          values.arquivo_secundario[0],
          `secundarios/${mediaId}`
        );
      }

      // Process tags
      const tagsArray = values.tags
        ? values.tags.split(",").map((tag) => tag.trim())
        : [];

      // Prepare data for database
      const mediaData = {
        id: mediaId,
        titulo: values.titulo,
        descricao: values.descricao,
        tipo_media: values.tipo_media,
        categoria: values.categoria,
        thumbnail_url: thumbnailUrl,
        arquivo_principal_url: arquivoPrincipalUrl,
        arquivo_secundario_url: arquivoSecundarioUrl || null,
        tags: tagsArray,
      };

      console.log("Dados para inserção/atualização:", mediaData);

      // Additional data for new media
      if (mode === "create") {
        Object.assign(mediaData, {
          tamanho_arquivo:
            values.arquivo_principal instanceof FileList
              ? values.arquivo_principal[0].size
              : existingMedia?.tamanho_arquivo || 0,
          formato:
            values.arquivo_principal instanceof FileList
              ? values.arquivo_principal[0].name.split(".").pop() || ""
              : existingMedia?.formato || "",
          data_criacao: new Date().toISOString(),
          visualizacoes: 0,
        });
      }

      // Create or update in database com retry simplificado
      let error;
      let retryCount = 0;
      const maxRetries = 2; // Tentar até 3 vezes (original + 2 retries)

      while (retryCount <= maxRetries) {
        try {
          if (mode === "create") {
            console.log(
              `Tentativa ${retryCount + 1} de inserção no banco de dados...`
            );
            ({ error } = await supabase.from("medias").insert(mediaData));
          } else {
            console.log(
              `Tentativa ${retryCount + 1} de atualização no banco de dados...`
            );
            ({ error } = await supabase
              .from("medias")
              .update(mediaData)
              .eq("id", mediaId));
          }

          // Se não tiver erro, sai do loop
          if (!error) break;

          // Se tiver erro, tenta novamente
          console.error(`Erro na tentativa ${retryCount + 1}:`, error);
          retryCount++;

          // Espera um pouco antes de tentar novamente (backoff exponencial)
          if (retryCount <= maxRetries) {
            const waitTime = 1000 * Math.pow(2, retryCount); // 2s, 4s
            console.log(
              `Aguardando ${waitTime / 1000}s antes de tentar novamente...`
            );
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          }
        } catch (innerError) {
          console.error(`Exceção na tentativa ${retryCount + 1}:`, innerError);
          retryCount++;

          if (retryCount <= maxRetries) {
            const waitTime = 1000 * Math.pow(2, retryCount);
            console.log(
              `Aguardando ${waitTime / 1000}s antes de tentar novamente...`
            );
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          } else {
            throw innerError; // Se acabaram as tentativas, propaga o erro
          }
        }
      }

      if (error) {
        console.error(
          "Erro na operação do banco de dados após todas as tentativas:",
          error
        );
        throw error;
      }

      console.log("Operação concluída com sucesso!");

      // Show success message
      toast.success(
        mode === "create"
          ? "Media created successfully!"
          : "Media updated successfully!"
      );

      // Navigate or call completion callback
      if (onComplete) {
        onComplete();
      } else {
        router.push("/Media/dashboard");
      }
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} media:`,
        error
      );
      toast.error(
        `Error ${mode === "create" ? "creating" : "updating"} media: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Watch media type for file input validation
  const watchTipoMedia = form.watch("tipo_media");

  // Get accepted file types based on media type
  const getAcceptedFileTypes = () => {
    switch (watchTipoMedia) {
      case "imagem":
        return ".jpg,.jpeg,.png,.webp";
      case "video":
        return ".mp4,.webm,.ogg";
      case "musica":
        return ".mp3,.ogg,.wav";
      case "stl":
        return ".stl";
      default:
        return undefined;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Media title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed description of the media"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tipo_media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={mode === "edit"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="imagem">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="musica">Music</SelectItem>
                    <SelectItem value="stl">3D Model (STL)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category (Game)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Mixers Universe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>
                Thumbnail {mode === "edit" && "(Upload to change)"}
              </FormLabel>
              {mode === "edit" && typeof value === "string" && (
                <div className="mb-2">
                  <img
                    src={value}
                    alt="Current thumbnail"
                    className="h-24 object-cover rounded-md"
                  />
                </div>
              )}
              <FormControl>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => onChange(e.target.files || e.target.value)}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchTipoMedia && (
          <FormField
            control={form.control}
            name="arquivo_principal"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>
                  Main File {mode === "edit" && "(Upload to change)"}
                </FormLabel>
                {mode === "edit" && typeof value === "string" && (
                  <div className="mb-2 text-sm text-muted-foreground">
                    Current file:{" "}
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View current file
                    </a>
                  </div>
                )}
                <FormControl>
                  <Input
                    type="file"
                    accept={getAcceptedFileTypes()}
                    onChange={(e) => onChange(e.target.files || e.target.value)}
                    {...rest}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchTipoMedia && (
          <FormField
            control={form.control}
            name="arquivo_secundario"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>
                  Secondary File (Optional){" "}
                  {mode === "edit" && "(Upload to change)"}
                </FormLabel>
                {mode === "edit" && typeof value === "string" && (
                  <div className="mb-2 text-sm text-muted-foreground">
                    Current file:{" "}
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View current file
                    </a>
                  </div>
                )}
                <FormControl>
                  <Input
                    type="file"
                    accept={getAcceptedFileTypes()}
                    onChange={(e) => onChange(e.target.files || e.target.value)}
                    {...rest}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: character, game, art" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create" ? "Uploading..." : "Updating..."}
            </>
          ) : mode === "create" ? (
            "Create Media"
          ) : (
            "Update Media"
          )}
        </Button>
      </form>
    </Form>
  );
}
