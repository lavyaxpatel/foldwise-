export type NavRoute =
  | 'home'
  | 'dashboard'
  | 'tutor'
  | 'learn'
  | 'arena'
  | 'map'
  | 'leaderboard'
  | 'analytics'
  | 'profile'
  | 'settings';

export type GradeLevel =
  | 'Grade 1'
  | 'Grade 2'
  | 'Grade 3'
  | 'Grade 4'
  | 'Grade 5'
  | 'Grade 6'
  | 'Grade 7'
  | 'Grade 8'
  | 'Grade 9'
  | 'Grade 10'
  | 'Grade 11'
  | 'Grade 12'
  | 'College';

export type GradeBand = 'early' | 'upper_elem' | 'middle' | 'high' | 'college';

export interface AuthUser {
  id: string;
  name: string;
  grade: GradeLevel;
  createdAt: string;
  updatedAt: string;
}

export type DifficultyTier =
  | 'Flat Sheet'
  | 'First Fold'
  | 'Complex Fold'
  | 'Master Fold'
  | 'Masterpiece';

export type StudentRank =
  | 'Paper Apprentice'
  | 'Fold Explorer'
  | 'Paper Artisan'
  | 'Origami Architect'
  | 'Fold Master'
  | 'Grand Origami Master';

export type PaperSkinId = 'washi-ivory' | 'vermilion-gold' | 'indigo-mist' | 'sakura-parchment';

export type OrigamiShapeId =
  | 'crane'
  | 'fox'
  | 'star'
  | 'robot'
  | 'aeroplane'
  | 'molecule'
  | 'butterfly'
  | 'pagoda'
  | 'cube'
  | 'dragon'
  | 'hummingbird'
  | 'mask'
  | 'magnifier';

export type ArenaModeId =
  | 'bug-hunt'
  | 'speed-hunt'
  | 'truth-or-trap'
  | 'boss-battle'
  | 'code-detective'
  | 'exam-mode'
  | 'deep-fold';

export type TutorQuickAction =
  | 'Simplify this'
  | 'Give me an example'
  | 'Explain step by step'
  | 'Test my knowledge'
  | 'Give me a hint'
  | 'Summarise this'
  | 'Explain my mistake';

export interface TutorFold {
  title: string;
  content: string;
  creaseTip: string;
}

export interface TutorResponsePayload {
  folds: TutorFold[];
  reflectionPrompt: string;
  weakConceptDetected: string | null;
  suggestedDifficulty: DifficultyTier;
  origamiMood: 'calm' | 'curious' | 'celebrating' | 'guiding';
  mode: 'live' | 'simulated';
  provider: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  folds?: TutorFold[];
  reflectionPrompt?: string;
  weakConceptDetected?: string | null;
  mode?: 'live' | 'simulated';
  provider?: string;
  timestamp: string;
}

export interface BugHuntStep {
  stepNumber: number;
  label: string;
  expression: string;
}

export interface BugHuntProblem {
  id: string;
  subject: 'Mathematics' | 'Physics' | 'Chemistry' | 'Programming' | 'Science';
  gradeBand?: GradeBand;
  title: string;
  difficulty: DifficultyTier;
  prompt: string;
  steps: BugHuntStep[];
  bugStepNumber: number;
  bugExplanation: string;
  correctedStep: string;
  hints: [string, string, string];
  mode?: 'live' | 'simulated';
}

export interface ReasoningEvaluation {
  score: number;
  understood: boolean;
  strengths: string[];
  gaps: string[];
  feedback: string;
  nextDifficulty: DifficultyTier;
  xpEarned: number;
  mode: 'live' | 'simulated';
}

export interface TopicNode {
  id: string;
  title: string;
  subject: string;
  origamiModel: OrigamiShapeId;
  modelName: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  progress: number;
  isWeak: boolean;
  difficulty: DifficultyTier;
  x: number;
  y: number;
  connections: string[];
  concepts: string[];
}

export interface DailyMission {
  id: string;
  title: string;
  xp: number;
  progress: number;
  target: number;
  completed: boolean;
}

export interface UserSettings {
  reducedMotion: boolean;
  activeSkin: PaperSkinId;
  tutorPersona: 'crane' | 'fox';
  soundEffects: boolean;
  dailyGoalMinutes: number;
  apiProviderHint: string;
}

export interface FoldWiseState {
  studentName: string;
  studentGrade: GradeLevel;
  xp: number;
  streak: number;
  lastActiveDate: string;
  dailyMinutesCompleted: number;
  accuracyHistory: number[];
  weeklyActivity: { day: string; minutes: number; folds: number }[];
  difficulty: DifficultyTier;
  topics: TopicNode[];
  unlockedSkins: PaperSkinId[];
  badges: string[];
  missions: DailyMission[];
  challengesCompleted: Record<ArenaModeId, number>;
  tutorHistory: ChatMessage[];
  settings: UserSettings;
  examBestScore: number | null;
}
