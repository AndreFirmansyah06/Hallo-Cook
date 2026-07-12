import React, { useState, useEffect } from 'react';
import { ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const sliderImages = [
  {
    src: "https://images.unsplash.com/photo-1645696301019-35adcc18fc21?auto=format&fit=crop&q=80&w=1000",
    title: "Sushi & Sashimi Premium"
  },
  {
    src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000",
    title: "Barbekyu Daging Juicy"
  },
  {
    src: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=1000",
    title: "Tumis Sayuran Segar"
  },
  {
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000",
    title: "Pizza Italia Klasik"
  },
  {
    src: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=1000",
    title: "Ramen Khas Jepang"
  },
  {
    src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=1000",
    title: "Steak Premium Panggang"
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 pb-24 px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-brand-coral rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <div className="w-2 h-2 rounded-full bg-brand-coral animate-pulse" />
              <span>Smart Kitchen Assistant AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-extrabold leading-[1] tracking-tighter mb-8">
              Cook.<br />
              Eat.<br />
              <span className="relative">
                Better!
                <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-2 md:h-3 text-brand-salmon/40" viewBox="0 0 200 20" fill="none">
                  <path d="M2 17C40 7 160 7 198 17" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/50 max-w-md mb-10 leading-relaxed font-medium">
              Temukan ribuan resep lezat untuk setiap tingkat keahlian. Masak lebih pintar dengan bantuan asisten dapur digital premium.
            </p>
          </motion.div>

          {/* Right Content - Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex items-center justify-center mt-10 lg:mt-0"
          >
            {/* Background Glows */}
            <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-brand-coral/20 to-transparent rounded-full blur-[100px] -z-10" />
            
            {/* Main Image Slider */}
            <div className="relative z-10 w-full max-w-[300px] sm:max-w-[400px] md:max-w-[450px] aspect-[4/5] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 bg-black">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 1, scale: 1.1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ 
                    opacity: { duration: 1, ease: "easeInOut" },
                    scale: { duration: 4, ease: "linear" }
                  }}
                  className="absolute inset-0"
                >
                  <img 
                    src={sliderImages[currentIndex].src}
                    alt={sliderImages[currentIndex].title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-10" />

              {/* Text Content Overlay */}
              <div className="absolute bottom-10 left-8 right-8 z-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-2 font-display">{sliderImages[currentIndex].title}</h3>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {sliderImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-brand-coral' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 md:-bottom-10 md:-left-16 md:translate-x-0 w-[90%] sm:w-72 glass rounded-3xl md:rounded-[2.5rem] p-4 md:p-6 shadow-2xl z-30 border-white/20"
            >
              <div className="flex items-center gap-4 mb-3">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-coral border border-white/10">
                    <ChefHat size={28} />
                 </div>
                 <div>
                    <div className="text-[10px] font-bold text-brand-peach uppercase tracking-[0.2em]">DAILY TIPS</div>
                    <div className="text-sm font-bold text-white leading-tight mt-0.5">Dari Hallo Jadi Jago</div>
                 </div>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                "Kunci ramen yang lezat ada pada kematangan telur onsen-nya."
              </p>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
