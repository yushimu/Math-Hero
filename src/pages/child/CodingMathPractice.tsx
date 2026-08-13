import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Trophy, Star, ShieldAlert, Clock, Flame, BrainCircuit } from 'lucide-react';
import { MOCK_CODING_MATH_QUESTIONS } from '../../data/codingMathMock';
import { CODING_MATH_CONFIG, CODING_MATH_LEVELS } from '../../config/codingMath';
import { CodingMathQuestion, CodingMathLevelProgress } from '../../types/codingMath';
import { ProgressBar } from '../../components/ui/ProgressBar';
import confetti from 'canvas-confetti';

export function CodingMathPractice() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<CodingMathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Tracking
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const levelInfo = CODING_MATH_LEVELS.find(l => l.id === levelId);

  useEffect(() => {
    if (levelId && MOCK_CODING_MATH_QUESTIONS[levelId]) {
      setQuestions(MOCK_CODING_MATH_QUESTIONS[levelId]);
      setQuestionStartTime(Date.now());
    } else {
      setQuestions([]);
    }
  }, [levelId]);

  if (!questions.length || !levelInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <ShieldAlert className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-500">Soal belum tersedia untuk level ini.</h2>
        <button 
          onClick={() => navigate('/child/coding-math')}
          className="mt-6 bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold"
        >
          Kembali
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = (currentIndex / questions.length) * 100;

  const handleCheck = () => {
    if (!selectedAnswer) return;
    
    setIsChecking(true);
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    const timeTaken = Date.now() - questionStartTime;
    setTotalTimeMs(prev => prev + timeTaken);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      
      // Calculate score based on time bonus (optional) or flat rate
      // Flat rate for now: 100 points per question
      setScore(prev => prev + 100);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#4ade80', '#22c55e', '#16a34a']
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsChecking(false);
      setIsCorrect(null);
      setQuestionStartTime(Date.now());
    } else {
      finishLevel();
    }
  };

  const finishLevel = () => {
    setIsFinished(true);
    const finalScorePercent = Math.round(((correctCount + (isCorrect ? 1 : 0)) / questions.length) * 100);
    
    // Check if passed
    const passed = finalScorePercent >= CODING_MATH_CONFIG.unlockRequirements.minScore;
    let earnedStars = 0;
    if (passed) {
      if (finalScorePercent >= 90) earnedStars = 3;
      else if (finalScorePercent >= 70) earnedStars = 2;
      else earnedStars = 1;
    }

    if (passed) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }

    // Save progress
    const savedProgressStr = localStorage.getItem('codingMathProgress');
    const savedProgress: Record<string, CodingMathLevelProgress> = savedProgressStr ? JSON.parse(savedProgressStr) : {};
    
    // Update current level
    const currentProgress = savedProgress[levelId!] || { levelId: levelId!, unlocked: true, bestScore: 0, bestAccuracy: 0, stars: 0 };
    if (finalScorePercent > currentProgress.bestScore) {
      currentProgress.bestScore = finalScorePercent;
      currentProgress.bestAccuracy = finalScorePercent;
      currentProgress.stars = Math.max(currentProgress.stars, earnedStars);
    }
    savedProgress[levelId!] = currentProgress;

    // Unlock next level if passed
    if (passed) {
      const currentLevelIndex = CODING_MATH_LEVELS.findIndex(l => l.id === levelId);
      if (currentLevelIndex !== -1 && currentLevelIndex < CODING_MATH_LEVELS.length - 1) {
        const nextLevelId = CODING_MATH_LEVELS[currentLevelIndex + 1].id;
        if (!savedProgress[nextLevelId]) {
          savedProgress[nextLevelId] = {
            levelId: nextLevelId,
            unlocked: true,
            bestScore: 0,
            bestAccuracy: 0,
            stars: 0
          };
        } else {
          savedProgress[nextLevelId].unlocked = true;
        }
      }
    }

    localStorage.setItem('codingMathProgress', JSON.stringify(savedProgress));
  };

  const resetPractice = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setScore(0);
    setTotalTimeMs(0);
    setIsFinished(false);
    setIsChecking(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setQuestionStartTime(Date.now());
  };

  const goToNextLevel = () => {
    const currentLevelIndex = CODING_MATH_LEVELS.findIndex(l => l.id === levelId);
    if (currentLevelIndex !== -1 && currentLevelIndex < CODING_MATH_LEVELS.length - 1) {
      const nextLevelId = CODING_MATH_LEVELS[currentLevelIndex + 1].id;
      navigate(`/child/coding-math/practice/${nextLevelId}`);
    }
  };

  if (isFinished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const passed = accuracy >= CODING_MATH_CONFIG.unlockRequirements.minScore;
    const avgTimeSeconds = Math.round((totalTimeMs / questions.length) / 1000);
    const earnedXp = correctCount * 15;

    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[80vh] py-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 md:p-8 rounded-3xl border-4 border-indigo-100 shadow-xl text-center max-w-lg w-full"
        >
          <div className="bg-indigo-50 text-indigo-700 font-black px-6 py-2 rounded-full inline-block mb-6 uppercase tracking-widest text-sm border-2 border-indigo-100">
            LEVEL COMPLETE!
          </div>
          
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-4 ${
            passed ? 'bg-green-100 text-green-500 border-green-200' : 'bg-orange-100 text-orange-500 border-orange-200'
          }`}>
            {passed ? <Trophy className="w-10 h-10" /> : <BrainCircuit className="w-10 h-10" />}
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 mb-2">
            {passed ? 'Awesome Job!' : 'Almost there!'}
          </h2>
          <p className="text-slate-500 font-bold mb-6">
            {passed ? 'You have successfully completed this level.' : 'Practice this level again to unlock the next one.'}
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-100 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Score</span>
              <span className="text-xl font-black text-indigo-600">{score}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-100 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Accuracy</span>
              <span className="text-xl font-black text-indigo-600">{accuracy}%</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-100 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Correct</span>
              <span className="text-xl font-black text-green-500">{correctCount} / {questions.length}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-100 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Best Streak</span>
              <span className="text-xl font-black text-orange-500 flex items-center gap-1">
                {bestStreak} <Flame className="w-4 h-4 fill-orange-500" />
              </span>
            </div>
            <div className="col-span-2 bg-slate-50 p-3 rounded-2xl border-2 border-slate-100 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Avg Time</span>
              <span className="text-xl font-black text-slate-600 flex items-center gap-1">
                <Clock className="w-4 h-4" /> {avgTimeSeconds}s / question
              </span>
            </div>
          </div>

          {/* Rewards */}
          <div className="flex justify-center gap-6 mb-8 bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100">
             <div className="flex flex-col items-center">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-6 h-6 ${
                        star <= (accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1) && passed
                          ? 'fill-yellow-400 text-yellow-500' 
                          : 'fill-slate-200 text-slate-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase">Stars</span>
             </div>
             <div className="w-px bg-indigo-200 h-10"></div>
             <div className="flex flex-col items-center justify-center">
                <span className="text-xl font-black text-blue-600 flex items-center gap-1">
                  💎 +{passed ? earnedXp : Math.floor(earnedXp/2)}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase">XP Gained</span>
             </div>
          </div>

          <div className="flex flex-col gap-3">
            {passed && (
              <button 
                onClick={goToNextLevel}
                className="w-full py-4 rounded-xl font-black text-white bg-green-500 border-b-4 border-green-700 hover:bg-green-600 active:translate-y-1 active:border-b-0"
              >
                NEXT LEVEL
              </button>
            )}
            <button 
              onClick={resetPractice}
              className={`w-full py-4 rounded-xl font-black transition-all ${
                !passed 
                  ? 'bg-indigo-500 text-white border-b-4 border-indigo-700 hover:bg-indigo-600 active:translate-y-1 active:border-b-0' 
                  : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-100'
              }`}
            >
              TRY AGAIN
            </button>
            <button 
              onClick={() => navigate('/child/coding-math')}
              className="w-full py-4 rounded-xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              BACK TO CODING MATH
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-2 md:py-4 h-full flex flex-col min-h-[85vh]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800">Coding Math</h1>
          <p className="text-indigo-500 font-bold text-sm uppercase tracking-widest">Level {levelInfo.levelNumber}</p>
        </div>
        <button 
          onClick={() => navigate('/child/coding-math')}
          className="bg-white p-2 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm border-2 border-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border-2 border-slate-100 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[150px]">
          <div className="flex justify-between items-center mb-1">
             <span className="text-xs font-bold text-slate-400 uppercase">Progress</span>
             <span className="text-xs font-black text-indigo-600">{currentIndex + 1} / {questions.length}</span>
          </div>
          <ProgressBar value={progressPercent} max={100} size="md" color="bg-indigo-500" />
        </div>
        
        <div className="flex gap-3 shrink-0">
          <div className="bg-orange-50 px-3 py-1.5 rounded-xl border-2 border-orange-100 flex items-center gap-1.5">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'fill-orange-500 text-orange-500' : 'text-slate-300'}`} />
            <span className="font-black text-orange-600">{streak}</span>
          </div>
          <div className="bg-green-50 px-3 py-1.5 rounded-xl border-2 border-green-100 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 fill-green-500 text-green-500" />
            <span className="font-black text-green-600">{score}</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="flex-1 flex flex-col bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 border-slate-100"
        >
          <div className="mb-6 flex justify-between items-start">
            <span className="inline-block bg-indigo-50 text-indigo-600 font-black px-3 py-1 rounded-lg text-xs uppercase tracking-widest border-2 border-indigo-100">
              Question {currentIndex + 1}
            </span>
          </div>

          <div className="text-center md:text-left mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="mt-auto">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
              Answer:
            </div>
            {currentQuestion.options ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={isChecking}
                    onClick={() => setSelectedAnswer(opt)}
                    className={`p-4 rounded-2xl text-xl font-bold transition-all border-4 text-left flex items-center justify-between ${
                      selectedAnswer === opt
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 text-slate-600'
                    } ${isChecking ? 'cursor-default opacity-80' : 'cursor-pointer active:scale-95'}`}
                  >
                    <span>{opt}</span>
                    {selectedAnswer === opt && <div className="w-4 h-4 rounded-full bg-indigo-500" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-2">
                <input 
                  type="text" 
                  disabled={isChecking}
                  value={selectedAnswer || ''}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 rounded-2xl text-xl font-bold border-4 border-slate-200 focus:border-indigo-500 focus:bg-indigo-50 outline-none transition-all text-slate-700 disabled:opacity-80 disabled:bg-slate-50"
                />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Footer */}
      <div className={`mt-6 rounded-3xl p-4 md:p-6 transition-colors border-4 shadow-sm ${
        !isChecking ? 'bg-white border-slate-100' : 
        isCorrect ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
      }`}>
        {!isChecking ? (
          <button
            disabled={!selectedAnswer}
            onClick={handleCheck}
            className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
              selectedAnswer 
                ? 'bg-indigo-500 text-white border-b-4 border-indigo-700 hover:bg-indigo-600 active:translate-y-1 active:border-b-0 shadow-sm' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border-b-4 border-slate-200'
            }`}
          >
            CHECK ANSWER
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm ${
                isCorrect ? 'bg-green-500' : 'bg-orange-500'
              }`}>
                {isCorrect ? <Check className="w-8 h-8" /> : <BrainCircuit className="w-8 h-8" />}
              </div>
              <div>
                <h3 className={`text-xl font-black ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                  {isCorrect ? 'Great thinking! 🎉' : 'Good try! Let\'s think again.'}
                </h3>
                {isCorrect && currentQuestion.explanation && (
                  <p className="font-bold text-green-600 text-sm mt-1">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleNext}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl font-black text-lg text-white transition-all active:translate-y-1 active:border-b-0 border-b-4 flex items-center justify-center gap-2 shadow-sm ${
                isCorrect 
                  ? 'bg-green-500 border-green-700 hover:bg-green-600' 
                  : 'bg-orange-500 border-orange-700 hover:bg-orange-600'
              }`}
            >
              NEXT <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
