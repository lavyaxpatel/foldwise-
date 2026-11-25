import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  evaluateReasoning,
  generateBugHunt,
  generateTutorReply,
  getProviderStatus,
} from './llm.js';
import {
  deleteUserByToken,
  getUserByToken,
  loginOrCreateUser,
  logoutByToken,
  saveUserStateByToken,
} from './authStore.js';
import { SERVER_DEFAULT_STATE } from './seedData.js';
import type { FoldWiseState, GradeLevel } from '../src/types/foldwise.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

function extractBearer(req: express.Request): string | undefined {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return undefined;
  return header.slice(7).trim();
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    app: 'FoldWise API',
    ...getProviderStatus(),
  });
});

/* ---------------- Unified Start-Page Login & Per-User Data Persistence ---------------- */
app.post('/api/auth/login', (req, res) => {
  const { fullName, password, grade, initialState } = req.body ?? {};
  const result = loginOrCreateUser({
    fullName: String(fullName || ''),
    password: String(password || ''),
    grade: (grade as GradeLevel) || 'Grade 8',
    initialState: initialState || SERVER_DEFAULT_STATE,
  });
  if ('error' in result) {
    res.status(401).json({ error: result.error });
    return;
  }
  res.json(result);
});

app.get('/api/auth/me', (req, res) => {
  const token = extractBearer(req);
  const found = getUserByToken(token);
  if (!found) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json(found);
});

app.put('/api/user/state', (req, res) => {
  const token = extractBearer(req);
  const { state } = req.body ?? {};
  if (!state) {
    res.status(400).json({ error: 'state payload is required' });
    return;
  }
  const updated = saveUserStateByToken(token, state as FoldWiseState);
  if (!updated) {
    res.status(401).json({ error: 'Session expired or unauthorized' });
    return;
  }
  res.json(updated);
});

app.post('/api/auth/logout', (req, res) => {
  logoutByToken(extractBearer(req));
  res.json({ ok: true });
});

app.delete('/api/auth/account', (req, res) => {
  const deleted = deleteUserByToken(extractBearer(req));
  if (!deleted) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json({ ok: true });
});

/* ---------------- AI Tutor & Grade-Aware Challenge Routes ---------------- */
app.post('/api/tutor/chat', async (req, res) => {
  try {
    const { message, action, topic, difficulty, persona, grade } = req.body ?? {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'message is required' });
      return;
    }
    const reply = await generateTutorReply({
      message,
      action,
      topic: topic || 'Core Principles',
      difficulty: difficulty || 'First Fold',
      persona: persona === 'fox' ? 'fox' : 'crane',
      grade: grade || 'Grade 8',
    });
    res.json(reply);
  } catch (err) {
    console.error('Tutor route error:', err);
    res.status(500).json({ error: 'Failed to generate tutor fold' });
  }
});

app.post('/api/challenges/bug-hunt', async (req, res) => {
  try {
    const { subject, difficulty, grade, excludeId } = req.body ?? {};
    const problem = await generateBugHunt({
      subject: subject || 'Mathematics',
      difficulty: difficulty || 'First Fold',
      grade: grade || 'Grade 8',
      excludeId: typeof excludeId === 'string' ? excludeId : undefined,
    });
    res.json(problem);
  } catch (err) {
    console.error('Bug hunt route error:', err);
    res.status(500).json({ error: 'Failed to generate Bug Hunt challenge' });
  }
});

app.post('/api/challenges/evaluate-reasoning', async (req, res) => {
  try {
    const { question, userExplanation, expectedConcept, grade } = req.body ?? {};
    if (!userExplanation || typeof userExplanation !== 'string') {
      res.status(400).json({ error: 'userExplanation is required' });
      return;
    }
    const evaluation = await evaluateReasoning({
      question: question || 'Explain the core concept',
      userExplanation,
      expectedConcept: expectedConcept || 'Conceptual reasoning',
      grade: grade || 'Grade 8',
    });
    res.json(evaluation);
  } catch (err) {
    console.error('Reasoning eval error:', err);
    res.status(500).json({ error: 'Failed to evaluate reasoning' });
  }
});

/* ---------------- Production Static Frontend Serving ---------------- */
const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  const status = getProviderStatus();
  console.log(
    `[FoldWise Server] listening on http://localhost:${PORT} | AI Mode: ${status.mode} (${status.model})`
  );
});
