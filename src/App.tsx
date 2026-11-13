import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Gift, Home, Volume2, VolumeX } from 'lucide-react';
import { TOOLS_CATALOG } from './data/toolsCatalog';
import { soundEngine, type MusicPlayerSnapshot } from './utils/soundEngine';
import { ForefrontHeartMeter } from './components/HeartProgressBar';
import { FloatingMinimap } from './components/FloatingMinimap';
import { LofiMusicDock } from './components/LofiMusicDock';
import { IntroView } from './components/IntroView';
import { JourneyMapStage, type SlideBeat } from './components/JourneyMapStage';
import { TravelMapTransition } from './components/TravelMapTransition';
import { PartTwoTransition } from './components/PartTwoTransition';
import { FinaleNoteStage } from './components/FinaleNoteStage';
import { GiftBoardView } from './components/GiftBoardView';
import { InteractiveSkyEffects } from './components/InteractiveSkyEffects';
import { SparklerOverlay } from './components/SparklerOverlay';
import { SkyBackdropLayer } from './components/SkyBackdropLayer';

type AppStage =
  | 'intro'
  | 'traveling'
  | 'journey'
  | 'part2-transition'
  | 'finale'
  | 'board';

const STORAGE_KEY = 'starlight_atlas_progress_v2';
const LEGACY_STORAGE_KEY = 'btech_boy_map_progress_v1';
const VALID_TOOL_IDS = new Set(TOOLS_CATALOG.map((t) => t.id));

interface SavedProgress {
  collectedIds: string[];
  activeIndex: number;
  finaleDiscovered?: boolean;
}

function sanitizeCollectedIds(rawIds: unknown): string[] {
  if (!Array.isArray(rawIds)) return [];
  const unique: string[] = [];
  for (const id of rawIds) {
    if (typeof id === 'string' && VALID_TOOL_IDS.has(id) && !unique.includes(id)) {
      unique.push(id);
    }
  }
  return unique;
}

function loadSavedProgress(): {
  collectedIds: string[];
  activeIndex: number;
  finaleDiscovered: boolean;
} {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return { collectedIds: [], activeIndex: 0, finaleDiscovered: false };
    const parsed = JSON.parse(raw) as Partial<SavedProgress>;
    const validIds = sanitizeCollectedIds(parsed.collectedIds);
    const safeIndex =
      typeof parsed.activeIndex === 'number' &&
      parsed.activeIndex >= 0 &&
      parsed.activeIndex < TOOLS_CATALOG.length
        ? parsed.activeIndex
        : 0;
    const finaleDiscovered =
      Boolean(parsed.finaleDiscovered) && validIds.length >= TOOLS_CATALOG.length;
    return { collectedIds: validIds, activeIndex: safeIndex, finaleDiscovered };
  } catch {
    return { collectedIds: [], activeIndex: 0, finaleDiscovered: false };
  }
}

