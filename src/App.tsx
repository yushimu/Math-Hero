import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { ChildLayout } from './components/layout/ChildLayout';
import { ParentLayout } from './components/layout/ParentLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { ProfileSelection } from './pages/public/ProfileSelection';

// Child Pages
import { ChildDashboard } from './pages/child/ChildDashboard';
import { Practice } from './pages/child/Practice';
import { Rewards } from './pages/child/Rewards';
import { Achievements } from './pages/child/Achievements';
import { Profile } from './pages/child/Profile';
import { Progress } from './pages/child/Progress';
import { ChildOnboarding } from './pages/child/ChildOnboarding';
import { CodingMathDashboard } from './pages/child/CodingMathDashboard';
import { CodingMathPractice } from './pages/child/CodingMathPractice';

// Parent Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ChildDetail } from './pages/parent/ChildDetail';

// Placeholder for unbuilt pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
    <p className="text-slate-500">Halaman ini sedang dalam tahap pengembangan.</p>
  </div>
);

import { AuthProvider } from './lib/contexts/AuthContext';
import { ChildProvider } from './lib/contexts/ChildContext';

export default function App() {
  return (
    <AuthProvider>
      <ChildProvider>
        <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="select-profile" element={<ProfileSelection />} />
        </Route>

        {/* Child Routes */}
        <Route path="/child/onboarding" element={<ChildOnboarding />} />
        <Route path="/child" element={<ChildLayout />}>
          <Route index element={<ChildDashboard />} />
          <Route path="practice" element={<Practice />} />
          <Route path="challenge" element={<Placeholder title="Tantangan" />} />
          <Route path="progress" element={<Progress />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Coding Math Routes */}
          <Route path="coding-math" element={<CodingMathDashboard />} />
          <Route path="coding-math/practice/:levelId" element={<CodingMathPractice />} />
        </Route>

        {/* Parent Routes */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<ParentDashboard />} />
          <Route path="child/:id" element={<ChildDetail />} />
          <Route path="children" element={<Placeholder title="Daftar Anak" />} />
          <Route path="reports" element={<Placeholder title="Laporan" />} />
          <Route path="settings" element={<Placeholder title="Pengaturan" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        </BrowserRouter>
      </ChildProvider>
    </AuthProvider>
  );
}
