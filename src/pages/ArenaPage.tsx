import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { OrigamiSVG } from '../components/OrigamiSVG';
import { gradeToBand } from '../data/curriculum';
import {
  BOSS_TRIALS,
  DEEP_FOLD_PROMPTS,
  DETECTIVE_CASES,
  EXAM_ITEMS,
  filterByBand,
  SPEED_QUESTIONS,
  TRUTH_CLAIMS,
} from '../data/arenaQuestions';
import { fetchBugHuntProblem, submitReasoningEvaluation } from '../services/aiClient';
import { useFoldWise } from '../store/useFoldWiseStore';
import type {
  ArenaModeId,
  BugHuntProblem,
  GradeBand,
  GradeLevel,
  OrigamiShapeId,
  ReasoningEvaluation,
} from '../types/foldwise';

interface ArenaCardMeta {
  id: ArenaModeId;
  title: string;
  subtitle: string;
  description: string;
  shape: OrigamiShapeId;
  accent: string;
  xpReward: number;
}

const ARENA_MODES: ArenaCardMeta[] = [
  {
    id: 'bug-hunt',
    title: 'Bug Hunt',
    subtitle: 'Broken Fold',
    description: 'Spot the single hidden mistake inside a solved problem matched to your grade.',
    shape: 'crane',
    accent: '#C8433A',
    xpReward: 75,
  },
  {
    id: 'speed-hunt',
    title: 'Speed Hunt',
    subtitle: 'Swift Fold',
    description: 'Beat the sandglass across rapid conceptual challenges for your grade.',
    shape: 'hummingbird',
    accent: '#5D819E',
    xpReward: 65,
  },
  {
    id: 'truth-or-trap',
    title: 'Truth or Trap',
    subtitle: 'Hidden Crease',
    description: 'Flip the paper mask to expose misconceptions and false statements.',
    shape: 'mask',
    accent: '#ACA0C6',
    xpReward: 55,
  },
  {
    id: 'boss-battle',
    title: 'Boss Battle',
    subtitle: 'Grand Fold',
    description: 'Conquer a multi-concept Boss Trial matched to your academic level.',
    shape: 'dragon',
    accent: '#B8924A',
    xpReward: 150,
  },
  {
    id: 'code-detective',
    title: 'Code Detective',
    subtitle: 'Paper Trails',
    description: 'Inspect interactive paper evidence cards to trace a hidden logic defect.',
    shape: 'magnifier',
    accent: '#7F967B',
    xpReward: 70,
  },
  {
    id: 'exam-mode',
    title: 'Exam Mode',
    subtitle: 'Silent Fold',
    description: 'Focused timed exam tailored to your grade. AI hints are disabled.',
    shape: 'pagoda',
    accent: '#1E1D1B',
    xpReward: 110,
  },
  {
    id: 'deep-fold',
    title: 'Explain Your Reasoning',
    subtitle: 'Deep Fold',
    description: 'Write why an answer works and let AI grade your conceptual depth.',
    shape: 'star',
    accent: '#C8433A',
    xpReward: 85,
  },
];

