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

  // Add child modal state
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadChildren = async () => {
    setLoading(true);
    const data = await ChildrenService.getChildren();
    setChildren(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadChildren();
  }, [user, navigate]);

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newChild = await ChildrenService.createChild({
        name: newChildName.trim(),
      });
      if (newChild) {
        setShowAddChild(false);
        setNewChildName('');
        await loadChildren(); // Reload the list
      }
    } catch (error) {
      console.error("Failed to add child:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <button 
          onClick={() => setShowAddChild(true)}
          className="flex flex-col items-center justify-center gap-4 p-6 bg-green-50 rounded-[32px] border-4 border-green-200 hover:border-green-400 hover:scale-105 transition-all shadow-sm border-dashed"
        >
          <div className="w-24 h-24 bg-green-100 rounded-2xl overflow-hidden border-4 border-green-300 flex items-center justify-center text-5xl font-black text-green-500 pb-2">
            +
          </div>
          <div className="font-black text-xl text-green-700">Tambah Anak</div>
        </button>
      </div>

      {showAddChild && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border-4 border-blue-100">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Tambah Profil Anak</h2>
            <form onSubmit={handleAddChild} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Panggilan Anak</label>
                <input 
                  type="text" 
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-medium text-slate-700"
                  placeholder="Contoh: Budi"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAddChild(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={!newChildName.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pt-12">
        <Button variant="outline" className="border-4" onClick={handleLogout}>
          Keluar dari Akun
        </Button>
      </div>
    </div>
  );
}
