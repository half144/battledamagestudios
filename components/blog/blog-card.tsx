import { BlogPost } from "@/data/store";
import { MagicCard } from "@/components/ui/magic-card";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
              href={`/blogs/${blog.id}`}
              className="hover:text-red-500 transition-colors"
            >
              {blog.title}
            </Link>
          </CardTitle>
          <CardDescription className="flex items-center gap-2 mt-2">
            <span className="text-red-500">{blog.date}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {blog.readTime}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              By {blog.author?.name}
            </span>
          </CardDescription>
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
            <Link href={`/blogs/${blog.id}`}>Read More</Link>
          </Button>
        </CardFooter>
      </MagicCard>
    </motion.div>
  );
}
