export type QuestionType = 
  | 'NumberPattern'
  | 'Sequence'
  | 'LogicalMath'
  | 'Comparison'
  | 'MissingNumber'
  | 'MathematicalPuzzle'
  | 'Counting'
  | 'GeometryLogic'
  | 'WordProblem'
  | 'Combinatorics'
  | 'StrategyProblem'
  | 'OlympiadStyle';

export interface CodingMathQuestion {
  id: string;
  type: QuestionType;
  question: string; // The problem statement (can include text/math)
  options?: string[]; // Multiple choice options (optional, if undefined it's a text input)
  correctAnswer: string;
  explanation?: string; // Explanation shown after answering
  imageUrl?: string; // Optional image for the question
}

export interface CodingMathLevelProgress {
  levelId: string;
  unlocked: boolean;
  bestScore: number;
  bestAccuracy: number;
  stars: number;
}

export interface CodingMathLevelDef {
  id: string;
  levelNumber: number;
  title: string;
  description: string;
  questionCount: number;
}
