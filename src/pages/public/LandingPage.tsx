import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Brain, Star, TrendingUp, ShieldCheck } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center pt-16 md:pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-black text-sm uppercase tracking-widest mb-4 border-2 border-yellow-200 shadow-sm">
          <Star className="w-4 h-4 fill-yellow-500" />
          Belajar matematika jadi menyenangkan!
        </div>
        
        <h1 className="text-[2.5rem] leading-[1.1] md:text-6xl font-black text-[#1E293B]">
          Latih Otak Anak Anda Dengan <span className="text-blue-600 block mt-2">Mental Aritmatika</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Platform belajar berhitung interaktif yang dirancang khusus untuk anak TK hingga SD. Membantu meningkatkan kecepatan dan ketepatan dengan cara yang menyenangkan.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-lg px-10 animate-bounce hover:animate-none">Mulai Belajar Sekarang</Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10">Masuk Akun</Button>
          </Link>
        </div>
      </div>

      <div className="mt-32 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <FeatureCard 
          icon={<Brain className="w-8 h-8 text-white" />}
          title="Metode Interaktif"
          desc="Latihan didesain seperti permainan dengan level dan tantangan harian."
          color="bg-white border-blue-100"
          iconColor="bg-blue-500"
        />
        <FeatureCard 
          icon={<TrendingUp className="w-8 h-8 text-white" />}
          title="Pantau Perkembangan"
          desc="Dashboard khusus orang tua untuk melihat progress dan statistik belajar anak."
          color="bg-white border-green-100"
          iconColor="bg-green-500"
        />
        <FeatureCard 
          icon={<ShieldCheck className="w-8 h-8 text-white" />}
          title="Aman & Ramah Anak"
          desc="Lingkungan belajar yang positif tanpa iklan dan konten yang mengganggu."
          color="bg-white border-pink-100"
          iconColor="bg-pink-500"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, iconColor }: { icon: React.ReactNode, title: string, desc: string, color: string, iconColor: string }) {
  return (
    <div className={`p-8 rounded-[32px] border-4 ${color} shadow-lg hover:scale-[1.02] transition-transform flex flex-col items-center text-center space-y-4`}>
      <div className={`w-16 h-16 ${iconColor} rounded-2xl flex items-center justify-center shadow-md`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-800">{title}</h3>
      <p className="text-slate-500 font-bold">{desc}</p>
    </div>
  );
}
