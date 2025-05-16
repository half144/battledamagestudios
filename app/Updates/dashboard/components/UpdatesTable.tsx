import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogPost } from "@/types/blog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { UpdatesActions } from "./UpdatesActions";

interface UpdatesTableProps {
  posts: BlogPost[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function UpdatesTable({ posts, loading, onDelete }: UpdatesTableProps) {
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Extract category from a post
  const getPostCategory = (post: BlogPost): string => {
    const categoryMatch = post.content.match(/<category>([^<]+)<\/category>/);
    return categoryMatch ? categoryMatch[1] : "General";
  };

  // Render thumbnail with fallback for thumbnail_url undefined
  const renderThumbnail = (post: BlogPost) => {
    return (
      <div className="relative w-20 h-12 overflow-hidden rounded-md bg-muted">
        <Image
          src={post.image || "/images/placeholder.jpg"}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
    );
  };

  // Sort posts
  const sortedPosts = [...posts].sort((a, b) => {
    let valueA, valueB;

    switch (sortColumn) {
      case "title":
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        break;
      case "category":
        valueA = getPostCategory(a).toLowerCase();
        valueB = getPostCategory(b).toLowerCase();
        break;
      case "readTime":
        valueA = parseInt(a.readTime?.split(" ")[0] || "0");
        valueB = parseInt(b.readTime?.split(" ")[0] || "0");
        break;
      case "date":
      default:
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
    }

    const comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Toggle sort order
  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Render skeleton loader
  if (loading) {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Read Time</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-12 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Render empty state message
  if (posts.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">
          No posts found. Try changing the filters or adding new posts.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Thumbnail</TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("title")}
            >
              Title{" "}
              {sortColumn === "title" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("category")}
            >
              Category{" "}
              {sortColumn === "category" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("date")}
            >
              Date{" "}
              {sortColumn === "date" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => toggleSort("readTime")}
            >
              Read Time{" "}
              {sortColumn === "readTime" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPosts.map((post) => (
            <TableRow
              key={post.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={(e) => {
                // Avoid navigation when clicking on action controls
                if (
                  (e.target as HTMLElement).closest(
                    '[data-no-navigation="true"]'
                  )
                )
                  return;
                router.push(`/Updates/${post.id}`);
              }}
            >
              <TableCell>{renderThumbnail(post)}</TableCell>
              <TableCell className="font-medium">
                <div className="line-clamp-2">{post.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {post.description}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{getPostCategory(post)}</span>
                </Badge>
              </TableCell>
              <TableCell>{post.date}</TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  {post.readTime}
                </div>
              </TableCell>
              <TableCell>
                <div data-no-navigation="true">
                  <UpdatesActions post={post} onDelete={onDelete} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
