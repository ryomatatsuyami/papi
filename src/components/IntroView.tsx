import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Heart, Sparkles } from 'lucide-react';
import introCottageImg from '../assets/images/pastel_sky_intro_cottage_1794553720808.jpg';
import { KittenTravelerSprite } from './HandDrawnIcons';
import { soundEngine } from '../utils/soundEngine';

interface IntroViewProps {
  collectedCount: number;
  totalCount: number;
  onStartJourney: () => void;
  onOpenBoard: () => void;
}

const INTRO_KITTY_LINES = [
  'ready to explore?',
  'tap me again, i dare you',
  '20 free tools inside my bag!',
  'don’t forget his coffee btw',
  'mrrp~ click Start the Journey!',
  'part 2 has starry skies!!',
  'i promise zero sketchy PDF sites',
  'try the heart & star buttons top-left!',
  'light the sparkler in the bottom-left!',
  'purr... go click Start!',
];

export const IntroView: React.FC<IntroViewProps> = ({
  collectedCount,
  totalCount,
  onStartJourney,
  onOpenBoard,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [kittyIdx, setKittyIdx] = useState(0);
  const [kittyHop, setKittyHop] = useState(false);
  const hopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasProgress = collectedCount > 0;

  useEffect(() => {
    return () => {
      if (hopTimerRef.current) clearTimeout(hopTimerRef.current);
    };
  }, []);

  const handleKittyClick = () => {
    soundEngine.playKittenMeow();
    if (hopTimerRef.current) clearTimeout(hopTimerRef.current);
    setKittyHop(true);
    setKittyIdx((prev) => (prev + 1) % INTRO_KITTY_LINES.length);
    hopTimerRef.current = setTimeout(() => setKittyHop(false), 360);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      <div className="relative w-full max-w-[1360px] mx-auto px-5 sm:px-10 pt-20 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center space-y-6"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#5C4C55]">
              <span className="text-[#C84164]">Starlight Atlas</span>
              <span aria-hidden="true">·</span>
              <span>4 Chapters</span>
              <span aria-hidden="true">·</span>
              <span>20 Free Tools</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[#352931] leading-[1.1]">
              So I made you an entire world instead of sending 20 links over text.
            </h1>

            <div className="space-y-4 text-base sm:text-lg text-[#453740] leading-relaxed max-w-xl">
              <p>
                First-year Computer Science comes with forty logins, giant lab PDFs,
                and at least three nights where C pointers will make you stare at the wall.
                Rather than flooding your chats with random URLs, I tucked every free,
                open-source tool I swear by onto floating islands for you.
              </p>
              <p>
                <strong className="font-semibold text-[#C84164]">Chapters I & II</strong>{' '}
                cover campus survival and first-year study gear you can use right now.
                Cross the Cloud Gate into{' '}
                <strong className="font-semibold text-[#7A51AE]">Chapters III & IV</strong>{' '}
                to unlock serious builder tools for shipping real apps and landing
                internships.
              </p>
              <p className="font-display italic text-[#A83858] text-xl">
                Yes, I gave you a little kitten avatar. No, don’t let the effort go to your
                head—you still owe me coffee.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onStartJourney}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#D95D7B] via-[#C95E93] to-[#8E65C7] text-[#FFFDFB] font-semibold text-base hover:brightness-105 transition-all shadow-md cursor-pointer whitespace-nowrap shrink-0"
              >
                <Compass className="w-5 h-5" />
                <span>
                  {hasProgress && collectedCount < totalCount
                    ? `Continue Journey (${collectedCount}/${totalCount})`
                    : 'Start the Journey'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {collectedCount >= totalCount && (
                <button
                  type="button"
                  onClick={onOpenBoard}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#EBF7F0] border-2 border-[#B3DCC6] text-[#2B5A44] font-semibold text-base hover:bg-[#DFF2E7] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Open Gift Board</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Right Column: Floating Cottage + Pinned Stationary Interactive Kitty */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex items-stretch"
          >
            <div className="w-full rounded-3xl overflow-hidden border-2 border-[#E6C8D3] bg-[#FFFDFB] shadow-xl flex flex-col relative">
              <div className="relative flex-1 min-h-[390px] lg:min-h-[500px] bg-gradient-to-br from-[#FBF0EC] via-[#F2F6FC] to-[#F7ECF1]">
                {!imgFailed ? (
                  <img
                    src={introCottageImg}
                    alt="A cozy pastel cottage floating on a soft cloud surrounded by wildflowers"
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center text-[#6E5D67]">
                    <Heart className="w-12 h-12 text-[#D95D7B] mb-3" />
                    <p className="font-display text-xl text-[#352931]">
                      Starlight Atlas
                    </p>
                  </div>
                )}

                {/* Stationary Kitty Pinned Bottom-Right; Bubble Expands Leftward */}
                <button
                  type="button"
                  onClick={handleKittyClick}
                  className="absolute bottom-5 right-5 flex flex-row-reverse items-center gap-3 cursor-pointer group focus-visible:outline-none"
                >
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#FFFDFB]/96 border-2 border-[#E6C2CD] shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <KittenTravelerSprite hop={kittyHop} className="w-14 h-14" />
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-[#FFFDFB]/96 border-2 border-[#E6C2CD] shadow-lg text-sm font-medium text-[#352931] whitespace-nowrap">
                    {INTRO_KITTY_LINES[kittyIdx]}
                  </div>
                </button>
              </div>
              <div className="px-7 py-4 bg-[#FFFDFB] border-t border-[#EFE4E0] flex items-center justify-between text-xs sm:text-sm text-[#6E5D67]">
                <span>Curated by hand, island by island</span>
                <span className="font-mono tabular-nums font-medium text-[#352931]">
                  20 Open-Source Picks
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
