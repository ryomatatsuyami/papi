import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Gift, Heart, MailOpen, RotateCcw, Sparkles } from 'lucide-react';
import { FloatingIslandLandmark, KittenTravelerSprite } from './HandDrawnIcons';
import { soundEngine } from '../utils/soundEngine';

interface FinaleNoteStageProps {
  onBackToLastStop: () => void;
  onOpenBoard: () => void;
}

const FINALE_CONFETTI = Array.from({ length: 85 }).map((_, i) => ({
  id: i,
  left: `${(i * 1.19 + (i % 7) * 2.1) % 98}%`,
  delay: (i % 10) * 0.08,
  duration: 2.6 + (i % 5) * 0.45,
  drift: ((i % 2 === 0 ? 1 : -1) * (30 + (i % 6) * 22)),
  rotate: (i % 2 === 0 ? 1 : -1) * (200 + (i % 5) * 85),
  color: ['#E85D82', '#FFD166', '#6BAE8E', '#8B62B8', '#38BDF8', '#F472B6'][i % 6],
  size: 7 + (i % 4) * 3,
}));

const FINALE_KITTY_LINES = [
  'a secret 21st island just bloomed!!',
  'check your bank account!! :D',
  '1k headphone sponsorship unlocked!!',
  'all the best with exam season~',
  'siddu spent way too much time on this kitty',
  'mrrp! tap the wax seal to open it!',
];

