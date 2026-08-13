import React from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { BADGE_DEFINITIONS } from '../../lib/badges';
import { useChildContext } from '../../lib/contexts/ChildContext';

export function Achievements() {
  const { activeChild } = useChildContext();
  const ownedBadges = activeChild?.unlockedBadges || [];

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">Koleksi Lencana 🏅</h1>
        <p className="text-slate-500 font-bold">Kumpulkan semua lencana dengan menyelesaikan misi dan tantangan!</p>
      </div>

      {BADGE_DEFINITIONS.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border-4 border-slate-100">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-xl font-bold text-slate-400">Belum ada lencana yang terbuka</h2>
          <p className="text-slate-400">Teruslah berlatih untuk mendapatkan lencana pertamamu!</p>
        </div>
      ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {BADGE_DEFINITIONS.map((badge, idx) => {
          const isOwned = ownedBadges.includes(badge.id);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-6 rounded-[32px] border-4 flex flex-col items-center text-center relative shadow-sm ${
                isOwned ? 'bg-gradient-to-b from-yellow-50 to-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200 grayscale-[80%] opacity-70'
              }`}
            >
              {!isOwned && (
                <div className="absolute top-4 right-4 text-slate-400 bg-white p-2 rounded-xl shadow-sm">
                  <Lock className="w-4 h-4" />
                </div>
              )}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 border-4 shadow-inner ${
                isOwned ? 'bg-white border-orange-100 shadow-orange-100' : 'bg-slate-200 border-slate-300'
              }`}>
                {badge.icon}
              </div>
              <h3 className={`font-black text-lg mb-2 leading-tight ${isOwned ? 'text-orange-700' : 'text-slate-600'}`}>
                {badge.title}
              </h3>
              <p className="text-xs font-bold text-slate-500 leading-relaxed">
                {badge.description}
              </p>
            </motion.div>
          );
        })}
      </div>
      )}
    </div>
  );
}
