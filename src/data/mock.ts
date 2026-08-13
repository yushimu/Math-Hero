import { ChildProfile, ParentProfile, BadgeDef, RewardItem } from '../types';

export const mockChildProfile: ChildProfile = {
  id: 'child-1',
  name: 'Budi',
  role: 'child',
  level: 5,
  xp: 1250,
  stars: 42,
  parentId: 'parent-1',
  dailyStreak: 3,
  avatarUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Budi',
  unlockedBadges: ['first_practice', '7_day_streak'],
  unlockedRewards: ['avatar_explorer', 'acc_glasses', 'theme_day'],
  equippedAvatar: 'avatar_explorer',
  equippedAccessory: 'acc_glasses',
  equippedTheme: 'theme_day',
};

export const mockParentProfile: ParentProfile = {
  id: 'parent-1',
  name: 'Bapak Budi',
  role: 'parent',
  childrenIds: ['child-1'],
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Parent'
};

export const mockExercises = [
  { id: 'add', title: 'Penjumlahan', icon: '➕', difficulty: 'Mudah', progress: 85, bestScore: 1250, color: 'bg-indigo-500', borderColor: 'border-indigo-100', locked: false },
  { id: 'sub', title: 'Pengurangan', icon: '➖', difficulty: 'Mudah', progress: 42, bestScore: 850, color: 'bg-pink-500', borderColor: 'border-pink-100', locked: false },
  { id: 'mul', title: 'Perkalian', icon: '✖️', difficulty: 'Sedang', progress: 0, bestScore: 0, color: 'bg-purple-500', borderColor: 'border-purple-100', locked: true },
  { id: 'div', title: 'Pembagian', icon: '➗', difficulty: 'Sulit', progress: 0, bestScore: 0, color: 'bg-teal-500', borderColor: 'border-teal-100', locked: true },
  { id: 'mix', title: 'Campuran', icon: '🎲', difficulty: 'Campuran', progress: 15, bestScore: 300, color: 'bg-orange-500', borderColor: 'border-orange-100', locked: false },
  { id: 'speed', title: 'Tantangan Kilat', icon: '⚡', difficulty: 'Sulit', progress: 50, bestScore: 2500, color: 'bg-yellow-400', borderColor: 'border-yellow-200', locked: false },
];

export const mockBadges: BadgeDef[] = [
  { id: 'first_practice', title: 'Latihan Pertama', description: 'Menyelesaikan latihan untuk pertama kalinya.', icon: '🌱' },
  { id: '10_correct', title: '10 Benar', description: 'Menjawab 10 soal dengan benar.', icon: '🎯' },
  { id: 'speed_master', title: 'Master Kecepatan', description: 'Rata-rata waktu menjawab di bawah 3 detik.', icon: '⚡' },
  { id: 'math_explorer', title: 'Penjelajah Math', description: 'Menyelesaikan latihan Campuran dengan baik.', icon: '🧭' },
  { id: '7_day_streak', title: '7 Hari Beruntun', description: 'Belajar 7 hari berturut-turut.', icon: '🔥' },
  { id: 'perfect_score', title: 'Skor Sempurna', description: 'Mendapat akurasi 100% dalam satu latihan.', icon: '🌟' },
  { id: 'add_master', title: 'Master Penjumlahan', description: 'Menyelesaikan level Penjumlahan dengan sangat baik.', icon: '➕' },
  { id: 'sub_master', title: 'Master Pengurangan', description: 'Menyelesaikan level Pengurangan dengan sangat baik.', icon: '➖' },
  { id: 'mul_master', title: 'Master Perkalian', description: 'Menyelesaikan level Perkalian dengan sangat baik.', icon: '✖️' },
  { id: 'div_master', title: 'Master Pembagian', description: 'Menyelesaikan level Pembagian dengan sangat baik.', icon: '➗' },
];

export const mockRewards: RewardItem[] = [
  { id: 'avatar_explorer', title: 'Penjelajah', type: 'avatar', cost: 0, icon: '🧑‍🌾' },
  { id: 'avatar_scientist', title: 'Ilmuwan', type: 'avatar', cost: 10, icon: '🧑‍🔬' },
  { id: 'avatar_astronaut', title: 'Astronot', type: 'avatar', cost: 20, icon: '🧑‍🚀' },
  { id: 'avatar_artist', title: 'Seniman', type: 'avatar', cost: 15, icon: '🧑‍🎨' },
  { id: 'avatar_panda', title: 'Panda Lucu', type: 'avatar', cost: 25, icon: '🐼' },
  { id: 'avatar_fox', title: 'Rubah Pintar', type: 'avatar', cost: 25, icon: '🦊' },
  { id: 'avatar_lion', title: 'Singa Berani', type: 'avatar', cost: 30, icon: '🦁' },
  
  { id: 'acc_glasses', title: 'Kacamata Keren', type: 'accessory', cost: 0, icon: '👓' },
  { id: 'acc_cap', title: 'Topi Santai', type: 'accessory', cost: 10, icon: '🧢' },
  { id: 'acc_crown', title: 'Mahkota Juara', type: 'accessory', cost: 40, icon: '👑' },
  
  { id: 'theme_day', title: 'Cerah', type: 'theme', cost: 0, icon: '☀️', value: 'bg-blue-100' },
  { id: 'theme_forest', title: 'Hutan', type: 'theme', cost: 20, icon: '🌲', value: 'bg-green-200' },
  { id: 'theme_space', title: 'Luar Angkasa', type: 'theme', cost: 35, icon: '🚀', value: 'bg-indigo-900' },
  { id: 'theme_castle', title: 'Kastil', type: 'theme', cost: 30, icon: '🏰', value: 'bg-slate-300' },
];