export const FinaleNoteStage: React.FC<FinaleNoteStageProps> = ({
  onBackToLastStop,
  onOpenBoard,
}) => {
  const [phase, setPhase] = useState<'sealed' | 'opening' | 'opened'>('sealed');
  const [confettiKey, setConfettiKey] = useState(0);
  const [kittenHop, setKittenHop] = useState(false);
  const [kittyIdx, setKittyIdx] = useState(0);
  const [kittySpeech, setKittySpeech] = useState('a secret 21st island just bloomed!!');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hopTimerRef.current) clearTimeout(hopTimerRef.current);
    };
  }, []);

  const handlePetKitten = () => {
    soundEngine.playKittenMeow();
    if (hopTimerRef.current) clearTimeout(hopTimerRef.current);
    setKittenHop(true);
    const nextIdx = (kittyIdx + 1) % FINALE_KITTY_LINES.length;
    setKittyIdx(nextIdx);
    setKittySpeech(FINALE_KITTY_LINES[nextIdx]);
    hopTimerRef.current = setTimeout(() => setKittenHop(false), 360);
  };

  const handleOpenLetter = () => {
    if (phase === 'opening') return;
    if (timerRef.current) clearTimeout(timerRef.current);
    soundEngine.playPaperRustle();
    soundEngine.playLootboxBuildup();
    setPhase('opening');
    setKittenHop(true);
    setKittySpeech('unsealing the final note…!!');

    timerRef.current = setTimeout(() => {
      soundEngine.playConfettiPopper();
      setConfettiKey((k) => k + 1);
      setPhase('opened');
      setKittenHop(false);
      setKittySpeech('check your bank account!! :D');
    }, 1150);
  };

  return (
    <section className="relative w-full flex-1 flex items-center justify-center overflow-hidden pb-36 pt-4">
      {/* Soft Glowing Hidden Island Silhouette in Background */}
      <motion.div
        initial={{ scale: 0.35, opacity: 0, y: 40 }}
        animate={{
          scale: phase === 'opened' ? 0.9 : 1.05,
          opacity: phase === 'opened' ? 0.32 : 0.85,
          y: phase === 'opened' ? -30 : 0,
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <div className="scale-[2.3] sm:scale-[2.8]">
          <FloatingIslandLandmark discovered={true} active={true} chapter={4} iconKind="treasure" />
        </div>
      </motion.div>

      {/* Festive Confetti Wave on Unsealing the Final Note */}
      {confettiKey > 0 && (
        <div key={confettiKey} className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
          {FINALE_CONFETTI.map((c) => (
            <motion.span
              key={c.id}
              initial={{ y: -25, x: 0, opacity: 1, rotate: 0, scale: 0.75 }}
              animate={{
                y: '108vh',
                x: c.drift,
                opacity: [1, 1, 0.92, 0],
                rotate: c.rotate,
                scale: [0.85, 1.2, 0.9],
              }}
              transition={{
                delay: c.delay,
                duration: c.duration,
                ease: 'easeIn',
              }}
              style={{
                left: c.left,
                width: c.size,
                height: c.id % 3 === 0 ? c.size * 0.52 : c.size,
                backgroundColor: c.color,
              }}
              className={`absolute top-0 ${c.id % 2 === 0 ? 'rounded-full' : 'rounded-xs'}`}
            />
          ))}
        </div>
      )}

      {/* Stationary Desktop Kitty Mascot on Right Side */}
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

      {/* Main Content Card */}
      <div className="relative z-20 w-full max-w-[1140px] mx-auto px-5 sm:px-10 lg:px-28 pb-8">
        <AnimatePresence mode="wait">
          {(phase === 'sealed' || phase === 'opening') && (
            <motion.article
              key="finale-sealed"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -12 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[34px] bg-[#FFFDFB]/95 backdrop-blur-md border-2 border-[#ECC9D5] shadow-2xl p-8 sm:p-12 text-center space-y-7"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF2F6] border border-[#F2C6D2] text-xs font-bold tracking-wider uppercase text-[#C84164]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Secret Island #21 · Starlight Keepsake</span>
              </div>

              {/* Animated Sealed Envelope Centerpiece */}
              <div className="flex justify-center py-2">
                <motion.button
                  type="button"
                  onClick={handleOpenLetter}
                  animate={
                    phase === 'opening'
                      ? { scale: [1, 1.12, 0.96, 1.16], rotate: [-3, 4, -5, 5, 0] }
                      : { y: [-4, 4, -4] }
                  }
                  transition={
                    phase === 'opening'
                      ? { duration: 1.0, ease: 'easeInOut' }
                      : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }
                  }
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Open Siddu's note"
                  className="relative w-44 h-36 rounded-3xl bg-gradient-to-br from-[#FFF3F7] via-[#FFFDFB] to-[#F9EEFC] border-3 border-[#E6B0C2] shadow-xl flex flex-col items-center justify-center cursor-pointer group"
                >
                  <svg viewBox="0 0 140 100" className="w-36 h-28" aria-hidden="true">
                    <rect
                      x="10"
                      y="16"
                      width="120"
                      height="72"
                      rx="10"
                      fill="#FFEAF0"
                      stroke="#3A2C34"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M12 20L70 58 128 20"
                      fill="#FAD4E0"
                      stroke="#3A2C34"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Heart Wax Seal */}
                    <circle cx="70" cy="57" r="14" fill="#D95D7B" stroke="#3A2C34" strokeWidth="2.2" />
                    <path
                      d="M70 64.5c-4.5-3.2-7.5-6-7.5-9.2a4.2 4.2 0 0 1 7.5-2.5 4.2 4.2 0 0 1 7.5 2.5c0 3.2-3 6-7.5 9.2z"
                      fill="#FFFDFB"
                    />
                  </svg>
                </motion.button>
              </div>

              <div className="space-y-3 max-w-xl mx-auto">
                <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#352931] leading-tight">
                  {phase === 'opening' ? 'Unsealing your note…' : 'Wait—there’s one tiny island left.'}
                </h1>
                <p className="text-base sm:text-lg text-[#5C4C55]">
                  All 20 tools are safely in your pack. Tap the wax seal to open the last keepsake waiting at the edge of the sky.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onBackToLastStop}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#DFCFD3] bg-[#FFFDFB] text-sm sm:text-base font-medium text-[#51424B] hover:border-[#352931] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Stop 20</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenLetter}
                  disabled={phase === 'opening'}
                  className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-gradient-to-r from-[#D95D7B] via-[#C95E93] to-[#8E65C7] text-[#FFFDFB] text-base sm:text-lg font-bold hover:brightness-105 transition-all shadow-lg cursor-pointer disabled:opacity-75"
                >
                  <MailOpen className="w-5 h-5" />
                  <span>{phase === 'opening' ? 'Opening Note…' : 'Open the Little Note'}</span>
                </button>
              </div>
            </motion.article>
          )}

          {phase === 'opened' && (
            <motion.article
              key="finale-opened"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[34px] bg-[#FFFDFB]/97 backdrop-blur-md border-2 border-[#ECC4D2] shadow-2xl p-8 sm:p-12 lg:p-14 space-y-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2E4E0] pb-4">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D95D7B]">
                  <Heart className="w-4 h-4 fill-[#F48CA7] text-[#D95D7B]" />
                  <span>Step 21 · Starlight Keepsake Note</span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenLetter}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#8C7780] hover:text-[#D95D7B] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Reveal</span>
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.55 }}
                className="rounded-3xl bg-gradient-to-br from-[#FFF5F8] via-[#FFFDFB] to-[#FBF6FD] border border-[#F0D6DF] p-7 sm:p-10 space-y-6 shadow-inner"
              >
                <p className="font-display text-xl sm:text-2xl text-[#352931] leading-relaxed">
                  i know college has been a little bit of everything and that studies have also been taking a little toll on you considering the exam season. so to cool you off a little bit, i decided to make this little gift for you :D. consider this a late birthday, early anniversary, birthday return and all the best to your exams type gift.
                </p>

                <p className="font-display text-xl sm:text-2xl text-[#352931] leading-relaxed">
                  and as an added bonus, i am also sponsoring 1k for your headphones. check your bank account.
                </p>

                <div className="pt-2 font-display italic text-2xl sm:text-3xl font-bold text-[#C84164] leading-snug">
                  <p>with love</p>
                  <p>- siddu</p>
                </div>
              </motion.div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onBackToLastStop}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#DFCFD3] bg-[#FFFDFB] text-sm sm:text-base font-medium text-[#51424B] hover:border-[#352931] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Stop 20</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenBoard}
                  className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-gradient-to-r from-[#D95D7B] via-[#C95E93] to-[#8E65C7] text-[#FFFDFB] text-base sm:text-lg font-bold hover:brightness-105 transition-all shadow-lg cursor-pointer"
                >
                  <Gift className="w-5 h-5" />
                  <span>Open Full Gift Board</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
