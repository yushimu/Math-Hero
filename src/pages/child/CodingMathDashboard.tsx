import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Star, Play, Award, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { CODING_MATH_LEVELS, CODING_MATH_CONFIG } from '../../config/codingMath';
import { CodingMathLevelProgress } from '../../types/codingMath';

export function CodingMathDashboard() {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState<Record<string, CodingMathLevelProgress>>({});

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('codingMathProgress');
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    } else {
      // Initialize with Level 1 unlocked
      const initialProgress: Record<string, CodingMathLevelProgress> = {
        'LEVEL_1': { levelId: 'LEVEL_1', unlocked: true, bestScore: 0, bestAccuracy: 0, stars: 0 }
      };
      localStorage.setItem('codingMathProgress', JSON.stringify(initialProgress));
      setProgressData(initialProgress);
    }
  }, []);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 md:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10 w-full">
          <button 
            onClick={() => navigate('/child')}
            className="flex items-center gap-2 text-indigo-100 hover:text-white mb-4 transition-colors font-bold text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Kembali ke Beranda
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl border-2 border-white/30 backdrop-blur-sm">
              🧠
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-1 tracking-tight drop-shadow-md">Coding Math</h1>
              <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs md:text-sm">
                Train your math logic & problem-solving skills
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Level Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {CODING_MATH_LEVELS.map((level, idx) => {
          const isUnlocked = level.id === 'LEVEL_1' || progressData[level.id]?.unlocked;
          const levelProgress = progressData[level.id];

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative rounded-3xl border-4 overflow-hidden transition-all duration-300 shadow-sm ${
                isUnlocked 
                  ? 'border-indigo-100 bg-white hover:-translate-y-2 hover:shadow-xl hover:border-indigo-300' 
                  : 'border-slate-200 bg-slate-50 opacity-80 grayscale-[50%]'
              }`}
            >
              <div className="p-4 md:p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <div className={`text-[10px] md:text-sm font-black uppercase tracking-widest px-2 py-1 md:px-3 rounded-lg md:rounded-xl border-2 ${
                    isUnlocked ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 'bg-slate-200 text-slate-500 border-slate-300'
                  }`}>
                    Level {level.levelNumber}
                  </div>
                  {!isUnlocked && (
                    <div className="bg-slate-200 p-1.5 md:p-2 rounded-lg md:rounded-xl text-slate-500">
                      <Lock className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  )}
                </div>
                
                <h3 className={`text-sm md:text-xl font-black mb-1 md:mb-2 leading-tight line-clamp-1 ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                  {level.title}
                </h3>
                <p className="text-slate-500 font-bold text-[10px] md:text-sm mb-3 md:mb-6 h-8 md:h-10 line-clamp-2 leading-snug">
                  {level.description}
                </p>

                {isUnlocked && (
                  <div className="mt-auto flex items-center justify-between border-t-2 border-slate-100 pt-3 md:pt-4">
                    <div className="flex gap-0.5 md:gap-1">
                      {[1, 2, 3].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 md:w-5 md:h-5 ${
                            (levelProgress?.stars || 0) >= star 
                              ? 'fill-yellow-400 text-yellow-500' 
                              : 'fill-slate-100 text-slate-300'
                          }`} 
                        />
                      ))}
                    </div>
                    {levelProgress?.bestScore ? (
                      <span className="text-indigo-600 font-black text-[10px] md:text-sm">
                        Score: {levelProgress.bestScore}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold text-[8px] md:text-xs uppercase tracking-wider">
                        Belum Selesai
                      </span>
                    )}
                  </div>
                )}
              </div>

              {isUnlocked ? (
                <Link to={`/child/coding-math/practice/${level.id}`} className="block">
                  <div className="bg-indigo-500 text-white font-black text-center py-2.5 md:py-4 flex items-center justify-center gap-1.5 md:gap-2 hover:bg-indigo-600 transition-colors text-xs md:text-base">
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    MULAI MAIN
                  </div>
                </Link>
              ) : (
                <div className="bg-slate-200 text-slate-400 font-black text-center py-2.5 md:py-4 flex items-center justify-center gap-1.5 md:gap-2 cursor-not-allowed text-xs md:text-base">
                  <Lock className="w-4 h-4 md:w-5 md:h-5" />
                  TERKUNCI
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
