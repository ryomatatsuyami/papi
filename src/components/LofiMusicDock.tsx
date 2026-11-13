import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronDown,
  ListMusic,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import { PLAYLIST_SONGS, type PlaylistSong } from '../utils/soundEngine';

interface LofiMusicDockProps {
  playing: boolean;
  volume: number;
  track: PlaylistSong;
  trackIndex: number;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onSelectTrack: (index: number) => void;
  onVolumeChange: (val: number) => void;
}

export const LofiMusicDock: React.FC<LofiMusicDockProps> = ({
  playing,
  volume,
  track,
  trackIndex,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onSelectTrack,
  onVolumeChange,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const pct = Math.round(volume * 100);

  return (
    <div className="relative">
      <AnimatePresence>
        {showQueue && !collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 right-0 w-72 sm:w-80 max-h-64 overflow-y-auto rounded-2xl bg-[#FFFDFB]/97 backdrop-blur-md border-2 border-[#E6D8D4] shadow-xl p-2 space-y-1 z-40"
          >
            <div className="px-2.5 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#8A767D]">
              <span>Playlist ({PLAYLIST_SONGS.length} Songs)</span>
              <button
                type="button"
                onClick={() => setShowQueue(false)}
                className="text-[#D95D7B] hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
            {PLAYLIST_SONGS.map((song, idx) => {
              const isCurrent = idx === trackIndex;
              return (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => {
                    onSelectTrack(idx);
                    setShowQueue(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#FCE7EE] text-[#A33657]'
                      : 'hover:bg-[#F7F1EF] text-[#352931]'
                  }`}
                >
                  <span className="font-mono text-[11px] font-semibold w-5 text-center shrink-0 opacity-75">
                    {song.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate">{song.title}</p>
                    <p className="text-[11px] text-[#6E5D67] truncate">{song.artist}</p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {collapsed ? (
          <motion.button
            key="music-collapsed"
            type="button"
            initial={{ opacity: 0, scale: 0.78, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            onClick={() => setCollapsed(false)}
            title={`Expand music player (${track.title})`}
            aria-label="Expand music player"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#FFFDFB]/95 backdrop-blur-md border-2 border-[#E6D8D4] shadow-lg hover:border-[#D95D7B] transition-colors cursor-pointer origin-bottom-right"
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                playing
                  ? 'bg-gradient-to-br from-[#FAD4E0] to-[#DCCBFA] text-[#B3395B]'
                  : 'bg-[#F5EFEC] text-[#8A767D]'
              }`}
            >
              <Music className={`w-4 h-4 ${playing ? 'animate-pulse' : ''}`} />
            </div>
            <span className="font-display text-xs font-bold text-[#352931] max-w-[130px] truncate hidden sm:inline">
              {track.title}
            </span>
          </motion.button>
        ) : (
          <motion.aside
            key="music-expanded"
            initial={{ opacity: 0, scale: 0.88, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            aria-label="Music Playlist Player"
            className="w-72 sm:w-80 rounded-2xl bg-[#FFFDFB]/95 backdrop-blur-md border-2 border-[#E6D8D4] shadow-lg p-3 space-y-2.5 origin-bottom-right"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowQueue(false);
                    setCollapsed(true);
                  }}
                  title="Collapse music menu"
                  aria-label="Collapse music player"
                  className={`relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-transform hover:scale-105 ${
                    playing
                      ? 'bg-gradient-to-br from-[#FAD4E0] to-[#DCCBFA] text-[#B3395B]'
                      : 'bg-[#F5EFEC] text-[#8A767D]'
                  }`}
                >
                  <Music className={`w-4 h-4 ${playing ? 'animate-pulse' : ''}`} />
                  <ChevronDown className="w-2.5 h-2.5 absolute bottom-0.5 right-0.5 opacity-70" />
                </button>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#D95D7B] leading-tight truncate">
                    {track.number}/{PLAYLIST_SONGS.length} · {track.artist}
                  </p>
                  <p
                    className="font-display text-xs sm:text-sm font-bold text-[#352931] truncate"
                    title={`${track.title} — ${track.artist}`}
                  >
                    {track.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={onPrevTrack}
                  title="Previous song"
                  aria-label="Previous song"
                  className="w-7 h-7 rounded-full bg-[#FFFDFB] border border-[#E6D8D4] text-[#51424B] hover:border-[#D95D7B] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onTogglePlay}
                  title={playing ? 'Pause song' : 'Play song'}
                  aria-label={playing ? 'Pause song' : 'Play song'}
                  className="w-8 h-8 rounded-full bg-[#352931] text-[#FFFDFB] hover:bg-[#4D3B46] flex items-center justify-center cursor-pointer transition-colors"
                >
                  {playing ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={onNextTrack}
                  title="Next song"
                  aria-label="Next song"
                  className="w-7 h-7 rounded-full bg-[#FFFDFB] border border-[#E6D8D4] text-[#51424B] hover:border-[#D95D7B] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Volume + Playlist Queue Toggle */}
            <div className="flex items-center gap-2 px-0.5">
              <Volume2 className="w-3.5 h-3.5 text-[#8A767D] shrink-0" />
              <input
                type="range"
                min={0}
                max={100}
                value={pct}
                onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
                aria-label="Music volume"
                className="flex-1 h-1.5 rounded-full accent-[#D95D7B] bg-[#EFE3E0] cursor-pointer"
              />
              <span className="font-mono text-[10px] font-semibold text-[#6E5D67] tabular-nums w-7 text-right">
                {pct}%
              </span>

              <button
                type="button"
                onClick={() => setShowQueue((q) => !q)}
                title="View all 11 songs"
                aria-label="Toggle song list"
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                  showQueue
                    ? 'bg-[#D95D7B] border-[#D95D7B] text-[#FFFDFB]'
                    : 'bg-[#FCE7EE] border-[#EBC0CE] text-[#A33657] hover:bg-[#FAD6E2]'
                }`}
              >
                <ListMusic className="w-3 h-3" />
                <span>Songs</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};
