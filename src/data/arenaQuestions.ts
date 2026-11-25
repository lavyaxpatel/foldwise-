import type { GradeBand } from '../types/foldwise';

export interface SpeedQuestion {
  band: GradeBand;
  subject: string;
  q: string;
  opts: string[];
  ans: number;
}

export const SPEED_QUESTIONS: SpeedQuestion[] = [
  // Early Elementary (Grades 1-3)
  { band: 'early', subject: 'Mathematics', q: 'What is 28 + 14?', opts: ['32', '42', '52'], ans: 1 },
  { band: 'early', subject: 'Mathematics', q: 'How many sides does a hexagon have?', opts: ['5', '6', '8'], ans: 1 },
  { band: 'early', subject: 'Science', q: 'Which sense organ helps you hear music?', opts: ['Eyes', 'Ears', 'Nose'], ans: 1 },
  { band: 'early', subject: 'Science', q: 'Water freezes into ice when it gets:', opts: ['Hotter', 'Colder', 'Brighter'], ans: 1 },
  { band: 'early', subject: 'Logic', q: 'What comes next in the pattern: 5, 10, 15, 20, ___?', opts: ['22', '25', '30'], ans: 1 },

  // Upper Elementary (Grades 4-5)
  { band: 'upper_elem', subject: 'Mathematics', q: 'What is 3/4 + 1/4?', opts: ['4/8', '1 whole', '2/4'], ans: 1 },
  { band: 'upper_elem', subject: 'Mathematics', q: 'Area of a rectangle with length 7 cm and width 4 cm:', opts: ['11 cm²', '22 cm²', '28 cm²'], ans: 2 },
  { band: 'upper_elem', subject: 'Science', q: 'Which planet is closest to the Sun?', opts: ['Mercury', 'Venus', 'Mars'], ans: 0 },
  { band: 'upper_elem', subject: 'Science', q: 'Which state of matter takes both the shape and volume of its container?', opts: ['Solid', 'Liquid', 'Gas'], ans: 2 },
  { band: 'upper_elem', subject: 'Logic', q: 'If a loop repeats 4 times and prints 2 stars each time, how many stars appear?', opts: ['6', '8', '16'], ans: 1 },

  // Middle School (Grades 6-8)
  { band: 'middle', subject: 'Mathematics', q: 'Solve for x: 4x - 5 = 15', opts: ['x = 2.5', 'x = 5', 'x = 20'], ans: 1 },
  { band: 'middle', subject: 'Mathematics', q: 'What is 25% of 80?', opts: ['15', '20', '25'], ans: 1 },
  { band: 'middle', subject: 'Physics', q: 'A runner covers 100 m in 10 s. Average speed is:', opts: ['10 m/s', '90 m/s', '1000 m/s'], ans: 0 },
  { band: 'middle', subject: 'Programming', q: 'In JavaScript/Python, what is the remainder `17 % 5`?', opts: ['2', '3', '5'], ans: 0 },
  { band: 'middle', subject: 'Biology', q: 'Which gas do green plants take in during photosynthesis?', opts: ['Oxygen', 'Carbon dioxide', 'Nitrogen'], ans: 1 },

  // High School (Grades 9-12)
  { band: 'high', subject: 'Mathematics', q: 'What are the roots of x² - 5x + 6 = 0?', opts: ['x = 2, 3', 'x = -2, -3', 'x = 1, 6'], ans: 0 },
  { band: 'high', subject: 'Programming', q: 'Time complexity of Binary Search on n sorted items?', opts: ['O(n)', 'O(log n)', 'O(n log n)'], ans: 1 },
  { band: 'high', subject: 'Physics', q: 'SI unit of electrical resistance?', opts: ['Volt', 'Ohm', 'Watt'], ans: 1 },
  { band: 'high', subject: 'Chemistry', q: '0°C on the absolute Kelvin scale equals:', opts: ['273.15 K', '100 K', '-273.15 K'], ans: 0 },
  { band: 'high', subject: 'Chemistry', q: 'A solution with pH = 4 has how many times more H⁺ than pH = 6?', opts: ['2×', '20×', '100×'], ans: 2 },

  // College
  { band: 'college', subject: 'Mathematics', q: 'Derivative of sin(x) evaluated at x = 0?', opts: ['0', '1', '-1'], ans: 1 },
  { band: 'college', subject: 'Programming', q: 'Which data structure guarantees O(1) amortized push and LIFO pop?', opts: ['Stack', 'Binary Heap', 'BST'], ans: 0 },
  { band: 'college', subject: 'Logic', q: 'The contrapositive of "If P then Q" is logically equivalent to:', opts: ['If Q then P', 'If not Q then not P', 'If not P then not Q'], ans: 1 },
  { band: 'college', subject: 'Physics', q: 'Max efficiency of a Carnot engine between 600 K and 300 K:', opts: ['25%', '50%', '75%'], ans: 1 },
  { band: 'college', subject: 'Mathematics', q: 'Eigenvalues of a 2×2 identity matrix are:', opts: ['0 and 1', 'Both 1', '1 and -1'], ans: 1 },
];

