import type { AuthUser, FoldWiseState, GradeLevel } from '../types/foldwise';

export interface AuthPayload {
  token: string;
  user: AuthUser;
  state: FoldWiseState;
  isNew: boolean;
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

export async function apiLoginOrEnroll(params: {
  fullName: string;
  password: string;
  grade: GradeLevel;
  initialState: FoldWiseState;
}): Promise<AuthPayload | { error: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Login failed' };
    return { ...(data as Omit<AuthPayload, 'storageMode'>), storageMode: 'server' };
  } catch {
    const cleanName = params.fullName.trim();
    if (cleanName.length < 2) return { error: 'Please enter your full name.' };
    if (params.password.length < 4) return { error: 'Password must be at least 4 characters.' };

    const nameKey = cleanName.toLowerCase();
    const accounts = readLocalAccounts();
    const idx = accounts.findIndex((a) => a.nameKey === nameKey);
    const now = new Date().toISOString();

    if (idx !== -1) {
      const found = accounts[idx];
      if (found.password !== params.password) {
        return { error: 'Incorrect password for this scholar name.' };
      }
      const nextState: FoldWiseState = {
        ...found.state,
        studentName: cleanName,
        studentGrade: params.grade,
      };
      accounts[idx] = { ...found, grade: params.grade, updatedAt: now, state: nextState };
      writeLocalAccounts(accounts);
      return {
        token: `local-token:${nameKey}`,
        user: { id: found.id, name: cleanName, grade: params.grade, createdAt: found.createdAt, updatedAt: now },
        state: nextState,
        isNew: false,
        storageMode: 'local',
      };
    }

    const record: LocalAccountRecord = {
      id: `local-${Date.now()}`,
      nameKey,
      name: cleanName,
      grade: params.grade,
      password: params.password,
      createdAt: now,
      updatedAt: now,
      state: { ...params.initialState, studentName: cleanName, studentGrade: params.grade },
    };
    accounts.push(record);
    writeLocalAccounts(accounts);
    return {
      token: `local-token:${nameKey}`,
      user: { id: record.id, name: cleanName, grade: params.grade, createdAt: now, updatedAt: now },
      state: record.state,
      isNew: true,
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
  if (token.startsWith('local-token:')) {
    const nameKey = token.replace('local-token:', '');
    const accounts = readLocalAccounts();
    const idx = accounts.findIndex((a) => a.nameKey === nameKey);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    accounts[idx] = {
      ...accounts[idx],
      name: state.studentName,
      grade: state.studentGrade,
      updatedAt: now,
      state,
    };
    writeLocalAccounts(accounts);
    return {
      user: {
        id: accounts[idx].id,
        name: accounts[idx].name,
        grade: accounts[idx].grade,
        createdAt: accounts[idx].createdAt,
        updatedAt: now,
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

export async function apiDeleteAccount(token: string): Promise<boolean> {
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
