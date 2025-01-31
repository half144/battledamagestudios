"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Cart } from "@/components/cart";

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
              href="/#features"
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#characters"
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              Characters
            </Link>
            <Link
              href="/#stats"
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              Stats
            </Link>
            <Link
              href="/store"
              className="text-muted-foreground hover:text-red-500 transition-colors"
            >
              Store
            </Link>
            <Cart />
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10"
            >
              Login
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Play Now
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Cart />
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
              className="block text-muted-foreground hover:text-red-500 transition-colors"
            >
              Store
            </Link>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
              >
                Login
              </Button>
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