export const mockParentOverview = {
  totalChildren: 2,
  practiceToday: 2,
  averageAccuracy: 88,
  totalPracticeTime: '45 mins',
};

export const mockChildrenList = [
  {
    id: 'child-1',
    name: 'Budi',
    avatar: '🧑‍🌾',
    level: 5,
    xp: 1250,
    accuracy: 92,
    streak: 3,
    lastActive: 'Today, 10:00 AM',
    recommendation: 'Penjumlahan (Addition) is improving well. Pengurangan (Subtraction) may need more practice.'
  },
  {
    id: 'child-2',
    name: 'Siti',
    avatar: '🧑‍🔬',
    level: 3,
    xp: 850,
    accuracy: 84,
    streak: 1,
    lastActive: 'Yesterday, 3:30 PM',
    recommendation: 'Good progress overall. Try introducing Perkalian (Multiplication) soon.'
  }
];

export const mockChildDetailedStats = {
  'child-1': {
    learningProgress: 85,
    accuracyByOperation: [
      { name: 'Penjumlahan', accuracy: 95 },
      { name: 'Pengurangan', accuracy: 75 },
      { name: 'Perkalian', accuracy: 60 },
      { name: 'Pembagian', accuracy: 50 },
    ],
    averageResponseTime: '3.2s',
    questionsCompleted: 240,
    strengths: ['Penjumlahan Cepat', 'Konsistensi Harian'],
    areasToImprove: ['Pengurangan dengan pinjaman', 'Ketelitian saat dikejar waktu'],
    recentActivity: [
      { date: 'Today', description: 'Completed Daily Challenge: 10 Penjumlahan', score: '100%' },
      { date: 'Yesterday', description: 'Practice: Pengurangan (Easy)', score: '80%' },
    ]
  },
  'child-2': {
    learningProgress: 60,
    accuracyByOperation: [
      { name: 'Penjumlahan', accuracy: 88 },
      { name: 'Pengurangan', accuracy: 80 },
      { name: 'Perkalian', accuracy: 0 },
      { name: 'Pembagian', accuracy: 0 },
    ],
    averageResponseTime: '4.5s',
    questionsCompleted: 120,
    strengths: ['Penjumlahan Dasar', 'Akurasi Tinggi'],
    areasToImprove: ['Kecepatan menjawab', 'Pengenalan Perkalian'],
    recentActivity: [
      { date: 'Yesterday', description: 'Practice: Penjumlahan (Medium)', score: '90%' },
      { date: '2 days ago', description: 'Completed Daily Challenge: 5 Streak', score: '100%' },
    ]
  }
};

export const mockOverallProgress = {
  totalPractice: 24,
  totalQuestions: 240,
  accuracy: 85,
  bestScore: 1250,
  currentStreak: 3,
  totalXp: 1250,
};

export const mockSubjectProgress = [
  { id: 'add', name: 'Penjumlahan', icon: '➕', accuracy: 92, questions: 100, bestScore: 500, level: 5, color: 'bg-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', text: 'text-blue-600' },
  { id: 'sub', name: 'Pengurangan', icon: '➖', accuracy: 80, questions: 60, bestScore: 300, level: 3, color: 'bg-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200', text: 'text-green-600' },
  { id: 'mul', name: 'Perkalian', icon: '✖️', accuracy: 65, questions: 50, bestScore: 250, level: 2, color: 'bg-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', text: 'text-purple-600' },
  { id: 'div', name: 'Pembagian', icon: '➗', accuracy: 50, questions: 30, bestScore: 200, level: 1, color: 'bg-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', text: 'text-orange-600' },
];

export const mockChartData = [
  { day: 'Sen', soal: 20 },
  { day: 'Sel', soal: 40 },
  { day: 'Rab', soal: 30 },
  { day: 'Kam', soal: 50 },
  { day: 'Jum', soal: 70 },
  { day: 'Sab', soal: 10 },
  { day: 'Min', soal: 30 },
];
