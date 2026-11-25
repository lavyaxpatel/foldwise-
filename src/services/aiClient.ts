import type {
  BugHuntProblem,
  DifficultyTier,
  GradeLevel,
  ReasoningEvaluation,
  TutorResponsePayload,
} from '../types/foldwise';

export interface HealthResponse {
  ok: boolean;
  app: string;
  mode: 'live' | 'simulated';
  provider: 'gemini' | 'openai' | 'simulated';
  model: string;
}

export async function fetchAiHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return (await res.json()) as HealthResponse;
  } catch {
    return {
      ok: false,
      app: 'FoldWise',
      mode: 'simulated',
      provider: 'simulated',
      model: 'Simulated Origami AI (Offline)',
    };
  }
}

export async function sendTutorMessage(params: {
  message: string;
  action?: string;
  topic: string;
  difficulty: DifficultyTier;
  persona: 'crane' | 'fox';
  grade: GradeLevel;
}): Promise<TutorResponsePayload> {
  try {
    const res = await fetch('/api/tutor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Tutor API failed');
    return (await res.json()) as TutorResponsePayload;
  } catch {
    return {
      folds: [
        {
          title: `Fold 1 — ${params.grade} Pattern (Offline Simulation)`,
          content: `In ${params.topic}, focus on one clean rule at a time for "${params.message.slice(0, 60)}".`,
          creaseTip: 'Start the Express API server (`npm run dev`) for live backend AI responses.',
        },
        {
          title: 'Fold 2 — Guided Check',
          content: 'Test your step with a tiny simple number to make sure each crease holds.',
          creaseTip: 'Compare units and signs line by line.',
        },
      ],
      reflectionPrompt: 'What stays constant across the transformation?',
      weakConceptDetected: null,
      suggestedDifficulty: params.difficulty,
      origamiMood: 'guiding',
      mode: 'simulated',
      provider: 'Client Fallback Simulator',
    };
  }
}

export async function fetchBugHuntProblem(params: {
  subject: BugHuntProblem['subject'];
  difficulty: DifficultyTier;
  grade: GradeLevel;
  excludeId?: string;
}): Promise<BugHuntProblem> {
  try {
    const res = await fetch('/api/challenges/bug-hunt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Bug Hunt API failed');
    return (await res.json()) as BugHuntProblem;
  } catch {
    return {
      id: 'offline-bh-1',
      subject: params.subject,
      title: `${params.grade} Crease Check`,
      difficulty: params.difficulty,
      prompt: 'Find the hidden mistake in this solved equation: 2x² - 8x + 6 = 0',
      steps: [
        { stepNumber: 1, label: 'Divide by 2', expression: 'x² - 4x + 3 = 0' },
        { stepNumber: 2, label: 'Split middle term', expression: 'x² - 3x - x + 3 = 0' },
        { stepNumber: 3, label: 'Factor by grouping', expression: 'x(x - 3) + 1(x - 3) = 0' },
        { stepNumber: 4, label: 'Solve', expression: '(x + 1)(x - 3) = 0 => x = -1, 3' },
      ],
      bugStepNumber: 3,
      bugExplanation: 'Factoring -x + 3 requires -1(x - 3), not +1(x - 3).',
      correctedStep: 'x(x - 3) - 1(x - 3) = 0 => x = 1, 3',
      hints: [
        'First Crease: Inspect the signs in the second grouping pair.',
        'Guided Fold: Multiply +1(x - 3) back out — does it match -x + 3?',
        'Open Sheet: Step 3 should factor out -1, giving roots x = 1 and 3.',
      ],
      mode: 'simulated',
    };
  }
}

export async function submitReasoningEvaluation(params: {
  question: string;
  userExplanation: string;
  expectedConcept: string;
  grade: GradeLevel;
}): Promise<ReasoningEvaluation> {
  try {
    const res = await fetch('/api/challenges/evaluate-reasoning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Evaluation failed');
    return (await res.json()) as ReasoningEvaluation;
  } catch {
    const words = params.userExplanation.trim().split(/\s+/).filter(Boolean).length;
    const score = Math.min(92, 40 + words * 3);
    const understood = score >= 65;
    return {
      score,
      understood,
      strengths: ['Clear attempt to explain the underlying causal rule.'],
      gaps: understood ? [] : ['Add a concrete "because..." clause referencing the invariant.'],
      feedback: understood
        ? 'Crisp fold! Your explanation captures the essential mechanism.'
        : 'Partial crease — clarify *why* the rule holds to unlock the final fold.',
      nextDifficulty: understood ? 'Complex Fold' : 'First Fold',
      xpEarned: understood ? 60 : 20,
      mode: 'simulated',
    };
  }
}
