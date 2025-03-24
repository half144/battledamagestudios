import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Media } from "@/types/media";
import { MoreHorizontalIcon, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface MediaActionsProps {
  media: Media;
  onDelete: (id: string) => void;
}

export function MediaActions({ media, onDelete }: MediaActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/Media/${media.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            <span>View</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/Media/${media.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            <span>Edit</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(media.id)}>
          <Trash2 className="h-4 w-4 mr-2" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
