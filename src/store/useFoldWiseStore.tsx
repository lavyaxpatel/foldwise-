import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  DIFFICULTY_TIERS,
  getRankForXp,
  INITIAL_MISSIONS,
  INITIAL_TOPICS,
} from '../data/curriculum';
import {
  apiDeleteAccount,
  apiFetchMe,
  apiLoginOrEnroll,
  apiLogout,
  apiSaveUserState,
} from '../services/authClient';
import type {
  ArenaModeId,
  AuthUser,
  ChatMessage,
  DifficultyTier,
  FoldWiseState,
  GradeLevel,
  NavRoute,
  PaperSkinId,
  TopicNode,
} from '../types/foldwise';

const STORAGE_KEY = 'foldwise_state_v3';
const SESSION_TOKEN_KEY = 'foldwise_session_token_v2';

export const DEFAULT_STATE: FoldWiseState = {
  studentName: 'Scholar',
  studentGrade: 'Grade 8',
  xp: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  dailyMinutesCompleted: 0,
  accuracyHistory: [],
  weeklyActivity: [
    { day: 'Mon', minutes: 0, folds: 0 },
    { day: 'Tue', minutes: 0, folds: 0 },
    { day: 'Wed', minutes: 0, folds: 0 },
    { day: 'Thu', minutes: 0, folds: 0 },
    { day: 'Fri', minutes: 0, folds: 0 },
    { day: 'Sat', minutes: 0, folds: 0 },
    { day: 'Sun', minutes: 0, folds: 0 },
  ],
  difficulty: 'Flat Sheet',
  topics: INITIAL_TOPICS,
  unlockedSkins: ['washi-ivory'],
  badges: [],
  missions: INITIAL_MISSIONS,
  challengesCompleted: {
    'bug-hunt': 0,
    'speed-hunt': 0,
    'truth-or-trap': 0,
    'boss-battle': 0,
    'code-detective': 0,
    'exam-mode': 0,
    'deep-fold': 0,
  },
  tutorHistory: [
    {
      id: 'welcome-1',
      role: 'tutor',
      text: 'Welcome to FoldWise. Every concept unfolds cleanly when matched to your grade level.',
      folds: [
        {
          title: 'Fold 1 — Begin from 0 XP',
          content:
            'Ask me any question or pick a quick action below — I adapt every explanation to your selected grade.',
          creaseTip: 'Your first Bug Hunt or Tutor fold unlocks your opening origami badges.',
        },
      ],
      reflectionPrompt: 'Which subject would you like to unfold first?',
      mode: 'simulated',
      provider: 'FoldWise Guide',
      timestamp: new Date().toISOString(),
    },
  ],
  settings: {
    reducedMotion: false,
    activeSkin: 'washi-ivory',
    tutorPersona: 'crane',
    soundEffects: false,
    dailyGoalMinutes: 30,
    apiProviderHint: 'gemini',
  },
  examBestScore: null,
};

interface FoldWiseContextValue {
  state: FoldWiseState;
  route: NavRoute;
  setRoute: (r: NavRoute) => void;
  selectedTopicId: string;
  setSelectedTopicId: (id: string) => void;
  levelUpBanner: string | null;
  dismissLevelUp: () => void;
  authUser: AuthUser | null;
  authReady: boolean;
  syncStatus: 'synced' | 'saving' | 'local';
  loginAtStart: (params: {
    fullName: string;
    password: string;
    grade: GradeLevel;
  }) => Promise<{ ok: boolean; error?: string; isNew?: boolean }>;
  logoutAccount: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
  syncNow: () => Promise<void>;
  importUserState: (jsonText: string) => { ok: boolean; error?: string };
  awardXp: (amount: number, reason?: string) => void;
  recordChallengeWin: (mode: ArenaModeId, xp: number, accuracy?: number, topicId?: string) => void;
  markTopicProgress: (topicId: string, delta: number, weak?: boolean) => void;
  appendTutorMessage: (msg: ChatMessage) => void;
  updateSettings: (partial: Partial<FoldWiseState['settings']>) => void;
  unlockSkin: (skin: PaperSkinId, costXp: number) => boolean;
  setExamBestScore: (score: number) => void;
  setStudentName: (name: string) => void;
  setStudentGrade: (grade: GradeLevel) => void;
  resetProgress: () => void;
}

