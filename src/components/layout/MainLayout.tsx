import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Brain, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F0F9FF] text-[#1E293B] flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white border-b-4 border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-yellow-400 p-2 rounded-xl flex items-center justify-center w-12 h-12 border-b-4 border-yellow-600">
                <span className="text-2xl font-black text-white">+</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-blue-600">MATH HERO</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:inline-flex text-blue-600 font-bold uppercase tracking-widest text-sm">Masuk</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">DAFTAR GRATIS</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="bg-white border-t-2 border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Mental Arithmetic Trainer. Semua hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
