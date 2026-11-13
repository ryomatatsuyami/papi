import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  Compass,
  Copy,
  ExternalLink,
  Heart,
  MailOpen,
  PartyPopper,
  RotateCcw,
  Search,
} from 'lucide-react';
import { CHAPTER_META, TOOLS_CATALOG, type ToolPart } from '../data/toolsCatalog';
import { HandDrawnToolIcon, MysteryQuestionIcon } from './HandDrawnIcons';
import { openExternalSafely } from '../utils/openExternalLink';
import { soundEngine } from '../utils/soundEngine';

interface GiftBoardViewProps {
  collectedIds: string[];
  finaleDiscovered: boolean;
  onReplayJourney: () => void;
  onBackToMap: () => void;
  onOpenFinaleNote: () => void;
}

type BoardFilter = 'all' | ToolPart;

const CONFETTI_COLORS = [
  '#E85D82',
  '#F59E0B',
  '#6BAE8E',
  '#8B62B8',
  '#38BDF8',
  '#F472B6',
  '#FFD166',
  '#FB7185',
];

const SHOWER_CONFETTI = Array.from({ length: 84 }).map((_, i) => ({
  id: i,
  left: `${(i * 1.2 + (i % 7) * 1.9) % 98}%`,
  delay: (i % 12) * 0.12,
  duration: 2.9 + (i % 5) * 0.55,
  drift: ((i % 2 === 0 ? 1 : -1) * (40 + (i % 6) * 26)),
  rotate: (i % 2 === 0 ? 1 : -1) * (240 + (i % 5) * 95),
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 8 + (i % 4) * 3,
}));

const CANNON_CONFETTI = Array.from({ length: 44 }).map((_, i) => {
  const fromLeft = i % 2 === 0;
  const spreadX = 120 + (i % 11) * 48;
  return {
    id: i,
    fromLeft,
    tx: fromLeft ? spreadX : -spreadX,
    peakY: -(260 + (i % 7) * 65),
    endY: 160 + (i % 5) * 45,
    delay: (i % 6) * 0.05,
    duration: 2.1 + (i % 4) * 0.35,
    rotate: (fromLeft ? 1 : -1) * (280 + (i % 4) * 90),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 8 + (i % 4) * 3,
  };
});

