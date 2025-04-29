"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TextAnimate } from "@/components/ui/text-animate";
import Image from "next/image";
import Link from "next/link";

type SectionKeys = 'About' | 'History' | 'Characters' | 'Units' | 'Magic';

// Placeholder sections content
const sections: Record<SectionKeys, { title: string; content: string }> = {
  About: {
    title: "About the Astrian Empire",
    content: "The Astrian Empire is one of the dominant powers in Terrestria, controlling vast territories through their technological superiority and disciplined military forces."
  },
  History: {
    title: "History of the Empire",
    content: "The Astrian Empire rose from the ashes of the Great Collapse, unifying the scattered human settlements under a single banner. For centuries, they have been expanding their influence across Terrestria, building grand cities and establishing powerful military outposts."
  },
  Characters: {
    title: "Notable Characters",
    content: "Profiles of important figures in the Astrian Empire will be available soon..."
  },
  Units: {
    title: "Military Units",
    content: "Information about the various military units of the Astrian Empire will be available soon..."
  },
  Magic: {
    title: "Magical Traditions",
    content: "Details about the magical practices and traditions of the Astrian Empire will be available soon..."
  },
};

export default function AstrianEmpire() {
  const [activeSection, setActiveSection] = useState<SectionKeys>("About");

  return (
    <div className="min-h-screen bg-background pt-40 px-6 py-12 flex flex-col items-center">
      {/* Back button */}
      <div className="self-start mb-6">
        <Link href="/terrestria-at-war">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Terrestria At War
          </button>
        </Link>
      </div>

      {/* Faction Header */}
      <div className="flex flex-col md:flex-row items-center mb-12 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/astrian-empire.png"
            alt="Astrian Empire"
            width={200}
            height={200}
            className="rounded-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center md:text-left"
        >
          <TextAnimate
            animation="blurInUp"
            by="character"
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-red-500"
          >
            Astrian Empire
          </TextAnimate>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A powerful faction that controls vast territories in Terrestria, known for their advanced technology and strict hierarchical society.
          </p>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap justify-center gap-4 py-8 mb-8">
        {(["About", "History", "Characters", "Units", "Magic"] as SectionKeys[]).map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveSection(tab)}
            className={`relative px-5 py-2 text-lg font-bold uppercase border border-red-500 rounded-md shadow-lg transition-all duration-300 group overflow-hidden ${
              activeSection === tab ? "bg-red-500 text-white" : "text-red-500 hover:bg-red-500 hover:text-white"
            }`}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
            <span className="relative">{tab}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <h2 className="text-3xl font-bold text-red-500 mb-4">{sections[activeSection].title}</h2>
        <div className="bg-black bg-opacity-30 p-6 rounded-lg">
          <p className="text-lg text-muted-foreground">
            {sections[activeSection].content}
          </p>
        </div>
      </motion.div>
    </div>
  );
}