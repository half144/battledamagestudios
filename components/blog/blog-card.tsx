import { BlogPost } from "@/types/blog";
import { MagicCard } from "@/components/ui/magic-card";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { motion } from "framer-motion";

interface BlogCardProps {
  blog: BlogPost;
  index: number;
}

export function BlogCard({ blog, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <MagicCard
        className="flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group overflow-hidden"
        gradientFrom="rgb(239 68 68)"
        gradientTo="rgb(185 28 28)"
        gradientOpacity={0.2}
      >
        <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
          <div
            className="absolute inset-0 bg-cover bg-center transform transition-all duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${blog.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <CardHeader className="relative z-10 -mt-6">
          <CardTitle className="line-clamp-2 text-xl">
            <Link
              href={`/Updates/${blog.id}`}
              className="hover:text-red-500 transition-colors"
            >
              {blog.title}
            </Link>
          </CardTitle>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
            <span className="text-red-500">{blog.date}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{blog.readTime}</span>
            {blog.author && (
              <>
                <span className="text-muted-foreground">·</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={blog.author.avatar || "/default-avatar.png"}
                      alt={blog.author.name || "Author"}
                    />
                    <AvatarFallback className="text-xs">
                      {blog.author.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">
                    {blog.author.name}
                  </span>
                </div>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">
            {blog.description}
          </p>
        </CardContent>
        <CardFooter className="mt-auto pt-6">
          <Button
            asChild
            variant="default"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            <Link href={`/Updates/${blog.id}`}>Read More</Link>
          </Button>
        </CardFooter>
      </MagicCard>
    </motion.div>
  );
}
