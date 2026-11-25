import dotenv from 'dotenv';
import {
  buildSimulatedReasoningEval,
  buildSimulatedTutorReply,
  SIMULATED_BUG_HUNTS,
} from './fallbackData.js';
import { gradeToBand } from './seedData.js';
import type {
  BugHuntProblem,
  DifficultyTier,
  GradeLevel,
  ReasoningEvaluation,
  TutorResponsePayload,
} from '../src/types/foldwise.js';

dotenv.config();

export interface ProviderStatus {
  mode: 'live' | 'simulated';
  provider: 'gemini' | 'openai' | 'simulated';
  model: string;
}

export function getProviderStatus(): ProviderStatus {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0) {
    return {
      mode: 'live',
      provider: 'gemini',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    };
  }
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0) {
    return {
      mode: 'live',
      provider: 'openai',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    };
  }
  return {
    mode: 'simulated',
    provider: 'simulated',
    model: 'Simulated Origami AI',
  };
}

async function callLLMJson<T>(systemPrompt: string, userPrompt: string): Promise<T | null> {
  const status = getProviderStatus();
  if (status.mode === 'simulated') return null;

  try {
    if (status.provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY!.trim();
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        status.model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.6,
          },
        }),
      });

      if (!res.ok) {
        console.error('Gemini API error:', res.status, await res.text());
        return null;
      }
      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) return null;
      return JSON.parse(raw) as T;
    }

    if (status.provider === 'openai') {
      const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY!.trim()}`,
        },
        body: JSON.stringify({
          model: status.model,
          response_format: { type: 'json_object' },
          temperature: 0.6,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!res.ok) {
        console.error('OpenAI-compatible API error:', res.status, await res.text());
        return null;
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) return null;
      return JSON.parse(raw) as T;
    }
  } catch (err) {
    console.error('LLM call failed, falling back to simulated mode:', err);
  }
  return null;
}

export async function generateTutorReply(params: {
  message: string;
  action?: string;
  topic: string;
  difficulty: DifficultyTier;
  persona: 'crane' | 'fox';
  grade?: GradeLevel;
}): Promise<TutorResponsePayload> {
  const status = getProviderStatus();
  const gradeLabel = params.grade || 'Grade 8';
  const systemPrompt = `You are FoldWise, a calm, artistic Japanese origami-themed AI tutor (${params.persona} persona) teaching a ${gradeLabel} student.
Adapt vocabulary, depth, and examples specifically for ${gradeLabel}.
Break explanations into 2-4 sequential steps called "Folds".
Return ONLY valid JSON matching this schema:
{
  "folds": [{ "title": "Fold 1 — ...", "content": "...", "creaseTip": "..." }],
  "reflectionPrompt": "A short Socratic question asking the student to explain their reasoning.",
  "weakConceptDetected": null | "short concept name",
  "suggestedDifficulty": "Flat Sheet" | "First Fold" | "Complex Fold" | "Master Fold" | "Masterpiece",
  "origamiMood": "calm" | "curious" | "celebrating" | "guiding"
}`;

  const userPrompt = `Student Grade: ${gradeLabel}
Topic: ${params.topic}
Student Difficulty: ${params.difficulty}
Quick Action: ${params.action || 'Normal conversation'}
Student Message: ${params.message}`;

  const live = await callLLMJson<Omit<TutorResponsePayload, 'mode' | 'provider'>>(
    systemPrompt,
    userPrompt
  );

  if (live && Array.isArray(live.folds) && live.folds.length > 0) {
    return {
      ...live,
      mode: 'live',
      provider: `${status.provider} (${status.model})`,
    };
  }

  return buildSimulatedTutorReply(
    params.message,
    params.action,
    params.topic,
    params.difficulty,
    gradeLabel
  );
}

export async function generateBugHunt(params: {
  subject: BugHuntProblem['subject'];
  difficulty: DifficultyTier;
  grade?: GradeLevel;
  excludeId?: string;
}): Promise<BugHuntProblem> {
  const gradeLabel = params.grade || 'Grade 8';
  const band = gradeToBand(gradeLabel);

  const systemPrompt = `You are FoldWise's Bug-Hunt ("Broken Fold") problem generator for a ${gradeLabel} student.
