import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useChildContext } from '../../lib/contexts/ChildContext';
import { ChildrenService } from '../../lib/services/api';
import type { Database } from '../../lib/database.types';

type Child = Database['public']['Tables']['children']['Row'];

export function ProfileSelection() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { setActiveChild } = useChildContext();
  
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadChildren = async () => {
      const data = await ChildrenService.getChildren();
      setChildren(data);
      setLoading(false);
    };

    loadChildren();
  }, [user, navigate]);

  const handleSelectChild = (child: Child) => {
    setActiveChild(child);
    navigate('/child');
  };

  const handleSelectParent = () => {
    navigate('/parent');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center p-4">Memuat profil...</div>;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl font-black text-slate-800">Siapa yang mau main?</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {children.map((child) => (
          <button 
            key={child.id}
            onClick={() => handleSelectChild(child)}
            className="flex flex-col items-center gap-4 p-6 bg-white rounded-[32px] border-4 border-blue-100 hover:border-blue-400 hover:scale-105 transition-all shadow-sm"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-2xl overflow-hidden border-4 border-blue-200">
              <img src={child.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix'} alt={child.name} className="w-full h-full object-cover" />
            </div>
            <div className="font-black text-xl text-slate-700">{child.name}</div>
          </button>
        ))}

        <button 
          onClick={handleSelectParent}
          className="flex flex-col items-center justify-center gap-4 p-6 bg-slate-50 rounded-[32px] border-4 border-slate-200 hover:border-slate-400 hover:scale-105 transition-all shadow-sm"
        >
          <div className="w-24 h-24 bg-slate-200 rounded-2xl overflow-hidden border-4 border-slate-300 flex items-center justify-center text-4xl">
            👨‍👩‍👧
          </div>
          <div className="font-black text-xl text-slate-700">Orang Tua</div>
        </button>
      </div>

      <div className="pt-12">
        <Button variant="outline" className="border-4" onClick={handleLogout}>
          Keluar dari Akun
        </Button>
      </div>
    </div>
  );
}
