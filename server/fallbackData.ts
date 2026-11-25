import type {
  BugHuntProblem,
  GradeBand,
  ReasoningEvaluation,
  TutorResponsePayload,
} from '../src/types/foldwise.js';

export const SIMULATED_BUG_HUNTS: BugHuntProblem[] = [
  // ================= EARLY ELEMENTARY (Grades 1 - 3) =================
  {
    id: 'bh-early-math-1',
    subject: 'Mathematics',
    gradeBand: 'early',
    title: 'Two-Digit Addition Carry Fold',
    difficulty: 'Flat Sheet',
    prompt: 'Find the hidden mistake in this solved addition problem: 27 + 15',
    steps: [
      { stepNumber: 1, label: 'Add the ones digits', expression: '7 + 5 = 12 (write 2, carry 1 ten)' },
      { stepNumber: 2, label: 'Look at the tens digits', expression: '2 tens + 1 ten = 3 tens' },
      { stepNumber: 3, label: 'Combine tens and ones', expression: '3 tens + 2 ones = 32' },
      { stepNumber: 4, label: 'Final answer written', expression: '27 + 15 = 32' },
    ],
    bugStepNumber: 2,
    bugExplanation:
      'We carried 1 ten from 7 + 5 = 12, so we must add 2 + 1 + 1 = 4 tens (making 42, not 32)!',
    correctedStep: '2 tens + 1 ten + 1 carried ten = 4 tens  =>  42',
    hints: [
      'First Crease: Remember the extra 1 ten carried from Step 1.',
      'Guided Fold: Count all the tens in Step 2: 2 + 1 plus the carried 1!',
      'Open Sheet: Step 2 forgot to add the carried 1 ten, so 27 + 15 = 42.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-early-math-2',
    subject: 'Mathematics',
    gradeBand: 'early',
    title: 'Subtraction Borrowing Crease',
    difficulty: 'Flat Sheet',
    prompt: 'Spot the hidden mistake when solving 42 - 17.',
    steps: [
      { stepNumber: 1, label: 'Compare the ones', expression: '2 is smaller than 7, so subtract backwards: 7 - 2 = 5' },
      { stepNumber: 2, label: 'Subtract the tens', expression: '4 tens - 1 ten = 3 tens' },
      { stepNumber: 3, label: 'Put digits together', expression: '3 tens and 5 ones = 35' },
      { stepNumber: 4, label: 'Final result', expression: '42 - 17 = 35' },
    ],
    bugStepNumber: 1,
    bugExplanation:
      'You cannot flip 2 - 7 into 7 - 2! Instead, borrow 1 ten from 40 to turn 2 into 12, then 12 - 7 = 5 and 30 - 10 = 20 (answer: 25).',
    correctedStep: 'Borrow 1 ten: 12 - 7 = 5, and 3 tens - 1 ten = 2 tens => 25',
    hints: [
      'First Crease: Can you subtract 7 from 2 without borrowing from the tens?',
      'Guided Fold: Look at Step 1 — flipping 2 - 7 to 7 - 2 changes the problem!',
      'Open Sheet: Borrow 1 ten from 4 tens: 12 - 7 = 5, 3 - 1 = 2 => 25.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-early-sci-1',
    subject: 'Physics',
    gradeBand: 'early',
    title: 'Plant Sunlight & Roots Check',
    difficulty: 'Flat Sheet',
    prompt: 'A student wrote notes about how a green plant grows. Find the single mistake!',
    steps: [
      { stepNumber: 1, label: 'Roots underground', expression: 'Roots absorb water and nutrients from soil.' },
      { stepNumber: 2, label: 'Stem support', expression: 'The stem carries water up to the leaves.' },
      { stepNumber: 3, label: 'Making food', expression: 'Roots use moonlight underground to cook sugar.' },
      { stepNumber: 4, label: 'Growth result', expression: 'Healthy leaves help the plant grow.' },
    ],
    bugStepNumber: 3,
    bugExplanation:
      'Leaves (not roots!) use SUNLIGHT (not moonlight) to make food during photosynthesis.',
    correctedStep: 'Leaves use sunlight, water, and air to make food for the plant.',
    hints: [
      'First Crease: Which part of a plant catches light above ground?',
      'Guided Fold: Check Step 3 — do roots underground get light?',
      'Open Sheet: Step 3 is wrong: leaves (not roots) use sunlight to make food.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-early-prog-1',
    subject: 'Programming',
    gradeBand: 'early',
    title: 'Robot Grid Step Order',
    difficulty: 'Flat Sheet',
    prompt: 'A robot needs to step forward twice, then turn right to pick up a star at (2, -1). Find the bug!',
    steps: [
      { stepNumber: 1, label: 'Start position', expression: 'Robot starts at (0, 0) facing East' },
      { stepNumber: 2, label: 'Move sequence', expression: 'TURN_RIGHT, MOVE_FORWARD, MOVE_FORWARD' },
      { stepNumber: 3, label: 'Check direction', expression: 'Facing South after turning right' },
      { stepNumber: 4, label: 'Target claimed', expression: 'Reached (2, -1)' },
    ],
    bugStepNumber: 2,
    bugExplanation:
      'Turning right at the start points the robot South to (0, -2)! It must MOVE_FORWARD twice first to reach (2, 0), then turn right.',
    correctedStep: 'MOVE_FORWARD, MOVE_FORWARD, TURN_RIGHT, MOVE_FORWARD',
    hints: [
      'First Crease: Trace where the robot faces after Step 2’s very first command.',
      'Guided Fold: Turning right first sends the robot South instead of East.',
      'Open Sheet: Step 2 put TURN_RIGHT too early; move forward twice before turning.',
    ],
    mode: 'simulated',
  },

  // ================= UPPER ELEMENTARY (Grades 4 - 5) =================
  {
    id: 'bh-ue-math-1',
    subject: 'Mathematics',
    gradeBand: 'upper_elem',
    title: 'Fraction Addition Crease',
    difficulty: 'First Fold',
    prompt: 'Find the mistake when adding two fractions: 1/3 + 1/4.',
    steps: [
      { stepNumber: 1, label: 'Check the fractions', expression: '1/3 + 1/4' },
      { stepNumber: 2, label: 'Add tops and bottoms', expression: '(1 + 1) / (3 + 4)' },
      { stepNumber: 3, label: 'Simplify sum', expression: '= 2/7' },
      { stepNumber: 4, label: 'Compare size', expression: '2/7 is claimed to equal 1/3 + 1/4' },
    ],
    bugStepNumber: 2,
    bugExplanation:
      'Never add denominators directly! Convert to a common denominator (12): 4/12 + 3/12 = 7/12.',
    correctedStep: '4/12 + 3/12 = 7/12',
    hints: [
      'First Crease: Can you add thirds and fourths without making the pieces the same size?',
      'Guided Fold: Notice 2/7 is actually smaller than 1/3! Check Step 2.',
      'Open Sheet: Find common denominator 12: 1/3 = 4/12 and 1/4 = 3/12, sum = 7/12.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-ue-sci-1',
    subject: 'Chemistry',
    gradeBand: 'upper_elem',
    title: 'States of Matter Fold',
    difficulty: 'First Fold',
    prompt: 'Spot the single incorrect science statement about water changing states.',
    steps: [
      { stepNumber: 1, label: 'Solid ice', expression: 'Ice has a fixed shape and freezes at 0°C.' },
      { stepNumber: 2, label: 'Melting', expression: 'Heating ice above 0°C melts it into liquid water.' },
      { stepNumber: 3, label: 'Evaporation', expression: 'Cooling liquid water turns it into water vapor gas.' },
      { stepNumber: 4, label: 'Condensation', expression: 'Water vapor cools back into liquid droplets.' },
    ],
    bugStepNumber: 3,
    bugExplanation:
      'Evaporation happens when liquid water is HEATED (absorbs energy), not cooled! Cooling liquid water freezes it into ice.',
    correctedStep: 'Heating liquid water causes evaporation into water vapor gas.',
    hints: [
      'First Crease: Think about a kettle or puddle in the sun.',
      'Guided Fold: Does cooling water turn it into steam/vapor, or ice?',
      'Open Sheet: Step 3 says "Cooling" instead of "Heating" for evaporation.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-ue-prog-1',
    subject: 'Programming',
    gradeBand: 'upper_elem',
    title: 'Loop Counter Misfold',
    difficulty: 'First Fold',
    prompt: 'A student wants to print "Fold!" exactly 5 times. Spot the mistake.',
    steps: [
      { stepNumber: 1, label: 'Start counter', expression: 'count = 0' },
      { stepNumber: 2, label: 'Repeat condition', expression: 'repeat while count <= 5:' },
      { stepNumber: 3, label: 'Action inside loop', expression: '  print("Fold!"); count = count + 1' },
      { stepNumber: 4, label: 'Expected output', expression: 'Prints "Fold!" 5 times' },
    ],
    bugStepNumber: 2,
    bugExplanation:
      'Starting at count = 0 and running while count <= 5 prints for 0, 1, 2, 3, 4, 5 — that is 6 times! Use `count < 5` or start at 1.',
    correctedStep: 'repeat while count < 5:  (runs for 0, 1, 2, 3, 4 => 5 times)',
    hints: [
      'First Crease: Count on your fingers: 0, 1, 2, 3, 4, 5.',
      'Guided Fold: How many numbers are there from 0 up to AND including 5?',
      'Open Sheet: Step 2 uses `<= 5` starting from 0, which runs 6 times instead of 5.',
    ],
    mode: 'simulated',
  },

  // ================= MIDDLE SCHOOL (Grades 6 - 8) =================
  {
    id: 'bh-mid-math-1',
    subject: 'Mathematics',
    gradeBand: 'middle',
    title: 'Linear Equation Distribution Trap',
    difficulty: 'First Fold',
    prompt: 'Find the hidden algebra mistake when solving 3(x - 4) = 15.',
    steps: [
      { stepNumber: 1, label: 'Write equation', expression: '3(x - 4) = 15' },
      { stepNumber: 2, label: 'Distribute 3', expression: '3x - 4 = 15' },
      { stepNumber: 3, label: 'Add 4 to both sides', expression: '3x = 19' },
      { stepNumber: 4, label: 'Divide by 3', expression: 'x = 19/3' },
    ],
    bugStepNumber: 2,
    bugExplanation:
      'When distributing 3 across (x - 4), you must multiply BOTH terms by 3: 3·x - 3·4 = 3x - 12, giving 3x = 27 => x = 9.',
    correctedStep: '3x - 12 = 15  =>  3x = 27  =>  x = 9',
    hints: [
      'First Crease: Check the distributive property in Step 2.',
      'Guided Fold: Did the 3 multiply the -4 inside the parentheses?',
      'Open Sheet: Step 2 wrote 3x - 4 instead of 3x - 12. Correct answer: x = 9.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-mid-phys-1',
    subject: 'Physics',
    gradeBand: 'middle',
    title: 'Average Speed Unit Misfold',
    difficulty: 'First Fold',
    prompt: 'A cyclist rides 12 km in 30 minutes. Find the mistake in calculating speed in km/h.',
    steps: [
      { stepNumber: 1, label: 'Write speed formula', expression: 'Speed = Distance / Time' },
      { stepNumber: 2, label: 'Substitute numbers', expression: 'Speed = 12 km / 30' },
      { stepNumber: 3, label: 'Divide', expression: 'Speed = 0.4' },
      { stepNumber: 4, label: 'State units', expression: 'Speed = 0.4 km/h' },
    ],
    bugStepNumber: 2,
    bugExplanation:
      '30 minutes is 0.5 hours, not 30 hours! Dividing 12 km by 0.5 hours gives 24 km/h.',
    correctedStep: 'Time = 30 min = 0.5 h  =>  Speed = 12 km / 0.5 h = 24 km/h',
    hints: [
      'First Crease: Check the time unit asked for (km per HOUR).',
      'Guided Fold: How many hours is 30 minutes?',
      'Open Sheet: Step 2 divided by 30 minutes instead of 0.5 hours.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-mid-prog-1',
    subject: 'Programming',
    gradeBand: 'middle',
    title: 'Even-Number Modulo Check',
    difficulty: 'First Fold',
    prompt: 'Spot the logic mistake in this function meant to return `true` for even integers.',
    steps: [
      { stepNumber: 1, label: 'Define function', expression: 'function isEven(n) {' },
      { stepNumber: 2, label: 'Check remainder', expression: '  if (n % 2 === 1) return true;' },
      { stepNumber: 3, label: 'Fallback return', expression: '  return false;' },
      { stepNumber: 4, label: 'Close function', expression: '}' },
    ],
    bugStepNumber: 2,
    bugExplanation:
      'An even number has remainder 0 when divided by 2 (`n % 2 === 0`). Remainder 1 means the number is ODD!',
    correctedStep: '  if (n % 2 === 0) return true;',
    hints: [
      'First Crease: Test `n = 4`. What is `4 % 2`?',
      'Guided Fold: Remainder 1 after dividing by 2 belongs to odd numbers, not even numbers.',
      'Open Sheet: Step 2 should check `n % 2 === 0`.',
    ],
    mode: 'simulated',
  },

  // ================= HIGH SCHOOL (Grades 9 - 12) =================
  {
    id: 'bh-math-1',
    subject: 'Mathematics',
    gradeBand: 'high',
    title: 'Quadratic Factoring Crease',
    difficulty: 'First Fold',
    prompt: 'Find the hidden algebra mistake in this solved quadratic equation: 2x² - 8x + 6 = 0',
    steps: [
      { stepNumber: 1, label: 'Divide both sides by 2', expression: 'x² - 4x + 3 = 0' },
      { stepNumber: 2, label: 'Split the middle term', expression: 'x² - 3x - x + 3 = 0' },
      { stepNumber: 3, label: 'Factor by grouping', expression: 'x(x - 3) + 1(x - 3) = 0' },
      { stepNumber: 4, label: 'Combine factors & solve', expression: '(x + 1)(x - 3) = 0  =>  x = -1, 3' },
    ],
    bugStepNumber: 3,
    bugExplanation:
      'When factoring -x + 3, factoring out +1 gives +(-x + 3), NOT +(x - 3). You must factor out -1 to get -1(x - 3).',
    correctedStep: 'x(x - 3) - 1(x - 3) = 0  =>  (x - 1)(x - 3) = 0  =>  x = 1, 3',
    hints: [
      'First Crease: Check the signs carefully when grouping the last two terms.',
      'Guided Fold: Look at Step 2 → Step 3. Multiply +1(x - 3) back out — does it equal -x + 3?',
      'Open Sheet: Step 3 should factor out -1: -x + 3 = -1(x - 3), giving roots x = 1 and 3.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-math-2',
    subject: 'Mathematics',
    gradeBand: 'high',
    title: 'Logarithm Quotient Misfold',
    difficulty: 'Complex Fold',
    prompt: 'Spot the hidden mistake when solving log₂(x + 6) - log₂(x) = 2 for x > 0.',
    steps: [
      { stepNumber: 1, label: 'Apply log difference rule', expression: 'log₂((x + 6) - x) = 2' },
      { stepNumber: 2, label: 'Simplify inside log', expression: 'log₂(6) = 2' },
      { stepNumber: 3, label: 'Convert to exponential', expression: '6 = 2² (contradiction noted)' },
      { stepNumber: 4, label: 'Conclude', expression: 'No solution exists' },
    ],
    bugStepNumber: 1,
    bugExplanation:
      'The difference of two logarithms is the logarithm of their QUOTIENT: log₂(A) - log₂(B) = log₂(A / B).',
    correctedStep: 'log₂((x + 6) / x) = 2  =>  (x + 6)/x = 4  =>  x = 2',
    hints: [
      'First Crease: Re-read the logarithm subtraction identity in Step 1.',
      'Guided Fold: Subtraction outside a logarithm corresponds to division inside.',
      'Open Sheet: Step 1 should be log₂((x + 6) / x) = 2, solving to x = 2.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-phys-1',
    subject: 'Physics',
    gradeBand: 'high',
    title: 'Projectile Kinematics Misfold',
    difficulty: 'Complex Fold',
    prompt: 'A ball is thrown straight up at 20 m/s (g = 10 m/s²). Find the hidden physics error in calculating max height.',
    steps: [
      { stepNumber: 1, label: 'Identify known values', expression: 'u = 20 m/s, v = 0 m/s at peak, a = -10 m/s²' },
      { stepNumber: 2, label: 'Select kinematic equation', expression: 'v² = u² + 2as' },
      { stepNumber: 3, label: 'Substitute values', expression: '0 = (20)² + 2(10)s' },
      { stepNumber: 4, label: 'Solve for height s', expression: '20s = 400  =>  s = 20 m' },
    ],
    bugStepNumber: 3,
    bugExplanation:
      'In Step 3, acceleration g acts downward opposite to initial velocity u, so a = -10 m/s² was replaced by +10 m/s² during substitution.',
    correctedStep: '0 = 400 + 2(-10)s  =>  20s = 400  =>  s = +20 m cleanly.',
    hints: [
      'First Crease: Watch the direction of gravity relative to the upward throw.',
      'Guided Fold: Step 1 defines a = -10 m/s², but check what number was plugged into Step 3.',
      'Open Sheet: Step 3 substituted +10 instead of -10 into 2as.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-chem-1',
    subject: 'Chemistry',
    gradeBand: 'high',
    title: 'Ideal Gas Unit Trap',
    difficulty: 'First Fold',
    prompt: 'Spot the hidden mistake when finding moles of gas at 27°C, 2 atm, in 12.3 L (R = 0.0821 L·atm/mol·K).',
    steps: [
      { stepNumber: 1, label: 'Write Ideal Gas Law', expression: 'PV = nRT  =>  n = PV / (RT)' },
      { stepNumber: 2, label: 'Substitute P, V, R, T', expression: 'n = (2 × 12.3) / (0.0821 × 27)' },
      { stepNumber: 3, label: 'Calculate numerator & denominator', expression: 'n = 24.6 / 2.2167' },
      { stepNumber: 4, label: 'Final value', expression: 'n ≈ 11.1 moles' },
    ],
    bugStepNumber: 2,
    bugExplanation:
      'Temperature in the Ideal Gas Law must be in Kelvin (K), not Celsius (°C). 27°C = 300.15 K, making n ≈ 1.0 mole.',
    correctedStep: 'n = (2 × 12.3) / (0.0821 × 300.15) ≈ 1.00 mol',
    hints: [
      'First Crease: Look at the units of the gas constant R.',
      'Guided Fold: R has K (Kelvin) in its denominator, so what unit should T have in Step 2?',
      'Open Sheet: Step 2 used 27°C instead of converting to 300.15 K.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-code-1',
    subject: 'Programming',
    gradeBand: 'high',
    title: 'Binary Search Off-by-One',
    difficulty: 'Complex Fold',
    prompt: 'Inspect this solved binary search implementation for a hidden boundary bug.',
    steps: [
      { stepNumber: 1, label: 'Initialize bounds', expression: 'let left = 0, right = arr.length - 1;' },
      { stepNumber: 2, label: 'Loop condition', expression: 'while (left < right) {' },
      { stepNumber: 3, label: 'Compute midpoint', expression: '  const mid = Math.floor((left + right) / 2);' },
      { stepNumber: 4, label: 'Check & narrow range', expression: '  if (arr[mid] === target) return mid; else if (arr[mid] < target) left = mid + 1; else right = mid - 1; }' },
    ],
    bugStepNumber: 2,
    bugExplanation:
      'Using `while (left < right)` skips checking the final element when `left === right`, failing on 1-element arrays or targets at the last remaining index.',
    correctedStep: 'while (left <= right) {',
    hints: [
      'First Crease: Trace a 1-element array `[7]` searching for `7`.',
      'Guided Fold: What happens on the very first check if `left = 0` and `right = 0`?',
      'Open Sheet: Step 2 must be `while (left <= right)` so the single-element case is evaluated.',
    ],
    mode: 'simulated',
  },

  // ================= COLLEGE / UNIVERSITY =================
  {
    id: 'bh-col-math-1',
    subject: 'Mathematics',
    gradeBand: 'college',
    title: 'Chain Rule Silent Tear',
    difficulty: 'Master Fold',
    prompt: 'Identify the single calculus error when differentiating f(x) = sin(3x² + 1).',
    steps: [
      { stepNumber: 1, label: 'Identify outer & inner', expression: 'outer u ↦ sin(u), inner u(x) = 3x² + 1' },
      { stepNumber: 2, label: 'Differentiate outer function', expression: 'd/du [sin(u)] = cos(u)' },
      { stepNumber: 3, label: 'Apply Chain Rule', expression: "f'(x) = cos(3x² + 1) · (3x)" },
      { stepNumber: 4, label: 'Evaluate at x = 0', expression: "f'(0) = 0" },
    ],
    bugStepNumber: 3,
    bugExplanation:
      'The derivative of the inner function u(x) = 3x² + 1 is 6x, not 3x.',
    correctedStep: "f'(x) = cos(3x² + 1) · (6x) = 6x cos(3x² + 1)",
    hints: [
      'First Crease: Check the power rule applied to the inner function 3x² + 1.',
      'Guided Fold: What is d/dx (3x²)? Compare with the multiplier in Step 3.',
      'Open Sheet: Step 3 dropped the factor of 2 from x²; multiply by 6x.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-col-phys-1',
    subject: 'Physics',
    gradeBand: 'college',
    title: 'Carnot Efficiency Celsius Trap',
    difficulty: 'Master Fold',
    prompt: 'A Carnot heat engine operates between 327°C and 27°C. Find the error in computing max efficiency.',
    steps: [
      { stepNumber: 1, label: 'Identify reservoir temps', expression: 'T_hot = 327°C, T_cold = 27°C' },
      { stepNumber: 2, label: 'Write Carnot formula', expression: 'η = 1 - (T_cold / T_hot)' },
      { stepNumber: 3, label: 'Substitute temperatures', expression: 'η = 1 - (27 / 327) = 0.917' },
      { stepNumber: 4, label: 'Express percentage', expression: 'η ≈ 91.7%' },
    ],
    bugStepNumber: 3,
    bugExplanation:
      'Carnot efficiency requires ABSOLUTE Kelvin temperatures: T_cold = 300 K and T_hot = 600 K, so η = 1 - 300/600 = 50%!',
    correctedStep: 'η = 1 - (300 K / 600 K) = 0.50 = 50%',
    hints: [
      'First Crease: Thermodynamic ratios break on arbitrary zero scales.',
      'Guided Fold: Convert 27°C and 327°C to Kelvin before dividing.',
      'Open Sheet: Step 3 used °C instead of Kelvin (300 K / 600 K = 50%).',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-col-chem-1',
    subject: 'Chemistry',
    gradeBand: 'college',
    title: 'Ammonia Stoichiometry Fold',
    difficulty: 'Complex Fold',
    prompt: 'For N₂ + 3H₂ → 2NH₃, how many moles of NH₃ form from 2 mol N₂ and 3 mol H₂? Spot the error.',
    steps: [
      { stepNumber: 1, label: 'Write balanced equation', expression: 'N₂ + 3H₂ → 2NH₃' },
      { stepNumber: 2, label: 'Assume N₂ limits', expression: '2 mol N₂ × (2 mol NH₃ / 1 mol N₂) = 4 mol NH₃' },
      { stepNumber: 3, label: 'Check H₂ availability', expression: '3 mol H₂ can supply 2 mol N₂ cleanly' },
      { stepNumber: 4, label: 'State yield', expression: '4 mol NH₃ produced' },
    ],
    bugStepNumber: 3,
    bugExplanation:
      '2 mol N₂ requires 6 mol H₂! With only 3 mol H₂ available, H₂ is the limiting reagent and yields only 2 mol NH₃.',
    correctedStep: '3 mol H₂ × (2 mol NH₃ / 3 mol H₂) = 2 mol NH₃ (H₂ is limiting)',
    hints: [
      'First Crease: Check the ratio between N₂ and H₂ in Step 1.',
      'Guided Fold: How many moles of H₂ react with 2 mol of N₂?',
      'Open Sheet: Step 3 ignores the 3:1 H₂-to-N₂ requirement.',
    ],
    mode: 'simulated',
  },
  {
    id: 'bh-col-code-1',
    subject: 'Programming',
    gradeBand: 'college',
    title: 'Mutable Default List Fold',
    difficulty: 'Master Fold',
    prompt: 'Spot the classic Python bug in this helper that collects student tags per session.',
    steps: [
      { stepNumber: 1, label: 'Define function signature', expression: 'def add_tag(tag, bucket=[]):' },
      { stepNumber: 2, label: 'Append incoming tag', expression: '    bucket.append(tag)' },
      { stepNumber: 3, label: 'Return updated list', expression: '    return bucket' },
      { stepNumber: 4, label: 'Expected call behavior', expression: "add_tag('math') -> ['math'], add_tag('logic') -> ['logic']" },
    ],
    bugStepNumber: 1,
    bugExplanation:
      'Default mutable arguments (`bucket=[]`) are bound ONCE at function definition time, so subsequent calls mutate the shared list.',
    correctedStep: 'def add_tag(tag, bucket=None): bucket = [] if bucket is None else bucket',
    hints: [
      'First Crease: Think about when Python creates default parameter objects.',
      'Guided Fold: What happens on the second call to `add_tag("logic")`?',
      'Open Sheet: Step 1 uses a mutable default list `[]`; use `bucket=None`.',
    ],
    mode: 'simulated',
  },
];

export function buildSimulatedTutorReply(
  message: string,
  action: string | undefined,
  topic: string,
  difficulty: string,
  grade = 'Grade 8'
): TutorResponsePayload {
  const lower = message.toLowerCase();
  const topicLabel = topic || 'the concept';

  if (action === 'Simplify this') {
    return {
      folds: [
        {
          title: `Fold 1 — ${grade} Flat Sheet Intuition`,
          content: `At ${grade} level, think of ${topicLabel} like folding a square sheet in half: look only at how one input transforms into one clear output.`,
          creaseTip: 'Strip away heavy symbols first; state the rule in one plain sentence.',
        },
        {
          title: 'Fold 2 — A Tiny Concrete Case',
          content: `Test the smallest example (like 1, 2, or an everyday object). Once the crease holds on a tiny sheet, the pattern scales cleanly.`,
          creaseTip: 'If a rule breaks on a tiny number, you spotted a hidden boundary.',
        },
      ],
      reflectionPrompt: `In one sentence of your own words, what problem does ${topicLabel} solve?`,
      weakConceptDetected: lower.includes('confused') || lower.includes('mistake') ? topicLabel : null,
      suggestedDifficulty: 'First Fold',
      origamiMood: 'calm',
      mode: 'simulated',
      provider: 'Simulated Origami AI',
    };
  }

  if (action === 'Give me an example') {
    return {
      folds: [
        {
          title: `Fold 1 — ${grade} Example for ${topicLabel}`,
          content: `Pick clean numbers tailored to ${grade} and trace each transformation step by step without skipping intermediate lines.`,
          creaseTip: 'Clean numbers expose sign, unit, and order mistakes immediately.',
        },
        {
          title: 'Fold 2 — Edge Case Contrast',
          content: `Now flip one boundary (0, negative sign, or reversed order). Comparing normal vs edge behavior builds rock-solid intuition.`,
          creaseTip: 'Always verify units and signs line by line.',
        },
      ],
      reflectionPrompt: 'Can you try making one small example of your own?',
      weakConceptDetected: null,
      suggestedDifficulty: 'First Fold',
      origamiMood: 'curious',
      mode: 'simulated',
      provider: 'Simulated Origami AI',
    };
  }

  if (action === 'Test my knowledge') {
    return {
      folds: [
        {
          title: `Fold 1 — ${grade} Quick Check`,
          content: `Consider ${topicLabel} at ${difficulty} level: suppose we change one assumption (like doubling an input or flipping a condition).`,
          creaseTip: 'Predict the direction of change before computing.',
        },
        {
          title: 'Fold 2 — Your Turn to Crease',
          content: `Question: Why does ${topicLabel} break if you skip a key rule or unit? Write a short 1–2 sentence explanation.`,
          creaseTip: 'Strong answers name both the rule and what goes wrong without it.',
        },
      ],
      reflectionPrompt: 'Reply with your reasoning and I will evaluate your fold!',
      weakConceptDetected: null,
      suggestedDifficulty: 'Complex Fold',
      origamiMood: 'curious',
      mode: 'simulated',
      provider: 'Simulated Origami AI',
    };
  }

  if (action === 'Explain my mistake') {
    return {
      folds: [
        {
          title: 'Fold 1 — Locating the Misfold',
          content: `Most errors in "${message.slice(0, 60)}" happen at a transition step — a dropped carry/sign, an unconverted unit, or an off-by-one boundary.`,
          creaseTip: 'Re-read the line right before your answer diverged.',
        },
        {
          title: 'Fold 2 — Re-creasing Cleanly',
          content: `Check each step backward with a quick mental test to verify the transformation stayed true.`,
          creaseTip: 'One transformation per line prevents silent misfolds.',
        },
      ],
      reflectionPrompt: 'Which specific step felt uncertain when you wrote it?',
      weakConceptDetected: topicLabel,
      suggestedDifficulty: 'First Fold',
      origamiMood: 'guiding',
      mode: 'simulated',
      provider: 'Simulated Origami AI',
    };
  }

  return {
    folds: [
      {
        title: `Fold 1 — Framing ${topicLabel} (${grade})`,
        content: `Every problem in ${topicLabel} starts from a clear rule — what stays balanced or true as we work through "${message.slice(0, 75)}".`,
        creaseTip: 'Name what you know and what you are solving for first.',
      },
      {
        title: 'Fold 2 — The Core Mechanism',
        content: `Break the solution into small atomic creases: apply one clean operation per line without skipping signs or units.`,
        creaseTip: 'Slowing down on transitions prevents hidden mistakes.',
      },
      {
        title: 'Fold 3 — Sanity Check & Shape',
        content: `Once unfolded, check whether the size, sign, and units make real-world sense for ${grade}.`,
        creaseTip: 'Great scholars double-check answers backward.',
      },
    ],
    reflectionPrompt: `Why do you think the second fold in ${topicLabel} holds true here?`,
    weakConceptDetected: lower.includes('hard') || lower.includes('stuck') ? topicLabel : null,
    suggestedDifficulty: 'Complex Fold',
    origamiMood: 'guiding',
    mode: 'simulated',
    provider: 'Simulated Origami AI',
  };
}

export function buildSimulatedReasoningEval(
  question: string,
  userExplanation: string,
  expectedConcept: string
): ReasoningEvaluation {
  const words = userExplanation.trim().split(/\s+/).filter(Boolean).length;
  const lower = userExplanation.toLowerCase();
  const keywords = expectedConcept
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3);
  const hits = keywords.filter((k) => lower.includes(k)).length;
  const hasCausal =
    lower.includes('because') ||
    lower.includes('since') ||
    lower.includes('therefore') ||
    lower.includes('so ') ||
    lower.includes('means') ||
    lower.includes('gives');

  const rawScore = Math.min(96, Math.max(28, 30 + words * 2 + hits * 14 + (hasCausal ? 15 : 0)));
  const understood = rawScore >= 65;

  return {
    score: rawScore,
    understood,
    strengths: understood
      ? [
          'Clear causal explanation connecting the step to the underlying rule.',
          'Identified the critical transformation without rushing.',
        ]
      : ['Good start attempting to articulate your reasoning in your own words.'],
    gaps: understood
      ? ['Try naming an edge case for Masterpiece level.']
      : [
          `Your explanation for "${question.slice(0, 50)}..." needs a clearer link to ${expectedConcept}.`,
          'State explicitly *why* the rule holds using "because...".',
        ],
    feedback: understood
      ? `Crisp fold! Your reasoning demonstrates solid conceptual grasp (${rawScore}/100). The final crease locks neatly into place.`
      : `Gentle misfold (${rawScore}/100). Expand on the rule behind ${expectedConcept} using "because..." to unlock the final fold.`,
    nextDifficulty: rawScore >= 85 ? 'Master Fold' : rawScore >= 65 ? 'Complex Fold' : 'First Fold',
    xpEarned: understood ? 65 : 20,
    mode: 'simulated',
  };
}