Create ONE solved ${params.subject} problem strictly appropriate for ${gradeLabel} (${params.difficulty} level) with EXACTLY ONE subtle hidden mistake in one of the 4 steps.
Return ONLY valid JSON:
{
  "id": "unique-id",
  "subject": "${params.subject}",
  "title": "Short poetic origami-inspired title",
  "difficulty": "${params.difficulty}",
  "prompt": "Problem statement",
  "steps": [
    { "stepNumber": 1, "label": "...", "expression": "..." },
    { "stepNumber": 2, "label": "...", "expression": "..." },
    { "stepNumber": 3, "label": "...", "expression": "..." },
    { "stepNumber": 4, "label": "...", "expression": "..." }
  ],
  "bugStepNumber": 3,
  "bugExplanation": "Clear explanation of the hidden mistake",
  "correctedStep": "The exact corrected step",
  "hints": ["First Crease clue", "Guided Fold clue", "Open Sheet full solution"]
}`;

  const live = await callLLMJson<BugHuntProblem>(
    systemPrompt,
    `Generate a fresh ${gradeLabel} ${params.subject} Bug Hunt challenge at ${params.difficulty} level.`
  );

  if (live && Array.isArray(live.steps) && live.steps.length === 4 && live.bugStepNumber) {
    return { ...live, gradeBand: band, mode: 'live' };
  }

  // Filter first by gradeBand + subject, then relax to gradeBand, then subject
  const bandSubjectPool = SIMULATED_BUG_HUNTS.filter(
    (b) =>
      b.gradeBand === band &&
      b.subject === params.subject &&
      (!params.excludeId || !params.excludeId.startsWith(b.id))
  );
  const bandPool = SIMULATED_BUG_HUNTS.filter(
    (b) => b.gradeBand === band && (!params.excludeId || !params.excludeId.startsWith(b.id))
  );
  const subjectPool = SIMULATED_BUG_HUNTS.filter(
    (b) => b.subject === params.subject && (!params.excludeId || !params.excludeId.startsWith(b.id))
  );
  const pool =
    bandSubjectPool.length > 0
      ? bandSubjectPool
      : bandPool.length > 0
      ? bandPool
      : subjectPool.length > 0
      ? subjectPool
      : SIMULATED_BUG_HUNTS.filter((b) => b.gradeBand === band);

  const chosen = pool[Math.floor(Math.random() * pool.length)] || SIMULATED_BUG_HUNTS[0];
  return { ...chosen, id: `${chosen.id}-${Date.now()}`, mode: 'simulated' };
}

export async function evaluateReasoning(params: {
  question: string;
  userExplanation: string;
  expectedConcept: string;
  grade?: GradeLevel;
}): Promise<ReasoningEvaluation> {
  const gradeLabel = params.grade || 'Grade 8';
  const systemPrompt = `You are FoldWise's Deep Fold conceptual evaluator for a ${gradeLabel} student.
Evaluate the student's written reasoning fairly for ${gradeLabel}.
Return ONLY valid JSON:
{
  "score": 0-100,
  "understood": boolean,
  "strengths": ["..."],
  "gaps": ["..."],
  "feedback": "2-sentence origami-themed constructive feedback",
  "nextDifficulty": "Flat Sheet" | "First Fold" | "Complex Fold" | "Master Fold" | "Masterpiece",
  "xpEarned": number (20-100)
}`;

  const userPrompt = `Student Grade: ${gradeLabel}
Question/Challenge: ${params.question}
Target Concept: ${params.expectedConcept}
Student Explanation: ${params.userExplanation}`;

  const live = await callLLMJson<Omit<ReasoningEvaluation, 'mode'>>(systemPrompt, userPrompt);
  if (live && typeof live.score === 'number') {
    return { ...live, mode: 'live' };
  }

  return buildSimulatedReasoningEval(
    params.question,
    params.userExplanation,
    params.expectedConcept
  );
}
