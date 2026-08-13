export type Operation = 'add' | 'sub' | 'mul' | 'div' | 'mix';
export type Difficulty = 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'ADVANCED';
export const DIFFICULTY_LEVELS: Difficulty[] = ['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'ADVANCED'];

export interface Question {
  id: string;
  operation: Operation;
  operand1: number;
  operand2: number;
  correctAnswer: number;
  difficulty: Difficulty;
  timeLimit?: number; // In seconds
}

export interface GameResult {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // 0 to 100
  averageResponseTime: number; // in milliseconds
  xpEarned: number;
  starsEarned: number;
  bestStreak: number;
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateQuestion(operation: Operation, difficulty: Difficulty): Question {
  let op = operation;
  if (op === 'mix') {
    const ops: Operation[] = ['add', 'sub', 'mul', 'div'];
    op = ops[getRandomInt(0, 3)];
  }

  let operand1 = 0;
  let operand2 = 0;
  let correctAnswer = 0;

  switch (difficulty) {
    case 'BEGINNER':
      if (op === 'add') {
        operand1 = getRandomInt(1, 5);
        operand2 = getRandomInt(1, 5);
      } else if (op === 'sub') {
        operand1 = getRandomInt(2, 10);
        operand2 = getRandomInt(1, operand1 - 1);
      } else if (op === 'mul') {
        operand1 = getRandomInt(1, 3);
        operand2 = getRandomInt(1, 5);
      } else if (op === 'div') {
        operand2 = getRandomInt(1, 3);
        correctAnswer = getRandomInt(1, 4);
        operand1 = operand2 * correctAnswer;
      }
      break;
    case 'EASY':
      if (op === 'add') {
        operand1 = getRandomInt(1, 20);
        operand2 = getRandomInt(1, 20);
      } else if (op === 'sub') {
        operand1 = getRandomInt(10, 30);
        operand2 = getRandomInt(1, operand1 - 1);
      } else if (op === 'mul') {
        operand1 = getRandomInt(2, 6);
        operand2 = getRandomInt(2, 6);
      } else if (op === 'div') {
        operand2 = getRandomInt(2, 6);
        correctAnswer = getRandomInt(2, 6);
        operand1 = operand2 * correctAnswer;
      }
      break;
    case 'MEDIUM':
      if (op === 'add') {
        operand1 = getRandomInt(10, 100);
        operand2 = getRandomInt(10, 100);
      } else if (op === 'sub') {
        operand1 = getRandomInt(50, 150);
        operand2 = getRandomInt(10, operand1 - 1);
      } else if (op === 'mul') {
        operand1 = getRandomInt(3, 10);
        operand2 = getRandomInt(3, 10);
      } else if (op === 'div') {
        operand2 = getRandomInt(3, 10);
        correctAnswer = getRandomInt(3, 10);
        operand1 = operand2 * correctAnswer;
      }
      break;
    case 'HARD':
      if (op === 'add') {
        operand1 = getRandomInt(100, 500);
        operand2 = getRandomInt(100, 500);
      } else if (op === 'sub') {
        operand1 = getRandomInt(200, 800);
        operand2 = getRandomInt(50, operand1 - 10);
      } else if (op === 'mul') {
        operand1 = getRandomInt(5, 20);
        operand2 = getRandomInt(5, 20);
      } else if (op === 'div') {
        operand2 = getRandomInt(4, 20);
        correctAnswer = getRandomInt(4, 15);
        operand1 = operand2 * correctAnswer;
      }
      break;
    case 'ADVANCED':
      if (op === 'add') {
        operand1 = getRandomInt(500, 2000);
        operand2 = getRandomInt(500, 2000);
      } else if (op === 'sub') {
        operand1 = getRandomInt(1000, 3000);
        operand2 = getRandomInt(100, operand1 - 100);
      } else if (op === 'mul') {
        operand1 = getRandomInt(10, 50);
        operand2 = getRandomInt(10, 30);
      } else if (op === 'div') {
        operand2 = getRandomInt(10, 30);
        correctAnswer = getRandomInt(10, 30);
        operand1 = operand2 * correctAnswer;
      }
      break;
  }

  if (op !== 'div') {
    if (op === 'add') correctAnswer = operand1 + operand2;
    if (op === 'sub') correctAnswer = operand1 - operand2;
    if (op === 'mul') correctAnswer = operand1 * operand2;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    operation: op,
    operand1,
    operand2,
    correctAnswer,
    difficulty,
  };
}

export function getOperationSymbol(op: Operation) {
  switch (op) {
    case 'add': return '+';
    case 'sub': return '-';
    case 'mul': return '×';
    case 'div': return '÷';
    default: return '?';
  }
}

export function calculateResults(
  totalQuestions: number,
  correctCount: number,
  responseTimesMs: number[],
  bestStreak: number,
  difficulty: Difficulty,
  hasDailyChallengeBonus: boolean = false
): GameResult {
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const avgTime = responseTimesMs.length > 0 ? responseTimesMs.reduce((a, b) => a + b, 0) / responseTimesMs.length : 0;
  
  // Base XP
  let xp = correctCount * 10;
  // Difficulty Multiplier
  const diffMultiplier = {
    'BEGINNER': 1,
    'EASY': 1.2,
    'MEDIUM': 1.5,
    'HARD': 2,
    'ADVANCED': 3
  }[difficulty];
  
  xp = Math.round(xp * diffMultiplier);

  // Bonus for streaks (consecutive correct answers in game)
  if (bestStreak >= 3) xp += 10;
  if (bestStreak >= 5) xp += 20;
  if (bestStreak >= 10) xp += 50;

  // Daily challenge bonus
  if (hasDailyChallengeBonus) xp += 100;

  // Stars: 1 for completing, 2 for >=80% accuracy, 3 for 100%
  let stars = 0;
  if (totalQuestions > 0) {
    if (accuracy === 100) stars = 3;
    else if (accuracy >= 80) stars = 2;
    else if (correctCount > 0) stars = 1;
  }

  return {
    totalQuestions,
    correctAnswers: correctCount,
    accuracy,
    averageResponseTime: Math.round(avgTime),
    xpEarned: xp,
    starsEarned: stars,
    bestStreak
  };
}

export function calculateLevel(currentXp: number) {
  // Simple curve: Each level requires (Level * 500) XP. 
  // L1: 0-499, L2: 500-1499, L3: 1500-2999
  let level = 1;
  let threshold = 500;
  let xpCounter = currentXp;

  while (xpCounter >= threshold) {
    xpCounter -= threshold;
    level++;
    threshold = level * 500;
  }

  return { 
    level, 
    currentLevelXp: xpCounter, 
    nextLevelThreshold: threshold,
    progressPercentage: Math.round((xpCounter / threshold) * 100)
  };
}

export function checkNewBadges(
  result: GameResult, 
  operation: Operation, 
  currentBadges: string[]
): string[] {
  const newBadges: string[] = [];
  const addBadge = (id: string) => {
    if (!currentBadges.includes(id) && !newBadges.includes(id)) {
      newBadges.push(id);
    }
  };

  addBadge('first_practice');
  if (result.correctAnswers >= 10) addBadge('10_correct');
  if (result.averageResponseTime > 0 && result.averageResponseTime <= 3000 && result.correctAnswers > 5) addBadge('speed_master');
  if (result.accuracy === 100) addBadge('perfect_score');
  
  if (result.accuracy >= 80) {
    if (operation === 'add') addBadge('add_master');
    if (operation === 'sub') addBadge('sub_master');
    if (operation === 'mul') addBadge('mul_master');
    if (operation === 'div') addBadge('div_master');
    if (operation === 'mix') addBadge('math_explorer');
  }
  
  return newBadges;
}

export function evaluateAdaptiveDifficulty(
  result: GameResult, 
  currentDifficulty: Difficulty
): { nextDifficulty: Difficulty; label: string } {
  const currentIndex = DIFFICULTY_LEVELS.indexOf(currentDifficulty);
  const { accuracy, averageResponseTime, totalQuestions } = result;

  if (accuracy >= 90 && averageResponseTime <= 5000 && totalQuestions >= 10) {
    // Ready for more: increase difficulty if possible
    const nextIndex = Math.min(currentIndex + 1, DIFFICULTY_LEVELS.length - 1);
    return {
      nextDifficulty: DIFFICULTY_LEVELS[nextIndex],
      label: 'Ready for More'
    };
  } else if (accuracy < 70) {
    // Getting easier: decrease difficulty if possible
    const prevIndex = Math.max(currentIndex - 1, 0);
    return {
      nextDifficulty: DIFFICULTY_LEVELS[prevIndex],
      label: 'Getting Easier'
    };
  } else {
    // Just right: keep current difficulty
    return {
      nextDifficulty: currentDifficulty,
      label: 'Just Right'
    };
  }
}
