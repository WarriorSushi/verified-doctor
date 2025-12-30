"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAMES = [
  "anna", "arjun", "abdul", "chong", "priya",
  "dave", "fatima", "rohan", "mateo", "wei",
  "anjali", "kwame", "vikram", "sarah", "meera"
];

const TYPING_SPEED = 100;
const PAUSE_DURATION = 1500;
const BACKSPACE_SPEED = 50;

interface TypewriterProps {
  onFocus?: () => void;
  isActive?: boolean;
}

export function Typewriter({ onFocus, isActive = true }: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [nameIndex, setNameIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const currentName = NAMES[nameIndex];

  const typeCharacter = useCallback(() => {
    if (!isActive) return;

    if (isTyping) {
      if (displayText.length < currentName.length) {
        setDisplayText(currentName.slice(0, displayText.length + 1));
      } else {
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsTyping(false);
        }, PAUSE_DURATION);
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
      } else {
        setNameIndex((prev) => (prev + 1) % NAMES.length);
        setIsTyping(true);
      }
    }
  }, [displayText, currentName, isTyping, isActive]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const speed = isTyping ? TYPING_SPEED : BACKSPACE_SPEED;
    const timer = setTimeout(typeCharacter, speed);

    return () => clearTimeout(timer);
  }, [typeCharacter, isTyping, isPaused, isActive]);

  return (
    <span className="inline-flex items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={displayText}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          className="text-slate-400"
        >
          {displayText}
        </motion.span>
      </AnimatePresence>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[2px] h-6 bg-[#0099F7] ml-0.5"
      />
    </span>
  );
}
