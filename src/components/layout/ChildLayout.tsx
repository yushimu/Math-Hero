import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Trophy, User, LogOut, Gift, Activity, Brain } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { useChildContext } from '../../lib/contexts/ChildContext';

export function ChildLayout() {
  const location = useLocation();
  const { activeChild } = useChildContext();
  const profile = activeChild;

  // Protect child routes
  if (!profile) {
    return <div className="p-8 text-center text-xl font-bold">Pilih profil anak terlebih dahulu...</div>;
  }

  const navItems = [
    { icon: Home, label: 'Beranda', path: '/child' },
    { icon: Brain, label: 'Coding Math', path: '/child/coding-math' },
    { icon: Trophy, label: 'Prestasi', path: '/child/achievements' },
    { icon: Activity, label: 'Perkembangan', path: '/child/progress' },
    { icon: Gift, label: 'Hadiah', path: '/child/rewards' },
    { icon: User, label: 'Profil', path: '/child/profile' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-[#1E293B] flex flex-col md:flex-row font-sans pb-20 md:pb-0">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-48 flex-col bg-white border-r-2 border-blue-100 sticky top-0 h-screen shadow-lg relative z-10">
        <div className="p-3 border-b-2 border-blue-50">
          <Link to="/child" className="flex items-center gap-3">
             <div className="h-10 w-10 bg-yellow-400 rounded-xl flex items-center justify-center border-b-4 border-yellow-600">
               <span className="text-xl font-black text-white">+</span>
             </div>
             <div className="text-xl font-black text-blue-600 tracking-tight">MATH HERO</div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl font-bold transition-all text-sm",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md border-b-2 border-blue-800" 
                    : "bg-white text-blue-500 border-2 border-blue-100 hover:border-blue-300"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive ? "stroke-[3]" : "stroke-2")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t-2 border-blue-50 bg-blue-50/50">
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border-2 border-blue-100 shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-lg border-2 border-blue-200 flex items-center justify-center overflow-hidden">
              <img src={profile.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix'} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-black text-slate-800 text-sm truncate">{profile.name}</div>
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest truncate">Level {profile.level}</div>
            </div>
          </div>
          <Link to="/" className="flex items-center justify-center gap-2 mt-3 text-slate-400 hover:text-pink-500 font-bold transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            GANTI PROFIL
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto w-full">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-blue-200 px-2 sm:px-6 py-2 sm:py-4 z-50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-1 sm:p-2 rounded-2xl transition-transform active:scale-95",
                  isActive ? "text-blue-600" : "text-blue-400 hover:text-blue-500"
                )}
              >
                <div className={cn(
                  "p-2 sm:p-3 rounded-2xl transition-all",
                  isActive ? "bg-blue-600 text-white shadow-md border-b-4 border-blue-800" : "bg-transparent"
                )}>
                  <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", isActive ? "stroke-[2.5]" : "stroke-2")} />
                </div>
                <span className={cn("text-[10px] sm:text-xs font-bold mt-0.5 sm:mt-1", isActive && "text-blue-700")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      
    </div>
  );
}
