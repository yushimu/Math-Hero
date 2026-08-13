export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const BADGE_DEFINITIONS: BadgeDef[] = [
  { id: 'first_practice', title: 'Langkah Pertama', description: 'Menyelesaikan latihan pertama', icon: '🌱' },
  { id: '10_correct', title: 'Si Tepat', description: 'Menjawab 10 soal benar', icon: '🎯' },
  { id: 'speed_master', title: 'Si Kilat', description: 'Menjawab cepat & tepat', icon: '⚡' },
  { id: 'perfect_score', title: 'Sempurna', description: 'Akurasi 100%', icon: '🌟' },
  { id: 'add_master', title: 'Raja Tambah', description: 'Akurasi 80%+ di Penjumlahan', icon: '➕' },
  { id: 'sub_master', title: 'Raja Kurang', description: 'Akurasi 80%+ di Pengurangan', icon: '➖' },
  { id: 'mul_master', title: 'Raja Kali', description: 'Akurasi 80%+ di Perkalian', icon: '✖️' },
  { id: 'div_master', title: 'Raja Bagi', description: 'Akurasi 80%+ di Pembagian', icon: '➗' },
  { id: 'math_explorer', title: 'Penjelajah', description: 'Menyelesaikan mode campuran', icon: '🌍' },
];
