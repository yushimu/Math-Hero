import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useChildContext } from '../../lib/contexts/ChildContext';
import { ChildAvatar } from '../../components/ui/ChildAvatar';
import { Lock, User, Sparkles, Palette, Volume2, VolumeX, PartyPopper } from 'lucide-react';
import { useSettings } from '../../lib/useSettings';
import { Button } from '../../components/ui/Button';

type Tab = 'avatar' | 'accessory' | 'theme';

export function Profile() {
  const { settings, toggleSound, toggleCelebration } = useSettings();
  const { activeChild } = useChildContext();
  const [activeTab, setActiveTab] = useState<Tab>('avatar');
  
  if (!activeChild) return null;
  
  // Local state for equipped items (mocking saving to profile)
  const [equippedAvatar, setEquippedAvatar] = useState<string | undefined>(undefined);
  const [equippedAccessory, setEquippedAccessory] = useState<string | undefined>(undefined);
  const [equippedTheme, setEquippedTheme] = useState<string | undefined>(undefined);

  const ownedItems: string[] = [];

  const equippedAvatarDef = undefined;
  const equippedAccessoryDef = undefined;
  const equippedThemeDef = undefined;

  const handleEquip = (type: Tab, id: string) => {
    if (!ownedItems.includes(id)) return;
    if (type === 'avatar') setEquippedAvatar(id);
    if (type === 'accessory') {
      // Toggle off if already equipped
      if (equippedAccessory === id) setEquippedAccessory(undefined);
      else setEquippedAccessory(id);
    }
    if (type === 'theme') setEquippedTheme(id);
  };

  const renderTabContent = (type: Tab) => {
    const items: any[] = [];
    
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        <AnimatePresence>
          {items.map((item, idx) => {
            const isOwned = ownedItems.includes(item.id);
            const isEquipped = 
              (type === 'avatar' && equippedAvatar === item.id) ||
              (type === 'accessory' && equippedAccessory === item.id) ||
              (type === 'theme' && equippedTheme === item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleEquip(type, item.id)}
                className={`aspect-square p-2 rounded-3xl border-4 flex flex-col items-center justify-center cursor-pointer transition-transform relative ${
                  !isOwned 
                    ? 'bg-slate-50 border-slate-200 grayscale opacity-70 cursor-not-allowed' 
                    : isEquipped
                    ? 'bg-blue-50 border-blue-400 shadow-md scale-105'
                    : 'bg-white border-slate-100 hover:border-blue-200 hover:-translate-y-1'
                }`}
              >
                {!isOwned && (
                  <div className="absolute top-2 right-2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <div className="text-4xl mb-1">{item.icon}</div>
                <div className="text-[10px] font-bold text-center text-slate-600 uppercase leading-tight truncate w-full px-1">
                  {item.title}
                </div>
                {isEquipped && (
                  <div className="absolute -bottom-3 bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-white">
                    DIPAKAI
                  </div>
                )}
              </motion.div>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-3 sm:col-span-4 md:col-span-5 text-center p-8">
              <p className="text-slate-400 font-bold">Belum ada item tersedia di toko.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">Gaya Karaktermu! 🎨</h1>
        <p className="text-slate-500 font-bold">Bikin karaktermu makin keren. Main terus buat buka lebih banyak!</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Preview Section */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="bg-white p-6 rounded-[40px] border-4 border-slate-100 shadow-lg w-full flex flex-col items-center relative">
            <h2 className="font-black text-xl text-slate-700 mb-6 uppercase tracking-widest text-center">Karakter Kamu</h2>
            <ChildAvatar 
              size="xxl" 
              avatarIcon={equippedAvatarDef?.icon}
              accessoryIcon={equippedAccessoryDef?.icon}
              themeClass={equippedThemeDef?.value}
            />
          </div>

          <div className="w-full mt-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center mb-2">Pengaturan Suara</h3>
            
            <button 
              onClick={toggleSound}
              className={`w-full p-4 rounded-2xl border-4 flex items-center justify-between transition-colors ${settings.soundOn ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 opacity-70'}`}
            >
              <div className="flex items-center gap-3">
                {settings.soundOn ? <Volume2 className="w-6 h-6 text-green-600" /> : <VolumeX className="w-6 h-6 text-slate-400" />}
                <span className={`font-bold ${settings.soundOn ? 'text-green-700' : 'text-slate-500'}`}>
                  Suara Permainan
                </span>
              </div>
              <div className={`text-xs font-black px-2 py-1 rounded-lg ${settings.soundOn ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                {settings.soundOn ? 'NYALA' : 'MATI'}
              </div>
            </button>

            <button 
              onClick={toggleCelebration}
              className={`w-full p-4 rounded-2xl border-4 flex items-center justify-between transition-colors ${settings.celebrationOn ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200 opacity-70'}`}
            >
              <div className="flex items-center gap-3">
                <PartyPopper className={`w-6 h-6 ${settings.celebrationOn ? 'text-orange-600' : 'text-slate-400'}`} />
                <span className={`font-bold ${settings.celebrationOn ? 'text-orange-700' : 'text-slate-500'}`}>
                  Animasi Pesta 🎉
                </span>
              </div>
              <div className={`text-xs font-black px-2 py-1 rounded-lg ${settings.celebrationOn ? 'bg-orange-200 text-orange-800' : 'bg-slate-200 text-slate-600'}`}>
                {settings.celebrationOn ? 'NYALA' : 'MATI'}
              </div>
            </button>
          </div>
        </div>

        {/* Customization Controls */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 p-2 bg-slate-100 rounded-[2rem]">
            <TabButton 
              active={activeTab === 'avatar'} 
              onClick={() => setActiveTab('avatar')}
              icon={<User className="w-5 h-5" />}
              label="Karakter"
            />
            <TabButton 
              active={activeTab === 'accessory'} 
              onClick={() => setActiveTab('accessory')}
              icon={<Sparkles className="w-5 h-5" />}
              label="Aksesoris"
            />
            <TabButton 
              active={activeTab === 'theme'} 
              onClick={() => setActiveTab('theme')}
              icon={<Palette className="w-5 h-5" />}
              label="Latar Belakang"
            />
          </div>

          {/* Tab Content */}
          <div className="bg-slate-100/50 p-6 rounded-[32px] min-h-[300px]">
            {renderTabContent(activeTab)}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-4 px-2 rounded-full font-black text-sm transition-all ${
        active 
          ? 'bg-white text-blue-600 shadow-sm shadow-slate-200' 
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
