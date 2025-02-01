import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";

interface EditorControlsProps {
  editor: Editor | null;
}

export function EditorControls({ editor }: EditorControlsProps) {
  return (
    <div className="mb-2 flex gap-2 border-b pb-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={editor?.isActive('bold') ? 'bg-slate-200 dark:bg-slate-800' : ''}
      >
        B
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={editor?.isActive('italic') ? 'bg-slate-200 dark:bg-slate-800' : ''}
      >
        I
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        className={editor?.isActive('strike') ? 'bg-slate-200 dark:bg-slate-800' : ''}
      >
        S
      </Button>
    </div>
  );
}
