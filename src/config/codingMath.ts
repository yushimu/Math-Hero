import { CodingMathLevelDef } from '../types/codingMath';

export const CODING_MATH_CONFIG = {
  // Global settings for unlocking the next level
  unlockRequirements: {
    minScore: 80, // Minimum score needed (out of 100)
    minAccuracy: 80, // Minimum accuracy percentage
  },
  
  // Default values
  defaultQuestionsPerLevel: 5,
};

export const CODING_MATH_LEVELS: CodingMathLevelDef[] = [
  {
    id: 'LEVEL_1',
    levelNumber: 1,
    title: 'Math Explorer',
    description: 'Learn basic patterns and logic.',
    questionCount: 5,
  },
  {
    id: 'LEVEL_2',
    levelNumber: 2,
    title: 'Pattern Solver',
    description: 'Find numbers and logical patterns.',
    questionCount: 5,
  },
  {
    id: 'LEVEL_3',
    levelNumber: 3,
    title: 'Number Detective',
    description: 'Solve number relationships.',
    questionCount: 5,
  },
  {
    id: 'LEVEL_4',
    levelNumber: 4,
    title: 'Sequence Master',
    description: 'Master the art of sequences.',
    questionCount: 5,
  },
  {
    id: 'LEVEL_5',
    levelNumber: 5,
    title: 'Logic Puzzle',
    description: 'Solve mathematical puzzles.',
    questionCount: 5,
  },
  {
    id: 'LEVEL_6',
    levelNumber: 6,
    title: 'Math Thinker',
    description: 'Think outside the box.',
    questionCount: 5,
  },
  {
    id: 'LEVEL_7',
    levelNumber: 7,
    title: 'Geometry Logic',
    description: 'Spatial and geometry logic.',
    questionCount: 5,
  },
  {
    id: 'LEVEL_8',
    levelNumber: 8,
    title: 'Brain Teaser',
    description: 'Advanced brain teasers.',
    questionCount: 5,
  },
  {
    id: 'LEVEL_9',
    levelNumber: 9,
    title: 'Olympiad Prep',
    description: 'Preparation for olympiads.',
    questionCount: 5,
  },
  {
    id: 'LEVEL_10',
    levelNumber: 10,
    title: 'Math Genius',
    description: 'Ultimate coding math challenges.',
    questionCount: 5,
  },
];