export interface TruthClaim {
  band: GradeBand;
  subject: string;
  claim: string;
  isTrue: boolean;
  reveal: string;
}

export const TRUTH_CLAIMS: TruthClaim[] = [
  {
    band: 'early',
    subject: 'Mathematics',
    claim: 'Adding 0 to any number changes the number to 0.',
    isTrue: false,
    reveal: 'TRAP: Multiplying by 0 gives 0, but adding 0 leaves the number unchanged!',
  },
  {
    band: 'early',
    subject: 'Science',
    claim: 'The Sun is a star at the center of our solar system.',
    isTrue: true,
    reveal: 'TRUTH: Our Sun is a medium-sized star that gives Earth light and warmth.',
  },
  {
    band: 'upper_elem',
    subject: 'Mathematics',
    claim: '1/2 is larger than 1/4.',
    isTrue: true,
    reveal: 'TRUTH: Cutting a whole into 2 pieces gives larger pieces than cutting into 4 pieces.',
  },
  {
    band: 'upper_elem',
    subject: 'Science',
    claim: 'A magnet attracts all metals, including aluminum foil and copper coins.',
    isTrue: false,
    reveal: 'TRAP: Magnets attract ferromagnetic metals like iron, nickel, and cobalt — not aluminum or copper.',
  },
  {
    band: 'middle',
    subject: 'Mathematics',
    claim: 'Multiplying two negative numbers gives a positive number.',
    isTrue: true,
    reveal: 'TRUTH: Two negative signs cancel in multiplication, e.g., (-3) × (-4) = +12.',
  },
  {
    band: 'middle',
    subject: 'Physics',
    claim: 'Heavier objects always fall faster than lighter objects in a vacuum.',
    isTrue: false,
    reveal: 'TRAP: Without air resistance, all objects accelerate downward at the exact same rate g!',
  },
  {
    band: 'high',
    subject: 'Physics',
    claim: 'At the peak of vertical projectile motion, velocity is zero while acceleration remains -g.',
    isTrue: true,
    reveal: 'TRUTH: Gravity continues pulling downward at -g even at the instantaneous apex.',
  },
  {
    band: 'high',
    subject: 'Chemistry',
    claim: 'A catalyst lowers activation energy without changing the overall ΔH of the reaction.',
    isTrue: true,
    reveal: 'TRUTH: Catalysts open a lower-energy pathway; reactant and product enthalpies stay identical.',
  },
  {
    band: 'college',
    subject: 'Programming',
    claim: 'In Python, `a is b` always checks value equality just like `a == b`.',
    isTrue: false,
    reveal: 'TRAP: `is` checks object identity (memory reference), whereas `==` compares values.',
  },
  {
    band: 'college',
    subject: 'Mathematics',
    claim: 'Every continuous function on ℝ is differentiable everywhere.',
    isTrue: false,
    reveal: 'TRAP: Sharp corners such as f(x) = |x| are continuous at x = 0 yet not differentiable there.',
  },
];

export interface BossTrial {
  id: string;
  band: GradeBand;
  name: string;
  subtitle: string;
  stages: { q: string; opts: string[]; ans: number }[];
}

