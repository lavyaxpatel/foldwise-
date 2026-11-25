import type { AuthUser, FoldWiseState, GradeLevel } from '../types/foldwise';

export interface AuthPayload {
  token: string;
  user: AuthUser;
  state: FoldWiseState;
  storageMode: 'server' | 'local';
}

const LOCAL_USERS_KEY = 'foldwise_local_accounts_v2';

interface LocalAccountRecord {
  id: string;
  nameKey: string;
  name: string;
  grade: GradeLevel;
  password: string;
  createdAt: string;
  updatedAt: string;
  state: FoldWiseState;
}

function readLocalAccounts(): LocalAccountRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalAccountRecord[]) : [];
  } catch {
    return [];
  }
}

function writeLocalAccounts(records: LocalAccountRecord[]) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(records));
  } catch {
    // ignore storage errors
  }
}

function mirrorLocalAccount(params: {
  id: string;
  name: string;
  grade: GradeLevel;
  password?: string;
  createdAt: string;
  updatedAt: string;
  state: FoldWiseState;
}) {
  const nameKey = params.name.trim().toLowerCase();
  const accounts = readLocalAccounts();
  const idx = accounts.findIndex((a) => a.nameKey === nameKey);
  if (idx !== -1) {
    accounts[idx] = {
      ...accounts[idx],
      name: params.name,
      grade: params.grade,
      password: params.password ?? accounts[idx].password,
      updatedAt: params.updatedAt,
      state: params.state,
    };
  } else {
    accounts.push({
      id: params.id,
      nameKey,
      name: params.name,
      grade: params.grade,
      password: params.password || '',
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      state: params.state,
    });
  }
  writeLocalAccounts(accounts);
}

export async function apiRegister(params: {
  fullName: string;
  password: string;
  grade: GradeLevel;
  initialState: FoldWiseState;
}): Promise<AuthPayload | { error: string }> {
  const cleanName = params.fullName.trim();
  if (cleanName.length < 2) return { error: 'Please enter your full name (at least 2 characters).' };
  if (params.password.length < 4) return { error: 'Password must be at least 4 characters.' };

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Could not create account.' };

    const payload = data as Omit<AuthPayload, 'storageMode'>;
    mirrorLocalAccount({
      ...payload.user,
      password: params.password,
      state: payload.state,
    });
    return { ...payload, storageMode: 'server' };
  } catch {
    const nameKey = cleanName.toLowerCase();
    const accounts = readLocalAccounts();
    if (accounts.some((a) => a.nameKey === nameKey)) {
      return { error: 'An account with this name already exists. Please Sign In instead.' };
    }
    const now = new Date().toISOString();
    const state: FoldWiseState = {
      ...params.initialState,
      studentName: cleanName,
      studentGrade: params.grade,
    };
    const record: LocalAccountRecord = {
      id: `local-${Date.now()}`,
      nameKey,
      name: cleanName,
      grade: params.grade,
      password: params.password,
      createdAt: now,
      updatedAt: now,
      state,
    };
    accounts.push(record);
    writeLocalAccounts(accounts);
    return {
      token: `local-token:${nameKey}`,
      user: { id: record.id, name: cleanName, grade: params.grade, createdAt: now, updatedAt: now },
      state,
      storageMode: 'local',
    };
  }
}

export async function apiLogin(params: {
  fullName: string;
  password: string;
}): Promise<AuthPayload | { error: string }> {
  const cleanName = params.fullName.trim();
  if (cleanName.length < 2) return { error: 'Please enter your full name.' };

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Sign in failed.' };

    const payload = data as Omit<AuthPayload, 'storageMode'>;
    mirrorLocalAccount({
      ...payload.user,
      password: params.password,
      state: payload.state,
    });
    return { ...payload, storageMode: 'server' };
  } catch {
    const nameKey = cleanName.toLowerCase();
    const found = readLocalAccounts().find((a) => a.nameKey === nameKey);
    if (!found) {
      return { error: 'No account found for this name. Switch to Create Account to make one.' };
    }
    if (found.password !== params.password) {
      return { error: 'Incorrect password. Please try again.' };
    }
    return {
      token: `local-token:${nameKey}`,
      user: {
        id: found.id,
        name: found.name,
        grade: found.grade,
        createdAt: found.createdAt,
        updatedAt: found.updatedAt,
      },
      state: found.state,
      storageMode: 'local',
    };
  }
}

export async function apiFetchMe(token: string): Promise<{ user: AuthUser; state: FoldWiseState } | null> {
  if (token.startsWith('local-token:')) {
    const nameKey = token.replace('local-token:', '');
    const found = readLocalAccounts().find((a) => a.nameKey === nameKey);
    if (!found) return null;
    return {
      user: {
        id: found.id,
        name: found.name,
        grade: found.grade,
        createdAt: found.createdAt,
        updatedAt: found.updatedAt,
      },
      state: found.state,
    };
  }
  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as { user: AuthUser; state: FoldWiseState };
  } catch {
    return null;
  }
}

export async function apiSaveUserState(
  token: string,
  state: FoldWiseState
): Promise<{ user: AuthUser; storageMode: 'server' | 'local' } | null> {
  const nameKey = state.studentName.trim().toLowerCase();
  const accounts = readLocalAccounts();
  const localIdx = accounts.findIndex((a) => a.nameKey === nameKey);
  if (localIdx !== -1) {
    const now = new Date().toISOString();
    accounts[localIdx] = {
      ...accounts[localIdx],
      name: state.studentName,
      grade: state.studentGrade,
      updatedAt: now,
      state,
    };
    writeLocalAccounts(accounts);
  }

  if (token.startsWith('local-token:')) {
    if (localIdx === -1) return null;
    return {
      user: {
        id: accounts[localIdx].id,
        name: accounts[localIdx].name,
        grade: accounts[localIdx].grade,
        createdAt: accounts[localIdx].createdAt,
        updatedAt: accounts[localIdx].updatedAt,
      },
      storageMode: 'local',
    };
  }

  try {
    const res = await fetch('/api/user/state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ state }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { user: AuthUser };
    return { user: data.user, storageMode: 'server' };
  } catch {
    return null;
  }
}

export async function apiLogout(token: string | null) {
  if (!token || token.startsWith('local-token:')) return;
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // ignore
  }
}

export async function apiDeleteAccount(token: string, studentName?: string): Promise<boolean> {
  if (studentName) {
    const nameKey = studentName.trim().toLowerCase();
    writeLocalAccounts(readLocalAccounts().filter((a) => a.nameKey !== nameKey));
  }
  if (token.startsWith('local-token:')) {
    const nameKey = token.replace('local-token:', '');
    writeLocalAccounts(readLocalAccounts().filter((a) => a.nameKey !== nameKey));
    return true;
  }
  try {
    const res = await fetch('/api/auth/account', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
