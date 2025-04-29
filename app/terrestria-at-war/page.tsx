"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TextAnimate } from "@/components/ui/text-animate";
import Image from "next/image";
import Link from "next/link";

type SectionKeys = 'About' | 'Setting' | 'Factions' | 'Rules';

// Placeholder sections content
const sections: Record<Exclude<SectionKeys, "Factions">, { title: string; text: string; image: string }> = {
  About: {
    title: "About Terrestria At War",
    text: "Content coming soon...",
    image: "/images/terrestria-about.jpg",
  },
  Setting: {
    title: "The World of Terrestria",
    text: "Content coming soon...",
    image: "/images/terrestria-setting.jpg",
  },
  Rules: {
    title: "Game Rules",
    text: "Content coming soon...",
    image: "/images/terrestria-rules.jpg",
  },
};

// Factions data
const factions = [
  {
    id: "astrian-empire",
    name: "Astrian Empire",
    image: "/astrian-empire.png", // Update with your actual image path
    link: "/terrestria-at-war/factions/astrian-empire",
  },
  {
    id: "nephiric-horde",
    name: "Nephiric Horde",
    image: "/nephiric-horde.png", // Update with your actual image path
    link: "/terrestria-at-war/factions/nephiric-horde",
  },
];

export default function TerrestriaAtWar() {
  const [activeSection, setActiveSection] = useState<SectionKeys>("About");

  return (
    <div className="min-h-screen bg-background pt-40 px-6 py-12 flex flex-col items-center">
      {/* Title */}
      <TextAnimate
        animation="blurInUp"
        by="character"
        className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-red-500"
      >
        Terrestria At War
      </TextAnimate>

      {/* Navigation */}
      <div className="flex justify-center gap-6 py-8">
        {(["About", "Setting", "Factions", "Rules"] as SectionKeys[]).map((tab, index) => (
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
      {activeSection === "Factions" ? (
        <FactionsSection />
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

// Factions Section Component
function FactionsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl"
    >
      <h2 className="text-5xl font-bold text-center text-red-500 mb-16">Factions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {factions.map((faction) => (
          <Link href={faction.link} key={faction.id}>
            <motion.div
              className="flex flex-col items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="mb-6">
                <Image
                  src={faction.image}
                  alt={faction.name}
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-3xl font-bold text-white">{faction.name}</h3>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}