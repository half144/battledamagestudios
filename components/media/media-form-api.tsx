import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
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
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { createMediaApi, updateMediaApi } from "@/lib/mediaApi";
import { SUPABASE_URL } from "@/lib/supabaseApi";
import fetchClient from "@/lib/fetchClient";
// Form validation schema
const formSchema = z.object({
  titulo: z.string().min(1, { message: "Title is required" }),
  descricao: z.string().min(1, { message: "Description is required" }),
  tipo_media: z.enum(["imagem", "video", "musica", "stl", "youtube_embed"], {
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

interface MediaFormApiProps {
  mode: "create" | "edit";
  existingMedia?: Media;
  onComplete?: () => void;
}

export function MediaFormApi({
  mode,
  existingMedia,
  onComplete,
}: MediaFormApiProps) {
  const router = useRouter();
  const { profile } = useAuthStatus();
  const [loading, setLoading] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: existingMedia?.titulo || "",
      descricao: existingMedia?.descricao || "",
      tipo_media:
        (existingMedia?.tipo_media as
          | "imagem"
          | "video"
          | "musica"
          | "stl"
          | "youtube_embed") || undefined,
      categoria: existingMedia?.categoria || "",
      thumbnail: existingMedia?.thumbnail_url || undefined,
      arquivo_principal: existingMedia?.arquivo_principal_url || undefined,
      arquivo_secundario: existingMedia?.arquivo_secundario_url || undefined,
      tags: existingMedia?.tags?.join(", ") || "",
    },
  });

  // Upload file to Supabase Storage using API REST
  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      console.log(`Iniciando upload para ${filePath}...`, {
        tamanhoArquivo: file.size,
        tipoArquivo: file.type,
      });

      // Usar o fetchClient para fazer o upload
      await fetchClient.upload(`/storage/v1/object/media/${filePath}`, file);

      console.log("Upload completado com sucesso");

      // Obter URL pública do arquivo
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/media/${filePath}`;

      console.log("URL pública:", publicUrl);
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

      // Verificar se o usuário está autenticado
      if (!profile) {
        throw new Error("Usuário não autenticado");
      }

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
        values.tipo_media !== "youtube_embed" &&
        values.arquivo_principal instanceof FileList &&
        values.arquivo_principal.length > 0
      ) {
        console.log("Uploading arquivo principal...");
        arquivoPrincipalUrl = await uploadFile(
          values.arquivo_principal[0],
          `${values.tipo_media}/${mediaId}`
        );
      } else if (values.tipo_media === "youtube_embed") {
        arquivoPrincipalUrl = values.arquivo_principal;
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
      const mediaData: Omit<Media, "id" | "data_criacao" | "visualizacoes"> = {
        titulo: values.titulo,
        descricao: values.descricao,
        tipo_media: values.tipo_media,
        categoria: values.categoria,
        thumbnail_url: thumbnailUrl as string,
        arquivo_principal_url: arquivoPrincipalUrl as string,
        arquivo_secundario_url: arquivoSecundarioUrl
          ? (arquivoSecundarioUrl as string)
          : undefined,
        tags: tagsArray,
        tamanho_arquivo:
          values.tipo_media === "youtube_embed"
            ? 0
            : values.arquivo_principal instanceof FileList
            ? values.arquivo_principal[0].size
            : existingMedia?.tamanho_arquivo || 0,
        formato:
          values.tipo_media === "youtube_embed"
            ? "youtube"
            : values.arquivo_principal instanceof FileList
            ? values.arquivo_principal[0].name.split(".").pop() || ""
            : existingMedia?.formato || "",
      };

      console.log("Dados para inserção/atualização:", mediaData);

      // Create or update media using REST API
      let success = false;
      let retryCount = 0;
      const maxRetries = 2; // Tentar até 3 vezes (original + 2 retries)

      while (retryCount <= maxRetries && !success) {
        try {
          if (mode === "create") {
            console.log(`Tentativa ${retryCount + 1} de criação na API...`);
            const newId = await createMediaApi(mediaData);
            success = !!newId;
          } else if (existingMedia) {
            console.log(`Tentativa ${retryCount + 1} de atualização na API...`);
            success = await updateMediaApi(existingMedia.id, mediaData);
          }

          // Se tiver sucesso, sai do loop
          if (success) break;

          // Se falhar, tenta novamente
          retryCount++;

          // Espera um pouco antes de tentar novamente (backoff exponencial)
          if (retryCount <= maxRetries) {
            const waitTime = 1000 * Math.pow(2, retryCount); // 2s, 4s
            console.log(
              `Aguardando ${waitTime / 1000}s antes de tentar novamente...`
            );
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          }
        } catch (error) {
          console.error(`Erro na tentativa ${retryCount + 1}:`, error);
          retryCount++;

          if (retryCount <= maxRetries) {
            const waitTime = 1000 * Math.pow(2, retryCount);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          } else {
            throw error; // Se acabaram as tentativas, propaga o erro
          }
        }
      }

      if (!success) {
        throw new Error("Falha em todas as tentativas de salvar a mídia");
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
      case "youtube_embed":
        return undefined;
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
                    <SelectItem value="youtube_embed">YouTube Embed</SelectItem>
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
                  {watchTipoMedia === "youtube_embed"
                    ? "YouTube Video URL"
                    : "Main File"}
                  {mode === "edit" &&
                    watchTipoMedia !== "youtube_embed" &&
                    " (Upload to change)"}
                </FormLabel>
                {mode === "edit" && typeof value === "string" && (
                  <div className="mb-2 text-sm text-muted-foreground">
                    {watchTipoMedia === "youtube_embed"
                      ? "Current URL: "
                      : "Current file: "}
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {watchTipoMedia === "youtube_embed"
                        ? value
                        : "View current file"}
                    </a>
                  </div>
                )}
                <FormControl>
                  {watchTipoMedia === "youtube_embed" ? (
                    <Input
                      type="text"
                      placeholder="Enter YouTube video URL"
                      onChange={onChange}
                      value={value || ""}
                      {...rest}
                    />
                  ) : (
                    <Input
                      type="file"
                      accept={getAcceptedFileTypes()}
                      onChange={(e) =>
                        onChange(e.target.files || e.target.value)
                      }
                      {...rest}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchTipoMedia && watchTipoMedia !== "youtube_embed" && (
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
              <FormLabel>Tags (Comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="tag1, tag2, tag3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/Media/dashboard")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Media" : "Update Media"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
