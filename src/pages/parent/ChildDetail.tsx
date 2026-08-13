import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Target, Clock, Activity, Zap, Sparkles } from 'lucide-react';
import { ChildrenService } from '../../lib/services/api';
import type { Database } from '../../lib/database.types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

type Child = Database['public']['Tables']['children']['Row'];

export function ChildDetail() {
  const { id } = useParams();
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadChild = async () => {
      const data = await ChildrenService.getChildren();
      const found = data.find(c => c.id === id);
      setChild(found || null);
      setLoading(false);
    };
    loadChild();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Memuat data anak...</div>;
  }

  if (!child) {
    return <Navigate to="/parent" replace />;
  }

  return (
    <div className="space-y-6 font-sans pb-12">
      <Link to="/parent" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header Profile */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl border border-slate-200 shadow-sm overflow-hidden">
            <img src={child.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix'} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{child.name}</h1>
            <p className="text-slate-500 mt-1 font-medium">Level {child.level} • {child.xp} XP • {child.current_streak} Hari Streak</p>
          </div>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2">
          <Target className="w-5 h-5" />
          <span className="font-semibold text-lg">0% Accuracy</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Progress Latihan</p>
            <p className="text-2xl font-bold text-slate-800">0%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-purple-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Rata-rata Waktu</p>
            <p className="text-2xl font-bold text-slate-800">0s</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-orange-600">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Soal Terjawab</p>
            <p className="text-2xl font-bold text-slate-800">0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Subject */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Akurasi per Materi</h2>
          <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Belum ada riwayat latihan</p>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" /> Kelebihan
            </h2>
            <p className="text-sm text-slate-400 italic">Data tidak cukup</p>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" /> Perlu Ditingkatkan
            </h2>
            <p className="text-sm text-slate-400 italic">Data tidak cukup</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Aktivitas Terakhir</h2>
        <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">Belum ada riwayat aktivitas</p>
        </div>
      </div>
    </div>
  );
}
