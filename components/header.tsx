"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Cart } from "@/components/cart";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-red-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
              Battle Damage Studios
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#Projects"
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              Mixers Universe
            </Link>
            <Link
              href="/store"
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              Store
            </Link>
            <Link
              href="/Updates"
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              Updates 
            </Link>
            <Cart />
            <ThemeToggle />
            <Link
              href="/profile"
              data-testid="profile-link"
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              Profile{" "}
              <span className="text-xs text-red-500">(for preview)</span>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
              >
                Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Cart />
            <ThemeToggle />
            <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="w-6 h-6 text-red-500" />
              ) : (
                <Menu className="w-6 h-6 text-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 space-y-4"
          >
            <Link
              href="/#features"
              className="block text-muted-foreground hover:text-red-500 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#characters"
              className="block text-muted-foreground hover:text-red-500 transition-colors"
            >
              Characters
            </Link>
            <Link
              href="/#stats"
              className="block text-muted-foreground hover:text-red-500 transition-colors"
            >
              Stats
            </Link>
            <Link
              href="/store"
              className="block px-3 py-2 text-muted-foreground hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Store
            </Link>
            <Link
              href="/blogs"
              className="block px-3 py-2 text-muted-foreground hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blogs
            </Link>
            <Link
              href="/profile"
              data-testid="profile-link-mobile"
              className="block text-muted-foreground hover:text-red-500 transition-colors"
            >
              Profile{" "}
              <span className="text-xs text-red-500">(for preview)</span>
            </Link>
            <div className="space-y-2">
              <Link href="/login" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                >
                  Login
                </Button>
              </Link>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                Play Now
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
