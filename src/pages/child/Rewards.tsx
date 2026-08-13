import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Lock, Check } from 'lucide-react';
import { mockChildProfile, mockRewards } from '../../data/mock';
import { Button } from '../../components/ui/Button';

export function Rewards() {
  const [stars, setStars] = useState(mockChildProfile.stars);
  const [owned, setOwned] = useState<string[]>(mockChildProfile.unlockedRewards);

  const handleBuy = (id: string, cost: number) => {
    if (stars >= cost && !owned.includes(id)) {
      setStars(prev => prev - cost);
      setOwned(prev => [...prev, id]);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Toko Hadiah 🎁</h1>
        <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-2xl border-4 border-pink-100 shadow-sm">
          <Star className="w-6 h-6 fill-pink-500 text-pink-500" />
          <span className="text-xl font-black text-pink-600">{stars}</span>
        </div>
      </div>

      <p className="text-slate-500 font-bold">Tukarkan Bintangmu dengan karakter dan aksesoris keren!</p>

      <div className="space-y-8">
        <RewardSection 
          title="Karakter Baru" 
          items={mockRewards.filter(r => r.type === 'avatar')} 
          owned={owned} 
          stars={stars} 
          onBuy={handleBuy} 
        />
        <RewardSection 
          title="Aksesoris & Tema" 
          items={mockRewards.filter(r => r.type !== 'avatar')} 
          owned={owned} 
          stars={stars} 
          onBuy={handleBuy} 
        />
      </div>
    </div>
  );
}

function RewardSection({ title, items, owned, stars, onBuy }: any) {
  return (
    <div>
      <h2 className="text-xl font-black text-blue-600 mb-4 tracking-widest uppercase">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item: any) => {
          const isOwned = owned.includes(item.id);
          const canAfford = stars >= item.cost;
          
          return (
            <motion.div 
              key={item.id}
              whileHover={{ y: -4 }}
              className={`p-4 rounded-3xl border-4 flex flex-col items-center text-center shadow-sm relative overflow-hidden transition-colors ${
                isOwned ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-5xl mb-4 mt-2">{item.icon}</div>
              <h3 className="font-bold text-slate-800 text-sm mb-4 leading-tight flex-1">{item.title}</h3>
              
              {isOwned ? (
                <div className="w-full bg-green-500 text-white font-black py-2 rounded-xl border-b-4 border-green-700 flex items-center justify-center gap-2 text-sm uppercase">
                  <Check className="w-4 h-4 stroke-[3]" /> Punya Kamu
                </div>
              ) : (
                <Button 
                  variant={canAfford ? 'primary' : 'default'}
                  className={`w-full py-2 h-auto text-sm ${!canAfford && 'opacity-50'}`}
                  disabled={!canAfford}
                  onClick={() => onBuy(item.id, item.cost)}
                >
                  <Star className={`w-4 h-4 mr-1 ${canAfford ? 'fill-white' : 'fill-slate-400 text-slate-400'}`} />
                  {item.cost}
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
