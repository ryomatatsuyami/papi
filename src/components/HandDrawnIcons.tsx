import React from 'react';
import type { ChapterNumber, IconKind } from '../data/toolsCatalog';

interface HandIconProps {
  kind: IconKind;
  className?: string;
}

function renderToolIconContent(kind: IconKind) {
  switch (kind) {
    case 'pdf':
      return (
        <>
          <path d="M9 6h12l6 6v18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="#FADDE4" />
          <path d="M21 6v6h6" fill="#FFFDFB" />
          <path d="M12 18h12M12 23h8" />
          <circle cx="13" cy="13" r="1.4" fill="#D96B86" stroke="none" />
        </>
      );
    case 'send':
      return (
        <>
          <rect x="5" y="9" width="26" height="18" rx="3.5" fill="#DFEAFA" />
          <path d="M6 10.5L18 19l12-8.5" />
          <circle cx="18" cy="19" r="3" fill="#FADDE4" />
        </>
      );
    case 'vault':
      return (
        <>
          <rect x="7" y="15" width="22" height="15" rx="3.5" fill="#DCECE3" />
          <path d="M12 15v-4a6 6 0 0 1 12 0v4" />
          <circle cx="18" cy="21.5" r="2.2" fill="#FCECCB" />
          <path d="M18 24v3" />
        </>
      );
    case 'search':
      return (
        <>
          <circle cx="16" cy="16" r="8.5" fill="#DFEAFA" />
          <path d="M22.5 22.5L29 29" strokeWidth="2.3" />
          <path d="M13 13.5a4 4 0 0 1 4-2" />
        </>
      );
    case 'notes':
      return (
        <>
          <rect x="8" y="6" width="20" height="24" rx="3" fill="#FCECCB" />
          <path d="M13 6v24M17 13h7M17 18h7M17 23h4" />
          <path d="M6.5 11h3M6.5 17h3M6.5 23h3" />
        </>
      );
    case 'chat':
      return (
        <>
          <path
            d="M7 12c0-3 3-5 11-5s11 2 11 5v8c0 3-3 5-11 5-2.3 0-4.4-.2-6.1-.7L7 28l1.2-4.2C7.4 22.8 7 21.5 7 20v-8z"
            fill="#FADDE4"
          />
          <circle cx="13.5" cy="16" r="1.4" fill="#3A2C34" stroke="none" />
          <circle cx="18" cy="16" r="1.4" fill="#3A2C34" stroke="none" />
          <circle cx="22.5" cy="16" r="1.4" fill="#3A2C34" stroke="none" />
        </>
      );
    case 'sketch':
      return (
        <>
          <path d="M8 26l3-8L24 5l5 5-13 13-8 3z" fill="#FADDE4" />
          <path d="M21 8l5 5M7 29h22" />
        </>
      );
    case 'flashcards':
      return (
        <>
          <rect x="5" y="11" width="21" height="16" rx="2.5" fill="#DCECE3" />
          <rect x="10" y="7" width="21" height="16" rx="2.5" fill="#FCECCB" />
          <path d="M15 13h11M15 17h7" />
        </>
      );
    case 'graph':
      return (
        <>
          <path d="M10 10l8 8 8-8M18 18v10" />
          <circle cx="10" cy="10" r="3.2" fill="#DCECE3" />
          <circle cx="26" cy="10" r="3.2" fill="#FADDE4" />
          <circle cx="18" cy="18" r="3.2" fill="#FCECCB" />
          <circle cx="18" cy="28" r="3.2" fill="#DFEAFA" />
        </>
      );
    case 'algo':
      return (
        <>
          <rect x="7" y="20" width="5" height="9" rx="1.2" fill="#FADDE4" />
          <rect x="15.5" y="13" width="5" height="16" rx="1.2" fill="#DCECE3" />
          <rect x="24" y="8" width="5" height="21" rx="1.2" fill="#DFEAFA" />
        </>
      );
    case 'practice':
      return (
        <>
          <circle cx="18" cy="18" r="12" fill="#DCECE3" />
          <path d="M13 14l-4 4 4 4M23 14l4 4-4 4M19.5 12.5l-3 11" />
        </>
      );
    case 'curriculum':
      return (
        <>
          <path d="M18 7l12 6-12 6-12-6 12-6z" fill="#DFEAFA" />
          <path d="M10 15.5v8.5c0 2 3.6 3.5 8 3.5s8-1.5 8-3.5v-8.5" fill="#FCECCB" />
          <path d="M30 13v9" />
        </>
      );
    case 'roadmap':
      return (
        <>
          <path d="M7 9l7-3 8 3 7-3v20l-7 3-8-3-7 3V9z" fill="#FCECCB" />
          <path d="M14 6v20M22 9v20" />
          <circle cx="18" cy="17" r="2.2" fill="#D96B86" stroke="none" />
        </>
      );
    case 'database':
      return (
        <>
          <path d="M8 10v16c0 2.2 4.5 4 10 4s10-1.8 10-4V10H8z" fill="#DCECE3" />
          <ellipse cx="18" cy="10" rx="10" ry="4" fill="#FFFDFB" />
          <path d="M8 18c0 2.2 4.5 4 10 4s10-1.8 10-4" />
        </>
      );
    case 'deploy':
      return (
        <>
          <path d="M18 5c5 4 7 10 7 16l-7 4-7-4c0-6 2-12 7-16z" fill="#FADDE4" />
          <circle cx="18" cy="15" r="2.6" fill="#DFEAFA" />
          <path d="M11 21l-4 3 4 2M25 21l4 3-4 2M15 26l3 5 3-5" />
        </>
      );
    case 'latex':
      return (
        <>
          <path d="M27 7c-7 1-13 7-15 16l-4 6 6-4c9-2 15-8 13-18z" fill="#FCECCB" />
          <path d="M12 23l11-11" />
        </>
      );
    case 'treasure':
      return (
        <>
          <rect x="6" y="13" width="24" height="16" rx="3" fill="#FCECCB" />
          <path d="M6 19h24" />
          <path d="M9 13l3-6h12l3 6" fill="#FADDE4" />
          <circle cx="18" cy="19" r="3" fill="#FFD166" />
          <path d="M26 7l1 2.2L29 10l-2 .8L26 13l-1-2.2L23 10l2-.8z" fill="#FFD166" stroke="none" />
        </>
      );
    case 'agents':
      return (
        <>
          <rect x="8" y="11" width="20" height="16" rx="4.5" fill="#DFEAFA" />
          <path d="M18 6v5M13 18h2M21 18h2M14 23h8" />
          <circle cx="18" cy="6" r="1.8" fill="#FCECCB" />
        </>
      );
    case 'interview':
      return (
        <>
          <path d="M9 30V7" strokeWidth="2" />
          <path d="M9 8h17l-4 5 4 5H9" fill="#FADDE4" />
          <path d="M5 30h8" />
        </>
      );
    case 'backpack':
      return (
        <>
          <path d="M13 11V8a5 5 0 0 1 10 0v3" />
          <rect x="8" y="11" width="20" height="18" rx="5" fill="#FCECCB" />
          <rect x="12" y="19" width="12" height="7" rx="2" fill="#FADDE4" />
          <path d="M18 14v2" />
        </>
      );
  }
}

