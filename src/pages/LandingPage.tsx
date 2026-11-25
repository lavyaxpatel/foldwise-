import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Compass, Layers, Sparkles, Swords } from 'lucide-react';
import { PaperDiorama } from '../components/PaperDiorama';
import { OrigamiSVG } from '../components/OrigamiSVG';
import { useFoldWise } from '../store/useFoldWiseStore';

export const LandingPage: React.FC = () => {
  const { setRoute, state } = useFoldWise();
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollSectionRef,
    offset: ['start end', 'end start'],
  });

  const foldProgress = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);
  const leftFlapRotate = useTransform(foldProgress, [0, 1], [0, 36]);
  const rightFlapRotate = useTransform(foldProgress, [0, 1], [0, -36]);
  const sculptureScale = useTransform(foldProgress, [0.3, 0.9], [0.8, 1.06]);
  const butterflyY = useTransform(scrollYProgress, [0, 1], [24, -40]);

  return (
    <div className="min-h-screen washi-surface overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-8 pb-16 lg:pt-14 lg:pb-24">
        <motion.div
          style={{ y: state.settings.reducedMotion ? 0 : butterflyY }}
          className="hidden md:block absolute top-10 right-8 opacity-75 pointer-events-none"
          animate={state.settings.reducedMotion ? undefined : { y: [0, -9, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <OrigamiSVG shape="butterfly" className="w-14 h-14" accent="#ACA0C6" />
        </motion.div>

        <motion.div
          className="hidden md:block absolute bottom-10 left-4 opacity-60 pointer-events-none"
          animate={state.settings.reducedMotion ? undefined : { y: [0, 9, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <OrigamiSVG shape="star" className="w-12 h-12" accent="#B8924A" />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-sm bg-paper/80 border border-charcoal/15 text-xs font-mono uppercase tracking-wider text-charcoal/85">
              <Sparkles className="w-3.5 h-3.5 text-vermilion" />
              FoldWise • {state.studentGrade} • {state.xp} Fold XP
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-[5.25rem] font-normal tracking-tight text-charcoal leading-[0.98]">
              Knowledge,
              <br />
              <span className="italic text-vermilion">Unfolded.</span>
            </h1>

            <p className="text-base sm:text-lg text-charcoal/75 max-w-xl leading-relaxed">
              Welcome, <strong>{state.studentName}</strong>. Every lesson, Bug Hunt puzzle, and
              AI explanation is tailored for <strong>{state.studentGrade}</strong> — one crisp fold
              at a time.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-1">
              <button
                onClick={() => setRoute('dashboard')}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-charcoal text-ivory font-medium rounded-sm shadow-paper hover:bg-vermilion transition-colors"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setRoute('arena')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-ivory border border-charcoal/25 text-charcoal font-medium rounded-sm hover:bg-paper/70 transition-colors"
              >
                Explore Arena
              </button>
            </div>

            {/* Quick Mode Strip */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl border-t border-charcoal/10">
              <button
                onClick={() => setRoute('tutor')}
                className="p-3 text-left rounded-sm bg-paper/60 border border-charcoal/10 hover:border-charcoal/35 transition-colors"
              >
                <div className="font-serif text-base font-bold text-charcoal">AI Tutor</div>
                <div className="text-[11px] text-charcoal/65">Step-by-step folds</div>
              </button>
              <button
                onClick={() => setRoute('arena')}
                className="p-3 text-left rounded-sm bg-paper/60 border border-charcoal/10 hover:border-vermilion/55 transition-colors"
              >
                <div className="font-serif text-base font-bold text-vermilion">Bug Hunt</div>
                <div className="text-[11px] text-charcoal/65">7 Arena challenges</div>
              </button>
              <button
                onClick={() => setRoute('map')}
                className="p-3 text-left rounded-sm bg-paper/60 border border-charcoal/10 hover:border-charcoal/35 transition-colors"
              >
                <div className="font-serif text-base font-bold text-charcoal">Progress Map</div>
                <div className="text-[11px] text-charcoal/65">Visual skill tree</div>
              </button>
              <button
                onClick={() => setRoute('learn')}
                className="p-3 text-left rounded-sm bg-paper/60 border border-charcoal/10 hover:border-charcoal/35 transition-colors"
              >
                <div className="font-serif text-base font-bold text-charcoal">Guided Learn</div>
                <div className="text-[11px] text-charcoal/65">3-stage hints</div>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <PaperDiorama reducedMotion={state.settings.reducedMotion} />
          </div>
        </div>
      </section>

      {/* Scroll-Triggered Flat Sheet to Origami Transformation */}
      <section ref={scrollSectionRef} className="max-w-6xl mx-auto px-5 sm:px-6 py-12">
        <div className="paper-card rounded-sm p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-vermilion">
                Scroll-Triggered Transformation
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-charcoal leading-tight">
                From an intimidating flat sheet to crisp intuition.
              </h2>
              <p className="text-charcoal/75 leading-relaxed">
                Instead of walls of textbook prose, FoldWise breaks every explanation into sequential
                creases. Spot hidden mistakes in <strong>Bug Hunt — Broken Fold</strong>, defend your
                logic in <strong>Deep Fold</strong>, and track mastery across your{' '}
                <strong>Progress Map</strong>.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setRoute('tutor')}
                  className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 bg-paper border border-charcoal/15 rounded-sm hover:bg-charcoal hover:text-ivory transition-colors"
                >
                  <Layers className="w-4 h-4" /> Try AI Tutor Folds
                </button>
                <button
                  onClick={() => setRoute('map')}
                  className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 bg-paper border border-charcoal/15 rounded-sm hover:bg-charcoal hover:text-ivory transition-colors"
                >
                  <Compass className="w-4 h-4" /> View Progress Map
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-8 bg-paper/45 border border-charcoal/10 rounded-sm relative overflow-hidden">
              <div className="flex items-center gap-6">
                <motion.div
                  style={
                    state.settings.reducedMotion
                      ? undefined
                      : { rotateY: leftFlapRotate, rotateZ: -6 }
                  }
                  className="w-24 h-24 bg-ivory border border-charcoal/20 shadow-paper flex items-center justify-center"
                >
                  <span className="font-mono text-[11px] text-charcoal/60">Flat Sheet</span>
                </motion.div>
                <ArrowRight className="w-5 h-5 text-gold" />
                <motion.div
                  style={
                    state.settings.reducedMotion
                      ? undefined
                      : { scale: sculptureScale, rotateZ: rightFlapRotate }
                  }
                  className="p-4 bg-ivory/90 border border-charcoal/15 rounded-sm shadow-folded"
                >
                  <OrigamiSVG shape="dragon" className="w-24 h-24" accent="#B8924A" />
                </motion.div>
              </div>
              <p className="text-xs font-mono text-charcoal/55 mt-4">
                Scroll to watch the sheet crease into form
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Sequential AI Folds',
              body: `Unfolding paper cards explain concepts tailored for ${state.studentGrade} with 7 Socratic quick actions.`,
              shape: 'fox' as const,
              accent: '#C8433A',
              action: () => setRoute('tutor'),
              cta: 'Open AI Tutor',
            },
            {
              title: 'Bug Hunt — Broken Fold',
              body: `Grade-matched solved problems with 1 hidden flaw. Spot the error and repair the folded sculpture.`,
              shape: 'magnifier' as const,
              accent: '#5D819E',
              action: () => setRoute('arena'),
              cta: 'Enter Arena',
            },
            {
              title: 'Interactive Progress Map',
              body: 'Visual paper-island journey showing mastered sculptures, active folds, and red weak-crease alerts.',
              shape: 'star' as const,
              accent: '#B8924A',
              action: () => setRoute('map'),
              cta: 'Open Progress Map',
            },
          ].map((pillar) => (
            <div key={pillar.title} className="paper-card rounded-sm p-6 flex flex-col justify-between">
              <div>
                <OrigamiSVG shape={pillar.shape} accent={pillar.accent} className="w-14 h-14 mb-4" />
                <h3 className="font-serif text-xl font-bold text-charcoal">{pillar.title}</h3>
                <p className="text-sm text-charcoal/75 mt-2 leading-relaxed">{pillar.body}</p>
              </div>
              <button
                onClick={pillar.action}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-vermilion hover:underline"
              >
                {pillar.cta} <Swords className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