const FoldWiseContext = createContext<FoldWiseContextValue | null>(null);

export const FoldWiseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FoldWiseState>(DEFAULT_STATE);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SESSION_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'local'>('local');

  const [route, setRoute] = useState<NavRoute>('home');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('math-quadratics');
  const [levelUpBanner, setLevelUpBanner] = useState<string | null>(null);
  const skipNextSyncRef = useRef(false);

  // Restore active session on boot if present
  useEffect(() => {
    if (!authToken) {
      setAuthReady(true);
      return;
    }
    void apiFetchMe(authToken).then((res) => {
      if (res) {
        skipNextSyncRef.current = true;
        setAuthUser(res.user);
        setState({ ...DEFAULT_STATE, ...res.state });
        setSyncStatus(authToken.startsWith('local-token:') ? 'local' : 'synced');
      } else {
        localStorage.removeItem(SESSION_TOKEN_KEY);
        setAuthToken(null);
      }
      setAuthReady(true);
    });
  }, []);

  // Persist locally & debounce sync to signed-in backend account
  useEffect(() => {
    document.documentElement.setAttribute('data-skin', state.settings.activeSkin);

    if (!authToken || !authUser) {
      setSyncStatus('local');
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }

    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    setSyncStatus('saving');
    const timer = setTimeout(() => {
      void apiSaveUserState(authToken, state).then((res) => {
        if (res) {
          setAuthUser(res.user);
          setSyncStatus(res.storageMode === 'server' ? 'synced' : 'local');
        } else {
          setSyncStatus('local');
        }
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [state, authToken, authUser?.id]);

  const loginAtStart = async (params: {
    fullName: string;
    password: string;
    grade: GradeLevel;
  }) => {
    const starter: FoldWiseState = {
      ...DEFAULT_STATE,
      studentName: params.fullName.trim() || 'Scholar',
      studentGrade: params.grade,
      xp: 0,
      streak: 0,
    };
    const res = await apiLoginOrEnroll({
      fullName: params.fullName,
      password: params.password,
      grade: params.grade,
      initialState: starter,
    });
    if ('error' in res) return { ok: false, error: res.error };

    skipNextSyncRef.current = true;
    localStorage.setItem(SESSION_TOKEN_KEY, res.token);
    setAuthToken(res.token);
    setAuthUser(res.user);
    setState({ ...DEFAULT_STATE, ...res.state });
    setSyncStatus(res.storageMode === 'server' ? 'synced' : 'local');
    setRoute('home');
    return { ok: true, isNew: res.isNew };
  };

  const logoutAccount = async () => {
    await apiLogout(authToken);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    setAuthToken(null);
    setAuthUser(null);
    setState(DEFAULT_STATE);
    setSyncStatus('local');
  };

  const deleteAccount = async () => {
    if (!authToken) return false;
    const ok = await apiDeleteAccount(authToken);
    if (ok) {
      localStorage.removeItem(SESSION_TOKEN_KEY);
      localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
      setAuthUser(null);
      setState(DEFAULT_STATE);
      setSyncStatus('local');
    }
    return ok;
  };

  const syncNow = async () => {
    if (!authToken) return;
    setSyncStatus('saving');
    const res = await apiSaveUserState(authToken, state);
    if (res) {
      setAuthUser(res.user);
      setSyncStatus(res.storageMode === 'server' ? 'synced' : 'local');
    }
  };

  const importUserState = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText) as Partial<FoldWiseState>;
      if (typeof parsed.xp !== 'number' || !Array.isArray(parsed.topics)) {
        return { ok: false, error: 'Invalid FoldWise backup JSON structure.' };
      }
      setState({ ...DEFAULT_STATE, ...parsed });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not parse JSON file.' };
    }
  };

  const awardXp = (amount: number, reason?: string) => {
    setState((prev) => {
      const prevRank = getRankForXp(prev.xp).current.rank;
      const nextXp = prev.xp + amount;
      const nextRank = getRankForXp(nextXp).current.rank;

      if (nextRank !== prevRank) {
        setLevelUpBanner(`Ascended to ${nextRank}!${reason ? ` (${reason})` : ''}`);
      }

      const nextSkins = [...prev.unlockedSkins];
      if (nextXp >= 250 && !nextSkins.includes('vermilion-gold')) nextSkins.push('vermilion-gold');
      if (nextXp >= 500 && !nextSkins.includes('indigo-mist')) nextSkins.push('indigo-mist');
      if (nextXp >= 800 && !nextSkins.includes('sakura-parchment')) nextSkins.push('sakura-parchment');

      const nextWeekly = [...prev.weeklyActivity];
      const last = nextWeekly[nextWeekly.length - 1];
      if (last) {
        nextWeekly[nextWeekly.length - 1] = {
          ...last,
          minutes: last.minutes + 4,
          folds: last.folds + 1,
        };
      }

      return {
        ...prev,
        xp: nextXp,
        dailyMinutesCompleted: prev.dailyMinutesCompleted + 4,
        unlockedSkins: nextSkins,
        weeklyActivity: nextWeekly,
      };
    });
  };

  const adaptDifficulty = (current: DifficultyTier, accuracy: number): DifficultyTier => {
    const idx = DIFFICULTY_TIERS.indexOf(current);
    if (accuracy >= 85 && idx < DIFFICULTY_TIERS.length - 1) return DIFFICULTY_TIERS[idx + 1];
    if (accuracy < 55 && idx > 0) return DIFFICULTY_TIERS[idx - 1];
    return current;
  };

  const recordChallengeWin = (
    mode: ArenaModeId,
    xp: number,
    accuracy = 88,
    topicId?: string
  ) => {
    setState((prev) => {
      const prevRank = getRankForXp(prev.xp).current.rank;
      const nextXp = prev.xp + xp;
      const nextRank = getRankForXp(nextXp).current.rank;
      if (nextRank !== prevRank) {
        setLevelUpBanner(`New Origami Rank Unlocked: ${nextRank}!`);
      }

      const missions = prev.missions.map((m) => {
        if (m.completed) return m;
        if (
          (mode === 'bug-hunt' && m.id === 'm-bughunt') ||
          (mode === 'deep-fold' && m.id === 'm-reasoning')
        ) {
          const nextProg = Math.min(m.target, m.progress + 1);
          return { ...m, progress: nextProg, completed: nextProg >= m.target };
        }
        return m;
      });

      const topics: TopicNode[] = prev.topics.map((t) => {
        if (!topicId || t.id !== topicId) return t;
        const nextProgress = Math.min(100, t.progress + 25);
        const status: TopicNode['status'] = nextProgress >= 100 ? 'completed' : 'current';
        return {
          ...t,
          progress: nextProgress,
          status,
          isWeak: accuracy < 65 ? true : nextProgress >= 80 ? false : t.isWeak,
        };
      });

      const unlockedTopics = topics.map((t) => {
        if (mode === 'boss-battle' && t.id === 'mastery-dragon') {
          return { ...t, status: 'completed' as const, progress: 100 };
        }
        if (t.status === 'locked') {
          const prereqDone = topics.some(
            (src) => src.status === 'completed' && src.connections.includes(t.id)
          );
          if (prereqDone) return { ...t, status: 'current' as const, progress: 15 };
        }
        return t;
      });

      const badges = [...prev.badges];
      if (mode === 'boss-battle' && !badges.includes('Dragon Unfolder')) {
        badges.push('Dragon Unfolder');
      }
      if (mode === 'deep-fold' && !badges.includes('Deep Reasoner')) {
        badges.push('Deep Reasoner');
      }

      return {
        ...prev,
        xp: nextXp,
        accuracyHistory: [...prev.accuracyHistory.slice(-9), accuracy],
        difficulty: adaptDifficulty(prev.difficulty, accuracy),
        missions,
        topics: unlockedTopics,
        badges,
        challengesCompleted: {
          ...prev.challengesCompleted,
          [mode]: (prev.challengesCompleted[mode] || 0) + 1,
        },
      };
    });
  };

  const markTopicProgress = (topicId: string, delta: number, weak?: boolean) => {
    setState((prev) => {
      const updated = prev.topics.map((t) => {
        if (t.id !== topicId) return t;
        const progress = Math.min(100, Math.max(0, t.progress + delta));
        return {
          ...t,
          progress,
          status: progress >= 100 ? ('completed' as const) : ('current' as const),
          isWeak: weak !== undefined ? weak : progress >= 85 ? false : t.isWeak,
        };
      });
      return { ...prev, topics: updated };
    });
  };

  const appendTutorMessage = (msg: ChatMessage) => {
    setState((prev) => {
      const missions = prev.missions.map((m) => {
        if (m.id === 'm-tutor' && !m.completed && msg.role === 'tutor') {
          const p = Math.min(m.target, m.progress + 1);
          return { ...m, progress: p, completed: p >= m.target };
        }
        return m;
      });
      return {
        ...prev,
        missions,
        tutorHistory: [...prev.tutorHistory.slice(-24), msg],
      };
    });
  };

  const updateSettings = (partial: Partial<FoldWiseState['settings']>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...partial },
    }));
  };

  const unlockSkin = (skin: PaperSkinId, costXp: number) => {
    if (state.unlockedSkins.includes(skin)) {
      updateSettings({ activeSkin: skin });
      return true;
    }
    if (state.xp < costXp) return false;
    setState((prev) => ({
      ...prev,
      unlockedSkins: [...prev.unlockedSkins, skin],
      settings: { ...prev.settings, activeSkin: skin },
    }));
    return true;
  };

  const setExamBestScore = (score: number) => {
    setState((prev) => ({
      ...prev,
      examBestScore: prev.examBestScore === null ? score : Math.max(prev.examBestScore, score),
    }));
  };

  const setStudentName = (name: string) => {
    setState((prev) => ({ ...prev, studentName: name || 'Scholar' }));
  };

  const setStudentGrade = (grade: GradeLevel) => {
    setState((prev) => ({ ...prev, studentGrade: grade }));
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState((prev) => ({
      ...DEFAULT_STATE,
      studentName: authUser?.name || prev.studentName,
      studentGrade: prev.studentGrade,
    }));
  };

  return (
    <FoldWiseContext.Provider
      value={{
        state,
        route,
        setRoute,
        selectedTopicId,
        setSelectedTopicId,
        levelUpBanner,
        dismissLevelUp: () => setLevelUpBanner(null),
        authUser,
        authReady,
        syncStatus,
        loginAtStart,
        logoutAccount,
        deleteAccount,
        syncNow,
        importUserState,
        awardXp,
        recordChallengeWin,
        markTopicProgress,
        appendTutorMessage,
        updateSettings,
        unlockSkin,
        setExamBestScore,
        setStudentName,
        setStudentGrade,
        resetProgress,
      }}
    >
      {children}
    </FoldWiseContext.Provider>
  );
};

export function useFoldWise() {
  const ctx = useContext(FoldWiseContext);
  if (!ctx) throw new Error('useFoldWise must be used inside FoldWiseProvider');
  return ctx;
}
