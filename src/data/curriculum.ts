import type {
  DailyMission,
  DifficultyTier,
  GradeBand,
  GradeLevel,
  PaperSkinId,
  StudentRank,
  TopicNode,
} from '../types/foldwise';

export const GRADE_LEVELS: GradeLevel[] = [
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'College',
];

export function gradeToBand(grade: GradeLevel | string | undefined): GradeBand {
  if (!grade) return 'high';
  if (grade === 'College') return 'college';
  const num = Number(String(grade).replace(/[^0-9]/g, ''));
  if (num >= 1 && num <= 3) return 'early';
  if (num >= 4 && num <= 5) return 'upper_elem';
  if (num >= 6 && num <= 8) return 'middle';
  return 'high';
}

export const GRADE_BAND_LABELS: Record<GradeBand, string> = {
  early: 'Early Elementary (Grades 1–3)',
  upper_elem: 'Upper Elementary (Grades 4–5)',
  middle: 'Middle School (Grades 6–8)',
  high: 'High School (Grades 9–12)',
  college: 'College & University',
};

export const DIFFICULTY_TIERS: DifficultyTier[] = [
  'Flat Sheet',
  'First Fold',
  'Complex Fold',
  'Master Fold',
  'Masterpiece',
];

export const RANK_THRESHOLDS: { rank: StudentRank; minXp: number; badge: string }[] = [
  { rank: 'Paper Apprentice', minXp: 0, badge: 'Flat Square' },
  { rank: 'Fold Explorer', minXp: 250, badge: 'Valley Crease' },
  { rank: 'Paper Artisan', minXp: 650, badge: 'Mountain Fold' },
  { rank: 'Origami Architect', minXp: 1200, badge: 'Modular Star' },
  { rank: 'Fold Master', minXp: 2000, badge: 'Thousand Cranes' },
  { rank: 'Grand Origami Master', minXp: 3200, badge: 'Golden Dragon' },
];

export function getRankForXp(xp: number): {
  current: (typeof RANK_THRESHOLDS)[number];
  next: (typeof RANK_THRESHOLDS)[number] | null;
  progressPct: number;
} {
  let current = RANK_THRESHOLDS[0];
  let next: (typeof RANK_THRESHOLDS)[number] | null = RANK_THRESHOLDS[1];

  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (xp >= RANK_THRESHOLDS[i].minXp) {
      current = RANK_THRESHOLDS[i];
      next = RANK_THRESHOLDS[i + 1] ?? null;
    }
  }

  if (!next) return { current, next: null, progressPct: 100 };
  const span = next.minXp - current.minXp;
  const pct = Math.min(100, Math.max(0, Math.round(((xp - current.minXp) / span) * 100)));
  return { current, next, progressPct: pct };
}

