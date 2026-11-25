import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { getRankForXp } from '../data/curriculum';
import { OrigamiSVG } from '../components/OrigamiSVG';
import { useFoldWise } from '../store/useFoldWiseStore';

export const DashboardPage: React.FC = () => {
  const { state, setRoute, setSelectedTopicId } = useFoldWise();
  const rankInfo = getRankForXp(state.xp);
  const weakTopics = state.topics.filter((t) => t.isWeak);
  const currentTopics = state.topics.filter((t) => t.status === 'current');
  const avgAccuracy =
    state.accuracyHistory.length > 0
      ? Math.round(
          state.accuracyHistory.reduce((a, b) => a + b, 0) / state.accuracyHistory.length
        )
      : null;

  // Evolving origami companion shape based on rank
  const companionShape =
    state.xp >= 2000
      ? 'dragon'
      : state.xp >= 1200
      ? 'star'
      : state.xp >= 650
      ? 'fox'
      : state.xp >= 250
      ? 'butterfly'
      : 'crane';

  const goalPct = Math.min(
    100,
    Math.round((state.dailyMinutesCompleted / state.settings.dailyGoalMinutes) * 100)
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header + Floating Origami Companion */}
      <div className="paper-card rounded-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-widest text-charcoal/55">
            Student Sanctuary • {state.studentGrade} • {rankInfo.current.rank}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Welcome back, {state.studentName}.
          </h1>
          <p className="text-charcoal/75 max-w-xl">
            {state.xp === 0
              ? 'Your flat sheet awaits its first crease. Complete a Bug Hunt or AI Tutor fold to earn your opening XP.'
              : 'Your origami companion evolves as you master concepts. Keep folding to unlock new sculptures and skins.'}
          </p>
        </div>

        <motion.div
          animate={state.settings.reducedMotion ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-4 px-5 py-3 bg-paper/60 border border-charcoal/10 rounded-sm shrink-0"
        >
          <OrigamiSVG shape={companionShape} className="w-16 h-16" accent="#D9534F" />
          <div>
            <div className="text-xs font-mono uppercase text-charcoal/55">Companion</div>
            <div className="font-serif font-semibold text-charcoal capitalize">
              {companionShape} Spirit
            </div>
            <div className="text-xs text-vermilion font-mono">{state.difficulty}</div>
          </div>
        </motion.div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="paper-card rounded-sm p-5">
          <div className="flex items-center justify-between text-xs font-mono text-charcoal/60">
            <span>FOLD XP</span>
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <div className="font-serif text-3xl font-bold mt-2">{state.xp}</div>
          <div className="text-xs text-charcoal/65 mt-1">
            {rankInfo.next
              ? `${rankInfo.next.minXp - state.xp} XP to ${rankInfo.next.rank}`
              : 'Max Rank Achieved'}
          </div>
        </div>

        <div className="paper-card rounded-sm p-5">
          <div className="flex items-center justify-between text-xs font-mono text-charcoal/60">
            <span>DAILY STREAK</span>
            <Flame className="w-4 h-4 text-vermilion" />
          </div>
          <div className="font-serif text-3xl font-bold mt-2">{state.streak} Days</div>
          <div className="text-xs text-charcoal/65 mt-1">Consistent folding builds mastery</div>
        </div>

        <div className="paper-card rounded-sm p-5">
          <div className="flex items-center justify-between text-xs font-mono text-charcoal/60">
            <span>DAILY GOAL</span>
            <Target className="w-4 h-4 text-sage" />
          </div>
          <div className="font-serif text-3xl font-bold mt-2">
            {state.dailyMinutesCompleted}/{state.settings.dailyGoalMinutes}m
          </div>
          <div className="mt-2 h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
            <div className="h-full bg-sage" style={{ width: `${goalPct}%` }} />
          </div>
        </div>

        <div className="paper-card rounded-sm p-5">
          <div className="flex items-center justify-between text-xs font-mono text-charcoal/60">
            <span>ADAPTIVE TIER</span>
            <TrendingUp className="w-4 h-4 text-dusty" />
          </div>
          <div className="font-serif text-2xl font-bold mt-2">{state.difficulty}</div>
          <div className="text-xs text-charcoal/65 mt-1">
            Avg Accuracy: {avgAccuracy !== null ? `${avgAccuracy}%` : '—'}
          </div>
        </div>
      </div>

      {/* Main Grid: Continue Learning + AI Recommendations + Weekly Chart */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Continue Learning */}
          <div className="paper-card rounded-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold">Continue Unfolding</h2>
              <button
                onClick={() => setRoute('map')}
                className="text-xs font-mono text-vermilion hover:underline"
              >
                Open Progress Map →
              </button>
            </div>
            <div className="space-y-3">
              {currentTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-4 bg-paper/45 border border-charcoal/10 rounded-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <OrigamiSVG shape={topic.origamiModel} className="w-12 h-12 shrink-0" accent="#8FAEC5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-charcoal">{topic.title}</span>
                        {topic.isWeak && (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-vermilion/15 text-vermilion rounded-sm">
                            Red Crease
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-charcoal/65 mt-0.5">
                        {topic.subject} • {topic.progress}% folded
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTopicId(topic.id);
                      setRoute('learn');
                    }}
                    className="px-3.5 py-2 bg-charcoal text-ivory text-xs font-medium rounded-sm hover:bg-vermilion transition-colors shrink-0"
                  >
                    Resume
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Learning Activity */}
          <div className="paper-card rounded-sm p-6">
            <h2 className="font-serif text-2xl font-bold mb-1">Weekly Folding Activity</h2>
            <p className="text-xs text-charcoal/65 mb-5">Minutes spent & folds completed this week</p>
            <div className="grid grid-cols-7 gap-3 items-end h-40 pt-4">
              {state.weeklyActivity.map((day) => {
                const barH = day.minutes === 0 ? 8 : Math.max(16, Math.min(100, (day.minutes / 45) * 100));
                return (
                  <div key={day.day} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[10px] font-mono text-charcoal/60">{day.minutes}m</span>
                    <div
                      className={`w-full max-w-[36px] rounded-t-sm transition-all ${
                        day.minutes === 0
                          ? 'bg-paper/70 border border-dashed border-charcoal/20'
                          : 'bg-dusty/80 border border-charcoal/15'
                      }`}
                      style={{ height: `${barH}%` }}
                      title={`${day.day}: ${day.minutes} mins, ${day.folds} folds`}
                    />
                    <span className="text-xs font-mono text-charcoal/75">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Personalized AI Recommendation */}
          <div className="paper-card rounded-sm p-6 border-l-4 border-l-vermilion">
            <div className="text-xs font-mono uppercase tracking-wider text-vermilion">
              Personalised AI Recommendation
            </div>
            <h3 className="font-serif text-xl font-bold mt-1">
              {weakTopics[0]
                ? `Repair your ${weakTopics[0].title} crease`
                : 'Earn your first +75 Fold XP'}
            </h3>
            <p className="text-sm text-charcoal/75 mt-2 leading-relaxed">
              {weakTopics[0] ? (
                <>
                  Your recent accuracy dipped slightly on boundary & sign transitions. Try one{' '}
                  <strong>Bug Hunt — Broken Fold</strong> round to sharpen careful inspection.
                </>
              ) : (
                <>
                  Start with a quick <strong>Bug Hunt — Broken Fold</strong> round or ask the{' '}
                  <strong>AI Tutor</strong> to unfold your first concept.
                </>
              )}
            </p>
            <button
              onClick={() => setRoute('arena')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-vermilion text-ivory text-sm font-medium rounded-sm hover:bg-charcoal transition-colors"
            >
              Launch Bug Hunt <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Daily Challenges / Missions */}
          <div className="paper-card rounded-sm p-6">
            <h3 className="font-serif text-xl font-bold mb-3">Daily Missions</h3>
            <div className="space-y-3">
              {state.missions.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-paper/45 border border-charcoal/10 rounded-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${m.completed ? 'text-sage' : 'text-charcoal/25'}`}
                    />
                    <div>
                      <div className={`text-sm ${m.completed ? 'line-through text-charcoal/50' : ''}`}>
                        {m.title}
                      </div>
                      <div className="text-[11px] font-mono text-charcoal/55">
                        {m.progress}/{m.target} • +{m.xp} XP
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Mastery Overview */}
          <div className="paper-card rounded-sm p-6">
            <h3 className="font-serif text-xl font-bold mb-3">Subject Mastery</h3>
            <div className="space-y-3">
              {state.topics.slice(0, 5).map((t) => (
                <div key={t.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{t.subject}</span>
                    <span className="font-mono text-charcoal/65">{t.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${t.isWeak ? 'bg-vermilion' : 'bg-gold'}`}
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
