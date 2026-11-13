import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Gift,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { CHAPTER_META, TOOLS_CATALOG, type ToolStop } from '../data/toolsCatalog';
import {
  FloatingIslandLandmark,
  HandDrawnToolIcon,
  KittenTravelerSprite,
  StorybookGiftBoxSvg,
} from './HandDrawnIcons';
import { openExternalSafely } from '../utils/openExternalLink';
import { soundEngine } from '../utils/soundEngine';

export type SlideBeat = 'intro' | 'unwrapped';
type UnboxPhase = 'sealed' | 'buildup' | 'burst' | 'spotlight' | 'unveiled';

interface JourneyMapStageProps {
  activeIndex: number;
  slideBeat: SlideBeat;
  collectedIds: string[];
  onUnwrapCurrent: () => void;
  onWalkNext: () => void;
  onWalkPrevious: () => void;
}

const KITTY_DIALOGUES = [
  'mrrp! tap the gift box already!',
  'i carried this whole island here myself',
  'still waiting on that iced coffee btw',
  'try the heart & star buttons top-left!',
  'light the sparkler in the bottom-left!',
  'my paws hurt (totally worth it)',
  'psst... he spent way too long on this',
  '10/10 future software engineer vibes',
  'purr~ what’s behind the ribbon?',
  'don’t skip the Part 2 sky bridge!',
  'meow!! (that means hurry up)',
  'you’re kinda cute when you’re focused',
  'zero sketchy ad-filled sites in my bag',
  '100% free & open source, pinky promise',
  'drag your mouse near the stars if you summon them!',
  'bookmark the Gift Board when we finish!',
  'i knocked three bugs off the table for you',
  'brb napping on your keyboard after this',
  'this one’s gonna save your lab grade fr',
  'every island = 1 less headache this semester',
  'switch up the songs bottom-right~',
];

const CONFETTI_BURST = [
  { angle: 0, dist: 270, color: '#E66F8E', size: 14 },
  { angle: 20, dist: 295, color: '#6BAE8E', size: 12 },
  { angle: 40, dist: 255, color: '#FFD166', size: 15 },
  { angle: 60, dist: 285, color: '#9D77CE', size: 13 },
  { angle: 80, dist: 260, color: '#7BB1E8', size: 14 },
  { angle: 100, dist: 295, color: '#E66F8E', size: 12 },
  { angle: 120, dist: 255, color: '#FFD166', size: 15 },
  { angle: 140, dist: 285, color: '#6BAE8E', size: 13 },
  { angle: 160, dist: 270, color: '#9D77CE', size: 14 },
  { angle: 180, dist: 295, color: '#7BB1E8', size: 12 },
  { angle: 200, dist: 255, color: '#E66F8E', size: 15 },
  { angle: 220, dist: 285, color: '#FFD166', size: 13 },
  { angle: 240, dist: 260, color: '#6BAE8E', size: 14 },
  { angle: 260, dist: 295, color: '#9D77CE', size: 12 },
  { angle: 280, dist: 255, color: '#7BB1E8', size: 15 },
  { angle: 300, dist: 285, color: '#E66F8E', size: 13 },
  { angle: 320, dist: 265, color: '#FFD166', size: 14 },
  { angle: 340, dist: 290, color: '#6BAE8E', size: 12 },
];

