import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EditorActionsProps {
  onCancel: string;
  submitLabel: string;
}

export function EditorActions({ onCancel, submitLabel }: EditorActionsProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button variant="outline" asChild>
        <Link href={onCancel}>
          Cancel
        </Link>
      </Button>
      <Button type="submit" className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
        {submitLabel}
      </Button>
    </div>
  );
}
