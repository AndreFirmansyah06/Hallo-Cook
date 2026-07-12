import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import RecipeCard from '../components/RecipeCard';
import { api } from '../services/api';
import { Recipe } from '../types';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Mic, Plus, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'all' | 'ingredients'>('all');
  const [ingredientTags, setIngredientTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Mode Anak Kos states
  const [kosMode, setKosMode] = useState(false);
  const [maxBudget, setMaxBudget] = useState<number>(999999);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    try {
      const data = await api.getRecipes();
      setRecipes(data);
      if (user) {
        const favs = await api.getFavorites(user.id);
        setFavorites(favs.map(f => f.recipe_id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleBookmarkToggle = async (recipeId: string) => {
    if (!user) return alert("Please login to bookmark recipes");
    try {
      const res = await api.toggleFavorite(user.id, recipeId);
      if (res.active) {
        setFavorites([...favorites, recipeId]);
      } else {
        setFavorites(favorites.filter(id => id !== recipeId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddIngredient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    
    const parts = searchTerm.split(/[,;]+/).map(p => p.trim()).filter(Boolean);
    const newTags = [...ingredientTags];
    parts.forEach(p => {
      if (!newTags.some(t => t.toLowerCase() === p.toLowerCase())) {
        newTags.push(p);
      }
    });
    setIngredientTags(newTags);
    setSearchTerm('');
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setIngredientTags(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    } else if (e.key === ',') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const getIngredientKeywords = () => {
    const tags = [...ingredientTags];
    if (searchMode === 'ingredients' && searchTerm.trim()) {
      const parts = searchTerm.split(/[,;]+/).map(p => p.trim().toLowerCase()).filter(Boolean);
      parts.forEach(p => {
        if (!tags.includes(p)) tags.push(p);
      });
    }
    return tags;
  };

  const getFilteredAndScoredRecipes = () => {
    let list = [...recipes];
    
    // 1. Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter(r => r.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 1.1 Filter by Mode Anak Kos
    if (kosMode) {
      if (maxBudget !== 999999) {
        list = list.filter(r => r.estimated_cost !== undefined && r.estimated_cost <= maxBudget);
      }
      if (selectedEquipments.length > 0) {
        list = list.filter(r => 
          r.required_equipment?.some(eq => 
            selectedEquipments.some(sel => eq.toLowerCase().includes(sel.toLowerCase()) || sel.toLowerCase().includes(eq.toLowerCase()))
          )
        );
      }
    }

    // 2. Filter by search query based on mode
    if (searchMode === 'all') {
      if (!searchTerm.trim()) {
        return list.map(r => ({ recipe: r, matched: [] as string[] }));
      }
      
      const term = searchTerm.toLowerCase();
      return list
        .filter(r => 
          r.title.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term) ||
          r.ingredients.some(i => i.toLowerCase().includes(term))
        )
        .map(r => {
          const matched = r.ingredients.filter(i => i.toLowerCase().includes(term));
          return { recipe: r, matched };
        });
    } else {
      // Ingredient-based search
      const keywords = getIngredientKeywords();
      if (keywords.length === 0) {
        return list.map(r => ({ recipe: r, matched: [] as string[] }));
      }

      const scored = list.map(recipe => {
        let matchCount = 0;
        const matchedIngredients: string[] = [];

        keywords.forEach(kw => {
          const matching = recipe.ingredients.filter(ing => 
            ing.toLowerCase().includes(kw)
          );
          if (matching.length > 0) {
            matchCount++;
            matchedIngredients.push(...matching);
          }
        });

        return {
          recipe,
          matchCount,
          matchedIngredients: Array.from(new Set(matchedIngredients))
        };
      });

      return scored
        .filter(item => item.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount)
        .map(item => ({
          recipe: item.recipe,
          matched: item.matchedIngredients
        }));
    }
  };

  const results = getFilteredAndScoredRecipes();

  return (
    <div className="min-h-screen" id="hero">
      <Hero />
      
      {/* Smart Search Bar */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 -mt-12 relative z-30" id="search">
        <div className="glass rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-white/20">
          
          {/* Mode Selector & Anak Kos Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => { setSearchMode('all'); setIngredientTags([]); setSearchTerm(''); }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  searchMode === 'all' 
                    ? "bg-brand-coral text-white shadow-lg shadow-brand-salmon/20" 
                    : "text-white/40 hover:text-white bg-white/5 border border-white/5"
                }`}
              >
                🔍 Cari Resep
              </button>
              <button 
                onClick={() => { setSearchMode('ingredients'); setSearchTerm(''); }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  searchMode === 'ingredients' 
                    ? "bg-brand-coral text-white shadow-lg shadow-brand-salmon/20" 
                    : "text-white/40 hover:text-white bg-white/5 border border-white/5"
                }`}
              >
                <Sparkles size={14} className="animate-pulse text-brand-salmon" />
                🥑 Berdasarkan Bahan
              </button>
            </div>

            {/* Mode Anak Kos Toggle */}
            <button
              onClick={() => {
                const newMode = !kosMode;
                setKosMode(newMode);
                if (newMode) {
                  setSelectedCategory('Anak Kos');
                } else {
                  setSelectedCategory('All');
                }
              }}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2.5 border ${
                kosMode 
                  ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/30 font-extrabold scale-105 border-amber-400" 
                  : "text-white/60 hover:text-white bg-amber-500/10 border-amber-500/20"
              }`}
            >
              <span className="text-sm">🏠</span>
              <span>Mode Anak Kos</span>
              {kosMode && (
                <span className="w-2 h-2 rounded-full bg-neutral-950 animate-ping" />
              )}
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex-1 flex items-center gap-2 sm:gap-4 bg-white/5 rounded-2xl px-4 sm:px-6 py-4 border border-white/10">
              <Search className="text-brand-coral shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Cari resep hari ini atau masukkan bahan anda" 
                className="bg-transparent border-none outline-none w-full text-sm sm:text-lg font-medium text-white placeholder:text-white/20 min-w-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {searchMode === 'ingredients' && searchTerm.trim() && (
                <button 
                  onClick={() => handleAddIngredient()}
                  className="bg-brand-coral/20 hover:bg-brand-coral text-white text-xs px-3 sm:px-4 py-2 rounded-xl transition-all font-bold flex items-center gap-1 shrink-0"
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Tambah</span>
                </button>
              )}
              <button className="p-2 hover:bg-brand-salmon/20 rounded-xl transition-colors text-white/40 hover:text-brand-salmon shrink-0">
                <Mic size={20} />
              </button>
            </div>
            
            <div className="flex gap-4">
              <button className="flex-1 md:flex-none bg-white/5 p-4 rounded-2xl border border-white/10 text-white/40 hover:text-white transition-colors flex items-center justify-center">
                <SlidersHorizontal size={24} />
              </button>
              <button 
                onClick={() => searchMode === 'ingredients' ? handleAddIngredient() : null}
                className="flex-[3] md:flex-none bg-gradient-to-r from-brand-salmon to-brand-coral text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-brand-salmon/20 hover:scale-[1.02] md:hover:scale-105 transition-transform text-center"
              >
                Search
              </button>
            </div>
          </div>

          {/* Helper Text & Tags for Ingredients Mode */}
          {searchMode === 'ingredients' && (
            <div className="mt-3">
              <p className="text-[10px] text-white/40 font-medium italic">
                Tip: Tekan koma (,) atau Enter untuk menyimpan nama bahan ke daftar pencarian.
              </p>
              
              {ingredientTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black text-brand-salmon uppercase tracking-wider self-center mr-1">Bahan Pilihan:</span>
                  {ingredientTags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="flex items-center gap-1.5 bg-brand-coral/10 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full border border-brand-coral/20 transition-colors"
                    >
                      <span className="text-brand-salmon">🥑</span>
                      <span>{tag}</span>
                      <button 
                        onClick={() => handleRemoveTag(idx)}
                        className="hover:text-brand-coral font-bold text-[10px] w-4 h-4 rounded-full bg-white/5 flex items-center justify-center transition-all"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={() => setIngredientTags([])}
                    className="text-[10px] font-black text-white/30 hover:text-brand-coral transition-colors uppercase tracking-[0.2em] self-center ml-2"
                  >
                    Hapus Semua
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mode Anak Kos Filters Panel */}
          {kosMode && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-white/10 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Budget Filter */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      💰 Maksimal Budget
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {maxBudget === 999999 ? 'Semua Budget' : `≤ Rp ${maxBudget.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[10000, 15000, 25000, 999999].map((budget) => (
                      <button
                        key={budget}
                        onClick={() => setMaxBudget(budget)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          maxBudget === budget
                            ? "bg-emerald-500 text-neutral-950 font-black"
                            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {budget === 999999 ? 'Semua' : `Rp ${(budget/1000).toFixed(0)}k`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Equipment Filter */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      🍳 Peralatan Minimal
                    </span>
                    {selectedEquipments.length > 0 && (
                      <button 
                        onClick={() => setSelectedEquipments([])}
                        className="text-[10px] text-white/30 hover:text-white uppercase tracking-wider font-bold"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Rice Cooker', 'Kompor', 'Wajan', 'Panci', 'Spatula', 'Pisau', 'Talenan', 'Blender', 'Mixer', 'Oven', 'Microwave', 'Parutan'].map((tool) => {
                      const isSelected = selectedEquipments.includes(tool);
                      return (
                        <button
                          key={tool}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedEquipments(selectedEquipments.filter(t => t !== tool));
                            } else {
                              setSelectedEquipments([...selectedEquipments, tool]);
                            }
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-amber-400 text-neutral-950 font-black"
                              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span>{isSelected ? '✓' : '+'}</span>
                          <span>{tool}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Info Badges (Simple Ingredients & Easy Steps) */}
              <div className="bg-amber-500/5 px-4 py-3 rounded-2xl border border-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <p className="text-[11px] text-amber-300/80 font-medium leading-relaxed">
                    Menampilkan resep praktis dengan <strong>bahan sederhana</strong>, <strong>peralatan minimal kos-kosan</strong>, dan <strong>langkah mudah diikuti</strong>.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    🍃 Bahan Sederhana
                  </span>
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    ⚡ Mudah Diikuti
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-16">
          <div>
            <div className="inline-block px-3 py-1 bg-brand-coral/10 text-brand-coral rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">Discovery</div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tighter">
              {searchMode === 'ingredients' ? 'Ide Masakan Anda' : 'Trending Recipes'}
            </h2>
            <p className="text-white/40 font-medium mt-2">
              {searchMode === 'ingredients' 
                ? 'Resep dengan bahan-bahan yang paling cocok dan relevan.' 
                : 'Explore the most loved recipes this week.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4">
             {['All', 'Anak Kos', 'High Class'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border transition-all text-xs font-bold uppercase tracking-widest ${
                    selectedCategory === cat 
                      ? "bg-brand-coral border-brand-coral text-white shadow-lg shadow-brand-salmon/20" 
                      : "border-white/10 text-white/40 hover:text-brand-coral hover:border-brand-coral/50 bg-white/5"
                  }`}
                >
                  {cat}
                </button>
             ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-white/5 animate-pulse rounded-3xl md:rounded-[2.5rem] border border-white/5" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {results.map(({ recipe, matched }) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                isBookmarked={favorites.includes(recipe.id)}
                onBookmarkToggle={handleBookmarkToggle}
                matchedIngredients={matched}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-[3rem] border border-white/5">
            <span className="text-5xl block mb-6">🍳</span>
            <h4 className="text-2xl font-display font-extrabold tracking-tight mb-2">Resep Tidak Ditemukan</h4>
            <p className="text-white/40 font-medium max-w-md mx-auto">
              Tidak ada resep yang cocok dengan kriteria pencarian Anda. Coba masukkan kata kunci atau bahan masakan lain.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
