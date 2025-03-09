"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Cart } from "@/components/cart";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSupabase } from "@/components/providers/supabase-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Adicionando tipos
type UserType = {
  id: string;
  email?: string;
} | null;

type ProfileType = {
  username: string;
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserType>(null);
  const [profile, setProfile] = useState<ProfileType>({ username: "User" });
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    // Verificar o estado de autenticação atual
    const checkAuth = async () => {
      setIsLoading(true);

      try {
        // Obter a sessão atual
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          setUser(data.session.user);

          // Buscar o perfil do usuário
          const { data: profileData } = await supabase
            .from("profile")
            .select("username")
            .eq("id", data.session.user.id)
            .single();

          if (profileData) {
            setProfile(profileData);
          }
        } else {
          setUser(null);
          setProfile({ username: "User" });
        }
      } catch (error) {
        console.error("Auth error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Verificar autenticação na montagem do componente
    checkAuth();

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);

          // Buscar o perfil do usuário
          const { data: profileData } = await supabase
            .from("profile")
            .select("username")
            .eq("id", session.user.id)
            .single();

          if (profileData) {
            setProfile(profileData);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile({ username: "User" });
        }
      }
    );

    // Limpar listener na desmontagem
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isAuthenticated = !!user;

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

            {isAuthenticated && (
              <Link
                href="/profile"
                data-testid="profile-link"
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                Profile
              </Link>
            )}

            {isLoading ? (
              <div className="h-9 w-16 bg-muted rounded animate-pulse"></div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <Avatar className="h-8 w-8 border border-red-500/50">
                      <AvatarImage
                        src="/placeholder-avatar.png"
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-red-500/10 text-red-500">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {profile.username}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="cursor-pointer flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                >
                  Login
                </Button>
              </Link>
            )}
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
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#characters"
              className="block text-muted-foreground hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Characters
            </Link>
            <Link
              href="/#stats"
              className="block text-muted-foreground hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
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

            {isAuthenticated && (
              <Link
                href="/profile"
                data-testid="profile-link-mobile"
                className="block text-muted-foreground hover:text-red-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            )}

            <div className="space-y-2">
              {isLoading ? (
                <div className="h-9 w-full bg-muted rounded animate-pulse"></div>
              ) : isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 border border-red-500/20 rounded-md">
                    <Avatar className="h-8 w-8 border border-red-500/50">
                      <AvatarImage
                        src="/placeholder-avatar.png"
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-red-500/10 text-red-500">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {profile.username}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/login" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    Login
                  </Button>
                </Link>
              )}
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
