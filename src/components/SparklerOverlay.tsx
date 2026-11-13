import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { soundEngine } from '../utils/soundEngine';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const SPARK_COLORS = ['#FFF9DC', '#FFD166', '#FFA630', '#FF8FB1', '#BDF0FF', '#FFFFFF'];

export const SparklerOverlay: React.FC = () => {
  const [lit, setLit] = useState(false);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({
    x: 400,
    y: 300,
  });

  const cornerCanvasRef = useRef<HTMLCanvasElement>(null);
  const fullCanvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<{ x: number; y: number }>({ x: 400, y: 300 });

  const openFullscreenSparkler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const startX = e.clientX || window.innerWidth * 0.5;
    const startY = e.clientY || window.innerHeight * 0.5;
    tipRef.current = { x: startX, y: startY };
    setPointerPos({ x: startX, y: startY });
    soundEngine.ensureSparklerRunning('foreground');
    soundEngine.setSparklerMode('foreground');
    setLit(true);
  };

  const minimizeToCorner = () => {
    soundEngine.setSparklerMode('background');
    setLit(false);
  };

  // Start corner sparkler ambient audio gently on first interaction (never completely unlit)
  useEffect(() => {
    soundEngine.ensureSparklerRunning('background');

    const ensureBackgroundSparkler = () => {
      soundEngine.resumeAudioIfNeeded();
      soundEngine.ensureSparklerRunning(lit ? 'foreground' : 'background');
    };

    window.addEventListener('pointerdown', ensureBackgroundSparkler, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', ensureBackgroundSparkler);
    };
  }, [lit]);

  useEffect(() => {
    return () => {
      soundEngine.stopSparklerLoop();
    };
  }, []);

  // Return to corner on ANY key press (keep running softly in corner)
  useEffect(() => {
    if (!lit) return;
    const onKeyDown = () => {
      soundEngine.setSparklerMode('background');
      setLit(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lit]);

  // Continuous Ambient Corner Sparkler Fountain (!lit)
  useEffect(() => {
    if (lit) return;

    const canvas = cornerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 220;
    canvas.height = 220;

    // Wand tip inside 220x220 overlay positioned bottom-0 left-0 matches SVG tip
    const tipX = 136;
    const tipY = 84;
    const sparks: Spark[] = [];
    let rafId = 0;

    const tick = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pulse = 1 + Math.sin(now * 0.02) * 0.1;
      const glow = ctx.createRadialGradient(tipX, tipY, 2, tipX, tipY, 68 * pulse);
      glow.addColorStop(0, 'rgba(255, 240, 175, 0.72)');
      glow.addColorStop(0.35, 'rgba(255, 180, 95, 0.30)');
      glow.addColorStop(1, 'rgba(255, 180, 95, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gentle steady sparkle emitter
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 4.2;
        sparks.push({
          x: tipX,
          y: tipY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 16 + Math.random() * 18,
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
          size: 1.4 + Math.random() * 1.8,
        });
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 1;
        const px = s.x;
        const py = s.y;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.11;
        s.vx *= 0.96;

        const alpha = Math.max(0, 1 - s.life / s.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.restore();

        if (s.life >= s.maxLife) sparks.splice(i, 1);
      }

      ctx.save();
      ctx.fillStyle = '#FFFDF5';
      ctx.beginPath();
      ctx.arc(tipX, tipY, 4.6 + Math.sin(now * 0.03) * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [lit]);

  // Continuous Pointer-Tracking Big Sparkler Fountain in 80% Black Mode (lit)
  useEffect(() => {
    if (!lit) return;

    const canvas = fullCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onPointerMove = (e: PointerEvent) => {
      tipRef.current = { x: e.clientX, y: e.clientY };
      setPointerPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('pointermove', onPointerMove);

    const sparks: Spark[] = [];
    let rafId = 0;

    const tick = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const tipX = tipRef.current.x;
      const tipY = tipRef.current.y;

      const pulse = 1 + Math.sin(now * 0.018) * 0.09;
      const glow = ctx.createRadialGradient(tipX, tipY, 6, tipX, tipY, 390 * pulse);
      glow.addColorStop(0, 'rgba(255, 240, 185, 0.85)');
      glow.addColorStop(0.22, 'rgba(255, 182, 108, 0.42)');
      glow.addColorStop(0.55, 'rgba(242, 122, 174, 0.14)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 10.5;
        sparks.push({
          x: tipX,
          y: tipY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 20 + Math.random() * 28,
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
          size: 2.2 + Math.random() * 3.0,
        });
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 1;
        const prevX = s.x;
        const prevY = s.y;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.18;
        s.vx *= 0.962;

        const alpha = Math.max(0, 1 - s.life / s.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        if (s.size > 3.6 && alpha > 0.45) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
        }
      }

      ctx.save();
      ctx.fillStyle = '#FFFDF7';
      ctx.beginPath();
      ctx.arc(tipX, tipY, 9.5 + Math.sin(now * 0.032) * 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [lit]);

  return (
    <>
      {/* 80% Black Forefront Sparkler Mode */}
      <AnimatePresence>
        {lit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={minimizeToCorner}
            className="fixed inset-0 z-50 bg-black/80 cursor-none overflow-hidden select-none"
          >
            <canvas ref={fullCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            <svg
              viewBox="0 0 150 150"
              style={{
                left: `${pointerPos.x}px`,
                top: `${pointerPos.y}px`,
              }}
              className="fixed w-36 h-36 -translate-x-[128px] -translate-y-[22px] pointer-events-none drop-shadow-xl"
              aria-hidden="true"
            >
              <line x1="12" y1="138" x2="82" y2="68" stroke="#D4D8DF" strokeWidth="4" strokeLinecap="round" />
              <line x1="76" y1="74" x2="126" y2="24" stroke="#6D6169" strokeWidth="12" strokeLinecap="round" />
              <line
                x1="78"
                y1="72"
                x2="124"
                y2="26"
                stroke="#433940"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="3.5 4.5"
              />
              <circle cx="128" cy="22" r="7.5" fill="#FFD166" />
              <circle cx="128" cy="22" r="3.6" fill="#FFFDF5" />
            </svg>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xs text-white text-xs sm:text-sm font-medium tracking-wide pointer-events-none whitespace-nowrap">
              Wave the sparkler around · Click or press any key to return to corner
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-Lit Continuous Sparkler Living in the Bottom-Left Corner */}
      {!lit && (
        <div className="fixed bottom-0 left-0 z-40 w-[220px] h-[220px] pointer-events-none">
          <canvas
            ref={cornerCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          <motion.button
            type="button"
            onClick={openFullscreenSparkler}
            whileHover={{ scale: 1.05, x: 4, y: -4 }}
            whileTap={{ scale: 0.96 }}
            title="Bring sparkler to forefront!"
            aria-label="Bring sparkler to forefront"
            className="absolute bottom-0 left-0 w-[170px] h-[170px] p-0 bg-transparent border-0 cursor-pointer pointer-events-auto focus-visible:outline-none"
          >
            <svg viewBox="0 0 170 170" className="w-full h-full drop-shadow-md" aria-hidden="true">
              {/* Wire rooted directly at bottom-left corner (0, 170) -> tip matches (136, 34) in SVG which equals (136, 84) in 220x220 canvas */}
              <line
                x1="0"
                y1="170"
                x2="78"
                y2="92"
                stroke="#5E525A"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
              <line
                x1="0"
                y1="170"
                x2="78"
                y2="92"
                stroke="#BEB7BC"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                x1="72"
                y1="98"
                x2="134"
                y2="36"
                stroke="#352931"
                strokeWidth="12.5"
                strokeLinecap="round"
              />
              <line
                x1="75"
                y1="95"
                x2="131"
                y2="39"
                stroke="#6C5D66"
                strokeWidth="7.5"
                strokeLinecap="round"
                strokeDasharray="3 4"
              />
              <circle cx="136" cy="34" r="6" fill="#FFD166" />
              <circle cx="136" cy="34" r="3" fill="#FFFDF7" />
            </svg>
          </motion.button>
        </div>
      )}
    </>
  );
};
