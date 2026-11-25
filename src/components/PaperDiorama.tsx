import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Pause, Play, Rotate3d } from 'lucide-react';

const FOLD_STAGES = [
  {
    id: 0,
    code: '01',
    title: 'Flat Washi Sheet',
    caption: 'Raw complexity before the first crease.',
  },
  {
    id: 1,
    code: '02',
    title: 'Diagonal & Valley Crease',
    caption: 'Isolate the core symmetry and invariant.',
  },
  {
    id: 2,
    code: '03',
    title: 'Preliminary Bird Base',
    caption: 'Collapse details into clean structural folds.',
  },
  {
    id: 3,
    code: '04',
    title: 'Tsuru — Mastery in Flight',
    caption: 'Simple, balanced, and unforgettable.',
  },
];

export const PaperDiorama: React.FC<{ reducedMotion?: boolean }> = ({
  reducedMotion = false,
}) => {
  const [stage, setStage] = useState(3);
  const [autoPlay, setAutoPlay] = useState(false);
  const [rot, setRot] = useState({ x: 8, y: -16 });
  const draggingRef = useRef<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 0,
    y: 0,
  });

  // Gentle idle 3D orbit when not dragging
  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      if (!draggingRef.current.active) {
        const t = (now - start) / 1000;
        setRot({
          x: 7 + Math.sin(t * 0.9) * 6,
          y: Math.sin(t * 0.65) * 22,
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  // Optional auto-fold cycle across stages 01 -> 04
  useEffect(() => {
    if (!autoPlay || reducedMotion) return;
    const timer = setInterval(() => {
      setStage((s) => (s + 1) % FOLD_STAGES.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [autoPlay, reducedMotion]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = { active: true, x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current.active || reducedMotion) return;
    const dx = e.clientX - draggingRef.current.x;
    const dy = e.clientY - draggingRef.current.y;
    draggingRef.current = { active: true, x: e.clientX, y: e.clientY };
    setRot((prev) => ({
      x: Math.max(-32, Math.min(32, prev.x - dy * 0.35)),
      y: Math.max(-48, Math.min(48, prev.y + dx * 0.45)),
    }));
  };

  const onPointerUp = () => {
    draggingRef.current.active = false;
  };

  return (
    <div className="paper-card rounded-sm p-6 md:p-7 relative overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="text-[11px] font-mono uppercase tracking-widest text-charcoal/60 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-vermilion" />
          3D Origami Crease Studio
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-charcoal/55 hidden sm:inline-flex items-center gap-1">
            <Rotate3d className="w-3 h-3 text-gold" /> Drag to rotate
          </span>
          <button
            type="button"
            onClick={() => setAutoPlay((a) => !a)}
            className="px-2 py-1 text-[10px] font-mono bg-paper/75 border border-charcoal/15 rounded-sm hover:bg-charcoal hover:text-ivory inline-flex items-center gap-1 transition-colors"
          >
            {autoPlay ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
            {autoPlay ? 'Pause' : 'Auto Fold'}
          </button>
        </div>
      </div>

      {/* True Layered 3D Stage */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative h-72 sm:h-80 rounded-sm bg-paper/45 border border-charcoal/10 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: '1050px' }}
      >
        {/* Subtle Drafting Rings */}
        <svg
          viewBox="0 0 320 260"
          className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
          aria-hidden="true"
        >
          <circle cx="160" cy="130" r="98" fill="none" stroke="#B8924A" strokeWidth="0.9" strokeDasharray="3 4" />
          <circle cx="160" cy="130" r="64" fill="none" stroke="#1E1D1B" strokeWidth="0.6" strokeOpacity="0.25" />
          <line x1="20" y1="130" x2="300" y2="130" stroke="#1E1D1B" strokeOpacity="0.12" strokeWidth="0.7" />
          <line x1="160" y1="16" x2="160" y2="244" stroke="#1E1D1B" strokeOpacity="0.12" strokeWidth="0.7" />
        </svg>

        {/* 3D Transform Container */}
        <div
          className="relative w-64 h-56 flex items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: reducedMotion
              ? undefined
              : `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          }}
        >
          {/* Ground Shadow Plane (Z = -40px) */}
          <div
            className="absolute bottom-2 w-36 h-4 rounded-full bg-charcoal/15 blur-[3px] pointer-events-none"
            style={{ transform: 'translateZ(-40px) rotateX(75deg)' }}
          />

          {/* Stage 0: 3D Hinged Flat Washi Sheet */}
          {stage === 0 && (
            <motion.div
              key="stage-0"
              initial={reducedMotion ? false : { opacity: 0, rotateX: -45, scale: 0.9 }}
              animate={{ opacity: 1, rotateX: 0, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="w-44 h-44 bg-ivory border-2 border-charcoal shadow-folded flex items-center justify-center relative"
              style={{ transform: 'translateZ(18px)' }}
            >
              <svg viewBox="0 0 180 180" className="w-full h-full">
                <line x1="0" y1="0" x2="180" y2="180" stroke="#C8433A" strokeWidth="1.4" strokeDasharray="6 4" opacity="0.55" />
                <line x1="180" y1="0" x2="0" y2="180" stroke="#5D819E" strokeWidth="1.4" strokeDasharray="6 4" opacity="0.55" />
                <text x="90" y="94" textAnchor="middle" fill="#1E1D1B" fillOpacity="0.6" fontSize="11" fontFamily="IBM Plex Mono">
                  15 × 15 cm Washi
                </text>
              </svg>
            </motion.div>
          )}

          {/* Stage 1: 3D Hinged Valley Crease */}
          {stage === 1 && (
            <motion.div
              key="stage-1"
              initial={reducedMotion ? false : { opacity: 0, rotateY: -40 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.45 }}
              className="relative w-56 h-48 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <svg
                viewBox="0 0 240 220"
                className="w-56 h-52 drop-shadow-xl"
                style={{ transform: 'translateZ(12px)' }}
              >
                <polygon points="36,182 120,28 120,145" fill="#F8F4EC" stroke="#1E1D1B" strokeWidth="2" strokeLinejoin="round" />
                <polygon points="120,28 204,182 120,145" fill="#EAE2D3" stroke="#1E1D1B" strokeWidth="2" strokeLinejoin="round" />
                <line x1="120" y1="28" x2="120" y2="145" stroke="#C8433A" strokeWidth="1.8" strokeDasharray="6 3 2 3" />
              </svg>
            </motion.div>
          )}

          {/* Stage 2: 3D Layered Bird Base */}
          {stage === 2 && (
            <motion.div
              key="stage-2"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.85, rotateX: 25 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.45 }}
              className="relative w-56 h-52 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <svg
                viewBox="0 0 240 220"
                className="w-56 h-52 drop-shadow-xl"
                style={{ transform: 'translateZ(8px)' }}
              >
                <polygon points="120,22 178,108 120,192 62,108" fill="#F8F4EC" stroke="#1E1D1B" strokeWidth="2" strokeLinejoin="round" />
                <polygon points="62,108 120,108 90,196" fill="#EAE2D3" stroke="#1E1D1B" strokeWidth="1.8" strokeLinejoin="round" />
                <polygon points="178,108 120,108 150,196" fill="#EAE2D3" stroke="#1E1D1B" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              <svg
                viewBox="0 0 240 220"
                className="w-56 h-52 absolute inset-0 drop-shadow-md pointer-events-none"
                style={{ transform: 'translateZ(26px)' }}
              >
                <polygon points="120,22 178,108 120,108" fill="#C8433A" fillOpacity="0.9" stroke="#1E1D1B" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </motion.div>
          )}

          {/* Stage 3: Multi-Depth Animated 3D Origami Crane */}
          {stage === 3 && (
            <motion.div
              key="stage-3"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.88 }}
              animate={
                reducedMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 1, scale: 1, y: [0, -8, 0] }
              }
              transition={{
                y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.35 },
              }}
              className="relative w-64 h-56"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Layer 1: Far Wing (Z = -26px, independently animated flap) */}
              <motion.svg
                viewBox="0 0 260 220"
                className="w-full h-full absolute inset-0 pointer-events-none"
                style={{
                  transform: 'translateZ(-26px)',
                  transformOrigin: '115px 110px',
                }}
                animate={
                  reducedMotion
                    ? undefined
                    : { rotateX: [0, 18, 0], rotateZ: [0, -5, 0] }
                }
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <polygon
                  points="118,106 48,40 92,118"
                  fill="#EAE2D3"
                  stroke="#1E1D1B"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </motion.svg>

              {/* Layer 2: Indigo Tail (Z = -10px) */}
              <svg
                viewBox="0 0 260 220"
                className="w-full h-full absolute inset-0 pointer-events-none"
                style={{ transform: 'translateZ(-10px)' }}
              >
                <polygon
                  points="82,126 34,64 68,142"
                  fill="#5D819E"
                  stroke="#1E1D1B"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Layer 3: Central Body & Gold Accent Fold (Z = +4px) */}
              <svg
                viewBox="0 0 260 220"
                className="w-full h-full absolute inset-0 pointer-events-none drop-shadow-md"
                style={{ transform: 'translateZ(4px)' }}
              >
                <polygon
                  points="82,126 122,94 166,124 124,158"
                  fill="#F8F4EC"
                  stroke="#1E1D1B"
                  strokeWidth="2.1"
                  strokeLinejoin="round"
                />
                <polygon
                  points="122,94 154,118 124,158"
                  fill="#B8924A"
                  fillOpacity="0.55"
                  stroke="#1E1D1B"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <line
                  x1="122"
                  y1="94"
                  x2="124"
                  y2="158"
                  stroke="#1E1D1B"
                  strokeOpacity="0.45"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              </svg>

              {/* Layer 4: Neck, Head & Golden Beak (Z = +18px) */}
              <motion.svg
                viewBox="0 0 260 220"
                className="w-full h-full absolute inset-0 pointer-events-none"
                style={{
                  transform: 'translateZ(18px)',
                  transformOrigin: '170px 124px',
                }}
                animate={reducedMotion ? undefined : { rotateZ: [0, 3.5, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <polygon
                  points="162,122 204,50 178,128"
                  fill="#F8F4EC"
                  stroke="#1E1D1B"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <polygon
                  points="204,50 230,66 202,70"
                  fill="#B8924A"
                  stroke="#1E1D1B"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </motion.svg>

              {/* Layer 5: Near Vermilion Wing (Z = +32px, independently animated 3D flap) */}
              <motion.svg
                viewBox="0 0 260 220"
                className="w-full h-full absolute inset-0 pointer-events-none drop-shadow-lg"
                style={{
                  transform: 'translateZ(32px)',
                  transformOrigin: '138px 110px',
                }}
                animate={
                  reducedMotion
                    ? undefined
                    : { rotateX: [0, -22, 0], rotateZ: [0, 4.5, 0] }
                }
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <polygon
                  points="122,94 190,26 154,118"
                  fill="#C8433A"
                  stroke="#1E1D1B"
                  strokeWidth="2.1"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </motion.div>
          )}
        </div>
      </div>

      {/* Interactive Fold Stage Selector */}
      <div className="mt-4 space-y-2.5">
        <div className="grid grid-cols-4 gap-1.5">
          {FOLD_STAGES.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setAutoPlay(false);
                setStage(f.id);
              }}
              className={`py-1.5 px-2 rounded-sm border text-center transition-all ${
                stage === f.id
                  ? 'bg-charcoal text-ivory border-charcoal'
                  : 'bg-paper/60 text-charcoal/70 border-charcoal/15 hover:bg-paper'
              }`}
            >
              <div className="font-mono text-[10px] opacity-75">{f.code}</div>
              <div className="text-[11px] font-medium truncate">
                {f.id === 0 ? 'Sheet' : f.id === 1 ? 'Crease' : f.id === 2 ? 'Base' : 'Crane'}
              </div>
            </button>
          ))}
        </div>

        <div className="crease-divider" />

        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-serif font-semibold text-charcoal">
            {FOLD_STAGES[stage].title}
          </span>
          <span className="font-mono text-[11px] text-charcoal/60 text-right">
            {FOLD_STAGES[stage].caption}
          </span>
        </div>
      </div>
    </div>
  );
};