export const BOSS_TRIALS: BossTrial[] = [
  {
    id: 'boss-early',
    band: 'early',
    name: 'The Paper Sparrow Trial',
    subtitle: 'Grades 1–3 Numbers, Shapes & Nature',
    stages: [
      { q: 'Stage 1 (Math): What is 35 + 17?', opts: ['42', '52', '62'], ans: 1 },
      { q: 'Stage 2 (Science): Which part of a plant absorbs water from soil?', opts: ['Roots', 'Petals', 'Seeds'], ans: 0 },
      { q: 'Stage 3 (Logic): Which shape has 4 equal sides and 4 square corners?', opts: ['Triangle', 'Square', 'Circle'], ans: 1 },
    ],
  },
  {
    id: 'boss-ue',
    band: 'upper_elem',
    name: 'The Origami Fox Trial',
    subtitle: 'Grades 4–5 Fractions, Matter & Patterns',
    stages: [
      { q: 'Stage 1 (Fractions): Which fraction equals 1/2?', opts: ['2/3', '3/6', '4/5'], ans: 1 },
      { q: 'Stage 2 (Science): Liquid water turning into gas when heated is called:', opts: ['Evaporation', 'Freezing', 'Condensation'], ans: 0 },
      { q: 'Stage 3 (Geometry): Perimeter of a square with side 6 cm:', opts: ['12 cm', '24 cm', '36 cm'], ans: 1 },
    ],
  },
  {
    id: 'boss-middle',
    band: 'middle',
    name: 'The Indigo Crane Trial',
    subtitle: 'Grades 6–8 Algebra, Motion & Logic',
    stages: [
      { q: 'Stage 1 (Algebra): Solve 2(x + 3) = 14', opts: ['x = 4', 'x = 5.5', 'x = 8'], ans: 0 },
      { q: 'Stage 2 (Physics): Speed of a bike going 45 km in 1.5 hours:', opts: ['25 km/h', '30 km/h', '67.5 km/h'], ans: 1 },
      { q: 'Stage 3 (Code): Remainder when 23 is divided by 4 (`23 % 4`):', opts: ['1', '3', '5'], ans: 1 },
    ],
  },
  {
    id: 'boss-dragon',
    band: 'high',
    name: 'The Golden Dragon',
    subtitle: 'Grades 9–12 Algebra, Physics & Algorithms',
    stages: [
      { q: 'Stage 1 (Algebra): What value of k gives x² + kx + 9 = 0 one repeated root?', opts: ['k = 3', 'k = 6 or -6', 'k = 9'], ans: 1 },
      { q: 'Stage 2 (Physics): Tripling speed multiplies kinetic energy by:', opts: ['3×', '6×', '9×'], ans: 2 },
      { q: 'Stage 3 (Algorithms): What invariant keeps Binary Search O(log n)?', opts: ['Re-sorting inside the loop', 'Halving the sorted search interval each step', 'Linear scanning'], ans: 1 },
    ],
  },
  {
    id: 'boss-leviathan',
    band: 'college',
    name: 'The Grand Master Leviathan',
    subtitle: 'College Calculus, Thermo & Systems',
    stages: [
      { q: 'Stage 1 (Calculus): Derivative of ln(2x) with respect to x:', opts: ['1 / (2x)', '1 / x', '2 / x'], ans: 1 },
      { q: 'Stage 2 (Concurrency): Why does `arr.forEach(async fn)` cause race surprises?', opts: ['forEach skips odd items', 'forEach does not await returned Promises', 'async cannot be used in callbacks'], ans: 1 },
      { q: 'Stage 3 (Logic): Negating "All cranes are red" yields:', opts: ['No cranes are red', 'At least one crane is not red', 'Some red things are not cranes'], ans: 1 },
    ],
  },
];

export interface DetectiveCase {
  id: string;
  band: GradeBand;
  title: string;
  prompt: string;
  cards: { id: number; title: string; code: string }[];
  faultyCardId: number;
  explanation: string;
}