export const JourneyMapStage: React.FC<JourneyMapStageProps> = ({
  activeIndex,
  slideBeat,
  collectedIds,
  onUnwrapCurrent,
  onWalkNext,
  onWalkPrevious,
}) => {
  const stop: ToolStop = TOOLS_CATALOG[activeIndex] ?? TOOLS_CATALOG[0];
  const isCollected = collectedIds.includes(stop.id);
  const isLastStop = activeIndex === TOOLS_CATALOG.length - 1;
  const isEndOfPart1 = stop.order === 12;
  const chapterInfo = CHAPTER_META[stop.chapter];

  const isAlreadyUnwrapped = slideBeat === 'unwrapped' || isCollected;

  const [copied, setCopied] = useState(false);
  const [unboxPhase, setUnboxPhase] = useState<UnboxPhase>(
    isAlreadyUnwrapped ? 'unveiled' : 'sealed'
  );
  const [chargeStage, setChargeStage] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const [kittenHop, setKittenHop] = useState(false);
  const [kittyIdx, setKittyIdx] = useState(0);
  const [kittySpeech, setKittySpeech] = useState(stop.kittyLine);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearUnboxTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    clearUnboxTimers();
    setCopied(false);
    setChargeStage(0);
    setUnboxPhase(isAlreadyUnwrapped ? 'unveiled' : 'sealed');
    setKittySpeech(stop.kittyLine);
    return () => clearUnboxTimers();
  }, [stop.id, stop.kittyLine, isAlreadyUnwrapped]);

  useEffect(() => {
    return () => {
      clearUnboxTimers();
      if (hopTimerRef.current) clearTimeout(hopTimerRef.current);
    };
  }, []);

  const handlePetKitten = () => {
    soundEngine.playKittenMeow();
    if (hopTimerRef.current) clearTimeout(hopTimerRef.current);
    setKittenHop(true);
    setKittySpeech(KITTY_DIALOGUES[kittyIdx % KITTY_DIALOGUES.length]);
    setKittyIdx((i) => i + 1);
    hopTimerRef.current = setTimeout(() => setKittenHop(false), 360);
  };

  const finishSpotlight = () => {
    clearUnboxTimers();
    setKittenHop(false);
    setChargeStage(0);
    setUnboxPhase('unveiled');
    onUnwrapCurrent();
  };

  // Multi-stage lootbox-style buildup -> burst -> slow spotlight -> icon glides to card slot
  const handleUnwrapClick = () => {
    if (unboxPhase === 'buildup' || unboxPhase === 'burst' || unboxPhase === 'spotlight') return;
    clearUnboxTimers();
    soundEngine.playPaperRustle();
    soundEngine.playLootboxBuildup();
    setChargeStage(1);
    setUnboxPhase('buildup');
    setKittenHop(true);
    setKittySpeech('hold on… it’s charging up!');

    // Ramp shaking & aura glow halfway through buildup
    const tRamp = setTimeout(() => {
      setChargeStage(2);
      setKittySpeech('almost open!! look!!');
    }, 850);

    // Beat 2: Lootbox pops lid open with bright flash + confetti burst!
    const tBurst = setTimeout(() => {
      setBurstKey((k) => k + 1);
      setUnboxPhase('burst');
      soundEngine.playGiftSparkle();
    }, 1650);

    // Beat 3: Opened box transforms into the app icon & title in slow spotlight
    const tSpot = setTimeout(() => {
      setUnboxPhase('spotlight');
      setKittySpeech(`ta-da!! ${stop.title}!`);
    }, 2550);

    // Beat 4: Icon glides back smoothly into the card's icon slot
    const tDone = setTimeout(() => {
      setKittenHop(false);
      setChargeStage(0);
      setUnboxPhase('unveiled');
      onUnwrapCurrent();
    }, 5200);

    timersRef.current.push(tRamp, tBurst, tSpot, tDone);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(stop.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const isOverlayUnboxing =
    unboxPhase === 'buildup' || unboxPhase === 'burst' || unboxPhase === 'spotlight';

  return (
    <section className="relative w-full flex-1 flex items-center justify-center overflow-hidden pb-36 pt-2">
      {/* BACKGROUND / LAYERED KITTY ISLAND (Recedes into Soft Silhouette Behind Enlarged Card) */}
      <motion.div
        animate={{
          scale: unboxPhase === 'sealed' ? 1 : 0.85,
          opacity: unboxPhase === 'sealed' ? 0.9 : isOverlayUnboxing ? 0.2 : 0.36,
          y: unboxPhase === 'sealed' ? -10 : -40,
          filter: unboxPhase === 'sealed' ? 'blur(0px)' : 'blur(1.5px)',
        }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <div className="relative flex flex-col items-center">
          <div className="scale-[2.25] sm:scale-[2.7] opacity-85">
            <FloatingIslandLandmark
              discovered={unboxPhase === 'unveiled' || isCollected}
              active={true}
              chapter={stop.chapter}
              iconKind={stop.iconKind}
            />
          </div>
        </div>
      </motion.div>

      {/* Stationary Desktop Kitty Mascot on the Right Side of the Screen (Above Minimap) */}
      <div className="hidden lg:block fixed right-6 xl:right-8 bottom-48 z-30 w-24">
        <div className="relative flex flex-col items-center w-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={kittySpeech}
              initial={{ opacity: 0, y: 6, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.94 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-full right-0 mb-2.5 w-max max-w-[230px] px-4 py-2.5 rounded-2xl bg-[#FFFDFB] border-2 border-[#E6C2CD] text-xs sm:text-sm font-medium text-[#352931] shadow-md pointer-events-none"
            >
              <span>{kittySpeech}</span>
              <span className="absolute -bottom-2 right-8 w-3.5 h-3.5 rotate-45 bg-[#FFFDFB] border-r-2 border-b-2 border-[#E6C2CD]" />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={handlePetKitten}
            title="Tap the kitty!"
            className="flex flex-col items-center cursor-pointer focus-visible:outline-none group"
          >
            <KittenTravelerSprite
              hop={kittenHop}
              className="w-22 h-22 xl:w-24 xl:h-24 drop-shadow-lg group-hover:scale-105 transition-transform"
            />
            <span className="mt-0.5 px-2.5 py-0.5 rounded-full bg-[#FFFDFB]/95 border border-[#E6D8D4] text-[11px] font-medium text-[#6E5D67] whitespace-nowrap">
              Tap kitty
            </span>
          </button>
        </div>
      </div>

      {/* Confetti Explosion on Lootbox Burst */}
      {burstKey > 0 && (
        <div
          key={burstKey}
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
        >
          {CONFETTI_BURST.map((c, idx) => {
            const rad = (c.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * c.dist;
            const ty = Math.sin(rad) * c.dist;
            return (
              <motion.span
                key={idx}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.5, rotate: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  x: tx,
                  y: ty,
                  scale: [0.7, 1.6, 0.85],
                  rotate: idx % 2 === 0 ? 240 : -240,
                }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  backgroundColor: c.color,
                  width: c.size,
                  height: c.size,
                }}
                className={`absolute ${idx % 2 === 0 ? 'rounded-full' : 'rounded-xs'}`}
              />
            );
          })}
        </div>
      )}

      {/* LOOTBOX CENTER-STAGE UNBOXING OVERLAY */}
      <AnimatePresence>
        {isOverlayUnboxing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={unboxPhase === 'spotlight' ? finishSpotlight : undefined}
            className="fixed inset-0 z-40 bg-[#1B101A]/76 backdrop-blur-sm flex items-center justify-center p-6"
          >
            {/* Unified Center Anchor; shifts slightly down onto the gift box body during buildup/burst */}
            <div className="relative flex items-center justify-center">
              <div
                className={`relative flex items-center justify-center transition-transform duration-300 ${
                  unboxPhase === 'spotlight' ? 'translate-y-0' : 'translate-y-4'
                }`}
              >
                {/* Soft, Evenly Spread 16-Ray SVG Glow Sunburst (userSpaceOnUse gradient + soft blur) */}
                <motion.svg
                  viewBox="0 0 520 520"
                  animate={{
                    rotate: 360,
                    scale: unboxPhase === 'buildup' ? (chargeStage === 2 ? 1.08 : 0.88) : 1.12,
                    opacity: unboxPhase === 'buildup' ? (chargeStage === 2 ? 0.65 : 0.42) : 0.72,
                  }}
                  transition={{
                    rotate: { duration: 24, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 0.85, ease: 'easeOut' },
                    opacity: { duration: 0.5 },
                  }}
                  className="w-[460px] h-[460px] sm:w-[540px] sm:h-[540px] pointer-events-none select-none"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient
                      id="lootSunburstFade"
                      gradientUnits="userSpaceOnUse"
                      cx="260"
                      cy="260"
                      r="235"
                    >
                      <stop offset="0%" stopColor="#FFF5C8" stopOpacity="0.62" />
                      <stop offset="36%" stopColor="#FFD27D" stopOpacity="0.28" />
                      <stop offset="72%" stopColor="#F497B3" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#F497B3" stopOpacity="0" />
                    </radialGradient>
                    <filter id="softRayBlur" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="5.5" />
                    </filter>
                  </defs>
                  <g filter="url(#softRayBlur)">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <polygon
                        key={i}
                        points="260,260 232,16 288,16"
                        fill="url(#lootSunburstFade)"
                        opacity="0.48"
                        transform={`rotate(${i * 22.5} 260 260)`}
                      />
                    ))}
                    <circle cx="260" cy="260" r="115" fill="url(#lootSunburstFade)" opacity="0.65" />
                  </g>
                </motion.svg>

                {/* Centered Charging Energy Ring aligned directly around the Gift Box */}
                {unboxPhase === 'buildup' && (
                  <motion.div
                    initial={{ scale: 1.38, opacity: 0 }}
                    animate={{ scale: [1.38, 0.8, 1.12, 0.76], opacity: [0.28, 0.85, 0.45, 0.92] }}
                    transition={{ duration: 1.6, ease: 'easeInOut' }}
                    className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-[#FFD166]/70 shadow-[0_0_46px_rgba(255,209,102,0.45)] pointer-events-none"
                  />
                )}

                {/* Centered Flash Ripple on Lid Burst */}
                {unboxPhase === 'burst' && (
                  <motion.div
                    initial={{ scale: 0.35, opacity: 0.92 }}
                    animate={{ scale: 2.8, opacity: 0 }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute w-52 h-52 rounded-full bg-radial from-[#FFFDF7] via-[#FFE082]/65 to-transparent pointer-events-none"
                  />
                )}
              </div>

              {(unboxPhase === 'buildup' || unboxPhase === 'burst') && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      layoutId={`gift-box-${stop.id}`}
                      transition={{ type: 'spring', stiffness: 165, damping: 20 }}
                      className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center"
                    >
                      <motion.div
                        animate={
                          unboxPhase === 'burst'
                            ? { scale: [1.12, 1.24, 0.92], rotate: 0 }
                            : chargeStage === 2
                              ? {
                                  scale: [1.06, 1.14, 1.06],
                                  rotate: [-7, 8, -9, 9, -7, 6, -4, 0],
                                }
                              : {
                                  scale: [1, 1.04, 1],
                                  rotate: [-3, 3, -4, 4, -2, 0],
                                }
                        }
                        transition={{
                          duration: unboxPhase === 'burst' ? 0.5 : 0.75,
                          repeat: unboxPhase === 'buildup' ? Infinity : 0,
                          ease: 'easeInOut',
                        }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <StorybookGiftBoxSvg
                          lidOpen={unboxPhase === 'burst'}
                          showQuestion={unboxPhase === 'buildup'}
                          className="w-52 h-52 sm:w-60 sm:h-60 drop-shadow-2xl"
                        />
                      </motion.div>
                    </motion.div>

                    <motion.p
                      key={`${unboxPhase}-${chargeStage}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-5 whitespace-nowrap px-4 py-1.5 rounded-full bg-[#1F121D]/70 border border-white/15 font-display text-xl sm:text-3xl font-bold text-[#FFFDFB] drop-shadow-lg"
                    >
                      {unboxPhase === 'burst'
                        ? 'Unlocking…!'
                        : chargeStage === 2
                          ? 'Here it comes…!'
                          : `Opening Gift #${stop.order}…`}
                    </motion.p>
                  </div>
                </div>
              )}

              {unboxPhase === 'spotlight' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex flex-col items-center text-center">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45 }}
                      className="absolute bottom-full mb-7 px-4 py-1.5 rounded-full bg-[#241422]/85 border border-[#FFD166]/45 text-xs font-bold tracking-wider uppercase text-[#FFE89E] shadow-lg whitespace-nowrap"
                    >
                      Gift #{stop.order} Unlocked
                    </motion.div>

                    {/* Centered Medallion Directly Over Ray Origin */}
                    <motion.div
                      layoutId={`tool-emblem-${stop.id}`}
                      initial={{ scale: 0.28, y: 36, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                      className="w-36 h-36 sm:w-44 sm:h-44 rounded-[38px] bg-[#FFFDFB] border-4 border-[#F6B4C6] shadow-2xl flex items-center justify-center"
                    >
                      <HandDrawnToolIcon kind={stop.iconKind} className="w-22 h-22 sm:w-28 sm:h-28" />
                    </motion.div>

                    <div className="absolute top-full mt-7 w-[90vw] max-w-xl flex flex-col items-center">
                      <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.6 }}
                        className="font-display text-4xl sm:text-6xl font-bold text-[#FFFDFB] drop-shadow-[0_4px_20px_rgba(18,8,16,0.92)] leading-tight"
                      >
                        {stop.title}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.68, duration: 0.55 }}
                        className="mt-2.5 text-base sm:text-xl font-medium text-[#FFF3F8] drop-shadow-[0_2px_10px_rgba(18,8,16,0.9)] max-w-md"
                      >
                        {stop.tagline}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.92 }}
                        transition={{ delay: 1.05 }}
                        className="mt-4 px-3.5 py-1 rounded-full bg-[#1B101A]/75 border border-white/15 text-xs font-medium text-white/90"
                      >
                        Adding to your toolkit… (tap anywhere to continue)
                      </motion.p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOREGROUND FULL-WIDTH WELL-ALIGNED SPOTLIGHT CARD */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-36 pb-8">
        {unboxPhase === 'sealed' && (
          <motion.article
            key={`${stop.id}-sealed`}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full rounded-[32px] bg-[#FFFDFB]/95 backdrop-blur-md border-2 ${chapterInfo.tintBorder} shadow-2xl p-7 sm:p-10 lg:p-12 space-y-7`}
          >
            {/* Metadata Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#6E5D67]">
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: chapterInfo.accentColor }}>
                  {stop.partLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-medium">{stop.islandName}</span>
              </div>
              <span className="font-mono tabular-nums font-semibold text-[#352931]">
                Stop {stop.order} / {TOOLS_CATALOG.length}
              </span>
            </div>

            {/* Balanced Mystery Hero Row */}
            <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 py-2">
              <div className="shrink-0 flex justify-center">
                <motion.button
                  type="button"
                  layoutId={`gift-box-${stop.id}`}
                  onClick={handleUnwrapClick}
                  whileHover={{ scale: 1.07, rotate: -2 }}
                  whileTap={{ scale: 0.94 }}
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-44 h-44 sm:w-52 sm:h-52 rounded-[36px] bg-gradient-to-br from-[#FCE3EB] via-[#F5E8FC] to-[#E3F3EA] border-2 border-[#E6B8C7] shadow-lg flex items-center justify-center cursor-pointer"
                  title="Click to unwrap!"
                >
                  <StorybookGiftBoxSvg
                    showQuestion={true}
                    className="w-36 h-36 sm:w-40 sm:h-40"
                  />
                </motion.button>
              </div>

              <div className="flex-1 min-w-0 space-y-4 text-center md:text-left">
                <p className="text-xs font-bold tracking-wider uppercase text-[#D95D7B]">
                  Mystery Gift · Tap the box to unwrap
                </p>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#352931] leading-[1.15]">
                  {stop.storyHook}
                </h2>
                <p className="text-base sm:text-lg text-[#4D3E47] leading-relaxed">
                  {stop.whyForHer}
                </p>
              </div>
            </div>

            {/* Playful Personal Note */}
            <div
              className={`rounded-2xl ${chapterInfo.tintBg} border ${chapterInfo.tintBorder} px-6 py-5`}
            >
              <p className="font-display italic font-semibold text-lg sm:text-2xl text-[#352931] leading-relaxed">
                “{stop.personalNote}”
              </p>
            </div>

            {/* Mobile Kitty Inline Trigger */}
            <div className="lg:hidden flex items-center justify-center">
              <button
                type="button"
                onClick={handlePetKitten}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FFF5F7] border border-[#E6C2CD] text-xs font-medium text-[#352931] cursor-pointer"
              >
                <span className="w-8 h-8 shrink-0 flex items-center justify-center">
                  <KittenTravelerSprite hop={kittenHop} className="w-8 h-8" />
                </span>
                <span>“{kittySpeech}”</span>
              </button>
            </div>

            {/* Controls */}
            <div className="pt-3 border-t border-[#EFE2DE] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onWalkPrevious}
                disabled={activeIndex === 0}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#DFCFD3] bg-[#FFFDFB] text-sm sm:text-base font-medium text-[#51424B] hover:border-[#352931] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleUnwrapClick}
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-gradient-to-r from-[#D95D7B] via-[#C95E93] to-[#8E65C7] text-[#FFFDFB] text-base sm:text-lg font-bold hover:brightness-105 transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                <Gift className="w-5 h-5" />
                <span>Unwrap Gift</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </motion.article>
        )}

        {unboxPhase === 'unveiled' && (
          <motion.article
            key={`${stop.id}-unveiled`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full rounded-[32px] bg-[#FFFDFB]/96 backdrop-blur-md border-2 ${chapterInfo.tintBorder} shadow-2xl p-7 sm:p-10 lg:p-12 space-y-7`}
          >
            {/* Top Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#6E5D67]">
              <div className="flex items-center gap-2 font-bold text-[#3D745A]">
                <Sparkles className="w-4 h-4 text-[#D95D7B]" />
                <span>Unwrapped · {stop.freeBadge}</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleUnwrapClick}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#8C7780] hover:text-[#D95D7B] cursor-pointer"
                  title="Replay unboxing animation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Unwrap</span>
                </button>
                <span className="font-mono tabular-nums font-bold text-[#352931]">
                  Stop {stop.order} / {TOOLS_CATALOG.length}
                </span>
              </div>
            </div>

            {/* Revealed Icon Slot receiving the Spotlight Emblem via layoutId! */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <motion.div
                layoutId={`tool-emblem-${stop.id}`}
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] ${chapterInfo.tintBg} border-2 ${chapterInfo.tintBorder} shadow-md flex items-center justify-center shrink-0`}
              >
                <HandDrawnToolIcon kind={stop.iconKind} className="w-14 h-14 sm:w-16 sm:h-16" />
              </motion.div>

              <div className="space-y-1.5">
                <p
                  className="text-xs sm:text-sm font-bold"
                  style={{ color: chapterInfo.accentColor }}
                >
                  {stop.islandName} · {stop.partLabel}
                </p>
                <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#352931] leading-[1.08]">
                  {stop.title}
                </h2>
                <p className="text-base sm:text-lg text-[#5C4C55] font-medium">
                  {stop.tagline}
                </p>
              </div>
            </div>

            {/* Expanded Details Grid Using Full Width Cleanly */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-[#EFE2DE] pt-6">
              <div className="lg:col-span-7 space-y-3">
                <p className="text-base sm:text-lg text-[#352931] leading-relaxed">
                  {stop.whatItDoes}
                </p>
                <p className="text-sm sm:text-base text-[#4A3C44] leading-relaxed">
                  <strong className="font-bold text-[#352931]">Why it’s in your pack: </strong>
                  {stop.whyForHer}
                </p>
              </div>

              <div
                className={`lg:col-span-5 rounded-2xl ${chapterInfo.tintBg} border ${chapterInfo.tintBorder} p-5 flex items-center`}
              >
                <p className="font-display italic font-semibold text-base sm:text-xl text-[#785566] leading-relaxed">
                  “{stop.personalNote}”
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={stop.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => openExternalSafely(e, stop.url)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FCE4EB] to-[#F4E6FA] border border-[#E5B6C8] text-sm sm:text-base font-bold text-[#962F4B] hover:brightness-97 transition-all whitespace-nowrap shadow-2xs"
              >
                <span>{stop.urlLabel}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {stop.secondaryUrl && stop.secondaryLabel && (
                <a
                  href={stop.secondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => openExternalSafely(e, stop.secondaryUrl!)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#EAF6EF] border border-[#B3DCC6] text-sm sm:text-base font-semibold text-[#2A5942] hover:bg-[#DFF1E7] transition-colors whitespace-nowrap"
                >
                  <span>{stop.secondaryLabel}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-[#FFFDFB] border border-[#E2D2CE] text-sm sm:text-base font-medium text-[#51424B] hover:border-[#D95D7B] transition-colors cursor-pointer whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#488B6E]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Kitty */}
            <div className="lg:hidden flex items-center justify-center">
              <button
                type="button"
                onClick={handlePetKitten}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FFF5F7] border border-[#E6C2CD] text-xs font-medium text-[#352931] cursor-pointer"
              >
                <span className="w-8 h-8 shrink-0 flex items-center justify-center">
                  <KittenTravelerSprite hop={kittenHop} className="w-8 h-8" />
                </span>
                <span>“{kittySpeech}”</span>
              </button>
            </div>

            {/* Navigation Footer */}
            <div className="pt-4 border-t border-[#EFE2DE] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onWalkPrevious}
                disabled={activeIndex === 0}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#DFCFD3] bg-[#FFFDFB] text-sm sm:text-base font-medium text-[#51424B] hover:border-[#352931] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={onWalkNext}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#352931] text-[#FFFDFB] text-sm sm:text-base font-bold hover:bg-[#4B3B45] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span>
                  {isLastStop
                    ? 'Finish Journey'
                    : isEndOfPart1
                      ? 'Cross Cloud Gate → Part 2'
                      : 'Walk to Next Island'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.article>
        )}
      </div>
    </section>
  );
};
