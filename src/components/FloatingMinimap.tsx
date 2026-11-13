import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronUp, Map } from 'lucide-react';
import { FINALE_ISLAND, TOOLS_CATALOG, type ToolStop } from '../data/toolsCatalog';

interface FloatingMinimapProps {
  activeIndex: number;
  collectedIds: string[];
  showFinaleIsland?: boolean;
  onSelectStop: (index: number) => void;
}

function buildSmoothCurvePath(coords: Array<{ x: number; y: number }>): string {
  if (coords.length === 0) return '';
  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const midX = (curr.x + next.x) / 2;
    d += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

export const FloatingMinimap: React.FC<FloatingMinimapProps> = ({
  activeIndex,
  collectedIds,
  showFinaleIsland = false,
  onSelectStop,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const finaleUnlocked = showFinaleIsland || activeIndex >= TOOLS_CATALOG.length;
  const mapWidth = 2740;
  const mapHeight = 620;
  const pathD = buildSmoothCurvePath(TOOLS_CATALOG.map((t: ToolStop) => t.mapCoords));
  const finaleSegmentD = buildSmoothCurvePath([
    TOOLS_CATALOG[TOOLS_CATALOG.length - 1].mapCoords,
    FINALE_ISLAND.mapCoords,
  ]);
  const highestUnlocked = Math.min(TOOLS_CATALOG.length - 1, collectedIds.length);
  const isFinaleActive = activeIndex >= TOOLS_CATALOG.length;
  const activeName = isFinaleActive
    ? FINALE_ISLAND.islandName
    : (TOOLS_CATALOG[activeIndex] ?? TOOLS_CATALOG[0]).islandName;
  const totalDisplayed = finaleUnlocked ? TOOLS_CATALOG.length + 1 : TOOLS_CATALOG.length;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {collapsed ? (
        <motion.button
          key="minimap-collapsed"
          type="button"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.82, y: 8 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          onClick={() => setCollapsed(false)}
          title="Show Starlight Atlas minimap"
          aria-label="Expand minimap"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#FFFDFB]/95 backdrop-blur-md border-2 border-[#E6D8D4] shadow-lg hover:border-[#D95D7B] transition-colors cursor-pointer origin-bottom-right"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FCE3EB] to-[#E6DCF8] text-[#C84164] flex items-center justify-center shrink-0">
            <Map className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="font-display text-xs font-bold text-[#352931] leading-tight">
              Starlight Atlas
            </p>
            <p className="font-mono text-[10px] font-semibold text-[#6E5D67]">
              Stop {Math.min(activeIndex + 1, totalDisplayed)}/{totalDisplayed}
            </p>
          </div>
          <ChevronUp className="w-4 h-4 text-[#6E5D67] ml-1" />
        </motion.button>
      ) : (
        <motion.aside
          key="minimap-expanded"
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.84, y: 12 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          aria-label="Starlight Atlas Minimap"
          className="w-80 sm:w-[400px] rounded-2xl bg-[#FFFDFB]/95 backdrop-blur-md border-2 border-[#E6D8D4] shadow-lg p-3 origin-bottom-right"
        >
          <div className="flex items-center justify-between mb-2 px-0.5">
            <span className="font-display text-sm font-bold text-[#352931] whitespace-nowrap">
              Starlight Atlas
            </span>
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              title="Collapse minimap"
              aria-label="Collapse minimap"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F8F2F0] border border-[#E6D8D4] text-xs font-semibold text-[#5C4C55] hover:border-[#D95D7B] hover:text-[#D95D7B] cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Collapse</span>
            </button>
          </div>

          <div className="relative rounded-xl bg-gradient-to-r from-[#FCEFE9] via-[#F4F8FB] to-[#EFEBF8] border border-[#EDE2DE] overflow-hidden">
            <svg
              viewBox={`0 120 ${mapWidth} ${mapHeight - 160}`}
              className="w-full h-24 sm:h-28 block"
            >
              <line
                x1="1530"
                y1="140"
                x2="1530"
                y2="560"
                stroke="#D8C8CE"
                strokeWidth="12"
                strokeDasharray="24 20"
              />

              <path
                d={pathD}
                fill="none"
                stroke="#C9B7B3"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {finaleUnlocked && (
                <path
                  d={finaleSegmentD}
                  fill="none"
                  stroke="#D96B86"
                  strokeWidth="16"
                  strokeDasharray="20 16"
                  strokeLinecap="round"
                />
              )}

              {TOOLS_CATALOG.map((stop, idx) => {
                const isCollected = collectedIds.includes(stop.id);
                const isActive = idx === activeIndex;
                const isReachable = isCollected || idx <= highestUnlocked;

                return (
                  <g
                    key={stop.id}
                    onClick={() => {
                      if (isReachable) onSelectStop(idx);
                    }}
                    className={isReachable ? 'cursor-pointer' : 'cursor-not-allowed'}
                  >
                    {isActive && (
                      <circle
                        cx={stop.mapCoords.x}
                        cy={stop.mapCoords.y}
                        r="58"
                        fill="#D96B86"
                        opacity="0.28"
                      />
                    )}
                    <circle
                      cx={stop.mapCoords.x}
                      cy={stop.mapCoords.y}
                      r={isActive ? '34' : '22'}
                      fill={isActive ? '#D96B86' : isCollected ? '#5C9479' : '#FFFDFB'}
                      stroke={isActive ? '#352931' : isCollected ? '#3E7259' : '#B7A4A0'}
                      strokeWidth="10"
                    />
                  </g>
                );
              })}

              {finaleUnlocked && (
                <g
                  onClick={() => onSelectStop(TOOLS_CATALOG.length)}
                  className="cursor-pointer"
                >
                  {isFinaleActive && (
                    <circle
                      cx={FINALE_ISLAND.mapCoords.x}
                      cy={FINALE_ISLAND.mapCoords.y}
                      r="68"
                      fill="#FFD166"
                      opacity="0.38"
                    />
                  )}
                  <circle
                    cx={FINALE_ISLAND.mapCoords.x}
                    cy={FINALE_ISLAND.mapCoords.y}
                    r={isFinaleActive ? '38' : '28'}
                    fill="#FFD166"
                    stroke="#D95D7B"
                    strokeWidth="12"
                  />
                </g>
              )}
            </svg>
          </div>

          <div className="mt-2 px-0.5 flex items-center justify-between text-xs text-[#5C4C55] font-medium">
            <span className="truncate">{activeName}</span>
            <span className="font-mono tabular-nums font-bold text-[#352931] shrink-0">
              {Math.min(activeIndex + 1, totalDisplayed)}/{totalDisplayed}
            </span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
