"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState } from "react";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { 
  FaPatreon,
  FaSteam, 
  FaReddit,
  FaTwitch,
  FaTwitter,
  FaYoutube,
  FaDiscord,

} from "react-icons/fa";
import { SiStreamlabs } from "react-icons/si";
import { GridPattern } from "@/components/ui/grid-pattern";
import { MagicCard } from "@/components/ui/magic-card";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import Image from "next/image";
const socialLinks = [
  { icon: FaTwitter, url: "#" }, 
  { icon: FaPatreon, url: "#" },
  { icon: FaReddit, url: "#" },
  { icon: FaTwitch, url: "#" },
  { icon: FaSteam, url: "#" },
  { icon: FaYoutube, url: "#" },
  { icon: FaDiscord, url: "#" },
  { icon: SiStreamlabs, url: "#" }, 
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const cards = [
  {
    image: "/terrestria-war.png",
    title: "Terrestria at War",
    desc: "Explore the war-torn lands of Terrestria and its epic battles.",
    link: "/terrestria-at-war",
  },
  {
    image: "/legends-of-terrestria.jpg",
    title: "Legends of Terrestria",
    desc: "Dive into the rich lore of the Legends of Terrestria.",
    link: "/legends-of-terrestria",
  },
  {
    image: "/terrestrian-era.png",
    title: "Terrestrian Era",
    desc: "Join the Terrestrian community and explore exclusive content.",
    link: "/terrestrian-era",
  },
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
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
            className="mb-6"
          >
            <div className="z-10 flex min-h-64 items-center justify-center flex-col">
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1">
                <span>✨ Introducing A New World</span>
              </AnimatedShinyText>
              <Image
                src="/bdsLogo.png"
                alt="Battle Damage Studios Logo"
                width={350}
                height={150}
                className="mt-2"
              />
            </div>
          </motion.div>
          <TextAnimate
            by="word"
            className="text-xl md:text-xl text-muted-foreground mb-12 max-w-xl mx-auto"
          >
            Join Us in this Adventure
          </TextAnimate>
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            {socialLinks.map((social, index) => (
              <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
                <social.icon className="w-8 h-8 text-red-500 hover:text-red-600 transition-colors" />
              </a>
            ))}
          </div>
        </motion.div>
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          className={cn(
            "[mask-image:radial-gradient(350px_circle_at_center,white,transparent)]",
            "bg-background"
          )}
        />
      </div>

      {/* Projects Section */}
      <div id="Projects" className="py-32 px-4">
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
              The Mixers Universe
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
            {cards.map((card, index) => (
              <motion.a
                key={index}
                href={card.link}
                variants={item}
                className="group relative block rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition transform hover:scale-105"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  width={500}
                  height={224}
                  className="w-full h-96 object-cover transition-opacity duration-300 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 transition-opacity duration-300 group-hover:bg-opacity-70">
                  <h3 className="text-lg font-bold text-white">{card.title}</h3>
                  <p className="text-sm text-gray-300">{card.desc}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
