import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Eye, Lightbulb, RotateCcw } from 'lucide-react';
import { OrigamiSVG } from '../components/OrigamiSVG';
import { gradeToBand } from '../data/curriculum';
import { useFoldWise } from '../store/useFoldWiseStore';
import type { GradeBand } from '../types/foldwise';

interface LessonCheck {
  band: GradeBand;
  prompt: string;
  options: string[];
  correctIdx: number;
  hints: [string, string, string];
  explanation: string;
}

const LESSON_CHECKS: Record<string, LessonCheck[]> = {
  'math-quadratics': [
    {
      band: 'early',
      prompt: 'When adding 27 + 15, what do 7 ones + 5 ones equal?',
      options: ['12 (write 2, carry 1 ten)', '2 (drop the 1)', '15'],
      correctIdx: 0,
      hints: [
        'First Crease: Count up 5 from 7.',
        'Guided Fold: 7 + 5 = 12, which is 1 ten and 2 ones.',
        'Open Sheet: Write 2 in the ones place and carry 1 ten to make 42.',
      ],
      explanation: '12 ones trade neatly into 1 ten and 2 ones, giving 27 + 15 = 42.',
    },
    {
      band: 'upper_elem',
      prompt: 'Before adding 1/3 + 1/4, what common denominator should we fold both into?',
      options: ['7', '12', '1'],
      correctIdx: 1,
      hints: [
        'First Crease: Find a number both 3 and 4 divide into evenly.',
        'Guided Fold: List multiples of 4: 4, 8, 12...',
        'Open Sheet: 12 is the least common multiple of 3 and 4, giving 4/12 + 3/12 = 7/12.',
      ],
      explanation: 'Splitting into twelfths makes both fractions the exact same piece size.',
    },
    {
      band: 'middle',
      prompt: 'When solving 3(x - 4) = 15, what does distributing 3 give?',
      options: ['3x - 4 = 15', '3x - 12 = 15', '3x + 12 = 15'],
      correctIdx: 1,
      hints: [
        'First Crease: Multiply 3 by EVERY term inside the parentheses.',
        'Guided Fold: 3 times x is 3x, and 3 times -4 is -12.',
        'Open Sheet: 3x - 12 = 15 => 3x = 27 => x = 9.',
      ],
      explanation: 'Distributing 3 across both terms gives 3x - 12 = 15, so x = 9.',
    },
    {
      band: 'high',
      prompt: 'When factoring x² - 3x - x + 3 = 0 by grouping, what is the factored form?',
      options: ['(x + 1)(x - 3) = 0', '(x - 1)(x - 3) = 0', '(x - 1)(x + 3) = 0'],
      correctIdx: 1,
      hints: [
        'First Crease: Factor -1 out of the second pair (-x + 3).',
        'Guided Fold: -x + 3 = -1(x - 3), matching the (x - 3) binomial.',
        'Open Sheet: x(x - 3) - 1(x - 3) = (x - 1)(x - 3) = 0.',
      ],
      explanation: 'Both groups share (x - 3), leaving (x - 1)(x - 3) = 0 so x = 1 or x = 3.',
    },
    {
      band: 'college',
      prompt: 'Using the Chain Rule, what is d/dx [sin(3x² + 1)]?',
      options: ['cos(3x² + 1)', '3x cos(3x² + 1)', '6x cos(3x² + 1)'],
      correctIdx: 2,
      hints: [
        'First Crease: Differentiate the outer sin(u), then multiply by u′(x).',
        'Guided Fold: Derivative of 3x² + 1 is 6x.',
        'Open Sheet: f′(x) = 6x cos(3x² + 1).',
      ],
      explanation: 'Chain rule multiplies outer derivative cos(u) by inner derivative 6x.',
    },
  ],
  'prog-algorithms': [
    {
      band: 'early',
      prompt: 'A robot faces East at (0,0) and wants to reach (2,0). Which steps work?',
      options: ['TURN_RIGHT, MOVE_FORWARD', 'MOVE_FORWARD, MOVE_FORWARD', 'TURN_LEFT, MOVE_FORWARD'],
      correctIdx: 1,
      hints: [
        'First Crease: The robot is already facing East!',
        'Guided Fold: Each MOVE_FORWARD takes 1 step in the facing direction.',
        'Open Sheet: Just MOVE_FORWARD twice reaches (2,0).',
      ],
      explanation: 'Moving straight ahead twice reaches (2,0) without unnecessary turns.',
    },
    {
      band: 'upper_elem',
      prompt: 'Starting at `count = 0`, which condition makes a loop run exactly 5 times?',
      options: ['while count <= 5', 'while count < 5', 'while count == 5'],
      correctIdx: 1,
      hints: [
        'First Crease: Count how many numbers are in {0, 1, 2, 3, 4}.',
        'Guided Fold: `<= 5` includes 5 itself, making 6 total runs.',
        'Open Sheet: `count < 5` runs for 0, 1, 2, 3, 4 — exactly 5 times.',
      ],
      explanation: 'Zero-indexed loops stop cleanly at `< 5` for 5 iterations.',
    },
    {
      band: 'middle',
      prompt: 'Which expression checks whether integer `n` is even?',
      options: ['n % 2 === 1', 'n % 2 === 0', 'n / 2 === 0'],
      correctIdx: 1,
      hints: [
        'First Crease: `%` returns the division remainder.',
        'Guided Fold: Even numbers divide by 2 with zero left over.',
        'Open Sheet: `n % 2 === 0` is true for all even numbers.',
      ],
      explanation: 'Modulo 2 equals 0 for even numbers and 1 for odd numbers.',
    },
    {
      band: 'high',
      prompt: 'Why must standard binary search use `while (left <= right)` instead of `<`?',
      options: [
        'To avoid infinite recursion on empty arrays',
        'To ensure a single remaining element (left === right) is still inspected',
        'To double the search window each iteration',
      ],
      correctIdx: 1,
      hints: [
        'First Crease: Trace an array of length 1: `[42]`.',
        'Guided Fold: At the start, `left = 0` and `right = 0`. Does `0 < 0` execute?',
        'Open Sheet: Using `<=` guarantees the final narrowed candidate at `left === right` is checked.',
      ],
      explanation: 'When `left === right`, one candidate remains unexamined; `<` skips it prematurely.',
    },
    {
      band: 'college',
      prompt: 'Why should Python functions use `bucket=None` instead of `bucket=[]` as a default?',
      options: [
        'Empty lists are syntax errors in Python 3',
        'Default mutable lists are shared across every function call',
        'None executes 10× faster in bytecode',
      ],
      correctIdx: 1,
      hints: [
        'First Crease: Default parameter values are evaluated once when `def` runs.',
        'Guided Fold: Appending to a default `[]` mutates that single shared list object.',
        'Open Sheet: Use `bucket=None` and create a fresh `[]` inside the function body.',
      ],
      explanation: 'Late-binding inside the function body prevents cross-call state leakage.',
    },
  ],
};

