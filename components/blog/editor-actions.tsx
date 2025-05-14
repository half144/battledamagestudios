import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface EditorActionsProps {
  onCancel: string;
  submitLabel?: string;
  loading?: boolean;
  saving?: boolean;
  editMode?: boolean;
}

export function EditorActions({
  onCancel,
  submitLabel,
  loading = false,
  saving = false,
  editMode = false,
}: EditorActionsProps) {
  // Determinar o label do botão de submissão
  const buttonLabel =
    submitLabel || (editMode ? "Update Post" : "Publish Post");

  return (
    <div className="flex justify-end gap-4">
      <Button variant="outline" asChild disabled={loading || saving}>
        <Link href={onCancel}>Cancel</Link>
      </Button>
      <Button
        type="submit"
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
        disabled={loading || saving}
      >
        {(loading || saving) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {buttonLabel}
      </Button>
    </div>
  );
}
