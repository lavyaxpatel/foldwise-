import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { OrigamiSVG } from '../components/OrigamiSVG';
import { useFoldWise } from '../store/useFoldWiseStore';

export const KnowledgeMapPage: React.FC = () => {
  const { state, setSelectedTopicId, setRoute } = useFoldWise();

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-vermilion">
            Unfolding Paper Landscape • {state.studentGrade}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl mt-1">Progress Map</h1>
          <p className="text-charcoal/75 mt-1 max-w-2xl">
            Track your learning journey across connected paper islands. Completed topics show
            finished origami sculptures, active islands show progress, and red crease lines mark
            topics ready for reinforcement.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 text-xs font-mono">
          <span className="px-2.5 py-1 bg-sage/25 border border-sage rounded-sm">Completed</span>
          <span className="px-2.5 py-1 bg-dusty/25 border border-dusty rounded-sm">In Progress</span>
          <span className="px-2.5 py-1 bg-vermilion/15 border border-vermilion rounded-sm">Weak Crease</span>
          <span className="px-2.5 py-1 bg-paper border border-charcoal/20 rounded-sm">Locked Sheet</span>
        </div>
      </div>

      {/* Desktop Landscape Map */}
      <div className="paper-card rounded-sm p-6 relative overflow-hidden min-h-[540px]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
        >
          {state.topics.map((src) =>
            src.connections.map((targetId) => {
              const dst = state.topics.find((t) => t.id === targetId);
              if (!dst) return null;
              return (
                <line
                  key={`${src.id}-${dst.id}`}
                  x1={src.x}
                  y1={src.y}
                  x2={dst.x}
                  y2={dst.y}
                  stroke={src.isWeak || dst.isWeak ? '#C8433A' : '#1E1D1B'}
                  strokeOpacity={src.isWeak ? 0.55 : 0.25}
                  strokeWidth="0.35"
                  strokeDasharray="1.2 1.2"
                />
              );
            })
          )}
        </svg>

        <div className="grid sm:grid-cols-2 gap-4 md:block md:relative md:h-[490px]">
          {state.topics.map((topic) => {
            const locked = topic.status === 'locked';
            const partial = topic.status === 'current';

            return (
              <button
                key={topic.id}
                disabled={locked}
                onClick={() => {
                  setSelectedTopicId(topic.id);
                  setRoute('learn');
                }}
                style={{ left: `${topic.x}%`, top: `${topic.y}%` }}
                className={`md:absolute md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-52 p-3.5 rounded-sm border text-left transition-all ${
                  locked
                    ? 'bg-paper/65 border-charcoal/15 opacity-70 cursor-not-allowed'
                    : topic.isWeak
                    ? 'bg-ivory border-vermilion shadow-paper hover:scale-[1.03]'
                    : topic.status === 'completed'
                    ? 'bg-ivory border-sage shadow-paper hover:scale-[1.03]'
                    : 'bg-ivory border-dusty shadow-paper hover:scale-[1.03]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <OrigamiSVG
                    shape={topic.origamiModel}
                    locked={locked}
                    partial={partial}
                    broken={topic.isWeak}
                    className="w-10 h-10 shrink-0"
                    accent={topic.isWeak ? '#C8433A' : '#B8924A'}
                  />
                  {locked ? (
                    <Lock className="w-4 h-4 text-charcoal/40" />
                  ) : (
                    <span className="text-[11px] font-mono text-charcoal/65">{topic.progress}%</span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="text-[10px] font-mono uppercase text-charcoal/55">
                    {topic.subject}
                  </div>
                  <div className="font-serif font-bold text-sm text-charcoal flex items-center justify-between">
                    <span>{topic.title}</span>
                    {!locked && <ArrowRight className="w-3.5 h-3.5 text-charcoal/40" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
