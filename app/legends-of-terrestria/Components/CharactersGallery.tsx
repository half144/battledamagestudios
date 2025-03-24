"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const characters = [
    {
        id: 1,
        name: "Celeste",
        portrait: "Celeste-Portrait.jpg",
        detailImage: "Celeste-detail.jpg",
        description: "Celeste is a powerful sorceress who wields the elements to protect her homeland.\n " +
                "She is a fierce warrior and a loyal friend, always ready to stand up for what is right.\n" +
                "\nAge: 18\n" +
                "Hates: Injustice\n" +
                "Likes: Nature",
    },
    {
        id: 2,
        name: "Aia",
        portrait: "Aia-portrait.jpg",
        detailImage: "Aia-detail.jpg",
        description: "Aia is a powerful sorceress who wields the elements to protect her homeland. " +
                "She is a fierce warrior and a loyal friend, always ready to stand up for what is right.\n" +
                "Age: 30\n" +
                "Hates: Betrayal\n" +
                "Likes: Music",
    },
    {
        id: 3,
        name: "rihia",
        portrait: "rihia-detail.jpg",
        detailImage: "rihia-detail.jpg",
        description: "rihia is a powerful warrior who wants to protect her homeland and her friends. " +
                "She is a fierce warrior and a loyal friend, always ready to stand up for what is right.\n" +
                "Age: 28\n" +
                "Hates: ????\n" +
                "Likes: Swords",
    },

    // Add more characters as needed
];


interface Character {
  id: number;
  name: string;
  portrait: string;
  detailImage: string;
  description: string;
}

function CharacterModal({ character, onClose }: { character: Character; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-background p-6 rounded-lg max-w-3xl w-full relative"
      >
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-600 text-2xl font-bold"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <Image
              src={character.detailImage}
              alt={character.name}
              width={500}
              height={500}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-red-500 mb-4">
              {character.name}
            </h2>
            <p className="text-lg text-muted-foreground">
              {character.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CharactersGallery() {
  const [selectedCharacter, setSelectedCharacter] = useState<typeof characters[0] | null>(null);

  return (
    <div className="py-16 px-4">
      <h2 className="text-4xl font-bold text-center text-red-500 mb-8">
        Characters
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {characters.map((character) => (
          <motion.div
            key={character.id}
            className="cursor-pointer overflow-hidden rounded-lg shadow-lg"
            whileHover={{ scale: 1.05, rotate: 1 }} // efeito de hover sutil
            onClick={() => setSelectedCharacter(character)}
          >
            <Image
              src={character.portrait}
              alt={character.name}
              width={300}
              height={300}
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCharacter && (
          <CharacterModal
            character={selectedCharacter}
            onClose={() => setSelectedCharacter(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
