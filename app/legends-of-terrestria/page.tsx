"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { TextAnimate } from "@/components/ui/text-animate";
import Image from "next/image";
import CharactersGallery from "./Components/CharactersGallery"; 

type SectionKeys = 'About' | 'Story' | 'Characters' | 'Systems' | 'Steam';

const sections: Record<Exclude<SectionKeys, "Characters">, { title: string; text: string; image: string }> = {
  About: {
    title: "About Legends of Terrestria",
    text: "Legends of Terrastria is an epic RPG set in a vast fantasy world...",
    image: "/images/legends-about.jpg",
  },
  Story: {
    title: "The Story Unfolds",
    text: "Dive into a deep narrative filled with intrigue and adventure...",
    image: "/images/legends-story.jpg",
  },
  Systems: {
    title: "Gameplay Systems",
    text: "Innovative combat, deep skill trees, and an immersive world...",
    image: "/images/legends-systems.jpg",
  },
  Steam: {
    title: "Available on Steam",
    text: "Wishlist and follow Legends of Terrastria on Steam today!",
    image: "/images/legends-steam.jpg",
  },
};

export default function LegendsOfTerrestria() {
  const [activeSection, setActiveSection] = useState<SectionKeys>("About");

  return (
    <div className="min-h-screen bg-background pt-40 px-6 py-12 flex flex-col items-center">
      {/* Title */}
      <TextAnimate
        animation="blurInUp"
        by="character"
        className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-red-500"
      >
        Legends of Terrestria
      </TextAnimate>

      {/* Navigation */}
      <div className="flex justify-center gap-6 py-8">
        {(["About", "Story", "Characters", "Systems", "Steam"] as SectionKeys[]).map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveSection(tab)}
            className={`relative px-6 py-3 text-lg font-bold uppercase border border-red-500 rounded-md shadow-lg transition-all duration-300 group overflow-hidden ${
              activeSection === tab ? "bg-red-500 text-white" : "text-red-500 hover:bg-red-500 hover:text-white"
            }`}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
            <span className="relative">{tab}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeSection === "Characters" ? (
        <CharactersGallery />
      ) : (
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl"
        >
          <h2 className="text-3xl font-bold mb-4">{sections[activeSection].title}</h2>
          <p className="text-lg text-muted-foreground mb-6">{sections[activeSection].text}</p>
          <Image
            src={sections[activeSection].image}
            alt={activeSection}
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </motion.div>
      )}
    </div>
  );
}
