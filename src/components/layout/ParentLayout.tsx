import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LineChart, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { mockParentProfile } from '../../data/mock';

export function ParentLayout() {
  const location = useLocation();
  const profile = mockParentProfile;

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/parent' },
    { icon: Users, label: 'Children', path: '/parent/children' },
    { icon: LineChart, label: 'Reports', path: '/parent/reports' },
    { icon: Settings, label: 'Settings', path: '/parent/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="font-bold text-lg text-slate-800 tracking-tight">Parent Portal</div>
        <img src={profile.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
      </header>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 sticky top-0 h-screen z-10">
        <div className="p-6 border-b border-slate-100">
          <Link to="/parent" className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
            MATH HERO
          </Link>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Parent Portal</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/parent' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-sm",
                  isActive 
                    ? "bg-slate-100 text-slate-900" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-slate-900" : "text-slate-500")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
            <img src={profile.avatarUrl} alt="Profile" className="w-9 h-9 rounded-full border border-slate-200" />
            <div className="flex-1 overflow-hidden">
              <div className="font-semibold text-sm text-slate-800 truncate">{profile.name}</div>
              <div className="text-[10px] font-medium text-slate-500 uppercase truncate">Parent Account</div>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors rounded-lg hover:bg-slate-50 w-full">
            <ChevronLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0 h-full overflow-y-auto">
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/parent' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
                  isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5]" : "stroke-2")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
