import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChefHat, Search, User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-3 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="glass flex items-center justify-between rounded-full px-6 py-3 shadow-2xl border-white/10">
          {/* Logo */}
          <a href="/#hero" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-brand-salmon to-brand-coral p-2 rounded-lg text-white shadow-lg shadow-brand-salmon/20 group-hover:scale-110 transition-transform">
              <ChefHat size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Hallo</span>
              <span className="bg-gradient-to-r from-brand-salmon to-brand-coral bg-clip-text text-transparent">Cook</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {user?.role !== 'admin' && (
              <>
                <a href="/#search" className="text-xs font-medium uppercase tracking-widest transition-colors hover:text-brand-coral text-white/70">Discover</a>
                {user && (
                  <NavLink to="/dashboard" className={({ isActive }) => cn("text-xs font-medium uppercase tracking-widest transition-colors hover:text-brand-coral", isActive ? "text-brand-coral" : "text-white/70")}>My Kitchen</NavLink>
                )}
              </>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => cn("text-xs font-medium uppercase tracking-widest transition-colors hover:text-brand-coral", isActive ? "text-brand-coral" : "text-white/70")}>Admin Terminal</NavLink>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-brand-peach flex items-center justify-center text-white font-bold text-xs">
                      <User size={16} />
                    </div>
                    <span className="text-sm font-semibold text-white/90">{user.username}</span>
                 </div>
                 <button onClick={handleLogout} className="p-2 hover:bg-white/10 text-white/50 hover:text-red-400 rounded-full transition-colors">
                    <LogOut size={18} />
                 </button>
               </div>
            ) : (
              <Link to="/login" className="bg-gradient-to-r from-brand-salmon to-brand-coral text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-brand-salmon/10 hover:scale-105 active:scale-95 transition-all">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-white/70" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-4 right-4 z-40"
          >
            <div className="glass rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
               <a href="/#hero" onClick={() => setIsOpen(false)} className="text-lg font-medium p-2 border-b border-white/10 text-white">Home</a>
               <a href="/#search" onClick={() => setIsOpen(false)} className="text-lg font-medium p-2 border-b border-white/10 text-white">Discover</a>
               {user && <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium p-2 border-b border-white/10 text-white">My Kitchen</Link>}
               {user ? (
                 <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-lg font-medium p-2 text-red-500 text-left">Logout</button>
               ) : (
                 <Link to="/login" onClick={() => setIsOpen(false)} className="bg-brand-coral text-white p-3 rounded-2xl text-center font-bold">Sign In</Link>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
