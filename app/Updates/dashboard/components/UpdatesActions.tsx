import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blog";
import { MoreHorizontalIcon, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UpdatesActionsProps {
  post: BlogPost;
  onDelete: (id: string) => void;
}

export function UpdatesActions({ post, onDelete }: UpdatesActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/Updates/${post.id}`;
        }}
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">View</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/Updates/editor?edit=${post.id}`);
        }}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(post.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
