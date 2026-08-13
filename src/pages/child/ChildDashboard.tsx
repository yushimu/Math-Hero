import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Flame, Trophy, Lock } from 'lucide-react';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { mockChildProfile, mockExercises, mockRewards } from '../../data/mock';
import { ChildAvatar } from '../../components/ui/ChildAvatar';
import { Badge } from '../../components/ui/Badge';
import { motion } from 'motion/react';
import { getDailyChallenge, DailyChallenge, UserChallengeProgress } from '../../lib/dailyChallenge';
import { useChildContext } from '../../lib/contexts/ChildContext';

export function ChildDashboard() {
  const { activeChild } = useChildContext();
  const profile = activeChild;
  
  const [challengeData, setChallengeData] = useState<{ challenge: DailyChallenge, progress: UserChallengeProgress } | null>(null);

  useEffect(() => {
    if (profile) {
      getDailyChallenge(profile.id).then(setChallengeData);
    }
  }, [profile?.id]);

  if (!profile) return null;

  const equippedAvatarDef = mockRewards.find(r => r.id === 'avatar1'); // Fallback or implement real item system
  const equippedAccessoryDef = undefined;
  const equippedThemeDef = undefined;

  return (
    <div className="space-y-12 pb-12">
      {/* Header Profile / Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-10 rounded-[40px] border-4 border-blue-100 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
      >
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
        <ChildAvatar 
          size="lg" 
          avatarIcon={equippedAvatarDef?.icon}
          accessoryIcon={equippedAccessoryDef?.icon}
          themeClass={equippedThemeDef?.value}
          className="border-4 border-blue-200 relative z-10 shrink-0" 
        />
        
        <div className="flex-1 w-full text-center md:text-left relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">Halo, {profile.name}! 🌟</h1>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-5">
            <Badge variant="info" className="text-sm px-3 py-1">Pahlawan Angka</Badge>
            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Siap berpetualang hari ini?</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-black text-blue-500 uppercase tracking-widest">Level {profile.level}</span>
              <span className="text-sm font-bold text-blue-400">{profile.xp} / 2000 XP</span>
            </div>
            <ProgressBar value={profile.xp} max={2000} size="lg" color="bg-yellow-400" />
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4"
      >
        <StatCard icon="🔥" label="Streak" value={`${profile.current_streak} Hari`} color="bg-orange-100" />
        <StatCard icon="⭐" label="Bintang" value="0" color="bg-yellow-100" />
        <StatCard icon="💎" label="Total XP" value={profile.xp.toString()} color="bg-blue-100" />
        <StatCard icon="🎯" label="Akurasi" value="85%" color="bg-green-100" />
      </motion.div>

      {/* Daily Challenge & Continue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-[32px] border-4 border-green-100 shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 text-8xl opacity-10">🎯</div>
          <div className="relative z-10 flex flex-col h-full">
            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Tantangan Hari Ini!</h2>
            
            {challengeData ? (
              <>
                <p className="text-green-600 font-bold mb-4 line-clamp-2">{challengeData.challenge.title}: {challengeData.challenge.description}</p>
                
                <div className="bg-green-50 p-4 rounded-2xl mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-green-600 uppercase">Target</span>
                    <span className="text-sm font-black text-green-700">{challengeData.progress.progress} / {challengeData.challenge.target}</span>
                  </div>
                  <ProgressBar value={challengeData.progress.progress} max={challengeData.challenge.target} size="md" color="bg-green-500" />
                </div>

                <div className="mt-auto flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <div className="bg-yellow-100 text-yellow-700 text-xs font-black px-2 py-1 rounded-lg border-2 border-yellow-200 shadow-sm flex items-center">
                      +{challengeData.challenge.rewardXp} XP
                    </div>
                    <div className="bg-orange-100 text-orange-700 text-xs font-black px-2 py-1 rounded-lg border-2 border-orange-200 shadow-sm flex items-center">
                      +{challengeData.challenge.rewardStars} ⭐
                    </div>
                  </div>
                  
                  {challengeData.progress.isCompleted ? (
                    <div className="bg-green-500 text-white font-black text-sm py-2 px-4 rounded-xl border-b-4 border-green-700">
                      KEREN! 🎉
                    </div>
                  ) : (
                    <Link to={`/child/practice?op=${challengeData.challenge.operationHint || 'mix'}&diff=EASY`} className="flex-1">
                      <motion.button 
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 2 }}
                        className="w-full bg-green-500 text-white font-black py-2 rounded-xl border-b-4 border-green-700 shadow-sm text-sm"
                      >
                        AYO MAIN! 
                      </motion.button>
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mt-4">
                <div className="text-4xl mb-2">😴</div>
                <h3 className="text-lg font-black text-slate-400">Tidak ada misi aktif</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">Mainkan mode bebas untuk seru-seruan!</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-[32px] border-4 border-indigo-100 shadow-lg relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute -right-4 -top-4 text-8xl opacity-10">📚</div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Lanjut Main Yuk! 🚀</h2>
            <p className="text-slate-500 font-bold mb-4">Misi Pengurangan (Mudah)</p>

            <div className="bg-indigo-50 p-4 rounded-2xl mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-indigo-500 uppercase">Selesai</span>
                <span className="text-xs font-black text-indigo-600">42%</span>
              </div>
              <ProgressBar value={42} size="md" color="bg-indigo-500" />
            </div>

            <Link to="/child/practice?op=sub&diff=BEGINNER">
              <motion.button 
                whileHover={{ y: -2 }}
                whileTap={{ y: 2 }}
                className="w-full bg-indigo-50 text-indigo-600 font-black text-lg py-3 rounded-2xl border-b-4 border-indigo-200 border-x-2 border-t-2 flex items-center justify-center"
              >
                GAS MAIN!
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Menu Latihan */}
      <div>
        <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">Pilih Permainanmu! 🎮</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mockExercises.map((ex, idx) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
            >
              <Link to={ex.locked ? "#" : `/child/practice?op=${ex.id}`} className="block h-full">
                <div 
                  className={`h-full bg-white p-6 rounded-[32px] border-4 ${ex.borderColor} flex flex-col relative transition-transform hover:-translate-y-1 shadow-sm ${ex.locked ? 'opacity-70 grayscale-[30%]' : ''}`}
                >
                  {ex.locked && (
                    <div className="absolute top-4 right-4 bg-slate-100 p-2 rounded-xl text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                  )}
                  <div className={`w-14 h-14 ${ex.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm`}>
                    {ex.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-1">{ex.title}</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Level: {ex.difficulty}</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Progress</span>
                      <span className="text-xs font-black text-slate-600">{ex.progress}%</span>
                    </div>
                    <ProgressBar value={ex.progress} size="sm" color={ex.color} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string, label: string, value: string, color: string }) {
  return (
    <div className={`p-3 sm:p-4 rounded-3xl border-4 border-white shadow-md ${color} flex items-center gap-2 sm:gap-3`}>
      <div className="text-2xl sm:text-3xl bg-white/50 w-10 h-10 sm:w-12 sm:h-12 flex shrink-0 items-center justify-center rounded-xl">{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest truncate">{label}</p>
        <p className="text-base sm:text-xl font-black text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}
