import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Target, Clock, Activity, Zap, Sparkles } from 'lucide-react';
import { mockChildrenList, mockChildDetailedStats } from '../../data/mock';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export function ChildDetail() {
  const { id } = useParams();
  
  const child = mockChildrenList.find(c => c.id === id);
  const stats = mockChildDetailedStats[id as keyof typeof mockChildDetailedStats];

  if (!child || !stats) {
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
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl border border-slate-200 shadow-sm">
            {child.avatar}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{child.name}</h1>
            <p className="text-slate-500 mt-1 font-medium">Level {child.level} • {child.xp} XP • {child.streak} Day Streak</p>
          </div>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2">
          <Target className="w-5 h-5" />
          <span className="font-semibold text-lg">{child.accuracy}% Accuracy</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Learning Progress</p>
            <p className="text-2xl font-bold text-slate-800">{stats.learningProgress}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-purple-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Avg Response Time</p>
            <p className="text-2xl font-bold text-slate-800">{stats.averageResponseTime}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-orange-600">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Questions Done</p>
            <p className="text-2xl font-bold text-slate-800">{stats.questionsCompleted}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Subject */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Accuracy by Subject</h2>
          <div className="space-y-5">
            {stats.accuracyByOperation.map(op => (
              <div key={op.name}>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">{op.name}</span>
                  <span className="text-slate-900">{op.accuracy}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      op.accuracy >= 80 ? 'bg-emerald-500' : 
                      op.accuracy >= 60 ? 'bg-yellow-500' : 'bg-rose-500'
                    }`} 
                    style={{ width: `${op.accuracy}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" /> Strengths
            </h2>
            <ul className="space-y-2">
              {stats.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                  <span className="text-emerald-500 mt-0.5">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" /> Areas to Improve
            </h2>
            <ul className="space-y-2">
              {stats.areasToImprove.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                  <span className="text-orange-500 mt-0.5">•</span> {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {stats.recentActivity.map((act, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <div className="font-semibold text-slate-800">{act.description}</div>
                <div className="text-xs font-medium text-slate-500 mt-1">{act.date}</div>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">
                Score: {act.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