export const ArenaPage: React.FC = () => {
  const { state, recordChallengeWin, setExamBestScore } = useFoldWise();
  const [activeMode, setActiveMode] = useState<ArenaModeId | null>(null);
  const band = gradeToBand(state.studentGrade);

  if (!activeMode) {
    return (
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 space-y-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-vermilion">
            Gamified Learning Arena • {state.studentGrade}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl mt-1">Choose Your Fold Challenge</h1>
          <p className="text-charcoal/75 mt-2 max-w-2xl">
            Every challenge adapts to <strong>{state.studentGrade}</strong> — from spotting hidden
            flaws in Bug Hunt to defending first-principles reasoning.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARENA_MODES.map((m) => (
            <motion.button
              key={m.id}
              whileHover={state.settings.reducedMotion ? undefined : { y: -4 }}
              onClick={() => setActiveMode(m.id)}
              className="paper-card rounded-sm p-6 text-left flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <OrigamiSVG
                    shape={m.shape}
                    accent={m.accent}
                    broken={m.id === 'bug-hunt'}
                    className="w-16 h-16 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xs font-mono px-2.5 py-1 bg-paper/80 rounded-sm">
                    +{m.xpReward} XP
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-charcoal/55">
                    {m.subtitle}
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">{m.title}</h2>
                  <p className="text-sm text-charcoal/75 mt-2 leading-relaxed">{m.description}</p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-charcoal/10 flex items-center justify-between text-xs font-mono text-charcoal/65">
                <span>Completed: {state.challengesCompleted[m.id] || 0}</span>
                <span className="text-vermilion font-semibold">Enter →</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-8 space-y-6">
      <button
        onClick={() => setActiveMode(null)}
        className="inline-flex items-center gap-2 text-sm font-medium text-charcoal/75 hover:text-charcoal"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Arena Selection
      </button>

      {activeMode === 'bug-hunt' && (
        <BugHuntView
          grade={state.studentGrade}
          difficulty={state.difficulty}
          reducedMotion={state.settings.reducedMotion}
          onWin={(xp, acc) => recordChallengeWin('bug-hunt', xp, acc, 'math-quadratics')}
        />
      )}

      {activeMode === 'speed-hunt' && (
        <SpeedHuntView band={band} grade={state.studentGrade} onWin={(xp, acc) => recordChallengeWin('speed-hunt', xp, acc)} />
      )}

      {activeMode === 'truth-or-trap' && (
        <TruthOrTrapView band={band} grade={state.studentGrade} onWin={(xp, acc) => recordChallengeWin('truth-or-trap', xp, acc)} />
      )}

      {activeMode === 'boss-battle' && (
        <BossBattleView band={band} onWin={(xp, acc) => recordChallengeWin('boss-battle', xp, acc, 'mastery-dragon')} />
      )}

      {activeMode === 'code-detective' && (
        <CodeDetectiveView band={band} onWin={(xp, acc) => recordChallengeWin('code-detective', xp, acc, 'prog-algorithms')} />
      )}

      {activeMode === 'exam-mode' && (
        <ExamModeView
          band={band}
          grade={state.studentGrade}
          onFinish={(score) => {
            setExamBestScore(score);
            recordChallengeWin('exam-mode', Math.max(40, score), score);
          }}
        />
      )}

      {activeMode === 'deep-fold' && (
        <DeepFoldView band={band} grade={state.studentGrade} onWin={(xp, acc) => recordChallengeWin('deep-fold', xp, acc)} />
      )}
    </div>
  );
};

/* ---------------- 1. BUG HUNT — BROKEN FOLD ---------------- */
const BugHuntView: React.FC<{
  grade: GradeLevel;
  difficulty: 'Flat Sheet' | 'First Fold' | 'Complex Fold' | 'Master Fold' | 'Masterpiece';
  reducedMotion: boolean;
  onWin: (xp: number, accuracy: number) => void;
}> = ({ grade, difficulty, reducedMotion, onWin }) => {
  const [subject, setSubject] = useState<BugHuntProblem['subject']>('Mathematics');
  const [problem, setProblem] = useState<BugHuntProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [hintTier, setHintTier] = useState(0);
  const [repaired, setRepaired] = useState(false);
  const [wrongMsg, setWrongMsg] = useState<string | null>(null);

  const loadProblem = async (subj: BugHuntProblem['subject'], excludeId?: string) => {
    setLoading(true);
    setSelectedStep(null);
    setHintTier(0);
    setRepaired(false);
    setWrongMsg(null);
    const p = await fetchBugHuntProblem({ subject: subj, difficulty, grade, excludeId });
    setProblem(p);
    setLoading(false);
  };

  useEffect(() => {
    void loadProblem(subject);
  }, [subject, grade]);

  const checkStep = (stepNum: number) => {
    if (!problem || repaired) return;
    setSelectedStep(stepNum);
    if (stepNum === problem.bugStepNumber) {
      setRepaired(true);
      setWrongMsg(null);
      const accuracy = Math.max(70, 100 - hintTier * 10);
      onWin(75, accuracy);
    } else {
      setWrongMsg(`Step ${stepNum} is consistent. Look closer for the hidden misfold!`);
    }
  };

  return (
    <div className="paper-card rounded-sm p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <OrigamiSVG
            shape="crane"
            broken={!repaired}
            accent={repaired ? '#7F967B' : '#C8433A'}
            className="w-16 h-16 shrink-0"
          />
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-vermilion">
              Bug Hunt — {grade} • {problem?.mode === 'live' ? 'Live AI' : 'Simulated AI'}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              {problem ? problem.title : 'Unfolding Puzzle...'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as BugHuntProblem['subject'])}
            className="px-3 py-2 text-sm bg-ivory border border-charcoal/20 rounded-sm"
          >
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics / Science</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Programming">Programming</option>
          </select>
          <button
            onClick={() => loadProblem(subject, problem?.id)}
            disabled={loading}
            className="px-3 py-2 text-sm bg-paper border border-charcoal/20 rounded-sm hover:bg-charcoal hover:text-ivory inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> New Fold
          </button>
        </div>
      </div>

      {problem && !loading && (
        <>
          <div className="p-4 bg-paper/55 border border-charcoal/10 rounded-sm text-sm font-medium">
            {problem.prompt}
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-charcoal/60">
              Click the single step that contains the hidden mistake:
            </div>
            {problem.steps.map((s) => {
              const isSelected = selectedStep === s.stepNumber;
              const isBug = s.stepNumber === problem.bugStepNumber;
              return (
                <motion.button
                  key={s.stepNumber}
                  whileTap={reducedMotion ? undefined : { scale: 0.99 }}
                  onClick={() => checkStep(s.stepNumber)}
                  className={`w-full text-left p-4 rounded-sm border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    repaired && isBug
                      ? 'bg-sage/25 border-sage'
                      : isSelected && !isBug
                      ? 'bg-vermilion/15 border-vermilion'
                      : 'bg-ivory border-charcoal/15 hover:bg-paper/60'
                  }`}
                >
                  <div>
                    <span className="text-xs font-mono text-charcoal/55 mr-2">
                      Step {s.stepNumber}: {s.label}
                    </span>
                    <div className="font-mono text-sm text-charcoal mt-1">{s.expression}</div>
                  </div>
                  {repaired && isBug && (
                    <span className="text-xs font-mono px-2.5 py-1 bg-sage text-ivory rounded-sm shrink-0">
                      Faulty Crease Fixed!
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {wrongMsg && (
            <div className="p-3 bg-vermilion/10 border border-vermilion/40 rounded-sm text-sm text-vermilion flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {wrongMsg}
            </div>
          )}

          {repaired && (
            <div className="p-5 bg-sage/20 border border-sage rounded-sm space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-semibold text-charcoal">
                  <CheckCircle2 className="w-5 h-5 text-sage" /> Broken Fold Repaired! +75 Fold XP
                </span>
                <button
                  onClick={() => loadProblem(subject, problem.id)}
                  className="px-3 py-1.5 text-xs font-mono bg-charcoal text-ivory rounded-sm hover:bg-vermilion"
                >
                  Next Puzzle →
                </button>
              </div>
              <p className="text-sm text-charcoal/85">{problem.bugExplanation}</p>
              <div className="p-3 bg-ivory rounded-sm font-mono text-xs border border-charcoal/10">
                Corrected Step: {problem.correctedStep}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-charcoal/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-charcoal/60">Smart Hint Note</span>
              {hintTier < 3 && !repaired && (
                <button
                  onClick={() => setHintTier((h) => Math.min(3, h + 1))}
                  className="text-xs font-mono text-vermilion hover:underline inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Unfold Hint ({hintTier}/3)
                </button>
              )}
            </div>
            {hintTier > 0 && (
              <div className="space-y-1.5">
                {problem.hints.slice(0, hintTier).map((h, i) => (
                  <div key={i} className="p-3 bg-paper/65 border border-charcoal/10 rounded-sm text-xs">
                    {h}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

/* ---------------- 2. SPEED HUNT — SWIFT FOLD ---------------- */
const SpeedHuntView: React.FC<{ band: GradeBand; grade: GradeLevel; onWin: (xp: number, acc: number) => void }> = ({
  band,
  grade,
  onWin,
}) => {
  const questions = filterByBand(SPEED_QUESTIONS, band);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) {
      setDone(true);
      onWin(65, Math.round((score / questions.length) * 100));
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, done]);

  const answer = (optIdx: number) => {
    const correct = optIdx === questions[idx].ans;
    const nextScore = correct ? score + 1 : score;
    setScore(nextScore);
    if (idx + 1 >= questions.length) {
      setDone(true);
      onWin(65, Math.round((nextScore / questions.length) * 100));
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <div className="paper-card rounded-sm p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <OrigamiSVG shape="hummingbird" accent="#5D819E" className="w-14 h-14 shrink-0" />
          <div>
            <div className="text-xs font-mono text-dusty uppercase">Speed Hunt • {grade}</div>
            <h2 className="font-serif text-2xl font-bold">{questions.length}-Question Blitz</h2>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-paper rounded-sm font-mono text-sm">
          <Clock className="w-4 h-4 text-vermilion" /> {timeLeft}s
        </div>
      </div>

      {!done ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-charcoal/55">
            <span>
              Question {idx + 1} / {questions.length} • {questions[idx].subject}
            </span>
            <span>Score: {score}</span>
          </div>
          <p className="text-lg font-medium">{questions[idx].q}</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {questions[idx].opts.map((o, i) => (
              <button
                key={o}
                onClick={() => answer(i)}
                className="p-4 bg-ivory border border-charcoal/15 rounded-sm hover:bg-charcoal hover:text-ivory transition-colors text-sm font-medium"
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-5 bg-sage/20 border border-sage rounded-sm space-y-3">
          <div className="font-serif text-xl font-bold">
            Swift Fold Complete: {score}/{questions.length} Correct (+65 XP)
          </div>
          <button
            onClick={() => {
              setIdx(0);
              setScore(0);
              setTimeLeft(60);
              setDone(false);
            }}
            className="px-4 py-2 bg-charcoal text-ivory text-xs rounded-sm"
          >
            Fly Again
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- 3. TRUTH OR TRAP — HIDDEN CREASE ---------------- */
const TruthOrTrapView: React.FC<{ band: GradeBand; grade: GradeLevel; onWin: (xp: number, acc: number) => void }> = ({
  band,
  grade,
  onWin,
}) => {
  const claims = filterByBand(TRUTH_CLAIMS, band);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState<boolean | null>(null);
  const [hits, setHits] = useState(0);

  const choose = (guess: boolean) => {
    if (revealed !== null) return;
    const correct = guess === claims[idx].isTrue;
    setRevealed(correct);
    if (correct) setHits((h) => h + 1);
  };

  const next = () => {
    if (idx + 1 >= claims.length) {
      onWin(55, Math.round((hits / claims.length) * 100));
      setIdx(0);
      setHits(0);
    } else {
      setIdx(idx + 1);
    }
    setRevealed(null);
  };

  return (
    <div className="paper-card rounded-sm p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <OrigamiSVG shape="mask" accent="#ACA0C6" className="w-14 h-14 shrink-0" />
          <div>
            <div className="text-xs font-mono uppercase text-charcoal/55">
              Truth or Trap • {grade}
            </div>
            <h2 className="font-serif text-2xl font-bold">Unmask the Statement</h2>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 bg-paper rounded-sm">
          {idx + 1} / {claims.length} • {claims[idx].subject}
        </span>
      </div>

      <div className="p-6 bg-paper/55 border border-charcoal/15 rounded-sm text-lg sm:text-xl font-serif">
        “{claims[idx].claim}”
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => choose(true)}
          className="flex-1 py-3 bg-ivory border border-charcoal/20 rounded-sm hover:bg-sage/30 font-medium"
        >
          Truth
        </button>
        <button
          onClick={() => choose(false)}
          className="flex-1 py-3 bg-ivory border border-charcoal/20 rounded-sm hover:bg-vermilion/20 font-medium"
        >
          Trap
        </button>
      </div>

      {revealed !== null && (
        <div
          className={`p-4 rounded-sm border space-y-2 ${
            revealed ? 'bg-sage/20 border-sage' : 'bg-vermilion/15 border-vermilion'
          }`}
        >
          <div className="font-semibold text-sm">
            {revealed ? 'Mask Unfolded Correctly!' : 'Caught by the Crease!'}
          </div>
          <p className="text-sm">{claims[idx].reveal}</p>
          <button onClick={next} className="px-4 py-1.5 bg-charcoal text-ivory text-xs rounded-sm">
            {idx + 1 >= claims.length ? 'Claim +55 XP & Restart' : 'Next Mask →'}
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- 4. BOSS BATTLE — GRAND FOLD ---------------- */
const BossBattleView: React.FC<{ band: GradeBand; onWin: (xp: number, acc: number) => void }> = ({
  band,
  onWin,
}) => {
  const defaultIdx = Math.max(0, BOSS_TRIALS.findIndex((b) => b.band === band));
  const [trialIdx, setTrialIdx] = useState(defaultIdx);
  const [stage, setStage] = useState(0);
  const [victory, setVictory] = useState(false);
  const [err, setErr] = useState(false);

  const trial = BOSS_TRIALS[trialIdx];

  const pick = (i: number) => {
    if (i === trial.stages[stage].ans) {
      setErr(false);
      if (stage + 1 >= trial.stages.length) {
        setVictory(true);
        onWin(150, 95);
      } else {
        setStage(stage + 1);
      }
    } else {
      setErr(true);
    }
  };

  return (
    <div className="paper-card rounded-sm p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <OrigamiSVG
            shape="dragon"
            accent={victory ? '#B8924A' : '#C8433A'}
            partial={!victory}
            className="w-16 h-16 shrink-0"
          />
          <div>
            <div className="text-xs font-mono uppercase text-gold">Boss Battle — Grand Fold</div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">{trial.name}</h2>
            <div className="text-xs text-charcoal/65">{trial.subtitle}</div>
          </div>
        </div>
        <select
          value={trialIdx}
          onChange={(e) => {
            setTrialIdx(Number(e.target.value));
            setStage(0);
            setVictory(false);
            setErr(false);
          }}
          className="px-3 py-2 text-sm bg-ivory border border-charcoal/20 rounded-sm"
        >
          {BOSS_TRIALS.map((b, i) => (
            <option key={b.id} value={i}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {!victory ? (
        <div className="space-y-4">
          <div className="text-xs font-mono text-charcoal/60">
            Fold {stage + 1} / {trial.stages.length}
          </div>
          <p className="text-base font-medium">{trial.stages[stage].q}</p>
          <div className="space-y-2.5">
            {trial.stages[stage].opts.map((o, i) => (
              <button
                key={o}
                onClick={() => pick(i)}
                className="w-full text-left p-4 bg-ivory border border-charcoal/15 rounded-sm hover:bg-paper/70 text-sm"
              >
                {o}
              </button>
            ))}
          </div>
          {err && (
            <p className="text-xs font-mono text-vermilion">
              The boss resists that fold — re-evaluate the underlying rule!
            </p>
          )}
        </div>
      ) : (
        <div className="p-6 bg-gold/20 border border-gold rounded-sm space-y-3">
          <div className="font-serif text-2xl font-bold">
            {trial.name} Unfolded! +150 Fold XP
          </div>
          <p className="text-sm text-charcoal/80">
            Advanced Mastery progress has been recorded on your Progress Map.
          </p>
          <button
            onClick={() => {
              setTrialIdx((trialIdx + 1) % BOSS_TRIALS.length);
              setStage(0);
              setVictory(false);
            }}
            className="px-4 py-2 bg-charcoal text-ivory text-xs rounded-sm"
          >
            Challenge Next Boss Trial →
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- 5. CODE DETECTIVE — PAPER TRAILS ---------------- */
const CodeDetectiveView: React.FC<{ band: GradeBand; onWin: (xp: number, acc: number) => void }> = ({
  band,
  onWin,
}) => {
  const defaultIdx = Math.max(0, DETECTIVE_CASES.findIndex((c) => c.band === band));
  const [caseIdx, setCaseIdx] = useState(defaultIdx);
  const [solved, setSolved] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const activeCase = DETECTIVE_CASES[caseIdx];

  const inspect = (id: number) => {
    if (solved) return;
    if (id === activeCase.faultyCardId) {
      setSolved(true);
      setMsg(activeCase.explanation);
      onWin(70, 92);
    } else {
      setMsg('That paper clue is clean. Inspect the other evidence cards carefully!');
    }
  };

  return (
    <div className="paper-card rounded-sm p-6 md:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <OrigamiSVG shape="magnifier" accent="#7F967B" className="w-14 h-14 shrink-0" />
          <div>
            <div className="text-xs font-mono uppercase text-charcoal/55">
              Code Detective — Paper Trails ({caseIdx + 1}/{DETECTIVE_CASES.length})
            </div>
            <h2 className="font-serif text-2xl font-bold">{activeCase.title}</h2>
          </div>
        </div>
        <button
          onClick={() => {
            setCaseIdx((caseIdx + 1) % DETECTIVE_CASES.length);
            setSolved(false);
            setMsg(null);
          }}
          className="px-3 py-1.5 text-xs font-mono bg-paper border border-charcoal/20 rounded-sm hover:bg-charcoal hover:text-ivory"
        >
          Switch Case →
        </button>
      </div>

      <p className="text-sm text-charcoal/80">{activeCase.prompt}</p>

      <div className="grid md:grid-cols-3 gap-4">
        {activeCase.cards.map((c) => (
          <button
            key={c.id}
            onClick={() => inspect(c.id)}
            className={`p-4 text-left border rounded-sm transition-all ${
              solved && c.id === activeCase.faultyCardId
                ? 'bg-sage/25 border-sage'
                : 'bg-ivory border-charcoal/15 hover:bg-paper/60'
            }`}
          >
            <div className="text-xs font-mono text-charcoal/60 mb-2">{c.title}</div>
            <code className="font-mono text-xs text-charcoal break-all">{c.code}</code>
          </button>
        ))}
      </div>

      {msg && (
        <div className="p-4 bg-paper/70 border border-charcoal/15 rounded-sm text-sm flex flex-wrap items-center justify-between gap-3">
          <span>{msg}</span>
          {solved && (
            <button
              onClick={() => {
                setCaseIdx((caseIdx + 1) % DETECTIVE_CASES.length);
                setSolved(false);
                setMsg(null);
              }}
              className="px-3.5 py-1.5 bg-charcoal text-ivory text-xs rounded-sm shrink-0"
            >
              Next Case →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------------- 6. EXAM MODE — SILENT FOLD ---------------- */
const ExamModeView: React.FC<{ band: GradeBand; grade: GradeLevel; onFinish: (score: number) => void }> = ({
  band,
  grade,
  onFinish,
}) => {
  const items = filterByBand(EXAM_ITEMS, band);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(items.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(240);
  const [submitted, setSubmitted] = useState(false);

  const scorePct = Math.round(
    (items.filter((item, i) => answers[i] === item.ans).length / items.length) * 100
  );

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      onFinish(scorePct);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, submitted]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="paper-card rounded-sm p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono uppercase text-charcoal/60">
            Exam Mode — Silent Fold • {grade}
          </div>
          <h2 className="font-serif text-2xl font-bold">{items.length}-Question Assessment</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-mono bg-paper border border-charcoal/15 rounded-sm">
            {mins}:{secs}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 bg-charcoal text-ivory rounded-sm">
            <ShieldAlert className="w-3.5 h-3.5 text-gold" /> AI Hints Disabled
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`px-3 py-1.5 text-xs font-mono rounded-sm border ${
              current === i
                ? 'bg-charcoal text-ivory border-charcoal'
                : answers[i] !== null
                ? 'bg-sage/25 border-sage'
                : 'bg-ivory border-charcoal/20'
            }`}
          >
            Q{i + 1}
          </button>
        ))}
      </div>

      {!submitted ? (
        <div className="space-y-4">
          <div className="text-xs font-mono text-charcoal/55">{items[current].subject}</div>
          <p className="text-base font-medium">{items[current].q}</p>
          <div className="space-y-2">
            {items[current].opts.map((o, idx) => (
              <button
                key={o}
                onClick={() => {
                  const next = [...answers];
                  next[current] = idx;
                  setAnswers(next);
                }}
                className={`w-full text-left p-3.5 rounded-sm border text-sm ${
                  answers[current] === idx
                    ? 'bg-charcoal text-ivory border-charcoal'
                    : 'bg-ivory border-charcoal/15 hover:bg-paper/60'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrent((c) => Math.min(items.length - 1, c + 1))}
              className="px-4 py-2.5 bg-paper border border-charcoal/20 text-xs font-medium rounded-sm"
            >
              Next Question →
            </button>
            <button
              onClick={() => {
                setSubmitted(true);
                onFinish(scorePct);
              }}
              className="px-5 py-2.5 bg-vermilion text-ivory text-sm font-medium rounded-sm"
            >
              Submit Silent Fold Exam
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-paper/60 border border-charcoal/15 rounded-sm space-y-3">
          <div className="font-serif text-2xl font-bold">Performance Report: {scorePct}%</div>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            {items.map((item, i) => {
              const ok = answers[i] === item.ans;
              return (
                <div
                  key={i}
                  className={`p-2.5 rounded-sm border ${
                    ok ? 'bg-sage/20 border-sage' : 'bg-vermilion/10 border-vermilion/40'
                  }`}
                >
                  <span className="font-mono font-semibold">Q{i + 1} ({item.subject}): </span>
                  {ok ? 'Correct' : `Correct answer: ${item.opts[item.ans]}`}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- 7. EXPLAIN YOUR REASONING — DEEP FOLD ---------------- */
const DeepFoldView: React.FC<{ band: GradeBand; grade: GradeLevel; onWin: (xp: number, acc: number) => void }> = ({
  band,
  grade,
  onWin,
}) => {
  const defaultIdx = Math.max(0, DEEP_FOLD_PROMPTS.findIndex((p) => p.band === band));
  const [promptIdx, setPromptIdx] = useState(defaultIdx);
  const [explanation, setExplanation] = useState('');
  const [evalRes, setEvalRes] = useState<ReasoningEvaluation | null>(null);
  const [loading, setLoading] = useState(false);

  const activePrompt = DEEP_FOLD_PROMPTS[promptIdx];

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) return;
    setLoading(true);
    const res = await submitReasoningEvaluation({
      question: activePrompt.question,
      userExplanation: explanation,
      expectedConcept: activePrompt.expectedConcept,
      grade,
    });
    setEvalRes(res);
    setLoading(false);
    if (res.understood) onWin(res.xpEarned, res.score);
  };

  return (
    <div className="paper-card rounded-sm p-6 md:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <OrigamiSVG
            shape="star"
            accent={evalRes?.understood ? '#7F967B' : '#C8433A'}
            partial={!evalRes?.understood}
            className="w-14 h-14 shrink-0"
          />
          <div>
            <div className="text-xs font-mono uppercase text-vermilion">
              Deep Fold • {grade}
            </div>
            <h2 className="font-serif text-2xl font-bold">{activePrompt.title}</h2>
          </div>
        </div>

        <select
          value={promptIdx}
          onChange={(e) => {
            setPromptIdx(Number(e.target.value));
            setExplanation('');
            setEvalRes(null);
          }}
          className="px-3 py-2 text-sm bg-ivory border border-charcoal/20 rounded-sm"
        >
          {DEEP_FOLD_PROMPTS.map((p, i) => (
            <option key={p.id} value={i}>
              {p.subject}: {p.title}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-paper/55 border border-charcoal/10 rounded-sm space-y-1">
        <p className="text-sm font-medium">{activePrompt.question}</p>
        <p className="text-xs font-mono text-charcoal/60">Tip: {activePrompt.starterHint}</p>
      </div>

      <form onSubmit={handleEvaluate} className="space-y-3">
        <textarea
          rows={4}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain your conceptual reasoning in 1–3 clear sentences..."
          className="w-full p-3.5 bg-ivory border border-charcoal/20 rounded-sm text-sm focus:outline-none focus:border-charcoal"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-charcoal text-ivory text-sm font-medium rounded-sm hover:bg-vermilion inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> {loading ? 'Evaluating Fold...' : 'Evaluate Reasoning'}
        </button>
      </form>

      {evalRes && (
        <div
          className={`p-5 rounded-sm border space-y-2 ${
            evalRes.understood ? 'bg-sage/20 border-sage' : 'bg-gold/15 border-gold'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-serif text-lg font-bold">
              Conceptual Score: {evalRes.score}/100
            </span>
            <span className="text-xs font-mono">
              {evalRes.mode === 'live' ? 'Live AI Graded' : 'Simulated AI Graded'}
            </span>
          </div>
          <p className="text-sm">{evalRes.feedback}</p>
          <div className="text-xs font-mono text-charcoal/70">
            Adaptive Next Tier: {evalRes.nextDifficulty}
          </div>
        </div>
      )}
    </div>
  );
};