export const LearnPage: React.FC = () => {
  const { state, selectedTopicId, setSelectedTopicId, markTopicProgress, awardXp, setRoute } =
    useFoldWise();
  const topic = state.topics.find((t) => t.id === selectedTopicId) || state.topics[0];
  const band = gradeToBand(state.studentGrade);

  const rawDeck = LESSON_CHECKS[topic.id] || LESSON_CHECKS['math-quadratics'];
  const bandDeck = rawDeck.filter((c) => c.band === band);
  const deck = bandDeck.length > 0 ? bandDeck : rawDeck;

  const [qIndex, setQIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [misfold, setMisfold] = useState(false);
  const [solved, setSolved] = useState(false);

  const check = deck[qIndex % deck.length];
  const hintTitles = ['First Crease', 'Guided Fold', 'Open Sheet'];

  const handleSubmit = (idx: number) => {
    setSelectedOpt(idx);
    if (idx === check.correctIdx) {
      setMisfold(false);
      setSolved(true);
      markTopicProgress(topic.id, 35, false);
      awardXp(45, topic.title);
    } else {
      setMisfold(true);
      setTimeout(() => setMisfold(false), 700);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-charcoal/55">
            Guided Lesson • {state.studentGrade} • {topic.subject}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl">{topic.title}</h1>
        </div>
        <select
          value={topic.id}
          onChange={(e) => {
            setSelectedTopicId(e.target.value);
            setQIndex(0);
            setHintLevel(0);
            setSelectedOpt(null);
            setSolved(false);
          }}
          className="px-3 py-2 text-sm bg-ivory border border-charcoal/20 rounded-sm"
        >
          {state.topics
            .filter((t) => t.status !== 'locked')
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.progress}%)
              </option>
            ))}
        </select>
      </div>

      {/* Concept Sheet */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-5">
          <motion.div
            animate={
              misfold && !state.settings.reducedMotion
                ? { x: [0, -8, 8, -5, 5, 0], rotate: [0, -1.5, 1.5, 0] }
                : {}
            }
            className="paper-card rounded-sm p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2.5 py-1 bg-paper rounded-sm">
                {state.studentGrade} • {topic.difficulty}
              </span>
              <span className="text-xs font-mono text-charcoal/65">{topic.progress}% folded</span>
            </div>

            <p className="text-charcoal/80 leading-relaxed">{topic.description}</p>

            <div className="flex flex-wrap gap-2">
              {topic.concepts.map((c) => (
                <span
                  key={c}
                  className="text-xs px-2.5 py-1 bg-ivory border border-charcoal/15 rounded-sm"
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="crease-divider" />

            <h2 className="font-serif text-xl font-bold">Practice Crease</h2>
            <p className="text-sm text-charcoal/90">{check.prompt}</p>

            <div className="space-y-2.5">
              {check.options.map((opt, idx) => {
                const isChosen = selectedOpt === idx;
                const isRight = idx === check.correctIdx;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSubmit(idx)}
                    className={`w-full text-left px-4 py-3 rounded-sm border text-sm transition-all ${
                      isChosen && isRight
                        ? 'bg-sage/25 border-sage font-medium'
                        : isChosen && !isRight
                        ? 'bg-vermilion/15 border-vermilion'
                        : 'bg-ivory border-charcoal/15 hover:bg-paper/60'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {misfold && (
              <div className="text-xs font-mono text-vermilion flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Misfold detected — open a Smart Hint or refold!
              </div>
            )}

            {solved && (
              <div className="p-4 bg-sage/20 border border-sage rounded-sm space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-semibold text-sm text-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-sage" /> Clean Fold! +45 Fold XP
                  </span>
                  <button
                    onClick={() => {
                      setQIndex((i) => i + 1);
                      setHintLevel(0);
                      setSelectedOpt(null);
                      setSolved(false);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-mono px-3 py-1 bg-charcoal text-ivory rounded-sm"
                  >
                    Practice Again <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm text-charcoal/80">{check.explanation}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Smart Hints 3-Stage Paper Notes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="paper-card rounded-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-gold" />
                <h3 className="font-serif text-xl font-bold">3-Stage Smart Hints</h3>
              </div>
              <OrigamiSVG
                shape={topic.origamiModel}
                className="w-10 h-10"
                broken={misfold}
                accent="#B8924A"
              />
            </div>

            <p className="text-xs text-charcoal/70">
              Unfold only as much guidance as you need before revealing the complete sheet.
            </p>

            <div className="space-y-3">
              {[0, 1, 2].map((stage) => {
                const unlocked = hintLevel > stage;
                return (
                  <div
                    key={stage}
                    className="border border-charcoal/15 rounded-sm bg-paper/45 overflow-hidden"
                  >
                    <button
                      onClick={() => setHintLevel(Math.max(hintLevel, stage + 1))}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-mono uppercase tracking-wider hover:bg-paper/80"
                    >
                      <span>
                        Stage {stage + 1}: {hintTitles[stage]}
                      </span>
                      <Eye className="w-3.5 h-3.5 text-charcoal/60" />
                    </button>
                    <AnimatePresence>
                      {unlocked && (
                        <motion.div
                          initial={state.settings.reducedMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-3 text-sm text-charcoal/85 border-t border-charcoal/10 pt-2 bg-ivory/75"
                        >
                          {check.hints[stage]}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setRoute('tutor')}
              className="w-full py-2.5 text-xs font-medium bg-charcoal text-ivory rounded-sm hover:bg-vermilion transition-colors"
            >
              Ask AI Tutor about {topic.title}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
