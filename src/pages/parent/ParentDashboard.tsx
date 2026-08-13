import React from 'react';
import { Users, Clock, Target, Activity, ChevronRight, Sparkles } from 'lucide-react';
import { mockParentOverview, mockChildrenList } from '../../data/mock';
import { Link } from 'react-router-dom';

export function ParentDashboard() {
  const overview = mockParentOverview;
  const children = mockChildrenList;

  return (
    <div className="space-y-8 font-sans pb-12">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Overview</h1>
        <p className="text-slate-500 mt-2">Monitor your children's learning progress and activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Children" value={overview.totalChildren} icon={<Users className="w-5 h-5 text-blue-600" />} />
        <StatCard title="Practice Today" value={overview.practiceToday} icon={<Activity className="w-5 h-5 text-emerald-600" />} />
        <StatCard title="Avg. Accuracy" value={`${overview.averageAccuracy}%`} icon={<Target className="w-5 h-5 text-purple-600" />} />
        <StatCard title="Total Time" value={overview.totalPracticeTime} icon={<Clock className="w-5 h-5 text-orange-600" />} />
      </div>

      <div className="pt-4">
        <h2 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Children Profiles</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {children.map((child) => (
            <div key={child.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl border border-slate-200 shadow-sm">
                    {child.avatar}
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
                  <div className="text-xl font-bold text-slate-700">{child.accuracy}%</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Streak</div>
                  <div className="text-xl font-bold text-slate-700">{child.streak} days</div>
                </div>
              </div>

              <div className="mt-auto bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-blue-500" /> AI Recommendation
                </div>
                <p className="text-sm font-medium text-blue-900/80 leading-relaxed">{child.recommendation}</p>
              </div>
              
              <div className="mt-4 text-xs font-medium text-slate-400 text-right">
                Last active: {child.lastActive}
              </div>
            </div>
          ))}
        </div>
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
