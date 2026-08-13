import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { Question, generateQuestion, getOperationSymbol, Difficulty } from '../../lib/engine';
import confetti from 'canvas-confetti';

type OnboardingStep = 'WELCOME' | 'NAME' | 'AVATAR' | 'GRADE' | 'ASSESSMENT_INTRO' | 'ASSESSMENT' | 'RECOMMENDATION';

const AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Aneka&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Nala&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Leo&backgroundColor=d1d4f9',
];

const GRADES = ['TK', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4+'];

export function ChildOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('WELCOME');
  
  // User Data
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [grade, setGrade] = useState('');

  // Assessment State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [recommendedDiff, setRecommendedDiff] = useState<Difficulty>('EASY');
  
  const startAssessment = () => {
    // Generate 5 questions with increasing difficulty
    const q1 = generateQuestion('add', 'BEGINNER');
    const q2 = generateQuestion('sub', 'BEGINNER');
    const q3 = generateQuestion('add', 'EASY');
    const q4 = generateQuestion('sub', 'EASY');
    const q5 = generateQuestion('add', 'MEDIUM');
    
    setQuestions([q1, q2, q3, q4, q5]);
    setCurrentQIndex(0);
    setCorrectCount(0);
    setAnswer('');
    setStep('ASSESSMENT');
  };

  const handleNumberClick = (num: string) => {
    if (answer.length < 4) {
      setAnswer(prev => prev + num);
    }
  };

  const handleClear = () => setAnswer('');

  const checkAnswer = () => {
    if (!answer) return;
    
    const numAnswer = parseInt(answer, 10);
    const isCorrect = numAnswer === questions[currentQIndex].correctAnswer;
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    // Move to next question immediately without aggressive feedback to reduce pressure
    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setAnswer('');
      } else {
        finishAssessment(correctCount + (isCorrect ? 1 : 0));
      }
    }, 300);
  };

  const finishAssessment = (finalScore: number) => {
    let diff: Difficulty = 'BEGINNER';
    if (finalScore >= 5) diff = 'MEDIUM';
    else if (finalScore >= 3) diff = 'EASY';
    
    setRecommendedDiff(diff);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4ade80', '#3b82f6', '#fbbf24']
    });
    setStep('RECOMMENDATION');
  };

  const renderStep = () => {
    switch (step) {
      case 'WELCOME':
        return (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            <div className="w-32 h-32 bg-yellow-400 rounded-3xl mx-auto flex items-center justify-center border-b-8 border-yellow-600 shadow-xl mb-8">
               <span className="text-6xl font-black text-white">+</span>
            </div>
            <h1 className="text-5xl font-black text-slate-800">Selamat Datang di<br/><span className="text-blue-600">MATH HERO!</span></h1>
            <p className="text-xl text-slate-500 font-bold">Mari mulai petualangan belajarmu.</p>
            <Button size="lg" className="w-full text-2xl h-16 mt-8" onClick={() => setStep('NAME')}>
              MULAI
            </Button>
          </motion.div>
        );
      
      case 'NAME':
        return (
          <motion.div 
            key="name"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            <h1 className="text-4xl font-black text-slate-800">Halo! Siapa namamu?</h1>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-center text-4xl font-black p-6 rounded-3xl border-4 border-blue-200 focus:border-blue-500 outline-none shadow-sm"
              placeholder="Namaku..."
              autoFocus
            />
            <Button 
              size="lg" 
              className="w-full text-2xl h-16" 
              disabled={!name.trim()}
              onClick={() => setStep('AVATAR')}
            >
              LANJUT
            </Button>
          </motion.div>
        );

      case 'AVATAR':
        return (
          <motion.div 
            key="avatar"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            <h1 className="text-4xl font-black text-slate-800">Pilih Avatar Kerenmu!</h1>
            <div className="grid grid-cols-2 gap-4">
              {AVATARS.map((url) => (
                <div 
                  key={url} 
                  onClick={() => setAvatar(url)}
                  className={`cursor-pointer rounded-3xl border-4 p-4 transition-transform ${avatar === url ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <img src={url} alt="Avatar" className="w-full h-auto rounded-2xl" />
                </div>
              ))}
            </div>
            <Button size="lg" className="w-full text-2xl h-16" onClick={() => setStep('GRADE')}>
              LANJUT
            </Button>
          </motion.div>
        );

      case 'GRADE':
        return (
          <motion.div 
            key="grade"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            <h1 className="text-4xl font-black text-slate-800">Kelas berapa kamu sekarang?</h1>
            <div className="grid grid-cols-1 gap-3">
              {GRADES.map((g) => (
                <Button 
                  key={g}
                  variant={grade === g ? 'default' : 'outline'}
                  className={`h-16 text-xl border-4 ${grade === g ? 'bg-blue-600 text-white border-blue-800' : 'text-slate-600 border-slate-200 hover:border-blue-300'}`}
                  onClick={() => setGrade(g)}
                >
                  {g}
                </Button>
              ))}
            </div>
            <Button size="lg" className="w-full text-2xl h-16" disabled={!grade} onClick={() => setStep('ASSESSMENT_INTRO')}>
              LANJUT
            </Button>
          </motion.div>
        );

      case 'ASSESSMENT_INTRO':
        return (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            <div className="text-8xl">🕵️‍♂️</div>
            <h1 className="text-5xl font-black text-slate-800 tracking-tight">Mari kita lihat kemampuanmu!</h1>
            <p className="text-xl font-bold text-slate-500">Ada beberapa soal santai untuk menemukan level yang paling pas buatmu. Tidak ada penilaian, lakukan yang terbaik!</p>
            <Button size="lg" className="w-full text-2xl h-16 mt-8 bg-orange-500 hover:bg-orange-600 border-orange-700" onClick={startAssessment}>
              SIAP!
            </Button>
          </motion.div>
        );

      case 'ASSESSMENT':
        const currentQ = questions[currentQIndex];
        return (
          <motion.div 
            key="assessment"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center bg-blue-50 px-6 py-4 rounded-3xl border-4 border-blue-100 mb-8">
              <span className="font-bold text-blue-500 uppercase tracking-widest text-sm">Soal {currentQIndex + 1} dari {questions.length}</span>
              <span className="font-black text-blue-600">Tenang Saja! 🎈</span>
            </div>

            <div className="bg-white rounded-[40px] p-8 md:p-12 border-4 border-slate-100 text-center shadow-lg relative overflow-hidden">
              <div className="text-6xl md:text-8xl font-black text-slate-800 tracking-wider flex justify-center items-center gap-4">
                <span>{currentQ.operand1}</span>
                <span className="text-blue-500">{getOperationSymbol(currentQ.operation)}</span>
                <span>{currentQ.operand2}</span>
                <span className="text-slate-300">=</span>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-4 border-4 border-blue-100 flex justify-center items-center h-[100px] shadow-sm">
              <div className="text-5xl font-black text-blue-600 tracking-widest">
                {answer || <span className="text-slate-200">_</span>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4 mt-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button 
                  key={num} 
                  variant="default" 
                  className="h-16 md:h-20 text-3xl md:text-4xl font-black rounded-3xl bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  onClick={() => handleNumberClick(num.toString())}
                >
                  {num}
                </Button>
              ))}
              <Button variant="danger" className="h-16 md:h-20 text-lg uppercase rounded-3xl" onClick={handleClear}>
                Hapus
              </Button>
              <Button variant="default" className="h-16 md:h-20 text-3xl md:text-4xl font-black rounded-3xl bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200" onClick={() => handleNumberClick('0')}>
                0
              </Button>
              <Button variant="primary" className="h-16 md:h-20 text-xl font-black rounded-3xl uppercase tracking-widest" onClick={checkAnswer}>
                CEK
              </Button>
            </div>
          </motion.div>
        );

      case 'RECOMMENDATION':
        return (
          <motion.div 
            key="recommendation"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-8"
          >
            <div className="text-8xl">🎉</div>
            <h1 className="text-4xl font-black text-slate-800">Hebat! Kami menemukan level awal yang cocok untukmu.</h1>
            
            <div className="bg-blue-50 border-4 border-blue-200 p-8 rounded-[40px] shadow-sm">
              <div className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Level Rekomendasi</div>
              <div className="text-4xl font-black text-blue-600 mb-4">
                {recommendedDiff === 'BEGINNER' ? 'Pemula' : recommendedDiff === 'EASY' ? 'Mudah' : 'Sedang'}
              </div>
              <p className="text-lg font-bold text-blue-800/70">
                Level ini pas untuk melatih kemampuanmu. Nanti kita akan terus naik level!
              </p>
            </div>

            <Button 
              size="lg" 
              className="w-full text-2xl h-20 shadow-xl" 
              onClick={() => navigate(`/child/practice?op=mix&diff=${recommendedDiff}`)}
            >
              MULAI MAIN! 🚀
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white p-8 md:p-12 rounded-[48px] border-8 border-white/50 shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}
