import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await api.login({ email: formData.email, password: formData.password });
        login(res.user);
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        const res = await api.signup(formData);
        alert(res.message);
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md rounded-[3rem] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-white/10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-br from-brand-salmon to-brand-coral p-3 rounded-2xl text-white mb-4 shadow-xl shadow-brand-salmon/20">
            <ChefHat size={32} />
          </div>
          <h2 className="text-3xl font-display font-extrabold tracking-tight">
            {isLogin ? 'Welcome Back!' : 'Join HalloCook'}
          </h2>
          <p className="text-white/40 text-sm mt-3 font-medium text-center">
            {isLogin ? 'Masuk ke akun asisten dapur digital Anda' : 'Buat akun untuk mulai menabung resep'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-xs font-bold mb-6 text-center border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                placeholder="Username" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-coral/50 transition-colors font-medium text-white placeholder:text-white/20"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-coral/50 transition-colors font-medium text-white placeholder:text-white/20"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-coral/50 transition-colors font-medium text-white placeholder:text-white/20"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-salmon to-brand-coral text-white py-4 rounded-2xl font-bold shadow-xl shadow-brand-salmon/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
               <>
                 {isLogin ? 'Sign In' : 'Create Account'}
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-white/5">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-brand-coral transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
