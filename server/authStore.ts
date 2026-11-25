import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { FoldWiseState, GradeLevel } from '../src/types/foldwise.js';

export interface StoredUserRecord {
  id: string;
  nameKey: string; // normalized lowercase full name for lookup
  name: string;
  grade: GradeLevel;
  passwordHash: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
  state: FoldWiseState;
}

export interface PublicUser {
  id: string;
  name: string;
  grade: GradeLevel;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const sessions = new Map<string, string>();

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
  }
}

function readUsers(): StoredUserRecord[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUserRecord[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUserRecord[]) {
  ensureDataFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function toPublicUser(u: StoredUserRecord): PublicUser {
  return {
    id: u.id,
    name: u.name,
    grade: u.grade,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

/**
 * Unified Login / Auto-Enroll by Full Name + Password + Grade.
 * - If scholar exists: verifies password, updates grade if changed, and returns saved progress.
 * - If scholar is new: creates their stored record starting at 0 XP with chosen grade.
 */
export function loginOrCreateUser(params: {
  fullName: string;
  password: string;
  grade: GradeLevel;
  initialState: FoldWiseState;
}): { token: string; user: PublicUser; state: FoldWiseState; isNew: boolean } | { error: string } {
  const cleanName = params.fullName.trim();
  if (cleanName.length < 2) {
    return { error: 'Please enter your full name (at least 2 characters).' };
  }
  if (!params.password || params.password.length < 4) {
    return { error: 'Password must be at least 4 characters.' };
  }

  const nameKey = cleanName.toLowerCase();
  const users = readUsers();
  const existingIdx = users.findIndex((u) => u.nameKey === nameKey);

  if (existingIdx !== -1) {
    const found = users[existingIdx];
    const candidateHash = hashPassword(params.password, found.salt);
    const valid = crypto.timingSafeEqual(
      Buffer.from(candidateHash, 'hex'),
      Buffer.from(found.passwordHash, 'hex')
    );
    if (!valid) {
      return { error: 'Incorrect password for this scholar name.' };
    }

    const now = new Date().toISOString();
    const updatedState: FoldWiseState = {
      ...found.state,
      studentName: cleanName,
      studentGrade: params.grade || found.grade,
    };
    users[existingIdx] = {
      ...found,
      name: cleanName,
      grade: params.grade || found.grade,
      updatedAt: now,
      state: updatedState,
    };
    writeUsers(users);

    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, found.id);
    return {
      token,
      user: toPublicUser(users[existingIdx]),
      state: updatedState,
      isNew: false,
    };
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const now = new Date().toISOString();
  const state: FoldWiseState = {
    ...params.initialState,
    studentName: cleanName,
    studentGrade: params.grade,
  };

  const record: StoredUserRecord = {
    id: crypto.randomUUID(),
    nameKey,
    name: cleanName,
    grade: params.grade,
    passwordHash: hashPassword(params.password, salt),
    salt,
    createdAt: now,
    updatedAt: now,
    state,
  };

  users.push(record);
  writeUsers(users);

  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, record.id);
  return {
    token,
    user: toPublicUser(record),
    state: record.state,
    isNew: true,
  };
}

export function getUserByToken(
  token: string | undefined
): { user: PublicUser; state: FoldWiseState } | null {
  if (!token) return null;
  const userId = sessions.get(token);
  if (!userId) return null;
  const users = readUsers();
  const found = users.find((u) => u.id === userId);
  if (!found) return null;
  return { user: toPublicUser(found), state: found.state };
}

export function saveUserStateByToken(
  token: string | undefined,
  nextState: FoldWiseState
): { user: PublicUser; state: FoldWiseState } | null {
  if (!token) return null;
  const userId = sessions.get(token);
  if (!userId) return null;

  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const nextName = nextState.studentName || users[idx].name;
  users[idx] = {
    ...users[idx],
    name: nextName,
    nameKey: nextName.trim().toLowerCase(),
    grade: nextState.studentGrade || users[idx].grade,
    updatedAt: now,
    state: nextState,
  };
  writeUsers(users);
  return { user: toPublicUser(users[idx]), state: users[idx].state };
}

export function logoutByToken(token: string | undefined) {
  if (token) sessions.delete(token);
}

export function deleteUserByToken(token: string | undefined): boolean {
  if (!token) return false;
  const userId = sessions.get(token);
  if (!userId) return false;
  const users = readUsers();
  writeUsers(users.filter((u) => u.id !== userId));
  sessions.delete(token);
  return true;
}
