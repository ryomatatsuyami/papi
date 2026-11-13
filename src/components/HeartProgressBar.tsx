import React from 'react';
import { CHAPTER_META, TOOLS_CATALOG, type ChapterNumber } from '../data/toolsCatalog';

interface ForefrontHeartMeterProps {
  collectedCount: number;
  totalCount: number;
  currentChapter: ChapterNumber;
  currentStopOrder: number | null;
  isFinale?: boolean;
  glowTrigger: number;
  fullWidth?: boolean;
  onOpenBoard?: () => void;
}

export const ForefrontHeartMeter: React.FC<ForefrontHeartMeterProps> = ({
  collectedCount,
  totalCount,
  currentChapter,
  currentStopOrder,
  isFinale = false,
  glowTrigger,
  fullWidth = false,
  onOpenBoard,
}) => {
  const safeTotal = Math.max(1, totalCount);
  const safeCollected = Math.min(safeTotal, Math.max(0, collectedCount));
  const unlockedRatio = Math.min(1, safeCollected / safeTotal);
  const unlockedPercent = Math.round(unlockedRatio * 100);
  const fillTopY = 34 - unlockedRatio * 29;

  // Bar position tracks your current island stop during the journey (so revisiting Stop 8 shows 40% in Ch. II),
  // and tracks overall unlocked count when viewing the Gift Board.
  const barRatio =
    isFinale
      ? 1
      : currentStopOrder !== null
        ? Math.min(1, Math.max(0, currentStopOrder / safeTotal))
        : unlockedRatio;
  const barPercent = Math.round(barRatio * 100);

  // Proportional spans matching actual catalog stop counts:
  // Ch. I (1-6 = 30%), Ch. II (7-12 = 30%), Ch. III (13-16 = 20%), Ch. IV (17-20 = 20%)
  const chapters: {
    ch: ChapterNumber;
    label: string;
    widthPct: string;
    startStop: number;
    color: string;
  }[] = [
    { ch: 1, label: 'Ch. I · Survival', widthPct: '30%', startStop: 1, color: '#D95D7B' },
    { ch: 2, label: 'Ch. II · Study', widthPct: '30%', startStop: 7, color: '#488B6E' },
    { ch: 3, label: 'Ch. III · Builder', widthPct: '20%', startStop: 13, color: '#8B62B8' },
    { ch: 4, label: 'Ch. IV · Summit', widthPct: '20%', startStop: 17, color: '#C58332' },
  ];

  const chapterMeta = CHAPTER_META[currentChapter];

  return (
    <div
      className={
        fullWidth
          ? 'w-full px-5 sm:px-8 lg:px-12 pt-16 pb-2'
          : 'w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-36 pt-16 pb-2'
      }
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 rounded-2xl bg-[#FFFDFB]/92 backdrop-blur-md border border-[#EDE0DC] px-6 py-3 shadow-sm">
        {/* Larger Prominent Glowing Heart Crest showing true Unlocked Count */}
        <button
          type="button"
          onClick={onOpenBoard}
          title="View your unwrapped gifts"
          className="flex items-center gap-3.5 shrink-0 cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#D96B86] rounded-xl"
        >
          <div
            key={glowTrigger}
            className={`relative flex items-center justify-center ${
              glowTrigger > 0 ? 'animate-heart-glow' : ''
            }`}
          >
            <svg viewBox="0 0 40 38" className="w-12 h-12" aria-hidden="true">
              <defs>
                <linearGradient id="forefrontHeartGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D95D7B" />
                  <stop offset="45%" stopColor="#EB84A4" />
                  <stop offset="80%" stopColor="#B88BE6" />
                  <stop offset="100%" stopColor="#F5C06E" />
                </linearGradient>
                <clipPath id="forefrontHeartClip">
                  <rect x="0" y={fillTopY} width="40" height="38" />
                </clipPath>
              </defs>

              <path
                d="M20 34S5 24.5 5 13.5C5 8.1 9.2 4.5 14.2 4.5c2.9 0 5 1.5 5.8 3.2.8-1.7 2.9-3.2 5.8-3.2 5 0 9.2 3.6 9.2 9 0 11-15 20.5-15 20.5z"
                fill="#FCE6EC"
                stroke="#D95D7B"
                strokeWidth="1.9"
                strokeLinejoin="round"
              />
              <path
                d="M20 34S5 24.5 5 13.5C5 8.1 9.2 4.5 14.2 4.5c2.9 0 5 1.5 5.8 3.2.8-1.7 2.9-3.2 5.8-3.2 5 0 9.2 3.6 9.2 9 0 11-15 20.5-15 20.5z"
                fill="url(#forefrontHeartGrad)"
                clipPath="url(#forefrontHeartClip)"
              />
              <path
                d="M11.2 11.2c0-1.8 1.3-3.1 3.1-3.1"
                stroke="#FFFDFB"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.95"
              />
            </svg>
          </div>

          <div className="text-left">
            <div className="flex items-baseline gap-2">
              <span className="font-mono tabular-nums text-lg font-semibold text-[#352931]">
                {safeCollected}/{safeTotal}
              </span>
              <span className="text-sm font-semibold text-[#D95D7B] tabular-nums">
                {unlockedPercent}%
              </span>
            </div>
            <p className="text-xs text-[#6E5D67] whitespace-nowrap">
              {safeCollected >= TOOLS_CATALOG.length ? 'All gifts unlocked' : 'Gifts unwrapped'}
            </p>
          </div>
        </button>

        {/* Proportional 4-Chapter Storyline Bar Synchronized With Active Stop */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-semibold truncate" style={{ color: chapterMeta.accentColor }}>
              {isFinale ? 'Step 21 · Starlight Keepsake' : chapterMeta.title}
            </span>
            <span className="font-mono tabular-nums text-xs sm:text-sm font-semibold text-[#5C4C55] shrink-0">
              {isFinale
                ? 'Keepsake Note'
                : currentStopOrder !== null
                  ? `Stop ${currentStopOrder} / ${safeTotal}`
                  : `${safeCollected} / ${safeTotal} Unlocked`}
            </span>
          </div>

          <div className="relative h-3.5 rounded-full bg-[#EFE3E0] overflow-hidden shadow-inner">
            {/* Soft tint showing total unlocked progress */}
            <div
              style={{ width: `${unlockedPercent}%` }}
              className="absolute inset-y-0 left-0 rounded-full bg-[#D95D7B]/18 transition-all duration-500"
            />
            {/* Vibrant trail fill showing current stop position */}
            <div
              style={{ width: `${Math.max(barRatio > 0 ? 4 : 0, barPercent)}%` }}
              className="relative h-full rounded-full bg-gradient-to-r from-[#E66F8E] via-[#6BAE8E] via-60% to-[#9D77CE] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
            {/* Subtle segment ticks at Chapter boundaries: 30% (6/20), 60% (12/20), 80% (16/20) */}
            <span className="absolute inset-y-0 left-[30%] w-px bg-white/70 pointer-events-none" />
            <span className="absolute inset-y-0 left-[60%] w-px bg-white/70 pointer-events-none" />
            <span className="absolute inset-y-0 left-[80%] w-px bg-white/70 pointer-events-none" />
          </div>

          <div className="flex items-center text-[11px] sm:text-xs">
            {chapters.map((item) => {
              const reached =
                currentStopOrder !== null
                  ? currentStopOrder >= item.startStop
                  : safeCollected >= item.startStop;
              const isCurrent = !isFinale && currentChapter === item.ch;
              return (
                <div
                  key={item.ch}
                  style={{ width: item.widthPct }}
                  className="truncate pr-1.5"
                >
                  <span
                    style={isCurrent ? { color: item.color } : undefined}
                    className={`font-medium ${
                      isCurrent
                        ? 'font-bold'
                        : reached
                          ? 'text-[#352931]'
                          : 'text-[#9B8992]'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
