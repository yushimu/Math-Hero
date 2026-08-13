import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, they should select profile
  useEffect(() => {
    if (user) {
      navigate('/select-profile');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/select-profile');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl">Selamat Datang!</CardTitle>
          <p className="text-slate-500 font-medium mt-2">Masuk ke akun Orang Tua</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold border-2 border-red-200">{error}</div>}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none"
                required
              />
            </div>
            
            <Button type="submit" size="lg" className="w-full h-14 text-lg mt-4" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <p className="text-center text-slate-500 font-bold text-sm mt-6">
            Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline font-black uppercase tracking-widest ml-1">Daftar sekarang</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
