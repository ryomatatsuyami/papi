import React from 'react';
import { motion } from 'motion/react';
import type { ChapterNumber } from '../data/toolsCatalog';

interface SkyBackdropLayerProps {
  chapter: ChapterNumber;
}

const SKY_GRADIENTS: Record<ChapterNumber, string> = {
  1: 'from-[#FFCFC0] via-[#FADCE8] to-[#C8E1FB]',
  2: 'from-[#C5EDD6] via-[#D4EBFC] to-[#FAD8E8]',
  3: 'from-[#D9C6FA] via-[#FBD1E5] to-[#FDE0BA]',
  4: 'from-[#C2D2FA] via-[#F7CEE6] to-[#FDDF9E]',
};

export const SkyBackdropLayer: React.FC<SkyBackdropLayerProps> = ({ chapter }) => {
  return (
    <>
      {/* Unified Vibrant Pastel Sky Base (Identical on Map & Card Pages, Zero Blur Mud) */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${SKY_GRADIENTS[chapter]} transition-colors duration-700 pointer-events-none`}
      />

      {/* Crisp Soft Sunlit Glow */}
      <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-[#FFF7E2]/55 pointer-events-none" />
      <div className="absolute -bottom-32 -right-24 w-[520px] h-[520px] rounded-full bg-[#FFEAF2]/45 pointer-events-none" />

      {/* Crisp Illustrated Drifting Clouds (Consistent across Map & Slides) */}
      <motion.svg
        viewBox="0 0 260 90"
        animate={{ x: [0, 32, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 left-[6%] w-48 sm:w-64 opacity-78 pointer-events-none"
        aria-hidden="true"
      >
        <path
          d="M36 74c-14 0-24-9-24-20s10-19 23-20c5-13 18-22 34-22 14 0 26 7 32 17 6-4 13-6 21-6 17 0 31 11 34 26 10 2 18 10 18 20 0 11-11 20-25 20H36z"
          fill="#FFFDFB"
        />
      </motion.svg>

      <motion.svg
        viewBox="0 0 260 90"
        animate={{ x: [0, -34, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-14 right-[8%] w-52 sm:w-72 opacity-72 pointer-events-none"
        aria-hidden="true"
      >
        <path
          d="M36 74c-14 0-24-9-24-20s10-19 23-20c5-13 18-22 34-22 14 0 26 7 32 17 6-4 13-6 21-6 17 0 31 11 34 26 10 2 18 10 18 20 0 11-11 20-25 20H36z"
          fill="#FFFDFB"
        />
      </motion.svg>

      <motion.svg
        viewBox="0 0 260 90"
        animate={{ x: [0, 22, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-12 left-[22%] w-44 sm:w-56 opacity-62 pointer-events-none"
        aria-hidden="true"
      >
        <path
          d="M36 74c-14 0-24-9-24-20s10-19 23-20c5-13 18-22 34-22 14 0 26 7 32 17 6-4 13-6 21-6 17 0 31 11 34 26 10 2 18 10 18 20 0 11-11 20-25 20H36z"
          fill="#FFFDFB"
        />
      </motion.svg>
    </>
  );
};
