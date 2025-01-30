"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sword,
  Users,
  Trophy,
  Download,
  Play,
  Star,
  Sparkles,
  Gamepad2,
  Menu,
  X,
  ArrowRightIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState } from "react";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { MagicCard } from "@/components/ui/magic-card";
import { TextReveal } from "@/components/ui/text-reveal";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
                Battle Damage Studios
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                Features
              </a>
              <a
                href="#characters"
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                Characters
              </a>
              <a
                href="#stats"
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                Stats
              </a>
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
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-red-500" />
              ) : (
                <Menu className="w-6 h-6 text-red-500" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden py-4 space-y-4"
            >
              <a
                href="#features"
                className="block text-muted-foreground hover:text-red-500 transition-colors"
              >
                Features
              </a>
              <a
                href="#characters"
                className="block text-muted-foreground hover:text-red-500 transition-colors"
              >
                Characters
              </a>
              <a
                href="#stats"
                className="block text-muted-foreground hover:text-red-500 transition-colors"
              >
                Stats
              </a>
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

      {/* Hero Section */}
      <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-2"
          >
            <div className="z-10 flex min-h-64 items-center justify-center">
              <div
                className={cn(
                  "group rounded-full border border-black/5 bg-background text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                )}
              >
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                  <span>✨ Introducing A New Game</span>
                  <Sword className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedShinyText>
              </div>
            </div>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-white drop-shadow-2xl">
            <LineShadowText className="italic text-white" shadowColor="white">
              Battle
            </LineShadowText>
            <LineShadowText className="italic text-white" shadowColor="white">
              Damage
            </LineShadowText>
            <TextAnimate
              animation="blurInUp"
              duration={0.5}
              className="text-white"
              by="character"
            >
              Studios
            </TextAnimate>
          </h1>
          <TextAnimate
            by="word"
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Enter a world where legendary heroes clash, magic flows freely, and
            your destiny awaits.
          </TextAnimate>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg group"
            >
              Play Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10 px-8 py-6 text-lg"
            >
              <Play className="mr-2 h-5 w-5" /> Watch Trailer
            </Button>
          </div>
        </motion.div>
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
            "bg-background"
          )}
        />
      </div>

      {/* Features Section */}
      <div id="features" className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <TextAnimate
              animation="blurInUp"
              by="character"
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-red-500"
            >
              Game Features
            </TextAnimate>
            <p className="text-muted-foreground text-lg">
              Discover what makes Battle Damage Studios unique
            </p>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Sword,
                title: "Epic Battles",
                desc: "Experience intense combat with stunning animations and powerful abilities",
              },
              {
                icon: Users,
                title: "Multiplayer",
                desc: "Team up with friends or challenge rivals in PvP combat",
              },
              {
                icon: Trophy,
                title: "Rankings",
                desc: "Climb the leaderboards and become a legendary player",
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={item}>
                <MagicCard className="p-6 bg-background/50 dark:bg-gray-900/50 backdrop-blur-lg border border-red-500/20 hover:border-red-500/40 transition-all group">
                  <feature.icon className="w-12 h-12 mb-4 text-red-500 group-hover:text-red-400 transition-colors" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </MagicCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="z-10 flex min-h-64 items-center justify-center rounded-lg border bg-white dark:bg-black">
        <TextReveal
          className="text-red-500"
          text="Engage in epic battles with stunning animations and powerful abilities. Team up with friends or challenge rivals in PvP combat, and climb the leaderboards to become a legend!"
        />
      </div>

      {/* Characters Preview */}
      <div id="characters" className="py-32 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
              Featured Characters
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose your hero and begin your journey
            </p>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                name: "Shadow Blade",
                role: "Assassin",
                img: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3",
              },
              {
                name: "Crystal Mage",
                role: "Spellcaster",
                img: "https://images.unsplash.com/photo-1542931287-023b922fa89b?ixlib=rb-4.0.3",
              },
              {
                name: "Dragon Knight",
                role: "Warrior",
                img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3",
              },
              {
                name: "Spirit Healer",
                role: "Support",
                img: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?ixlib=rb-4.0.3",
              },
            ].map((char, i) => (
              <motion.div key={i} variants={item}>
                <Card className="overflow-hidden bg-background/50 dark:bg-gray-900/50 backdrop-blur-lg border border-red-500/20 hover:border-red-500/40 transition-all group">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{ backgroundImage: `url(${char.img})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-lg text-white">
                        {char.name}
                      </h3>
                      <p className="text-sm text-red-300">{char.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="py-32 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            {[
              { icon: Star, value: "1M+", label: "Active Players" },
              { icon: Gamepad2, value: "100+", label: "Unique Characters" },
              { icon: Trophy, value: "50K+", label: "Tournament Players" },
            ].map((stat, i) => (
              <motion.div key={i} variants={item} className="p-6">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background/80 backdrop-blur-lg border-t border-red-500/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold">Battle Damage Studios</span>
              </div>
              <p className="text-muted-foreground">
                Join millions of players in the ultimate anime gaming
                experience.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#characters"
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Characters
                  </a>
                </li>
                <li>
                  <a
                    href="#stats"
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Stats
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-red-500/20 text-center text-muted-foreground">
            <p>© 2025 Battle Damage Studios. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