export const GiftBoardView: React.FC<GiftBoardViewProps> = ({
  collectedIds,
  finaleDiscovered,
  onReplayJourney,
  onBackToMap,
  onOpenFinaleNote,
}) => {
  const [filter, setFilter] = useState<BoardFilter>('all');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confettiBurstKey, setConfettiBurstKey] = useState(0);

  const allComplete = collectedIds.length >= TOOLS_CATALOG.length;
  const showFinaleKeepsake = allComplete && finaleDiscovered;

  useEffect(() => {
    if (allComplete) {
      soundEngine.playConfettiPopper();
      setConfettiBurstKey((k) => k + 1);
    }
  }, [allComplete]);

  const triggerExtraConfetti = () => {
    soundEngine.playConfettiPopper();
    setConfettiBurstKey((k) => k + 1);
  };

  const filteredTools = useMemo(() => {
    return TOOLS_CATALOG.filter((tool) => {
      if (filter !== 'all' && tool.part !== filter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        tool.title.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        tool.simpleSummary.toLowerCase().includes(q) ||
        tool.whatItDoes.toLowerCase().includes(q) ||
        tool.islandName.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const handleCopy = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <section className="relative w-full flex-1">
      {/* Rich Dual-Cannon + Full-Screen Confetti Shower When Journey is Finished */}
      {confettiBurstKey > 0 && (
        <div
          key={confettiBurstKey}
          className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
          aria-hidden="true"
        >
          {/* Top Cascading Confetti Rain */}
          {SHOWER_CONFETTI.map((c) => (
            <motion.span
              key={`shower-${c.id}`}
              initial={{ y: -30, x: 0, opacity: 1, rotate: 0, scale: 0.75 }}
              animate={{
                y: '108vh',
                x: c.drift,
                opacity: [1, 1, 0.92, 0],
                rotate: c.rotate,
                scale: [0.85, 1.25, 0.9],
              }}
              transition={{
                delay: c.delay,
                duration: c.duration,
                ease: 'easeIn',
              }}
              style={{
                left: c.left,
                width: c.size,
                height: c.id % 3 === 0 ? c.size * 0.5 : c.size,
                backgroundColor: c.color,
              }}
              className={`absolute top-0 ${c.id % 2 === 0 ? 'rounded-full' : 'rounded-xs'}`}
            />
          ))}

          {/* Left & Right Party-Popper Cannons Shooting Across Screen */}
          {CANNON_CONFETTI.map((c) => (
            <motion.span
              key={`cannon-${c.id}`}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }}
              animate={{
                x: [0, c.tx * 0.65, c.tx],
                y: [0, c.peakY, c.endY],
                opacity: [1, 1, 0],
                scale: [0.7, 1.35, 0.85],
                rotate: c.rotate,
              }}
              transition={{
                delay: c.delay,
                duration: c.duration,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                left: c.fromLeft ? '4%' : '96%',
                bottom: '6%',
                width: c.size,
                height: c.id % 3 === 0 ? c.size * 0.52 : c.size,
                backgroundColor: c.color,
              }}
              className={`absolute ${c.id % 2 === 0 ? 'rounded-full' : 'rounded-xs'}`}
            />
          ))}
        </div>
      )}

      <div className="w-full px-5 sm:px-8 lg:px-12 pt-3 pb-44 space-y-6">
        {/* Header */}
        <div className="rounded-3xl border-2 border-[#E7CFD6] bg-[#FFFDFB]/95 p-7 sm:p-9 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6E5D67]">
              <span className="font-semibold text-[#D95D7B]">Reference Pinboard</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {collectedIds.length} / {TOOLS_CATALOG.length} Unwrapped
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#352931]">
              {allComplete
                ? 'Full toolkit unlocked. Go build something ridiculous.'
                : 'Your Toolkit So Far'}
            </h1>
            <p className="text-base text-[#51424B] leading-relaxed">
              {allComplete
                ? 'Every single tool from your journey is pinned right here whenever you need it for assignments, exam prep, or late-night side projects.'
                : 'Here are the gifts you’ve already unwrapped. Hop back onto the map whenever you want to track down the remaining question marks.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {showFinaleKeepsake && (
              <button
                type="button"
                onClick={onOpenFinaleNote}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FFF2F6] border-2 border-[#ECC0CE] text-sm sm:text-base font-semibold text-[#B3395B] hover:bg-[#FFE6EE] transition-colors cursor-pointer whitespace-nowrap"
              >
                <MailOpen className="w-4 h-4" />
                <span>Siddu’s Note</span>
              </button>
            )}

            {allComplete && (
              <button
                type="button"
                onClick={triggerExtraConfetti}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FFF9E8] border-2 border-[#EFD089] text-sm sm:text-base font-semibold text-[#945D18] hover:bg-[#FFF2CE] transition-colors cursor-pointer whitespace-nowrap"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Pop Confetti</span>
              </button>
            )}

            <button
              type="button"
              onClick={onBackToMap}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D95D7B] to-[#B069C4] text-[#FFFDFB] text-sm sm:text-base font-semibold hover:brightness-105 transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Compass className="w-4 h-4" />
              <span>{allComplete ? 'Revisit Islands' : 'Continue Journey'}</span>
            </button>

            <button
              type="button"
              onClick={onReplayJourney}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FFFDFB] border-2 border-[#E6D8D4] text-sm sm:text-base font-medium text-[#51424B] hover:border-[#352931] transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay from Start</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs + Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#FFFDFB]/85 border border-[#E6D8D4] self-start shadow-2xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-[#D95D7B] text-[#FFFDFB] shadow-2xs'
                  : 'text-[#6E5D67] hover:text-[#352931]'
              }`}
            >
              All Tools (20)
            </button>
            <button
              type="button"
              onClick={() => setFilter('general')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'general'
                  ? 'bg-[#488B6E] text-[#FFFDFB] shadow-2xs'
                  : 'text-[#6E5D67] hover:text-[#352931]'
              }`}
            >
              Part 1 · Survival & Study (12)
            </button>
            <button
              type="button"
              onClick={() => setFilter('future')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'future'
                  ? 'bg-[#8B62B8] text-[#FFFDFB] shadow-2xs'
                  : 'text-[#6E5D67] hover:text-[#352931]'
              }`}
            >
              Part 2 · Future Dev (8)
            </button>
          </div>

          <label className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8C7780] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools or study topics..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#FFFDFB] border border-[#E2D2CE] text-sm sm:text-base text-[#352931] placeholder:text-[#9A8790] focus:outline-none focus:border-[#D95D7B]"
            />
          </label>
        </div>

        {/* Full-Width Responsive Tool Pinboard Grid */}
        {filteredTools.length === 0 ? (
          <div className="rounded-3xl border border-[#E6D8D4] bg-[#FFFDFB] p-12 text-center space-y-2">
            <Heart className="w-8 h-8 text-[#D95D7B] mx-auto" />
            <p className="font-display text-xl text-[#352931]">No matching gifts found</p>
            <p className="text-sm text-[#6E5D67]">
              Try clearing your search filter to see all your tools.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-5 xl:gap-6">
            {filteredTools.map((tool) => {
              const isUnlocked = collectedIds.includes(tool.id);
              const ch = CHAPTER_META[tool.chapter];

              return (
                <article
                  key={tool.id}
                  className={`rounded-3xl border-2 ${
                    isUnlocked ? ch.tintBorder : 'border-[#E6D8D4]'
                  } bg-[#FFFDFB]/95 p-7 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md transition-all`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#6E5D67]">
                      <span className="font-semibold" style={{ color: ch.accentColor }}>
                        {tool.chapterTitle}
                      </span>
                      <span className="font-mono tabular-nums font-medium">#{tool.order}</span>
                    </div>

                    {isUnlocked ? (
                      <>
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-13 h-13 rounded-2xl ${ch.tintBg} border ${ch.tintBorder} flex items-center justify-center shrink-0`}
                          >
                            <HandDrawnToolIcon kind={tool.iconKind} className="w-7 h-7" />
                          </div>
                          <div className="min-w-0">
                            <h2 className="font-display text-2xl font-semibold text-[#352931] leading-snug">
                              {tool.title}
                            </h2>
                            <p className="text-xs sm:text-sm font-medium text-[#6E5D67]">
                              {tool.tagline}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm sm:text-[15px] text-[#352931] leading-relaxed font-medium">
                          {tool.simpleSummary}
                        </p>

                        <p className="text-xs sm:text-sm italic text-[#7B626D] border-t border-[#F4EAE7] pt-3">
                          “{tool.personalNote}”
                        </p>
                      </>
                    ) : (
                      <div className="py-8 flex flex-col items-center text-center space-y-3 text-[#8A767D]">
                        <div className="w-14 h-14 rounded-full bg-[#F9F4F2] border border-[#E6D8D4] flex items-center justify-center">
                          <MysteryQuestionIcon className="w-7 h-7" />
                        </div>
                        <h2 className="font-display text-xl font-medium text-[#352931]">
                          Mystery Stop · {tool.islandName}
                        </h2>
                        <p className="text-sm text-[#6E5D67] max-w-xs">
                          Walk to Stop {tool.order} on the sky path to unwrap this tool.
                        </p>
                      </div>
                    )}
                  </div>

                  {isUnlocked && (
                    <div className="pt-4 border-t border-[#EFE4E0] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => openExternalSafely(e, tool.url)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FCE4EB] to-[#F7E9FA] border border-[#E7B9C8] text-xs sm:text-sm font-semibold text-[#962F4B] hover:brightness-97 transition-all whitespace-nowrap"
                        >
                          <span>{tool.urlLabel}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        {tool.secondaryUrl && tool.secondaryLabel && (
                          <a
                            href={tool.secondaryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => openExternalSafely(e, tool.secondaryUrl!)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#EEF6F2] border border-[#BFE0CE] text-xs sm:text-sm font-medium text-[#2F5D47] hover:bg-[#E2F0E8] transition-colors whitespace-nowrap"
                          >
                            <span>
                              {tool.secondaryLabel === 'Documentation' ? 'Documentation' : 'Repo'}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(tool.id, tool.url)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[#EFE4E0] text-[#6E5D67] hover:text-[#352931] hover:bg-[#F7F1EF] hover:border-[#D95D7B] transition-colors cursor-pointer shrink-0"
                        title={copiedId === tool.id ? 'Copied!' : 'Copy link'}
                        aria-label={copiedId === tool.id ? 'Copied link' : 'Copy link'}
                      >
                        {copiedId === tool.id ? (
                          <Check className="w-4 h-4 text-[#488B6E]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Siddu's Keepsake Note at the End of the Board */}
        {showFinaleKeepsake && (
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="rounded-3xl border-2 border-[#ECC9D5] bg-[#FFFDFB]/95 p-7 sm:p-9 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            <div className="space-y-3 max-w-4xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D95D7B]">
                <Heart className="w-3.5 h-3.5 fill-[#F48CA7] text-[#D95D7B]" />
                <span>Step 21 · One Little Note For You</span>
              </div>
              <p className="font-display text-lg sm:text-xl text-[#352931] leading-relaxed">
                i know college has been a little bit of everything and that studies have also been taking a little toll on you considering the exam season. so to cool you off a little bit, i decided to make this little gift for you :D. consider this a late birthday, early anniversary, birthday return and all the best to your exams type gift.
              </p>
              <p className="font-display text-lg sm:text-xl text-[#352931] leading-relaxed">
                and as an added bonus, i am also sponsoring 1k for your headphones. check your bank account.
              </p>
              <p className="font-display italic text-xl font-bold text-[#C84164]">
                with love <br />- siddu
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenFinaleNote}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FFF5F7] border-2 border-[#F2C6D2] text-sm font-display font-bold text-[#B3395B] hover:bg-[#FFE9F0] transition-colors cursor-pointer"
            >
              <MailOpen className="w-4 h-4" />
              <span>Revisit Note Island</span>
            </button>
          </motion.aside>
        )}
      </div>
    </section>
  );
};
