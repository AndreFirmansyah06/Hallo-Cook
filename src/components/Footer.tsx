import React from 'react';
import { Instagram, Twitter, Facebook, ChefHat, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-deep-dark/50 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand */}
          <div className="space-y-8 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-brand-salmon to-brand-coral p-2 rounded-lg text-white shadow-xl shadow-brand-salmon/20 group-hover:scale-110 transition-transform">
                <ChefHat size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                HalloCook
              </span>
            </Link>
            <p className="text-white/40 leading-relaxed text-sm font-medium italic max-w-md">
              Premium digital kitchen assistant elevating your daily cooking experience with smart insights and a global recipe library.
            </p>
            <div className="flex gap-4">
               {[Instagram, Twitter, Facebook].map((Icon, i) => (
                 <a key={i} href="#" className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-white/40 hover:bg-brand-coral hover:text-white hover:border-brand-coral transition-all hover:-translate-y-1 shadow-lg shadow-black/20">
                    <Icon size={20} />
                 </a>
               ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 flex justify-end">
            <div className="w-full max-w-xs">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10 text-right">Discovery</h4>
              <ul className="space-y-6 text-white/40 text-xs font-bold uppercase tracking-widest text-right">
                 <li><Link to="/search" className="hover:text-brand-coral transition-colors flex items-center justify-end gap-2 group">Trending Recipes<span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" /></Link></li>
                 <li><Link to="/search" className="hover:text-brand-coral transition-colors flex items-center justify-end gap-2 group">Smart Ingredients<span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" /></Link></li>
                 <li><Link to="/search" className="hover:text-brand-coral transition-colors flex items-center justify-end gap-2 group">Popular Categories<span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" /></Link></li>
                 <li><Link to="/search" className="hover:text-brand-coral transition-colors flex items-center justify-end gap-2 group">Chef Guides<span className="w-0 group-hover:w-4 h-[2px] bg-brand-coral transition-all" /></Link></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
           <p>© 2026 HalloCook Protocol. Built with <Heart size={10} className="inline text-brand-salmon animate-pulse" fill="currentColor" /> for Smart Kitchens.</p>
           <div className="flex gap-12">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
           </div>
        </div>
      </div>
    </footer>
  );
}

function ArrowRight({ size, className }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
    )
}
