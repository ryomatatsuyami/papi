import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { FloatingIslandLandmark, KittenTravelerSprite } from './HandDrawnIcons';

interface PartTwoTransitionProps {
  onContinue: () => void;
}

const STARS = [
  { left: '10%', top: '16%', delay: 0.1, size: 6 },
  { left: '24%', top: '11%', delay: 0.35, size: 8 },
  { left: '42%', top: '14%', delay: 0.2, size: 5 },
  { left: '61%', top: '11%', delay: 0.45, size: 8 },
  { left: '78%', top: '18%', delay: 0.15, size: 6 },
  { left: '89%', top: '26%', delay: 0.3, size: 5 },
];

export const PartTwoTransition: React.FC<PartTwoTransitionProps> = ({ onContinue }) => {
  const [bridgeReady, setBridgeReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBridgeReady(true), 1850);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative z-10 w-full flex-1 flex items-center justify-center overflow-hidden pb-32">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full flex-1 flex flex-col items-center justify-between px-6 sm:px-14 pt-6 pb-20 text-center overflow-hidden"
      >
        {/* Parting Cloud Curtains */}
        <motion.div
          initial={{ x: 0, opacity: 0.9 }}
          animate={{ x: '-85%', opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#FFFDFB] to-transparent pointer-events-none z-20"
        />
        <motion.div
          initial={{ x: 0, opacity: 0.9 }}
          animate={{ x: '85%', opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#FFFDFB] to-transparent pointer-events-none z-20"
        />

        {/* Twinkling Starlight Motes */}
        {STARS.map((star, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.25, 0.95, 0.3], scale: [0.85, 1.2, 0.85] }}
            transition={{
              delay: star.delay,
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
            className="absolute rounded-full bg-[#FFD166] shadow-[0_0_10px_rgba(255,209,102,0.8)] pointer-events-none"
          />
        ))}

        {/* Top Chapter Milestone Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55 }}
          className="relative z-10 space-y-2.5 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDFB]/85 border border-[#DFC7DA] text-xs font-semibold text-[#7A51AE] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A44E]" />
            <span>Part 1 Complete · Sky-Bridge Unlocked</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#352931]">
            Crossing into Starlight Ridge
          </h1>
          <p className="text-sm sm:text-base text-[#4D3D4A] leading-relaxed">
            First-year survival is handled. Ahead sits a brighter horizon—the next eight
            islands are for when you stop just studying syntax and start shipping real projects.
          </p>
        </motion.div>

        {/* Clean Storybook Timber Sky-Bridge Between Two Floating Islands */}
        <div className="relative z-10 w-full max-w-3xl h-68 sm:h-76 my-3 flex items-center justify-center">
          <svg
            viewBox="0 0 680 260"
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            {/* Soft Fluffy Clouds Beneath Each Island */}
            <g opacity="0.65">
              <ellipse cx="120" cy="224" rx="88" ry="18" fill="#FFFDFB" />
              <ellipse cx="560" cy="224" rx="88" ry="18" fill="#FFFDFB" />
            </g>

            {/* Twin Handrail Rope Line (Upper Arch) */}
            <motion.path
              d="M 122 178 Q 340 108 558 178"
              fill="none"
              stroke="#B88E78"
              strokeWidth="2.8"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            />

            {/* Wooden Bridge Fence Posts + Tiny Warm Lanterns */}
            {[
              { x: 185, y: 158, hasLantern: false },
              { x: 245, y: 145, hasLantern: true },
              { x: 340, y: 138, hasLantern: true },
              { x: 435, y: 145, hasLantern: true },
              { x: 495, y: 158, hasLantern: false },
            ].map((post, idx) => (
              <motion.g
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.08, duration: 0.35 }}
              >
                <line
                  x1={post.x}
                  y1={post.y - 12}
                  x2={post.x}
                  y2={post.y + 18}
                  stroke="#7D5A4B"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {post.hasLantern && (
                  <g>
                    <circle cx={post.x} cy={post.y - 18} r="10" fill="#FFE89E" opacity="0.4" />
                    <circle
                      cx={post.x}
                      cy={post.y - 18}
                      r="4.5"
                      fill="#FFD166"
                      stroke="#5C4136"
                      strokeWidth="1.4"
                    />
                  </g>
                )}
              </motion.g>
            ))}

            {/* Curved Wooden Sky-Bridge Deck */}
            <motion.path
              d="M 120 194 Q 340 124 560 194"
              fill="none"
              stroke="#6E4F43"
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.path
              d="M 120 194 Q 340 124 560 194"
              fill="none"
              stroke="#E7BA96"
              strokeWidth="7"
              strokeDasharray="10 5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>

          {/* Left Island Anchor (Chapter II Conservatory) */}
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 sm:left-4 bottom-2 pointer-events-none scale-95 sm:scale-110"
          >
            <FloatingIslandLandmark
              discovered={true}
              active={false}
              chapter={2}
              iconKind="curriculum"
            />
          </motion.div>

          {/* Right Island Anchor (Chapter III Observatory) */}
          <motion.div
            animate={{ y: [3, -3, 3] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-0 sm:right-4 bottom-2 pointer-events-none scale-95 sm:scale-110"
          >
            <FloatingIslandLandmark
              discovered={false}
              active={true}
              chapter={3}
              iconKind="roadmap"
            />
          </motion.div>

          {/* Kitten Bounding Cleanly Across the Timber Sky-Bridge Deck */}
          <motion.div
            initial={{ x: -225, y: 42, rotate: -4 }}
            animate={{
              x: [-225, -150, -75, 0, 75, 150, 225],
              y: [42, 16, -2, -10, -2, 16, 40],
              rotate: [-4, -6, -2, 0, 3, 5, 0],
            }}
            transition={{
              delay: 0.45,
              duration: 1.85,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute pointer-events-none z-20"
          >
            <KittenTravelerSprite walking={!bridgeReady} className="w-18 h-18 drop-shadow-lg" />
          </motion.div>
        </div>

        {/* Continue CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.45 }}
          className="relative z-10"
        >
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#D95D7B] via-[#C95E93] to-[#8E65C7] text-[#FFFDFB] font-semibold text-sm sm:text-base hover:brightness-105 transition-all shadow-lg cursor-pointer whitespace-nowrap"
          >
            <span>Step into Part 2 · Starlight Ridge</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};
