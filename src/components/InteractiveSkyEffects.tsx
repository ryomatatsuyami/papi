import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, Star, X } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface TinyHeart {
  id: number;
  dx: number;
  dy: number;
  rotate: number;
  scale: number;
  color: string;
  duration: number;
}

interface RepelStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  phase: number;
  freqX: number;
  freqY: number;
  wanderR: number;
  rot: number;
  rotSpeed: number;
  jitterTimer: number;
}

const HEART_COLORS = ['#E85D82', '#F48CA7', '#F7B2C4', '#C07AD9', '#F5A67E', '#FF7597'];
const STAR_COLORS = ['#FBBF24', '#F472B6', '#A78BFA', '#FB923C', '#38BDF8', '#FACC15'];

export const InteractiveSkyEffects: React.FC = () => {
  // Heart explosion state
  const [bigHeartKey, setBigHeartKey] = useState(0);
  const [tinyHearts, setTinyHearts] = useState<TinyHeart[]>([]);

  // Cursor-avoiding starfield state
  const [starsActive, setStarsActive] = useState(false);
  const [starBurstCount, setStarBurstCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const starsRef = useRef<RepelStar[]>([]);

  const triggerHeartExplosion = () => {
    soundEngine.playHeartPop();
    const batchId = Date.now();
    setBigHeartKey(batchId);

    const generated: TinyHeart[] = Array.from({ length: 46 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 46 + (Math.random() - 0.5) * 0.3;
      const dist = 190 + Math.random() * 440;
      return {
        id: batchId + i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 55,
        rotate: (Math.random() - 0.5) * 160,
        scale: 0.75 + Math.random() * 1.15,
        color: HEART_COLORS[i % HEART_COLORS.length],
        duration: 3.4 + Math.random() * 1.8,
      };
    });
    setTinyHearts(generated);

    setTimeout(() => {
      setBigHeartKey((curr) => (curr === batchId ? 0 : curr));
    }, 1500);

    setTimeout(() => {
      setTinyHearts((curr) =>
        curr.length > 0 && curr[0].id >= batchId && curr[0].id < batchId + 60
          ? []
          : curr
      );
    }, 5400);
  };

  const spawnInteractiveStars = () => {
    soundEngine.playStarChime();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const newStars: RepelStar[] = Array.from({ length: 120 }).map((_, idx) => {
      const bx = 28 + Math.random() * (w - 56);
      const by = 28 + Math.random() * (h - 56);
      return {
        x: bx,
        y: by,
        vx: (Math.random() - 0.5) * 35,
        vy: (Math.random() - 0.5) * 35,
        baseX: bx,
        baseY: by,
        size: 7.5 + Math.random() * 7.5,
        color: STAR_COLORS[idx % STAR_COLORS.length],
        phase: Math.random() * Math.PI * 2,
        freqX: 0.35 + Math.random() * 0.85,
        freqY: 0.4 + Math.random() * 0.9,
        wanderR: 35 + Math.random() * 65,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 1.4,
        jitterTimer: Math.random() * 2,
      };
    });
    starsRef.current = newStars;
    setStarsActive(true);
    setStarBurstCount((c) => c + 1);
  };

  useEffect(() => {
    if (!starsActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const drawGlowingStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      outerR: number,
      rot: number,
      color: string,
      alpha: number
    ) => {
      const innerR = outerR * 0.46;
      c.save();
      c.translate(cx, cy);
      c.rotate(rot);
      c.globalAlpha = alpha;
      c.shadowColor = 'rgba(245, 158, 11, 0.35)';
      c.shadowBlur = 8;
      c.fillStyle = color;
      c.strokeStyle = 'rgba(58, 44, 52, 0.72)';
      c.lineWidth = 1.3;
      c.lineJoin = 'round';

      c.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();
      c.shadowBlur = 0;
      c.stroke();

      c.fillStyle = 'rgba(255, 253, 240, 0.75)';
      c.beginPath();
      c.arc(-outerR * 0.14, -outerR * 0.14, outerR * 0.16, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.004, (now - lastTime) / 1000));
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const sec = now * 0.001;

      for (const s of starsRef.current) {
        // Random breeze shifts over time so anchor & motion stay unpredictable
        s.jitterTimer -= dt;
        if (s.jitterTimer <= 0) {
          s.jitterTimer = 1.2 + Math.random() * 2.4;
          s.vx += (Math.random() - 0.5) * 55;
          s.vy += (Math.random() - 0.5) * 55;
          s.baseX = Math.max(40, Math.min(canvas.width - 40, s.baseX + (Math.random() - 0.5) * 70));
          s.baseY = Math.max(40, Math.min(canvas.height - 40, s.baseY + (Math.random() - 0.5) * 70));
        }

        const targetX = s.baseX + Math.sin(sec * s.freqX + s.phase) * s.wanderR;
        const targetY = s.baseY + Math.cos(sec * s.freqY + s.phase * 1.3) * s.wanderR;

        // Gentle spring tether lets stars roam freely and drift back lazily
        const springK = 1.1;
        s.vx += (targetX - s.x) * springK * dt;
        s.vy += (targetY - s.y) * springK * dt;

        // Strong "stay away from me" cursor repulsion with randomized scatter direction
        const dx = s.x - mx;
        const dy = s.y - my;
        const dist = Math.hypot(dx, dy);
        const repelRadius = 240;

        if (dist < repelRadius && dist > 0.5) {
          const t = 1 - dist / repelRadius;
          const push = (t * t * 3800 + t * 900) * dt;
          const nx = dx / dist;
          const ny = dy / dist;
          const swirlSign = s.phase > Math.PI ? 1 : -1;
          s.vx += (nx - ny * 0.42 * swirlSign) * push;
          s.vy += (ny + nx * 0.42 * swirlSign) * push;
        }

        const damp = Math.exp(-3.1 * dt);
        s.vx *= damp;
        s.vy *= damp;

        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.rot += s.rotSpeed * dt;

        if (s.x < 16) {
          s.x = 16;
          s.vx = Math.abs(s.vx) * 0.5;
        }
        if (s.x > canvas.width - 16) {
          s.x = canvas.width - 16;
          s.vx = -Math.abs(s.vx) * 0.5;
        }
        if (s.y < 16) {
          s.y = 16;
          s.vy = Math.abs(s.vy) * 0.5;
        }
        if (s.y > canvas.height - 16) {
          s.y = canvas.height - 16;
          s.vy = -Math.abs(s.vy) * 0.5;
        }

        // Softer unobtrusive opacity (0.40 - 0.58)
        const twinkle = 0.42 + Math.sin(sec * 2.2 + s.phase) * 0.14;
        drawGlowingStar(ctx, s.x, s.y, s.size, s.rot, s.color, twinkle);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [starsActive, starBurstCount]);

  return (
    <>
      {/* Cursor-Avoiding Interactive Starfield Layer */}
      {starsActive && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-[25] pointer-events-none"
        />
      )}

      {/* Much Bigger, Slower Heart -> Gentle Floating Tiny Hearts Layer */}
      <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden">
        <AnimatePresence>
          {bigHeartKey > 0 && (
            <motion.div
              key={bigHeartKey}
              initial={{ scale: 0.2, opacity: 0.95 }}
              animate={{ scale: [0.2, 1.8, 2.5], opacity: [0.95, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
            >
              <Heart className="w-64 h-64 sm:w-80 sm:h-80 text-[#D95D7B] fill-[#F58CA8] drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {tinyHearts.map((th) => (
          <motion.div
            key={th.id}
            initial={{ x: 0, y: 0, scale: 0.25, opacity: 1, rotate: 0 }}
            animate={{
              x: th.dx,
              y: th.dy,
              scale: [0.35, th.scale, th.scale * 0.85],
              opacity: [1, 0.95, 0],
              rotate: th.rotate,
            }}
            transition={{ duration: th.duration, ease: [0.16, 1, 0.3, 1] }}
            className="absolute"
          >
            <Heart
              className="w-10 h-10 drop-shadow-sm"
              style={{ color: th.color, fill: th.color }}
            />
          </motion.div>
        ))}
      </div>

      {/* Top-Left Interactive Heart & Star Charm Dock */}
      <div className="fixed top-4 left-4 z-40 flex flex-col items-start gap-2">
        <div className="flex items-center gap-2.5">
          <motion.button
            type="button"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={triggerHeartExplosion}
            title="Pop a heart explosion!"
            className="w-11 h-11 rounded-full bg-[#FFFDFB]/95 border-2 border-[#F0A8BC] text-[#D95D7B] shadow-md flex items-center justify-center cursor-pointer"
          >
            <Heart className="w-5 h-5 fill-[#F7B8C8]" />
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={spawnInteractiveStars}
            title="Summon cursor-dodging stars!"
            className="w-11 h-11 rounded-full bg-[#FFFDFB]/95 border-2 border-[#EBC67A] text-[#C88928] shadow-md flex items-center justify-center cursor-pointer"
          >
            <Star className="w-5 h-5 fill-[#FCE09B]" />
          </motion.button>
        </div>

        {starsActive && (
          <button
            type="button"
            onClick={() => setStarsActive(false)}
            title="Clear stars"
            className="px-2.5 py-1 rounded-full bg-[#FFFDFB]/95 border border-[#E6D8D4] text-[11px] font-medium text-[#51424B] hover:text-[#352931] shadow-sm inline-flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear Stars</span>
          </button>
        )}
      </div>
    </>
  );
};