// Unified storybook icon language: consistent #3A2C34 1.75px linework + harmonious 4-tint pastel fills
export const HandDrawnToolIcon: React.FC<HandIconProps> = ({ kind, className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    stroke="#3A2C34"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {renderToolIconContent(kind)}
  </svg>
);

export const MysteryQuestionIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M11.5 11.5a4.6 4.6 0 0 1 9 1.2c0 3-4.5 3.6-4.5 6.3" />
    <circle cx="16" cy="24" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const KittenTravelerSprite: React.FC<{
  walking?: boolean;
  hop?: boolean;
  className?: string;
}> = ({ walking = false, hop = false, className = 'w-14 h-14' }) => (
  <svg
    viewBox="0 0 64 60"
    fill="none"
    className={`${className} ${
      hop ? 'scale-110 -translate-y-2' : walking ? 'animate-walk-bounce' : 'animate-float-gentle'
    } transition-transform duration-200`}
    aria-hidden="true"
  >
    {/* Ground shadow */}
    <ellipse cx="32" cy="54" rx="14" ry="3.5" fill="rgba(58,44,52,0.14)" />

    {/* Swishing fluffy tail */}
    <path
      d="M42 43c6-1 11-6 10-12-1-4-4-4-5-1-1 3-3 7-7 8"
      fill="#FBE7D7"
      stroke="#3A2C34"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M49 30c1 1 2 2.5 1.5 4" stroke="#E5A27B" strokeWidth="2.2" strokeLinecap="round" />

    {/* Tiny adventure backpack */}
    <rect
      x="35"
      y="30"
      width="10"
      height="11"
      rx="3.5"
      fill="#9BC3AE"
      stroke="#3A2C34"
      strokeWidth="1.7"
    />
    <path d="M36 34h8" stroke="#3A2C34" strokeWidth="1.4" />

    {/* Kitten chubby body */}
    <path
      d="M21 44c0-9 4-15 11-15s11 6 11 15c0 4-3 6-11 6s-11-2-11-6z"
      fill="#FFF9F3"
      stroke="#3A2C34"
      strokeWidth="1.8"
    />

    {/* Little paws */}
    <ellipse cx="26" cy="49.5" rx="3.4" ry="2.5" fill="#FFF9F3" stroke="#3A2C34" strokeWidth="1.6" />
    <ellipse cx="37" cy="49.5" rx="3.4" ry="2.5" fill="#FFF9F3" stroke="#3A2C34" strokeWidth="1.6" />

    {/* Cozy rose scarf */}
    <path
      d="M22 30c4 2.5 16 2.5 20 0l1.5 4.5-6-1-2.5 4-3-4-7.5 1L22 30z"
      fill="#EE9AAF"
      stroke="#3A2C34"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />

    {/* Kitten Ears */}
    <path
      d="M19 19L17 7l10 6z"
      fill="#FFF9F3"
      stroke="#3A2C34"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M20.2 16.5L19 10l6 3.8z" fill="#F8BBD0" />

    <path
      d="M45 19L47 7l-10 6z"
      fill="#E9B895"
      stroke="#3A2C34"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M43.8 16.5L45 10l-6 3.8z" fill="#F8BBD0" />

    {/* Kitten Head */}
    <ellipse cx="32" cy="21" rx="13.5" ry="11" fill="#FFF9F3" stroke="#3A2C34" strokeWidth="1.8" />
    {/* Cute calico patch */}
    <path d="M36 11c5 1 8.5 4.5 9 9.5-3.5-.5-6.5-2.5-9-9.5z" fill="#E9B895" opacity="0.85" />

    {/* Expressive eyes + sparkle */}
    <circle cx="26.5" cy="21" r="2" fill="#3A2C34" />
    <circle cx="37.5" cy="21" r="2" fill="#3A2C34" />
    <circle cx="27.2" cy="20.2" r="0.7" fill="#FFFDFB" />
    <circle cx="38.2" cy="20.2" r="0.7" fill="#FFFDFB" />

    {/* Rosy cheeks, tiny pink nose & ":3" smile */}
    <ellipse cx="22.5" cy="23.5" rx="2.2" ry="1.3" fill="#F6AEC0" opacity="0.75" />
    <ellipse cx="41.5" cy="23.5" rx="2.2" ry="1.3" fill="#F6AEC0" opacity="0.75" />
    <path d="M30.5 23.2h3l-1.5 1.6z" fill="#E47E97" />
    <path
      d="M29 25.6c1 .9 2.2.9 3 0 .8.9 2 .9 3 0"
      stroke="#3A2C34"
      strokeWidth="1.4"
      strokeLinecap="round"
    />

    {/* Tiny whiskers */}
    <path
      d="M16 21.5l4 .6M16 24l4-.2M48 21.5l-4 .6M48 24l-4-.2"
      stroke="#6E5D67"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export const FloatingIslandLandmark: React.FC<{
  discovered: boolean;
  active: boolean;
  chapter: ChapterNumber;
  iconKind: IconKind;
}> = ({ discovered, active, chapter, iconKind }) => {
  const accentStroke = active ? '#D95D7B' : discovered ? '#5C9479' : '#C4B1AE';

  return (
    <div className="relative flex flex-col items-center select-none">
      <svg viewBox="0 0 132 96" className="w-28 h-20 sm:w-32 sm:h-24 drop-shadow-sm" aria-hidden="true">
        {/* Smooth symmetric multi-puff fluffy cloud base */}
        <path
          d="M26 76c-10 0-17-6.5-17-14.5 0-7.2 5.6-13 13-13.8 2.8-8.8 11.4-14.7 21.5-14.7 6.8 0 12.9 2.6 17.2 6.8 3.6-2.5 8-3.8 12.8-3.8 10.6 0 19.5 7 21.2 16.5 6.8 1.4 11.8 7 11.8 13.8 0 8-7.2 14.2-16.5 14.2-3.2 0-6.2-.8-8.8-2.2-3.8 2.4-8.8 3.7-14.2 3.7-5.6 0-10.7-1.4-14.6-3.9-3.1 1.6-6.8 2.5-10.8 2.5-5.8 0-11-2-15.6-4.6z"
          fill="#FFFDFB"
          stroke={accentStroke}
          strokeWidth={active ? '2.2' : '1.6'}
          strokeLinejoin="round"
        />

        {/* Soft meadow / starlight turf crest */}
        <path
          d="M24 58c18-4 66-4 84 0"
          stroke={chapter === 1 ? '#9ED0B6' : chapter === 2 ? '#8FC8C1' : chapter === 3 ? '#B9B2E6' : '#E7C48B'}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* CHAPTER 1: Whimsical Pastel Blossom Bakery Cottage (replaced plain house) */}
        {chapter === 1 && (
          <g>
            {/* Tiny cloud puff chimney */}
            <rect x="70" y="19" width="5.5" height="9" rx="1.2" fill="#F2D7DE" stroke="#3A2C34" strokeWidth="1.3" />
            <circle cx="73" cy="14" r="2.2" fill="#FFF4F7" stroke="#E69DB2" strokeWidth="1" />
            {/* Rounded pastel cream facade */}
            <rect x="43" y="34" width="38" height="22" rx="5" fill="#FFF7EE" stroke="#3A2C34" strokeWidth="1.5" />
            {/* Curved scalloped roof */}
            <path
              d="M39 36c4-12 13-18 23-18s19 6 23 18H39z"
              fill={active ? '#F188A4' : discovered ? '#8AC5A8' : '#E8C9D4'}
              stroke="#3A2C34"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Awning scallop trim */}
            <path
              d="M42 36c2 3 6 3 8 0 2 3 6 3 8 0 2 3 6 3 8 0 2 3 6 3 8 0 2 3 5 3 7 0"
              fill="none"
              stroke="#FFFDFB"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Arched door & warm window */}
            <path d="M58 56v-9a4 4 0 0 1 8 0v9z" fill="#F3C79B" stroke="#3A2C34" strokeWidth="1.3" />
            <circle cx="50" cy="44" r="3.4" fill={discovered || active ? '#FFE89E' : '#EAE1DD'} stroke="#3A2C34" strokeWidth="1.2" />
            {/* Tiny pastel shrub */}
            <circle cx="40" cy="54" r="4" fill="#9ED0B6" stroke="#3A2C34" strokeWidth="1.1" />
            <circle cx="40" cy="53" r="1.2" fill="#F188A4" />
          </g>
        )}

        {/* CHAPTER 2: Botanical Conservatory Glasshouse */}
        {chapter === 2 && (
          <g>
            <path d="M43 56V37c0-11 9-19 20-19s20 8 20 19v19H43z" fill="#E3F5F1" stroke="#3A2C34" strokeWidth="1.5" />
            <path d="M63 18v38M51 23c3 6 4 14 4 33M75 23c-3 6-4 14-4 33" fill="none" stroke="#3A2C34" strokeWidth="1.15" opacity="0.6" />
            <path d="M43 38h40" fill="none" stroke="#3A2C34" strokeWidth="1.25" />
            <rect x="58" y="44" width="10" height="12" rx="5" fill="#FCECCB" stroke="#3A2C34" strokeWidth="1.3" />
            <circle cx="43" cy="52" r="3.5" fill="#A6D9B8" stroke="#3A2C34" strokeWidth="1.1" />
            <circle cx="46" cy="54" r="2.5" fill="#FAD4E0" stroke="#3A2C34" strokeWidth="1" />
          </g>
        )}

        {/* CHAPTER 3: Starlight Moon Observatory */}
        {chapter === 3 && (
          <g>
            <rect x="46" y="34" width="32" height="22" rx="3" fill="#F4EEFC" stroke="#3A2C34" strokeWidth="1.5" />
            <path
              d="M44 34c0-10 8-17 18-17s18 7 18 17H44z"
              fill={active ? '#C697EC' : discovered ? '#8FB3E6' : '#C9CEE6'}
              stroke="#3A2C34"
              strokeWidth="1.5"
            />
            <path d="M71 22l12-6" fill="none" stroke="#3A2C34" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="62" cy="44" r="4.8" fill={discovered || active ? '#FFE7A3' : '#EAE1DD'} stroke="#3A2C34" strokeWidth="1.3" />
            <circle cx="53" cy="26" r="1.4" fill="#FFF6C9" />
          </g>
        )}

        {/* CHAPTER 4: Golden Horizon Gazebo Pavilion (explicit pastel fill, ZERO black roof!) */}
        {chapter === 4 && (
          <g>
            {/* Open airy marble pavilion columns */}
            <rect x="46" y="34" width="32" height="22" rx="2" fill="#FFF8EE" stroke="#3A2C34" strokeWidth="1.5" />
            {/* Pastel gold/rose scalloped canopy */}
            <path
              d="M39 35L62 17l23 18H39z"
              fill={active ? '#FFD580' : discovered ? '#FCE0A6' : '#F3DFC8'}
              stroke="#3A2C34"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Sunburst roof stripe accent */}
            <path d="M62 17L55 35M62 17L69 35" fill="none" stroke="#E59872" strokeWidth="1.2" opacity="0.65" />
            {/* Top star spire */}
            <path d="M62 11v6" fill="none" stroke="#3A2C34" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="62" cy="10" r="2.4" fill="#FFD166" stroke="#3A2C34" strokeWidth="1.2" />
            {/* Archway */}
            <path d="M56 56V45a6 6 0 0 1 12 0v11z" fill="#FADDE4" stroke="#3A2C34" strokeWidth="1.3" />
          </g>
        )}

        {/* Integrated Emblem Plaque right on the Cloud Lawn */}
        <circle
          cx="95"
          cy="56"
          r="13.5"
          fill="#FFFDFB"
          stroke={active ? '#D95D7B' : discovered ? '#5C9479' : '#B7A5A1'}
          strokeWidth="1.7"
        />

        {/* Nested SVG mathematically locked dead-center on (95, 56) at EVERY scale! */}
        {discovered || active ? (
          <svg
            x="84.5"
            y="45.5"
            width="21"
            height="21"
            viewBox="0 0 36 36"
            fill="none"
            stroke="#3A2C34"
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {renderToolIconContent(iconKind)}
          </svg>
        ) : (
          <svg
            x="85.5"
            y="46.5"
            width="19"
            height="19"
            viewBox="0 0 32 32"
            fill="none"
            stroke="#8A767D"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11.5 11.5a4.6 4.6 0 0 1 9 1.2c0 3-4.5 3.6-4.5 6.3" />
            <circle cx="16" cy="24" r="1.4" fill="#8A767D" stroke="none" />
          </svg>
        )}
      </svg>
    </div>
  );
};

