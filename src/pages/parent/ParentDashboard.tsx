import React, { useEffect, useState } from 'react';
import { Users, Clock, Target, Activity, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChildrenService } from '../../lib/services/api';
import type { Database } from '../../lib/database.types';

type Child = Database['public']['Tables']['children']['Row'];

export function ParentDashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      const data = await ChildrenService.getChildren();
      setChildren(data);
      setLoading(false);
    };
    fetchChildren();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Memuat data...</div>;
  }

  return (
    <div className="space-y-8 font-sans pb-12">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Overview</h1>
        <p className="text-slate-500 mt-2">Monitor your children's learning progress and activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Anak" value={children.length} icon={<Users className="w-5 h-5 text-blue-600" />} />
        <StatCard title="Latihan Hari Ini" value="0" icon={<Activity className="w-5 h-5 text-emerald-600" />} />
        <StatCard title="Rata-rata Akurasi" value="0%" icon={<Target className="w-5 h-5 text-purple-600" />} />
        <StatCard title="Total Waktu" value="0m" icon={<Clock className="w-5 h-5 text-orange-600" />} />
      </div>

      <div className="pt-4">
        <h2 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Children Profiles</h2>
        {children.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-slate-500 mb-4">Belum ada profil anak.</p>
            <Link to="/select-profile" className="text-blue-600 font-bold hover:underline">
              Kembali untuk Tambah Anak
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {children.map((child) => (
              <div key={child.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">
                      <img src={child.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix'} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{child.name}</h3>
                      <p className="text-sm font-medium text-slate-500">Level {child.level} • {child.xp} XP</p>
                    </div>
                  </div>
                  <Link to={`/parent/child/${child.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg border border-blue-100">
                    View Detail <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Accuracy</div>
                    <div className="text-xl font-bold text-slate-700">0%</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Streak</div>
                    <div className="text-xl font-bold text-slate-700">{child.current_streak} days</div>
                  </div>
                </div>

                <div className="mt-auto bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-blue-500" /> AI Recommendation
                  </div>
                  <p className="text-sm font-medium text-blue-900/80 leading-relaxed">
                    Semangat belajarnya ya! Perbanyak latihan agar kemampuan berhitungmu semakin hebat.
                  </p>
                </div>
                
                <div className="mt-4 text-xs font-medium text-slate-400 text-right">
                  Bergabung sejak: {new Date(child.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</div>
        <div className="text-2xl font-bold text-slate-800 tracking-tight">{value}</div>
      </div>
    </div>
  );
}