export const DETECTIVE_CASES: DetectiveCase[] = [
  {
    id: 'det-early',
    band: 'early',
    title: 'Case 01 — Missing Robot Step',
    prompt: 'The paper robot wants to move 3 steps right to reach the flower. Click the wrong instruction card.',
    cards: [
      { id: 1, title: 'Clue A: Start', code: 'Robot stands at Square 0 facing Right' },
      { id: 2, title: 'Clue B: Moves', code: 'STEP_FORWARD, TURN_BACK, STEP_FORWARD' },
      { id: 3, title: 'Clue C: Goal', code: 'Expected position: Square 3' },
    ],
    faultyCardId: 2,
    explanation: 'TURN_BACK turned the robot around! It needed three STEP_FORWARD commands.',
  },
  {
    id: 'det-ue',
    band: 'upper_elem',
    title: 'Case 02 — Loop Count Slip',
    prompt: 'This loop was meant to clap 5 times, but clapped 6 times. Spot the faulty card.',
    cards: [
      { id: 1, title: 'Clue A: Counter', code: 'claps = 0' },
      { id: 2, title: 'Clue B: Condition', code: 'while (claps <= 5)' },
      { id: 3, title: 'Clue C: Action', code: 'clap(); claps = claps + 1;' },
    ],
    faultyCardId: 2,
    explanation: 'Starting at 0 with `<= 5` runs for 0, 1, 2, 3, 4, 5 (6 times). Use `claps < 5`.',
  },
  {
    id: 'det-middle',
    band: 'middle',
    title: 'Case 03 — Even Checker Mix-Up',
    prompt: 'This helper returns `true` for odd numbers instead of even numbers. Pick the bug.',
    cards: [
      { id: 1, title: 'Clue A: Input', code: 'function isEven(num) {' },
      { id: 2, title: 'Clue B: Remainder', code: '  if (num % 2 === 1) return true;' },
      { id: 3, title: 'Clue C: Default', code: '  return false; }' },
    ],
    faultyCardId: 2,
    explanation: 'Even numbers have remainder `0` when divided by 2: `num % 2 === 0`.',
  },
  {
    id: 'det-high',
    band: 'high',
    title: 'Case 04 — Out-of-Bounds Loop',
    prompt: 'This search returns `undefined` instead of `-1` when `target` is absent. Click the faulty clue.',
    cards: [
      { id: 1, title: 'Evidence A: Input', code: 'nums = [2, 4, 6, 8], target = 9' },
      { id: 2, title: 'Evidence B: Loop Bound', code: 'for (let i = 0; i <= nums.length; i++)' },
      { id: 3, title: 'Evidence C: Match Check', code: 'if (nums[i] === target) return i; return -1;' },
    ],
    faultyCardId: 2,
    explanation: '`i <= nums.length` reads `nums[4]` (`undefined`). Using `i < nums.length` fixes the boundary.',
  },
  {
    id: 'det-college',
    band: 'college',
    title: 'Case 05 — The Ghost Closure',
    prompt: 'Every delayed timer prints `3` instead of `0, 1, 2`. Inspect the paper clues to spot why.',
    cards: [
      { id: 1, title: 'Evidence A: Loop Declaration', code: 'for (var i = 0; i < 3; i++) {' },
      { id: 2, title: 'Evidence B: Timer Delay', code: '  setTimeout(() => console.log(i), 50);' },
      { id: 3, title: 'Evidence C: Closing Brace', code: '}' },
    ],
    faultyCardId: 1,
    explanation: '`var` is function-scoped, so all 3 callbacks share one `i` (which finishes at 3). Use `let i = 0`!',
  },
];

export interface ExamItem {
  band: GradeBand;
  subject: string;
  q: string;
  opts: string[];
  ans: number;
}

