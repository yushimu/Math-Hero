import React from 'react';
import { motion } from 'motion/react';
import { useChildContext } from '../../lib/contexts/ChildContext';
import { Trophy, Target, Flame, Activity, Zap, Star } from 'lucide-react';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function Progress() {
  const { activeChild } = useChildContext();
  const profile = activeChild;
  
  if (!profile) return null;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">Peta Perjalanan 🗺️</h1>
          <p className="text-slate-500 font-bold">Ayo mulai latihan pertamamu untuk melihat statistik di sini!</p>
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
              <StatCard icon={<Activity className="w-5 h-5 text-blue-500" />} label="Latihan" value={0} color="bg-blue-50 border-blue-100" />
              <StatCard icon={<Target className="w-5 h-5 text-green-500" />} label="Soal" value={0} color="bg-green-50 border-green-100" />
              <StatCard icon={<Zap className="w-5 h-5 text-purple-500" />} label="Akurasi" value={`0%`} color="bg-purple-50 border-purple-100" />
              <StatCard icon={<Flame className="w-5 h-5 text-orange-500" />} label="Streak" value={`0x`} color="bg-orange-50 border-orange-100" />
            </div>
            
            <div className="mt-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100 p-4 flex items-center justify-between">
              <span className="font-bold text-indigo-500">Total XP</span>
              <span className="font-black text-xl text-indigo-700">{profile.xp} XP</span>
            </div>
          </div>

          {/* Simple Chart */}
          <div className="bg-white p-6 rounded-[32px] border-4 border-slate-100 shadow-sm text-center">
            <h2 className="text-lg font-black text-slate-700 mb-2 uppercase tracking-widest text-center">Soal Terjawab (7 Hari)</h2>
            <p className="text-slate-400 font-bold mb-4">Belum ada riwayat latihan</p>
          </div>
        </div>

        {/* Right Col: Subject Progress */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Kemampuan per Kategori 🎯</h2>
          <div className="bg-white p-8 rounded-[32px] border-4 border-slate-100 text-center shadow-sm">
            <div className="text-5xl mb-4">🧩</div>
            <h3 className="text-xl font-bold text-slate-400">Mainkan game pertama untuk melihat statistikmu di sini.</h3>
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
