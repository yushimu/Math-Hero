import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Typically need to verify email, but if auto-confirmed, redirect to select-profile
      navigate('/select-profile');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl">Daftar Akun Baru</CardTitle>
          <p className="text-slate-500 font-medium mt-2">Bergabung dan mulai belajar!</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <form className="space-y-4" onSubmit={handleRegister}>
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold border-2 border-red-200">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Nama Orang Tua</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full h-12 px-4 rounded-xl border-4 border-blue-100 focus:border-blue-400 focus:outline-none font-bold" placeholder="Masukkan nama" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-12 px-4 rounded-xl border-4 border-blue-100 focus:border-blue-400 focus:outline-none font-bold" placeholder="Masukkan email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Kata Sandi</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full h-12 px-4 rounded-xl border-4 border-blue-100 focus:border-blue-400 focus:outline-none font-bold" placeholder="Minimal 6 karakter" />
            </div>
            
            <Button size="lg" type="submit" disabled={loading} className="w-full h-14 mt-4 text-lg">
              {loading ? 'MEMPROSES...' : 'DAFTAR SEKARANG'}
            </Button>
          </form>
          
          <p className="text-center text-slate-500 font-bold text-sm">
            Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline font-black uppercase tracking-widest ml-1">Masuk di sini</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
