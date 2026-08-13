import { Operation, GameResult } from './engine';

export type ChallengeType = 
  | 'TARGET_CORRECT'
  | 'TARGET_STREAK'
  | 'TARGET_ACCURACY'
  | 'TARGET_OPERATION';

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  type: ChallengeType;
  target: number;
  rewardXp: number;
  rewardStars: number;
  operationHint?: Operation;
}

export interface UserChallengeProgress {
  userId: string;
  challengeId: string;
  progress: number;
  isCompleted: boolean;
  claimed: boolean;
}

// In-memory store (Mocking Supabase)
let mockProgress: UserChallengeProgress = {
  userId: 'child-1',
  challengeId: '',
  progress: 0,
  isCompleted: false,
  claimed: false
};

// Simulate backend fetch
export async function getDailyChallenge(userId: string): Promise<{ challenge: DailyChallenge, progress: UserChallengeProgress }> {
  // We use current date to deterministically generate a challenge
  const today = new Date().toISOString().split('T')[0];
  
  // Deterministic type selection based on date string
  const hash = today.split('-').reduce((a, b) => a + parseInt(b, 10), 0);
  const challengeTypes: ChallengeType[] = ['TARGET_CORRECT', 'TARGET_STREAK', 'TARGET_ACCURACY', 'TARGET_OPERATION'];
  const type = challengeTypes[hash % challengeTypes.length];

  let challenge: DailyChallenge;
  
  if (type === 'TARGET_CORRECT') {
    challenge = { id: `dc-${today}`, date: today, title: 'Si Rajin', description: 'Jawab 10 soal dengan benar.', type: 'TARGET_CORRECT', target: 10, rewardXp: 50, rewardStars: 3 };
  } else if (type === 'TARGET_STREAK') {
    challenge = { id: `dc-${today}`, date: today, title: 'Si Fokus', description: 'Dapatkan 5 jawaban benar berturut-turut.', type: 'TARGET_STREAK', target: 5, rewardXp: 50, rewardStars: 3 };
  } else if (type === 'TARGET_ACCURACY') {
    challenge = { id: `dc-${today}`, date: today, title: 'Si Tepat', description: 'Selesaikan latihan dengan akurasi 100%.', type: 'TARGET_ACCURACY', target: 1, rewardXp: 60, rewardStars: 4 };
  } else {
    challenge = { id: `dc-${today}`, date: today, title: 'Master Penjumlahan', description: 'Selesaikan 1 latihan Penjumlahan.', type: 'TARGET_OPERATION', target: 1, operationHint: 'add', rewardXp: 40, rewardStars: 2 };
  }

  // If new day / new challenge, reset progress
  if (mockProgress.challengeId !== challenge.id) {
    mockProgress = {
      userId,
      challengeId: challenge.id,
      progress: 0,
      isCompleted: false,
      claimed: false
    };
  }

  return { challenge, progress: mockProgress };
}

// Simulate backend update
export async function updateDailyChallengeProgress(
  userId: string, 
  gameResult: GameResult, 
  operation: Operation
): Promise<{ completedNow: boolean, challenge: DailyChallenge, progress: UserChallengeProgress }> {
  
  const { challenge, progress } = await getDailyChallenge(userId);
  
  if (progress.isCompleted) {
    return { completedNow: false, challenge, progress };
  }

  let newProgressVal = progress.progress;

  switch (challenge.type) {
    case 'TARGET_CORRECT':
      newProgressVal += gameResult.correctAnswers;
      break;
    case 'TARGET_STREAK':
      if (gameResult.bestStreak > newProgressVal) {
        newProgressVal = gameResult.bestStreak;
      }
      break;
    case 'TARGET_ACCURACY':
      if (gameResult.accuracy === 100 && gameResult.totalQuestions > 0) {
        newProgressVal = 1;
      }
      break;
    case 'TARGET_OPERATION':
      if (challenge.operationHint === operation && gameResult.totalQuestions > 0) {
        newProgressVal = 1;
      }
      break;
  }

  let completedNow = false;
  if (newProgressVal >= challenge.target) {
    newProgressVal = challenge.target;
    completedNow = true;
    mockProgress.isCompleted = true;
  }

  mockProgress.progress = newProgressVal;

  return { completedNow, challenge, progress: mockProgress };
}