export const StorybookGiftBoxSvg: React.FC<{
  lidOpen?: boolean;
  showQuestion?: boolean;
  className?: string;
}> = ({ lidOpen = false, showQuestion = true, className = 'w-28 h-28' }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
    {/* Soft drop shadow */}
    <ellipse cx="60" cy="108" rx="36" ry="5.5" fill="rgba(58,44,52,0.14)" />

    {/* Gift Box Body with layered pastel wrap */}
    <rect
      x="22"
      y="50"
      width="76"
      height="54"
      rx="10"
      fill="#FAD4E0"
      stroke="#3A2C34"
      strokeWidth="2.6"
    />
    {/* Subtle cream inner panel shading */}
    <rect x="26" y="54" width="68" height="46" rx="7" fill="#FFE3EC" />
    {/* Vertical satin ribbon */}
    <rect x="52" y="50" width="16" height="54" fill="#D95D7B" />
    <path d="M52 50v54M68 50v54" stroke="#3A2C34" strokeWidth="2.2" />

    {/* Center Emblem Circle Seal */}
    <circle cx="60" cy="77" r="14" fill="#FFFDFB" stroke="#3A2C34" strokeWidth="2.4" />

    {/* Mathematically centered Question Mark directly inside viewBox at (60, 77) */}
    {showQuestion && (
      <svg x="49" y="66" width="22" height="22" viewBox="0 0 32 32" fill="none">
        <path
          d="M11.8 11.2a4.6 4.6 0 0 1 8.8 1.4c0 2.7-4.6 3.5-4.6 6"
          stroke="#D95D7B"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <circle cx="16" cy="24" r="1.8" fill="#D95D7B" />
      </svg>
    )}

    {/* Animated Lid + Fluffy Double Bow */}
    <g
      style={{
        transformOrigin: '60px 44px',
        transform: lidOpen ? 'translateY(-44px) rotate(14deg)' : 'translateY(0px) rotate(0deg)',
        opacity: lidOpen ? 0 : 1,
        transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease',
      }}
    >
      {/* Lid cap */}
      <rect
        x="15"
        y="34"
        width="90"
        height="19"
        rx="6.5"
        fill="#FFFDFB"
        stroke="#3A2C34"
        strokeWidth="2.6"
      />
      {/* Horizontal lid ribbon */}
      <rect x="52" y="34" width="16" height="19" fill="#D95D7B" stroke="#3A2C34" strokeWidth="2" />

      {/* Fluffy Double Storybook Bow */}
      <path
        d="M60 34C48 16 28 19 32 30c2 6 20 5 28 4z"
        fill="#EA6B8A"
        stroke="#3A2C34"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M60 34C72 16 92 19 88 30c-2 6-20 5-28 4z"
        fill="#EA6B8A"
        stroke="#3A2C34"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Bow knot + highlight */}
      <circle cx="60" cy="32" r="5.5" fill="#F8A1B7" stroke="#3A2C34" strokeWidth="2.2" />
    </g>
  </svg>
);
