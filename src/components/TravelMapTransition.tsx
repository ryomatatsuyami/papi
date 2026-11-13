import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FINALE_ISLAND, TOOLS_CATALOG, type ToolStop } from '../data/toolsCatalog';
import { FloatingIslandLandmark, KittenTravelerSprite } from './HandDrawnIcons';

interface TravelMapTransitionProps {
  fromIndex: number;
  toIndex: number;
  collectedIds: string[];
  onArrive: () => void;
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

function evalStopSegment(
  p0: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const midX = (p0.x + p3.x) / 2;
  const p1 = { x: midX, y: p0.y };
  const p2 = { x: midX, y: p3.y };
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

export const TravelMapTransition: React.FC<TravelMapTransitionProps> = ({
  fromIndex,
  toIndex,
  collectedIds,
  onArrive,
}) => {
  const isFinaleTravel = toIndex >= TOOLS_CATALOG.length;
  const showFinaleIsland = isFinaleTravel;

  const fromCoord =
    fromIndex >= TOOLS_CATALOG.length
      ? FINALE_ISLAND.mapCoords
      : (TOOLS_CATALOG[fromIndex] ?? TOOLS_CATALOG[0]).mapCoords;

  const toCoord = isFinaleTravel
    ? FINALE_ISLAND.mapCoords
    : (TOOLS_CATALOG[toIndex] ?? TOOLS_CATALOG[0]).mapCoords;

  const destinationName = isFinaleTravel
    ? FINALE_ISLAND.islandName
    : (TOOLS_CATALOG[toIndex] ?? TOOLS_CATALOG[0]).islandName;

  const isAdjacent = Math.abs(toIndex - fromIndex) === 1;

  const [progress, setProgress] = useState(0);
  const [viewportSize, setViewportSize] = useState({ w: 1200, h: 520 });
  const stageRef = useRef<HTMLDivElement>(null);
  const onArriveRef = useRef(onArrive);
  onArriveRef.current = onArrive;

  useEffect(() => {
    const updateSize = () => {
      if (stageRef.current) {
        setViewportSize({
          w: stageRef.current.clientWidth,
          h: stageRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const duration = isFinaleTravel ? 1750 : 1280;
    const start = performance.now();
    let rafId = 0;
    let arriveTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      const eased =
        raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
      setProgress(eased);

      if (raw < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        arriveTimer = setTimeout(() => onArriveRef.current(), isFinaleTravel ? 360 : 220);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      if (arriveTimer) clearTimeout(arriveTimer);
    };
  }, [fromIndex, toIndex, isFinaleTravel]);

  const kittenPos = isAdjacent
    ? evalStopSegment(fromCoord, toCoord, progress)
    : {
        x: fromCoord.x + (toCoord.x - fromCoord.x) * progress,
        y: fromCoord.y + (toCoord.y - fromCoord.y) * progress,
      };

  const trailPuff1 = isAdjacent
    ? evalStopSegment(fromCoord, toCoord, Math.max(0, progress - 0.14))
    : kittenPos;
  const trailPuff2 = isAdjacent
    ? evalStopSegment(fromCoord, toCoord, Math.max(0, progress - 0.28))
    : kittenPos;

  const cameraX = viewportSize.w / 2 - kittenPos.x;
  const cameraY = viewportSize.h / 2 - kittenPos.y;

  const worldWidth = 2780;
  const worldHeight = 620;
  const mainPathD = buildSmoothCurvePath(TOOLS_CATALOG.map((t: ToolStop) => t.mapCoords));
  const stop20Coord = TOOLS_CATALOG[TOOLS_CATALOG.length - 1].mapCoords;
  const finaleSegmentD = buildSmoothCurvePath([stop20Coord, FINALE_ISLAND.mapCoords]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative z-10 w-full flex-1 min-h-[560px] flex flex-col"
    >
      <div ref={stageRef} className="relative w-full flex-1 overflow-hidden">
        {/* Parallax Distant Pastel Cloud Horizon Silhouettes */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          style={{ transform: `translate3d(${cameraX * 0.12}px, 0, 0)` }}
          className="absolute bottom-0 left-[-20%] w-[160%] h-36 opacity-50 pointer-events-none"
          aria-hidden="true"
        >
          <path
            d="M0 160 Q140 80 280 130 T560 115 T840 135 T1120 105 T1440 140 L1440 200 L0 200 Z"
            fill="#FFFDFB"
          />
        </svg>

        {/* Centered Top Travel HUD */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-[#FFFDFB]/95 border border-[#E6D8D4] text-xs sm:text-sm font-semibold text-[#352931] shadow-sm whitespace-nowrap">
            {isFinaleTravel
              ? `A secret island appeared! Walking to ${destinationName}…`
              : `Walking to ${destinationName}…`}
          </div>
          <button
            type="button"
            onClick={onArrive}
            className="px-4 py-2 rounded-full bg-[#FFFDFB]/95 border border-[#E6D8D4] text-xs sm:text-sm font-medium text-[#51424B] hover:text-[#352931] cursor-pointer shadow-sm whitespace-nowrap"
          >
            Skip Walk
          </button>
        </div>

        {/* Camera-Centered World Map Layer */}
        <div
          style={{
            width: `${worldWidth}px`,
            height: `${worldHeight}px`,
            transform: `translate3d(${cameraX}px, ${cameraY}px, 0)`,
          }}
          className="relative z-10 will-change-transform"
        >
          <svg
            viewBox={`0 0 ${worldWidth} ${worldHeight}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <line
              x1="1530"
              y1="90"
              x2="1530"
              y2="540"
              stroke="#D9C5CB"
              strokeWidth="3"
              strokeDasharray="10 10"
            />
            <path
              d={mainPathD}
              fill="none"
              stroke="#BFA8A3"
              strokeWidth="6"
              strokeDasharray="12 12"
              strokeLinecap="round"
            />

            {/* Animated Golden Bridge Segment Appearing to Secret Step 21 Island */}
            {showFinaleIsland && (
              <motion.path
                d={finaleSegmentD}
                fill="none"
                stroke="#D95D7B"
                strokeWidth="6"
                strokeDasharray="10 10"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              />
            )}

            {/* Glowing Kitten Trail Sparkles */}
            {progress > 0.08 && (
              <>
                <circle cx={trailPuff2.x} cy={trailPuff2.y} r="5" fill="#F4A4BA" opacity="0.55" />
                <circle cx={trailPuff1.x} cy={trailPuff1.y} r="7" fill="#FFD166" opacity="0.7" />
              </>
            )}
          </svg>

          {TOOLS_CATALOG.map((item, idx) => {
            const isCollected = collectedIds.includes(item.id);
            const isDestination = idx === toIndex;

            return (
              <div
                key={item.id}
                style={{
                  left: `${item.mapCoords.x}px`,
                  top: `${item.mapCoords.y}px`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-transform duration-300 ${
                  isDestination ? 'scale-[1.4] z-10' : 'scale-115 opacity-95'
                }`}
              >
                <FloatingIslandLandmark
                  discovered={isCollected}
                  active={isDestination}
                  chapter={item.chapter}
                  iconKind={item.iconKind}
                />
                <span
                  className={`-mt-1 px-3 py-0.5 rounded-md text-xs font-medium whitespace-nowrap border ${
                    isDestination
                      ? 'bg-[#D95D7B] text-[#FFFDFB] border-[#C14866]'
                      : 'bg-[#FFFDFB]/95 text-[#352931] border-[#E6D8D4]'
                  }`}
                >
                  {isCollected || isDestination ? item.islandName : `? · Stop ${item.order}`}
                </span>
              </div>
            );
          })}

          {/* Emerging 21st Secret Island (Animated Bloom right beside Crown Pavilion!) */}
          {showFinaleIsland && (
            <motion.div
              initial={isFinaleTravel ? { scale: 0, opacity: 0, y: 28 } : { scale: 1.15, opacity: 1 }}
              animate={{
                scale: isFinaleTravel ? 1.42 : 1.18,
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                left: `${FINALE_ISLAND.mapCoords.x}px`,
                top: `${FINALE_ISLAND.mapCoords.y}px`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
            >
              {/* Magical Halo Pulse */}
              <motion.div
                animate={{ scale: [0.95, 1.22, 0.95], opacity: [0.4, 0.78, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-32 h-32 -top-4 rounded-full bg-radial from-[#FFE89E]/75 via-[#FAD4E0]/45 to-transparent pointer-events-none"
              />
              <FloatingIslandLandmark
                discovered={true}
                active={isFinaleTravel}
                chapter={4}
                iconKind="treasure"
              />
              <span className="-mt-1 px-3 py-0.5 rounded-md text-xs font-bold whitespace-nowrap border bg-gradient-to-r from-[#D95D7B] to-[#9B6BC7] text-[#FFFDFB] border-[#B3395B] shadow-sm">
                {FINALE_ISLAND.islandName} · Note
              </span>
            </motion.div>
          )}

          <div
            style={{
              left: `${kittenPos.x}px`,
              top: `${kittenPos.y - 62}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <KittenTravelerSprite walking className="w-20 h-20 drop-shadow-md" />
          </div>
        </div>
      </div>
    </motion.section>
  );
};