export default function App() {
  const initial = loadSavedProgress();

  const [stage, setStage] = useState<AppStage>('intro');
  const [collectedIds, setCollectedIds] = useState<string[]>(initial.collectedIds);
  const [activeIndex, setActiveIndex] = useState<number>(initial.activeIndex);
  const [finaleDiscovered, setFinaleDiscovered] = useState<boolean>(
    initial.finaleDiscovered
  );
  const [travelFromIndex, setTravelFromIndex] = useState<number>(initial.activeIndex);
  const [travelToIndex, setTravelToIndex] = useState<number>(initial.activeIndex);
  const [slideBeat, setSlideBeat] = useState<SlideBeat>(() => {
    const current = TOOLS_CATALOG[initial.activeIndex];
    return current && initial.collectedIds.includes(current.id) ? 'unwrapped' : 'intro';
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [heartGlowCount, setHeartGlowCount] = useState(0);

  // Real MP3 Playlist Player State
  const [musicSnap, setMusicSnap] = useState<MusicPlayerSnapshot>(() =>
    soundEngine.getMusicSnapshot()
  );

  useEffect(() => {
    return soundEngine.subscribeMusic(setMusicSnap);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ collectedIds, activeIndex, finaleDiscovered })
      );
    } catch {
      // Ignore storage quota issues
    }
  }, [collectedIds, activeIndex, finaleDiscovered]);

  useEffect(() => {
    soundEngine.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Resume Web Audio / Music on first user interaction so autoplay restrictions never block sound
  useEffect(() => {
    const ensureAudioResumed = () => {
      if (!soundEnabled) return;
      soundEngine.resumeAudioIfNeeded();
    };

    window.addEventListener('pointerdown', ensureAudioResumed, { passive: true });
    window.addEventListener('keydown', ensureAudioResumed, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', ensureAudioResumed);
      window.removeEventListener('keydown', ensureAudioResumed);
    };
  }, [soundEnabled]);

  const handleToggleMusic = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      soundEngine.setEnabled(true);
    }
    soundEngine.toggleMusic();
  };

  const handlePrevTrack = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      soundEngine.setEnabled(true);
    }
    soundEngine.prevTrack();
  };

  const handleNextTrack = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      soundEngine.setEnabled(true);
    }
    soundEngine.nextTrack(true);
  };

  const handleSelectTrack = (index: number) => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      soundEngine.setEnabled(true);
    }
    soundEngine.selectTrack(index, true);
  };

  const handleMusicVolumeChange = (val: number) => {
    soundEngine.setMusicVolume(val);
  };

  const currentStop = TOOLS_CATALOG[activeIndex] ?? TOOLS_CATALOG[0];

  const navigateStage = (next: AppStage) => {
    soundEngine.playPaperRustle();
    window.scrollTo({ top: 0, behavior: 'auto' });
    setStage(next);
  };

  const startTravelTo = (targetIdx: number) => {
    const clamped = Math.max(0, Math.min(TOOLS_CATALOG.length, targetIdx));
    soundEngine.playWalkSteps();
    window.scrollTo({ top: 0, behavior: 'auto' });
    setTravelFromIndex(stage === 'finale' ? TOOLS_CATALOG.length : activeIndex);
    setTravelToIndex(clamped);
    setStage('traveling');
  };

  const handleArriveAtIsland = useCallback(() => {
    if (travelToIndex >= TOOLS_CATALOG.length) {
      soundEngine.playChapterTransition();
      window.scrollTo({ top: 0, behavior: 'auto' });
      setActiveIndex(TOOLS_CATALOG.length - 1);
      setFinaleDiscovered(true);
      setStage('finale');
      return;
    }

    const arrivedStop = TOOLS_CATALOG[travelToIndex] ?? TOOLS_CATALOG[0];
    setActiveIndex(travelToIndex);
    setSlideBeat(collectedIds.includes(arrivedStop.id) ? 'unwrapped' : 'intro');
    soundEngine.playPaperRustle();
    window.scrollTo({ top: 0, behavior: 'auto' });
    setStage('journey');
  }, [travelToIndex, collectedIds]);

  const handleStartJourney = () => {
    const nextUncollected = TOOLS_CATALOG.findIndex(
      (t) => !collectedIds.includes(t.id)
    );
    const targetIdx =
      nextUncollected >= 0
        ? nextUncollected
        : Math.min(activeIndex, TOOLS_CATALOG.length - 1);

    soundEngine.playBirdChirp();
    soundEngine.playMapOpen();
    window.scrollTo({ top: 0, behavior: 'auto' });
    setActiveIndex(targetIdx);
    setSlideBeat(collectedIds.includes(TOOLS_CATALOG[targetIdx].id) ? 'unwrapped' : 'intro');
    setStage('journey');
  };

  const handleUnwrapCurrent = () => {
    const current = TOOLS_CATALOG[activeIndex];
    const isNewCollect = !collectedIds.includes(current.id);

    if (isNewCollect) {
      setCollectedIds((prev) =>
        prev.includes(current.id) ? prev : [...prev, current.id]
      );
      setHeartGlowCount((c) => c + 1);
    }
    setSlideBeat('unwrapped');
  };

  const handleWalkNext = () => {
    const current = TOOLS_CATALOG[activeIndex];
    if (activeIndex >= TOOLS_CATALOG.length - 1) {
      // After Step 20, reveal & walk onto Surprise Step 21 Finale Note Island
      startTravelTo(TOOLS_CATALOG.length);
      return;
    }

    if (current.order === 12) {
      soundEngine.playChapterTransition();
      window.scrollTo({ top: 0, behavior: 'auto' });
      setStage('part2-transition');
      return;
    }

    startTravelTo(activeIndex + 1);
  };

  const handleEnterPartTwo = () => {
    startTravelTo(12);
  };

  const handleWalkPrevious = () => {
    if (activeIndex <= 0) return;
    startTravelTo(activeIndex - 1);
  };

  const handleOpenFinaleFromAnywhere = () => {
    startTravelTo(TOOLS_CATALOG.length);
  };

  const handleReplayJourney = () => {
    soundEngine.playBirdChirp();
    window.scrollTo({ top: 0, behavior: 'auto' });
    setCollectedIds([]);
    setActiveIndex(0);
    setFinaleDiscovered(false);
    setTravelFromIndex(0);
    setTravelToIndex(0);
    setHeartGlowCount(0);
    setSlideBeat('intro');
    setStage('intro');
  };

  const isJourneyActive =
    stage === 'journey' ||
    stage === 'traveling' ||
    stage === 'part2-transition' ||
    stage === 'finale';

  const activeSkyChapter =
    stage === 'intro'
      ? 1
      : stage === 'part2-transition'
        ? 3
        : stage === 'finale'
          ? 4
          : stage === 'board'
            ? collectedIds.length >= TOOLS_CATALOG.length
              ? 4
              : currentStop.chapter
            : stage === 'traveling'
              ? travelToIndex >= TOOLS_CATALOG.length
                ? 4
                : (TOOLS_CATALOG[travelToIndex]?.chapter ?? currentStop.chapter)
              : currentStop.chapter;

  const activeBarStopOrder =
    stage === 'board'
      ? null
      : stage === 'part2-transition'
        ? 13
        : stage === 'finale'
          ? TOOLS_CATALOG.length
          : stage === 'traveling'
            ? travelToIndex >= TOOLS_CATALOG.length
              ? TOOLS_CATALOG.length
              : (TOOLS_CATALOG[travelToIndex]?.order ?? currentStop.order)
            : currentStop.order;

  return (
    <div className="min-h-screen flex flex-col text-[#352931] relative isolate">
      {/* Shared Seamless Full-Screen Pastel Cloud Backdrop Behind Everything */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <SkyBackdropLayer chapter={activeSkyChapter} />
      </div>

      {/* Top-Left Interactive Heart Explosion & Cursor-Dodging Starfield */}
      <InteractiveSkyEffects />

      {/* Bottom-Left Always-Lit Corner Sparkler -> 80% Black Forefront Sparkler */}
      <SparklerOverlay />

      {/* Top-Right Compact Floating Navigation Buttons (No Header Bar) */}
      <nav
        aria-label="Primary Navigation"
        className="fixed top-4 right-4 z-40 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => navigateStage('intro')}
          title="Intro"
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap ${
            stage === 'intro'
              ? 'bg-[#352931] text-[#FFFDFB] border-[#352931]'
              : 'bg-[#FFFDFB]/95 text-[#51424B] border-[#E6D8D4] hover:border-[#D95D7B]'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Intro</span>
        </button>

        <button
          type="button"
          onClick={() => navigateStage('journey')}
          title="Journey"
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap ${
            isJourneyActive
              ? 'bg-[#352931] text-[#FFFDFB] border-[#352931]'
              : 'bg-[#FFFDFB]/95 text-[#51424B] border-[#E6D8D4] hover:border-[#D95D7B]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Journey</span>
        </button>

        <button
          type="button"
          onClick={() => navigateStage('board')}
          title="Gift Board"
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap ${
            stage === 'board'
              ? 'bg-[#352931] text-[#FFFDFB] border-[#352931]'
              : 'bg-[#FFFDFB]/95 text-[#51424B] border-[#E6D8D4] hover:border-[#D95D7B]'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Board</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            soundEngine.setEnabled(next);
            if (next) {
              soundEngine.playBirdChirp();
            }
          }}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#FFFDFB]/95 border border-[#E6D8D4] text-[#51424B] hover:border-[#D95D7B] shadow-sm transition-colors cursor-pointer shrink-0"
          aria-label={soundEnabled ? 'Mute all audio' : 'Enable audio'}
          title={soundEnabled ? 'Audio On' : 'Audio Muted'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#D95D7B]" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#8C7780]" />
          )}
        </button>
      </nav>

      {/* Centered Forefront Heart Storyline Progress Meter */}
      {stage !== 'intro' && (
        <div className="relative z-20">
          <ForefrontHeartMeter
            collectedCount={collectedIds.length}
            totalCount={TOOLS_CATALOG.length}
            currentChapter={activeSkyChapter}
            currentStopOrder={activeBarStopOrder}
            isFinale={stage === 'finale' || (stage === 'traveling' && travelToIndex >= TOOLS_CATALOG.length)}
            glowTrigger={heartGlowCount}
            fullWidth={stage === 'board'}
            onOpenBoard={() => navigateStage('board')}
          />
        </div>
      )}

      {/* Main Stage Router */}
      <main className="flex-1 flex flex-col">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <IntroView
              collectedCount={collectedIds.length}
              totalCount={TOOLS_CATALOG.length}
              onStartJourney={handleStartJourney}
              onOpenBoard={() => navigateStage('board')}
            />
          </motion.div>
        )}

        {stage === 'traveling' && (
          <TravelMapTransition
            key={`travel-${travelFromIndex}-${travelToIndex}`}
            fromIndex={travelFromIndex}
            toIndex={travelToIndex}
            collectedIds={collectedIds}
            onArrive={handleArriveAtIsland}
          />
        )}

        {stage === 'journey' && (
          <motion.div
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22 }}
            className="flex-1"
          >
            <JourneyMapStage
              activeIndex={activeIndex}
              slideBeat={slideBeat}
              collectedIds={collectedIds}
              onUnwrapCurrent={handleUnwrapCurrent}
              onWalkNext={handleWalkNext}
              onWalkPrevious={handleWalkPrevious}
            />
          </motion.div>
        )}

        {stage === 'part2-transition' && (
          <motion.div
            key="part2-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <PartTwoTransition onContinue={handleEnterPartTwo} />
          </motion.div>
        )}

        {stage === 'finale' && (
          <motion.div
            key="finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <FinaleNoteStage
              onBackToLastStop={() => startTravelTo(TOOLS_CATALOG.length - 1)}
              onOpenBoard={() => navigateStage('board')}
            />
          </motion.div>
        )}

        {stage === 'board' && (
          <motion.div
            key="board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <GiftBoardView
              collectedIds={collectedIds}
              finaleDiscovered={finaleDiscovered}
              onReplayJourney={handleReplayJourney}
              onBackToMap={handleStartJourney}
              onOpenFinaleNote={handleOpenFinaleFromAnywhere}
            />
          </motion.div>
        )}
      </main>

      {/* Bottom-Right Unified Dock: Real Playlist Player beside Collapsible Starlight Atlas Minimap */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col sm:flex-row items-end gap-3 pointer-events-none">
        <div className="pointer-events-auto">
          <LofiMusicDock
            playing={musicSnap.playing}
            volume={musicSnap.volume}
            track={musicSnap.track}
            trackIndex={musicSnap.trackIndex}
            onTogglePlay={handleToggleMusic}
            onPrevTrack={handlePrevTrack}
            onNextTrack={handleNextTrack}
            onSelectTrack={handleSelectTrack}
            onVolumeChange={handleMusicVolumeChange}
          />
        </div>

        {(stage === 'journey' || stage === 'traveling' || stage === 'finale' || stage === 'board') && (
          <div className="pointer-events-auto">
            <FloatingMinimap
              activeIndex={
                stage === 'traveling'
                  ? travelToIndex
                  : stage === 'finale'
                    ? TOOLS_CATALOG.length
                    : activeIndex
              }
              collectedIds={collectedIds}
              showFinaleIsland={
                stage === 'finale' ||
                (stage === 'traveling' && travelToIndex >= TOOLS_CATALOG.length)
              }
              onSelectStop={startTravelTo}
            />
          </div>
        )}
      </div>
    </div>
  );
}