export const INITIAL_TOPICS: TopicNode[] = [
  {
    id: 'math-quadratics',
    title: 'Number Patterns & Algebra',
    subject: 'Mathematics',
    origamiModel: 'star',
    modelName: 'Geometric Star',
    description: 'Core arithmetic, equations, symmetry, and proof structures scaled to your grade.',
    status: 'current',
    progress: 0,
    isWeak: false,
    difficulty: 'Flat Sheet',
    x: 16,
    y: 28,
    connections: ['prog-algorithms', 'phys-kinematics'],
    concepts: ['Number sense', 'Equations', 'Symmetry'],
  },
  {
    id: 'prog-algorithms',
    title: 'Logic & Algorithms',
    subject: 'Programming',
    origamiModel: 'robot',
    modelName: 'Paper Robot',
    description: 'Step-by-step sequences, conditions, loops, and efficient problem solving.',
    status: 'current',
    progress: 0,
    isWeak: false,
    difficulty: 'Flat Sheet',
    x: 42,
    y: 20,
    connections: ['logic-deduction', 'mastery-dragon'],
    concepts: ['Sequences', 'Conditionals', 'Binary Search'],
  },
  {
    id: 'phys-kinematics',
    title: 'Forces & Motion',
    subject: 'Physics',
    origamiModel: 'aeroplane',
    modelName: 'Paper Aeroplane',
    description: 'Pushes, pulls, circuits, speed, and kinematics tailored to your grade.',
    status: 'current',
    progress: 0,
    isWeak: false,
    difficulty: 'Flat Sheet',
    x: 22,
    y: 66,
    connections: ['chem-bonding'],
    concepts: ['Motion', 'Circuits', 'Energy'],
  },
  {
    id: 'chem-bonding',
    title: 'Matter & Reactions',
    subject: 'Chemistry',
    origamiModel: 'molecule',
    modelName: 'Modular Molecular Sculpture',
    description: 'States of matter, mixtures, pH, and gas laws adapted to your level.',
    status: 'current',
    progress: 0,
    isWeak: false,
    difficulty: 'First Fold',
    x: 48,
    y: 68,
    connections: ['bio-genetics', 'logic-deduction'],
    concepts: ['Matter', 'Reactions', 'Gas Laws'],
  },
  {
    id: 'bio-genetics',
    title: 'Living Systems',
    subject: 'Biology',
    origamiModel: 'butterfly',
    modelName: 'Origami Butterfly',
    description: 'Plants, habitats, human body systems, and cellular energetics.',
    status: 'locked',
    progress: 0,
    isWeak: false,
    difficulty: 'First Fold',
    x: 72,
    y: 74,
    connections: ['hist-architecture'],
    concepts: ['Habitats', 'Cells', 'Energy'],
  },
  {
    id: 'logic-deduction',
    title: 'Reasoning & Puzzles',
    subject: 'Logical Reasoning',
    origamiModel: 'cube',
    modelName: 'Sonobe Puzzle Cube',
    description: 'Deductive chains, patterns, and spotting hidden false clues.',
    status: 'locked',
    progress: 0,
    isWeak: false,
    difficulty: 'Master Fold',
    x: 68,
    y: 36,
    connections: ['hist-architecture', 'mastery-dragon'],
    concepts: ['Patterns', 'Deduction', 'Counterexamples'],
  },
  {
    id: 'hist-architecture',
    title: 'Craft & World History',
    subject: 'History',
    origamiModel: 'pagoda',
    modelName: 'Japanese Pagoda',
    description: 'Timelines, primary sources, and engineering heritage.',
    status: 'locked',
    progress: 0,
    isWeak: false,
    difficulty: 'Complex Fold',
    x: 86,
    y: 54,
    connections: ['mastery-dragon'],
    concepts: ['Chronology', 'Sources', 'Architecture'],
  },
  {
    id: 'mastery-dragon',
    title: 'Synthesis Grand Fold',
    subject: 'Advanced Mastery',
    origamiModel: 'dragon',
    modelName: 'Golden Dragon',
    description: 'Cross-disciplinary mastery combining reasoning, science, and craft.',
    status: 'locked',
    progress: 0,
    isWeak: false,
    difficulty: 'Masterpiece',
    x: 86,
    y: 18,
    connections: [],
    concepts: ['Synthesis', 'Proofs', 'Debugging'],
  },
];

export const PAPER_SKINS: {
  id: PaperSkinId;
  name: string;
  subtitle: string;
  swatch: string;
  unlockCostXp: number;
}[] = [
  {
    id: 'washi-ivory',
    name: 'Classic Washi Ivory',
    subtitle: 'Hand-pressed Kyoto mulberry paper',
    swatch: '#F8F4EC',
    unlockCostXp: 0,
  },
  {
    id: 'vermilion-gold',
    name: 'Vermilion & Gold Leaf',
    subtitle: 'Ceremonial torii accent weave',
    swatch: '#C8433A',
    unlockCostXp: 250,
  },
  {
    id: 'indigo-mist',
    name: 'Aizome Indigo Mist',
    subtitle: 'Cool mineral dye parchment',
    swatch: '#5D819E',
    unlockCostXp: 500,
  },
  {
    id: 'sakura-parchment',
    name: 'Sakura Silk Parchment',
    subtitle: 'Soft blossom fiber finish',
    swatch: '#ACA0C6',
    unlockCostXp: 800,
  },
];

export const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'm-bughunt',
    title: 'Repair 1 Broken Fold in Bug Hunt',
    xp: 80,
    progress: 0,
    target: 1,
    completed: false,
  },
  {
    id: 'm-tutor',
    title: 'Unfold 2 concepts with the AI Tutor',
    xp: 60,
    progress: 0,
    target: 2,
    completed: false,
  },
  {
    id: 'm-reasoning',
    title: 'Complete a Deep Fold explanation',
    xp: 75,
    progress: 0,
    target: 1,
    completed: false,
  },
];

export const LEADERBOARD_PEERS = [
  { name: 'Aoi Takahashi', rank: 'Fold Master' as StudentRank, xp: 2480, streak: 19, models: 7 },
  { name: 'Liam Mercer', rank: 'Origami Architect' as StudentRank, xp: 1620, streak: 12, models: 6 },
  { name: 'Sora Watanabe', rank: 'Origami Architect' as StudentRank, xp: 1340, streak: 9, models: 5 },
  { name: 'Maya Chen', rank: 'Paper Artisan' as StudentRank, xp: 890, streak: 7, models: 4 },
  { name: 'Noah Patel', rank: 'Fold Explorer' as StudentRank, xp: 410, streak: 4, models: 2 },
];