export const EXAM_ITEMS: ExamItem[] = [
  // Early
  { band: 'early', subject: 'Math', q: '1. What is 19 + 6?', opts: ['24', '25', '26'], ans: 1 },
  { band: 'early', subject: 'Math', q: '2. Which number is greater: 74 or 47?', opts: ['74', '47', 'Equal'], ans: 0 },
  { band: 'early', subject: 'Science', q: '3. Which animal lays eggs?', opts: ['Dog', 'Duck', 'Cat'], ans: 1 },
  { band: 'early', subject: 'Logic', q: '4. Complete: 2, 4, 6, ___', opts: ['7', '8', '9'], ans: 1 },

  // Upper Elementary
  { band: 'upper_elem', subject: 'Math', q: '1. What is 12 × 6?', opts: ['62', '72', '84'], ans: 1 },
  { band: 'upper_elem', subject: 'Math', q: '2. Which is equivalent to 2/4?', opts: ['1/2', '2/3', '1/4'], ans: 0 },
  { band: 'upper_elem', subject: 'Science', q: '3. Plants release which gas during photosynthesis?', opts: ['Oxygen', 'Nitrogen', 'Helium'], ans: 0 },
  { band: 'upper_elem', subject: 'Logic', q: '4. Perimeter of a 5 cm × 3 cm rectangle:', opts: ['8 cm', '15 cm', '16 cm'], ans: 2 },

  // Middle
  { band: 'middle', subject: 'Math', q: '1. Solve 5x = 35', opts: ['x = 6', 'x = 7', 'x = 30'], ans: 1 },
  { band: 'middle', subject: 'Physics', q: '2. Speed = 60 km / 2 hours =', opts: ['30 km/h', '120 km/h', '58 km/h'], ans: 0 },
  { band: 'middle', subject: 'Chemistry', q: '3. Water (H₂O) is made of hydrogen and:', opts: ['Carbon', 'Oxygen', 'Nitrogen'], ans: 1 },
  { band: 'middle', subject: 'Programming', q: '4. Which boolean checks if x equals 10?', opts: ['x = 10', 'x === 10', 'x != 10'], ans: 1 },

  // High
  { band: 'high', subject: 'Mathematics', q: '1. If f(x) = 3x² - 12, what are its zeros?', opts: ['±2', '±4', '0 and 4'], ans: 0 },
  { band: 'high', subject: 'Programming', q: '2. Which data structure gives LIFO ordering?', opts: ['Queue', 'Stack', 'Hash Map'], ans: 1 },
  { band: 'high', subject: 'Chemistry', q: '3. In PV = nRT, if T doubles at constant n and V, P:', opts: ['Halves', 'Doubles', 'Stays constant'], ans: 1 },
  { band: 'high', subject: 'Physics', q: '4. Slope of a velocity–time graph equals:', opts: ['Displacement', 'Acceleration', 'Momentum'], ans: 1 },

  // College
  { band: 'college', subject: 'Mathematics', q: '1. What is d/dx [e^(3x)]?', opts: ['e^(3x)', '3e^(3x)', '3xe^(3x)'], ans: 1 },
  { band: 'college', subject: 'Programming', q: '2. Worst-case lookup in a balanced BST of n nodes:', opts: ['O(1)', 'O(log n)', 'O(n)'], ans: 1 },
  { band: 'college', subject: 'Logic', q: '3. Equivalent to "If P then Q":', opts: ['If Q then P', 'If not Q then not P', 'If not P then Q'], ans: 1 },
  { band: 'college', subject: 'Chemistry', q: '4. Which thermodynamic sign denotes spontaneous ΔG at constant T, P?', opts: ['ΔG < 0', 'ΔG > 0', 'ΔG = 1'], ans: 0 },
];

export interface DeepFoldPrompt {
  id: string;
  band: GradeBand;
  subject: string;
  title: string;
  question: string;
  expectedConcept: string;
  starterHint: string;
}

export const DEEP_FOLD_PROMPTS: DeepFoldPrompt[] = [
  {
    id: 'df-early',
    band: 'early',
    subject: 'Mathematics',
    title: 'Why Carrying Tens Works',
    question: 'When adding 18 + 5, why do we trade 10 ones for 1 ten?',
    expectedConcept: 'ten ones equal one ten place value',
    starterHint: 'Explain that 10 ones make 1 ten in the tens column.',
  },
  {
    id: 'df-ue',
    band: 'upper_elem',
    subject: 'Mathematics',
    title: 'Common Denominators',
    question: 'Why must we find a common denominator before adding 1/3 + 1/4?',
    expectedConcept: 'equal sized parts whole denominator',
    starterHint: 'Mention that thirds and fourths are different-sized pieces.',
  },
  {
    id: 'df-middle',
    band: 'middle',
    subject: 'Physics',
    title: 'Converting Minutes to Hours',
    question: 'Why do we change 30 minutes into 0.5 hours before computing speed in km/h?',
    expectedConcept: 'units hour sixty minutes match rate',
    starterHint: 'Explain that km/h needs time measured in hours, not minutes.',
  },
  {
    id: 'df-high',
    band: 'high',
    subject: 'Chemistry',
    title: 'Absolute Zero & Gas Pressure',
    question: 'Why do we convert Celsius to Kelvin before substituting T into PV = nRT?',
    expectedConcept: 'Kelvin absolute zero proportional gas law temperature',
    starterHint: 'Mention absolute zero (0 K) and why 0°C would wrongly make PV = 0.',
  },
  {
    id: 'df-college',
    band: 'college',
    subject: 'Programming',
    title: 'Binary Search Invariant',
    question: 'Why does Binary Search guarantee O(log n) steps and require sorted order?',
    expectedConcept: 'sorted monotonic half interval discard logarithmic',
    starterHint: 'Explain how ordering lets us safely discard half of remaining elements each step.',
  },
];

export function filterByBand<T extends { band: GradeBand }>(items: T[], band: GradeBand): T[] {
  const matched = items.filter((item) => item.band === band);
  return matched.length > 0 ? matched : items;
}
