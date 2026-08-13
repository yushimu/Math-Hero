import React from 'react';
import { motion } from 'motion/react';
import { mockOverallProgress, mockSubjectProgress, mockChartData, mockChildProfile } from '../../data/mock';
import { Trophy, Target, Flame, Activity, Zap, Star } from 'lucide-react';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function Progress() {
  const profile = mockChildProfile;
  
  // Find best subject
  const bestSubject = [...mockSubjectProgress].sort((a, b) => b.accuracy - a.accuracy)[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Encouragement */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">Peta Perjalanan 🗺️</h1>
          <p className="text-slate-500 font-bold">Kamu semakin hebat! Terus semangat berlatih ya! 🚀</p>
        </div>
        <div className="bg-yellow-100 border-4 border-yellow-300 p-4 rounded-3xl shadow-sm text-center md:text-right">
          <p className="text-sm font-bold text-yellow-700 uppercase tracking-widest mb-1">Keahlian Terbaikmu</p>
          <p className="text-xl font-black text-yellow-600 flex items-center justify-center md:justify-end gap-2">
            {bestSubject.icon} {bestSubject.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Overall Stats & Chart */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border-4 border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-700 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" /> Total Skor
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={<Activity className="w-5 h-5 text-blue-500" />} label="Latihan" value={mockOverallProgress.totalPractice} color="bg-blue-50 border-blue-100" />
              <StatCard icon={<Target className="w-5 h-5 text-green-500" />} label="Soal" value={mockOverallProgress.totalQuestions} color="bg-green-50 border-green-100" />
              <StatCard icon={<Zap className="w-5 h-5 text-purple-500" />} label="Akurasi" value={`${mockOverallProgress.accuracy}%`} color="bg-purple-50 border-purple-100" />
              <StatCard icon={<Flame className="w-5 h-5 text-orange-500" />} label="Streak" value={`${mockOverallProgress.currentStreak}x`} color="bg-orange-50 border-orange-100" />
            </div>
            
            <div className="mt-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100 p-4 flex items-center justify-between">
              <span className="font-bold text-indigo-500">Total XP</span>
              <span className="font-black text-xl text-indigo-700">{profile.xp} XP</span>
            </div>
          </div>

          {/* Simple Chart */}
          <div className="bg-white p-6 rounded-[32px] border-4 border-slate-100 shadow-sm">
            <h2 className="text-lg font-black text-slate-700 mb-6 uppercase tracking-widest text-center">Soal Terjawab (7 Hari)</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9', rx: 8 }}
                    contentStyle={{ borderRadius: '16px', border: '4px solid #e2e8f0', fontWeight: 'bold', color: '#334155' }}
                  />
                  <Bar dataKey="soal" radius={[8, 8, 8, 8]}>
                    {mockChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.soal > 40 ? '#3b82f6' : '#93c5fd'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Subject Progress */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Kemampuan per Kategori 🎯</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockSubjectProgress.map((sub, idx) => (
              <motion.div 
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-[32px] border-4 ${sub.borderColor} ${sub.bgColor} relative overflow-hidden flex flex-col`}
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl border-4 border-white shadow-sm flex items-center justify-center text-2xl">
                      {sub.icon}
                    </div>
                    <div>
                      <h3 className={`font-black text-lg ${sub.text}`}>{sub.name}</h3>
                      <div className="text-xs font-bold text-slate-500 bg-white/60 px-2 py-0.5 rounded-md inline-block">
                        Level {sub.level}
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl font-black ${sub.text}`}>
                    {sub.accuracy}%
                  </div>
                </div>

                <div className="mb-6 relative z-10">
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>Akurasi</span>
                  </div>
                  <ProgressBar value={sub.accuracy} max={100} size="md" color={sub.color} />
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2 relative z-10">
                  <div className="bg-white/60 p-3 rounded-2xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Soal Selesai</div>
                    <div className="font-black text-slate-700">{sub.questions}</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-2xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Skor Terbaik</div>
                    <div className="font-black text-slate-700 flex items-center gap-1">
                      {sub.bestScore} <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                </div>
                
                {/* Decorative background shape */}
                <div className="absolute -bottom-8 -right-8 text-9xl opacity-5 pointer-events-none transform rotate-12">
                  {sub.icon}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center ${color}`}>
      <div className="bg-white p-2 rounded-xl shadow-sm mb-2">
        {icon}
      </div>
      <div className="text-xs font-bold text-slate-500 mb-1">{label}</div>
      <div className="text-xl font-black text-slate-800">{value}</div>
    </div>
  );
}
