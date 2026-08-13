import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Play, Star, Trophy, Clock, Target, Flame } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Operation, 
  Difficulty, 
  Question, 
  GameResult, 
  generateQuestion, 
  getOperationSymbol,
  calculateResults,
  calculateLevel,
  checkNewBadges,
  evaluateAdaptiveDifficulty
} from '../../lib/engine';
import { BADGE_DEFINITIONS } from '../../lib/badges';
import { updateDailyChallengeProgress, DailyChallenge } from '../../lib/dailyChallenge';
import { useChildContext } from '../../lib/contexts/ChildContext';
import { PracticeService } from '../../lib/services/api';
import confetti from 'canvas-confetti';
import { useSettings } from '../../lib/useSettings';
import { audioEngine } from '../../lib/audio';

type GameState = 'SETUP' | 'PLAYING' | 'FINISHED';

interface QuestionState extends Question {
  attempts: number;
  startTime: number;
  solvedTimeMs?: number;
}

export function Practice() {
  const { settings } = useSettings();
  audioEngine.setEnabled(settings.soundOn);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [gameState, setGameState] = useState<GameState>('SETUP');
  
  // Setup State
  const { activeChild } = useChildContext();
  const [selectedOp, setSelectedOp] = useState<Operation>((searchParams.get('op') as Operation) || 'add');
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>((searchParams.get('diff') as Difficulty) || 'LEVEL_1');
  
  // Playing State
  const totalQuestions = 10;
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'NONE' | 'CORRECT' | 'WRONG'>('NONE');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  // Results & Gamification
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentXP, setCurrentXP] = useState(0);
  const [levelUpData, setLevelUpData] = useState<{old: number, new: number} | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [dcCompletedData, setDcCompletedData] = useState<DailyChallenge | null>(null);
  const [adaptiveFeedback, setAdaptiveFeedback] = useState<{ nextDifficulty: Difficulty, label: string } | null>(null);

  const getXpGain = (diff: Difficulty) => {
    switch (diff) {
      case 'LEVEL_1': return 10;
      case 'LEVEL_2': return 12;
      case 'LEVEL_3': return 15;
      case 'LEVEL_4': return 20;
      default: return 10;
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'PLAYING') {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (gameState === 'PLAYING') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameState]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    const newQuestions: QuestionState[] = [];
    for (let i = 0; i < totalQuestions; i++) {
      newQuestions.push({
        ...generateQuestion(selectedOp, selectedDiff),
        attempts: 0,
        startTime: 0,
      });
    }
    newQuestions[0].startTime = Date.now();
    
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setAnswer('');
    setFeedback('NONE');
    setTimeElapsed(0);
    setCurrentXP(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setLevelUpData(null);
    setEarnedBadges([]);
    setDcCompletedData(null);
    setAdaptiveFeedback(null);
    setGameState('PLAYING');
  };

  const handleNumberClick = (num: string) => {
    if (feedback === 'CORRECT') return; 
    
    // For Level 1, input is a single choice so check immediately
    if (selectedDiff === 'LEVEL_1') {
      setAnswer(num);
      checkAnswerValue(num);
      return;
    }

    if (answer.length < 4) {
      setAnswer(prev => prev + num);
      setFeedback('NONE'); 
    }
  };

  const handleClear = () => setAnswer('');
  const handleDelete = () => setAnswer(prev => prev.slice(0, -1));

  const checkAnswerValue = (val: string) => {
    if (!val || feedback === 'CORRECT') return;
    
    const numAnswer = parseInt(val, 10);
    const currentQ = questions[currentIndex];
    const isCorrect = numAnswer === currentQ.correctAnswer;
    
    setQuestions(prev => {
      const newQ = [...prev];
      newQ[currentIndex].attempts += 1;
      if (isCorrect) {
        newQ[currentIndex].solvedTimeMs = Date.now() - newQ[currentIndex].startTime;
      }
      return newQ;
    });

    if (isCorrect) {
      if (settings.soundOn) audioEngine.playCorrect();
      if (settings.celebrationOn) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#4ade80', '#fbbf24', '#3b82f6']
        });
      }
      
      setFeedback('CORRECT');
      setCurrentXP(prev => prev + getXpGain(selectedDiff));
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      
      setTimeout(() => {
        if (currentIndex < totalQuestions - 1) {
          setQuestions(prev => {
            const newQ = [...prev];
            newQ[currentIndex + 1].startTime = Date.now();
            return newQ;
          });
          setCurrentIndex(prev => prev + 1);
          setAnswer('');
          setFeedback('NONE');
        } else {
          finishGame(newStreak > bestStreak ? newStreak : bestStreak);
        }
      }, 1500);
    } else {
      setFeedback('WRONG');
      setCurrentStreak(0); // Reset streak on wrong answer
      setTimeout(() => {
        setAnswer('');
        setFeedback('NONE');
      }, 1000);
    }
  };

  const checkAnswer = () => checkAnswerValue(answer);

  const finishGame = async (finalBestStreak: number) => {
    const firstTryCorrect = questions.filter(q => q.attempts === 1).length;
    const responseTimes = questions.map(q => q.solvedTimeMs || 0).filter(t => t > 0);
    
    const res = calculateResults(
      totalQuestions,
      firstTryCorrect,
      responseTimes,
      finalBestStreak,
      selectedDiff
    );

    if (!activeChild) return;

    // Update Daily Challenge progress
    const dcResult = await updateDailyChallengeProgress(activeChild.id, res, selectedOp);
    let finalXpEarned = res.xpEarned;
    
    if (dcResult.completedNow) {
      setDcCompletedData(dcResult.challenge);
      finalXpEarned += dcResult.challenge.rewardXp;
    }
    
    res.xpEarned = finalXpEarned;
    setGameResult(res);

    // Save to Database securely
    try {
      await PracticeService.saveSessionSecure({
        childId: activeChild.id,
        operation: selectedOp,
        difficulty: selectedDiff,
        totalQuestions: totalQuestions,
        correctAnswers: firstTryCorrect,
        averageResponseTime: res.averageResponseTime
      });
    } catch (e) {
      console.error('Failed to save session securely', e);
    }

    // Adaptive Difficulty
    const adaptive = evaluateAdaptiveDifficulty(res, selectedDiff);
    setAdaptiveFeedback(adaptive);
    setSelectedDiff(adaptive.nextDifficulty);

    // Gamification processing
    const oldLevelData = calculateLevel(activeChild.xp);
    const newTotalXp = activeChild.xp + res.xpEarned;
    const newLevelData = calculateLevel(newTotalXp);
    
    if (newLevelData.level > oldLevelData.level) {
      setLevelUpData({ old: oldLevelData.level, new: newLevelData.level });
    }

    const newBadges = checkNewBadges(res, selectedOp, activeChild.unlockedBadges || []);
    setEarnedBadges(newBadges);

    if (settings.soundOn) {
      if (newLevelData.level > oldLevelData.level) {
        audioEngine.playLevelUp();
      } else if (newBadges.length > 0 || dcResult.completedNow) {
        audioEngine.playAchievement();
      }
    }
    
    if (settings.celebrationOn && (newLevelData.level > oldLevelData.level || newBadges.length > 0 || dcResult.completedNow)) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#4ade80', '#fbbf24', '#3b82f6', '#f43f5e']
        });
      }, 300);
    }

    setGameState('FINISHED');
  };

  if (gameState === 'SETUP') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl border-4 border-blue-100 hover:border-blue-300 text-blue-500 shadow-sm transition-colors">
            <ArrowLeft className="w-6 h-6 stroke-[3]" />
          </button>
          <h1 className="text-3xl font-black text-slate-800">Siap-Siap!</h1>
        </div>

        <div className="bg-white p-6 rounded-[32px] border-4 border-blue-100 shadow-xl space-y-6">
          {/* Operation */}
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Pilih Kekuatanmu</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: 'add', label: 'Tambah', icon: '➕', color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
                { id: 'sub', label: 'Kurang', icon: '➖', color: 'text-pink-500', bg: 'bg-pink-50 border-pink-200' },
                { id: 'mul', label: 'Kali', icon: '✖️', color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
                { id: 'div', label: 'Bagi', icon: '➗', color: 'text-teal-500', bg: 'bg-teal-50 border-teal-200' },
                { id: 'mix', label: 'Campuran', icon: '🎲', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' },
              ].map(op => (
                <button 
                  key={op.id}
                  onClick={() => setSelectedOp(op.id as Operation)}
                  className={`p-3 rounded-2xl border-2 transition-transform ${selectedOp === op.id ? `${op.bg} scale-105 border-b-4` : 'bg-white border-slate-100 hover:border-slate-200'} flex flex-col items-center gap-2`}
                >
                  <div className={`text-2xl ${op.color}`}>{op.icon}</div>
                  <div className={`font-bold text-sm ${selectedOp === op.id ? op.color : 'text-slate-500'}`}>{op.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Pilih Level</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { id: 'LEVEL_1', label: 'Pemula', stars: '🍎' },
                { id: 'LEVEL_2', label: 'Dasar', stars: '⭐⭐' },
                { id: 'LEVEL_3', label: 'SD Awal', stars: '⭐⭐⭐' },
                { id: 'LEVEL_4', label: 'SD', stars: '⭐⭐⭐⭐' },
              ].map(diff => (
                <button 
                  key={diff.id}
                  onClick={() => setSelectedDiff(diff.id as Difficulty)}
                  className={`p-3 rounded-2xl border-2 transition-transform ${selectedDiff === diff.id ? `bg-yellow-50 border-yellow-300 border-b-4 scale-105` : 'bg-white border-slate-100 hover:border-slate-200'} flex flex-col items-center gap-1`}
                >
                  <div className="text-lg">{diff.stars}</div>
                  <div className={`font-bold text-sm ${selectedDiff === diff.id ? 'text-yellow-700' : 'text-slate-500'}`}>{diff.label}</div>
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" className="w-full h-16 text-xl" onClick={startGame}>
            AYO MULAI! <Play className="w-6 h-6 ml-2 fill-white" />
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'FINISHED' && gameResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pb-12 text-center">
        {/* Level Up Banner */}
        <AnimatePresence>
          {levelUpData && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-[32px] border-4 border-yellow-200 shadow-xl text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsIDI1NSLCAyNTUsIDAuMikiLz48L3N2Zz4=')] opacity-50"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-5xl mb-2 animate-bounce">🚀</div>
                <h2 className="text-3xl font-black mb-1 tracking-widest uppercase text-yellow-100">LEVEL UP!</h2>
                <p className="text-xl font-bold text-white">Kamu telah mencapai <span className="font-black text-2xl">Level {levelUpData.new}</span>!</p>
              </div>
            </motion.div>
          )}

          {dcCompletedData && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-[32px] border-4 border-green-200 shadow-xl text-white relative overflow-hidden mt-4"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsIDI1NSLCAyNTUsIDAuMikiLz48L3N2Zz4=')] opacity-50"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-5xl mb-2 animate-bounce">🎯</div>
                <h2 className="text-3xl font-black mb-1 tracking-widest uppercase text-green-100">MISI HARIAN BERHASIL!</h2>
                <p className="text-xl font-bold text-white mb-2">{dcCompletedData.title}</p>
                <div className="flex gap-2">
                  <span className="bg-white text-green-600 font-black px-3 py-1 rounded-full text-sm">+{dcCompletedData.rewardXp} XP</span>
                  <span className="bg-white text-orange-500 font-black px-3 py-1 rounded-full text-sm">+{dcCompletedData.rewardStars} ⭐</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: levelUpData ? 0.5 : 0 }}
          className="bg-white p-6 md:p-10 rounded-[40px] border-4 border-blue-100 shadow-xl space-y-8"
        >
          <div className="w-32 h-32 mx-auto bg-yellow-400 rounded-full flex items-center justify-center border-8 border-yellow-200 shadow-lg mb-6">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-3xl font-black text-slate-800">Misi Berhasil!</h1>
          
          <div className="flex justify-center gap-2 text-4xl mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: (levelUpData ? 0.8 : 0.3) + i * 0.2, type: 'spring' }}
              >
                <Star 
                  className={`w-14 h-14 ${i < gameResult.starsEarned ? 'fill-yellow-400 text-yellow-500' : 'fill-slate-100 text-slate-200'}`} 
                />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-white p-4 rounded-3xl border-4 border-slate-100 col-span-2 flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-500 font-bold"><CheckCircle2 className="w-6 h-6 text-green-500"/> Jawaban Benar</div>
              <div className="text-3xl font-black text-slate-800">{gameResult.correctAnswers} <span className="text-xl text-slate-400">/ {gameResult.totalQuestions}</span></div>
            </div>
            <div className="bg-blue-50 p-4 rounded-3xl border-4 border-blue-100">
              <div className="flex items-center gap-2 text-blue-500 font-bold mb-1"><Target className="w-5 h-5"/> Akurasi</div>
              <div className="text-3xl font-black text-slate-800">{gameResult.accuracy}%</div>
            </div>
            <div className="bg-green-50 p-4 rounded-3xl border-4 border-green-100">
              <div className="flex items-center gap-2 text-green-500 font-bold mb-1"><Clock className="w-5 h-5"/> Rata-rata Waktu</div>
              <div className="text-3xl font-black text-slate-800">{(gameResult.averageResponseTime / 1000).toFixed(1)}s</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-3xl border-4 border-purple-100 col-span-2 flex justify-between items-center">
              <div className="flex items-center gap-2 text-purple-600 font-bold"><Flame className="w-6 h-6"/> XP Diperoleh</div>
              <div className="text-4xl font-black text-purple-600">+{gameResult.xpEarned}</div>
            </div>
          </div>

          {adaptiveFeedback && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 }}
              className={`p-4 rounded-3xl border-4 flex items-center justify-center gap-4 text-left ${
              adaptiveFeedback.label === 'Ready for More' 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : adaptiveFeedback.label === 'Getting Easier'
                  ? 'bg-orange-50 border-orange-200 text-orange-700'
                  : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              <div className="text-4xl drop-shadow-sm">
                {adaptiveFeedback.label === 'Ready for More' ? '🚀' : adaptiveFeedback.label === 'Getting Easier' ? '🤗' : '👍'}
              </div>
              <div>
                <span className="font-black block text-xl tracking-wide">{adaptiveFeedback.label}</span>
                <span className="text-sm font-bold opacity-80">
                  {adaptiveFeedback.label === 'Ready for More' && 'Hebat! Kamu siap untuk tantangan lebih besar!'}
                  {adaptiveFeedback.label === 'Just Right' && 'Kerja bagus! Level ini pas untukmu.'}
                  {adaptiveFeedback.label === 'Getting Easier' && 'Tidak apa-apa! Mari kita coba yang lebih mudah dulu.'}
                </span>
              </div>
            </motion.div>
          )}

          {/* Earned Badges Section */}
          {earnedBadges.length > 0 && (
            <div className="pt-4 border-t-4 border-slate-50 mt-8">
              <h3 className="text-lg font-black text-slate-600 mb-4 uppercase tracking-widest">Lencana Baru! 🎉</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {earnedBadges.map((badgeId, idx) => {
                  const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badgeId);
                  if (!badgeDef) return null;
                  return (
                    <motion.div
                      key={badgeId}
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: 1.5 + idx * 0.2 }}
                      className="bg-orange-50 p-3 rounded-2xl border-2 border-orange-200 flex items-center gap-3 pr-6"
                    >
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl border-2 border-orange-100 shadow-sm">{badgeDef.icon}</div>
                      <div className="text-left">
                        <div className="font-black text-orange-700 leading-tight">{badgeDef.title}</div>
                        <div className="text-[10px] font-bold text-orange-500 uppercase">Terbuka</div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <Button variant="outline" className="flex-1 h-16 text-lg border-4" onClick={() => navigate('/child')}>
              MENU UTAMA
            </Button>
            <Button className="flex-1 h-16 text-lg" onClick={() => setGameState('SETUP')}>
              MAIN LAGI!
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // PLAYING STATE
  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => setGameState('SETUP')} className="p-3 bg-white rounded-2xl border-4 border-blue-100 hover:border-blue-300 text-blue-500 shadow-sm transition-colors">
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
        </button>
        <div className="flex-1 bg-white p-4 rounded-[24px] border-4 border-blue-100 flex items-center gap-4 shadow-sm">
          <ProgressBar value={currentIndex + 1} max={totalQuestions} size="lg" color="bg-yellow-400" className="flex-1" />
          <span className="font-black text-blue-500 shrink-0 uppercase tracking-widest">{currentIndex + 1} / {totalQuestions}</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="bg-white p-3 px-4 rounded-2xl border-4 border-blue-100 flex items-center gap-2 font-black text-slate-700 shadow-sm">
            <Clock className="w-5 h-5 text-blue-500" />
            {formatTime(timeElapsed)}
          </div>
          <div className="bg-white p-3 px-4 rounded-2xl border-4 border-orange-100 flex items-center gap-2 font-black text-orange-600 shadow-sm">
            <Flame className="w-5 h-5 text-orange-500" />
            {currentXP} XP
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-[32px] p-4 sm:p-6 md:p-8 border-4 border-blue-100 text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
        <h2 className="text-base sm:text-lg font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-4 relative z-10">Berapa Hasilnya?</h2>
        
        {selectedDiff === 'LEVEL_1' ? (
          <div className="flex flex-col items-center gap-6 relative z-10 my-4">
            <div className="flex flex-wrap justify-center gap-2 max-w-[200px]">
              {Array.from({ length: currentQ.operand1 }).map((_, i) => (
                <span key={`op1-${i}`} className="text-4xl">🍎</span>
              ))}
            </div>
            <div className="text-4xl text-blue-500 font-black">{getOperationSymbol(currentQ.operation)}</div>
            <div className="flex flex-wrap justify-center gap-2 max-w-[200px]">
              {Array.from({ length: currentQ.operand2 }).map((_, i) => (
                <span key={`op2-${i}`} className="text-4xl">🍎</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-800 tracking-wider relative z-10 flex justify-center items-center gap-2 sm:gap-4">
            <span className="drop-shadow-sm">{currentQ.operand1}</span>
            <span className="text-blue-500 drop-shadow-sm">{getOperationSymbol(currentQ.operation)}</span>
            <span className="drop-shadow-sm">{currentQ.operand2}</span>
            <span className="text-slate-300">=</span>
          </div>
        )}

        <AnimatePresence>
          {feedback === 'CORRECT' && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-green-500 flex flex-col items-center justify-center z-20 text-white"
            >
              <div className="text-8xl mb-4">🌟</div>
              <h2 className="text-4xl font-black">MANTAP! 🎉</h2>
              <p className="text-xl font-bold opacity-90 mt-2">+{getXpGain(selectedDiff)} XP</p>
            </motion.div>
          )}
          {feedback === 'WRONG' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-orange-100/90 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              <div className="text-6xl mb-4">💪</div>
              <h2 className="text-3xl font-black text-orange-600">Ayo Coba Lagi!</h2>
              <p className="text-xl font-bold text-orange-500 mt-2">Kamu pasti bisa!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Answer Area */}
      {selectedDiff === 'LEVEL_1' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {/* Generate 4 multiple choices including the correct answer */}
          {[
            currentQ.correctAnswer,
            Math.max(1, currentQ.correctAnswer - 1),
            currentQ.correctAnswer + 1,
            Math.max(2, currentQ.correctAnswer + 2)
          ].sort(() => Math.random() - 0.5).map((choice, idx) => (
            <Button
              key={`${currentIndex}-${choice}-${idx}`}
              variant="default"
              className="h-16 sm:h-24 text-3xl sm:text-5xl font-black rounded-2xl border-4 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={() => handleNumberClick(choice.toString())}
            >
              {choice}
            </Button>
          ))}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-[24px] p-3 sm:p-4 border-4 border-blue-100 flex justify-between items-center min-h-[80px] sm:min-h-[100px] shadow-sm relative overflow-hidden">
            <div className="text-5xl sm:text-6xl font-black text-blue-600 tracking-widest w-full text-center">
              {answer || <span className="text-slate-200 animate-pulse">?</span>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button 
                key={num} 
                variant="default" 
                className="h-14 sm:h-16 md:h-20 text-2xl sm:text-3xl md:text-4xl font-black rounded-2xl"
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </Button>
            ))}
            <Button variant="danger" className="h-14 sm:h-16 md:h-20 text-sm sm:text-base uppercase tracking-wider rounded-2xl" onClick={handleClear}>
              Hapus
            </Button>
            <Button variant="default" className="h-14 sm:h-16 md:h-20 text-2xl sm:text-3xl md:text-4xl font-black rounded-2xl" onClick={() => handleNumberClick('0')}>
              0
            </Button>
            <Button variant="primary" className="h-14 sm:h-16 md:h-20 text-base sm:text-xl font-black rounded-2xl uppercase tracking-widest" onClick={checkAnswer}>
              CEK
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

