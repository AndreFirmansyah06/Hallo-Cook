import React, { useState, useEffect } from 'react';
import { ChefHat, Heart, List, Clock, TrendingUp, Settings, ChevronRight, X, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [shoppingList, setShoppingList] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [recipeToRemove, setRecipeToRemove] = useState<string | null>(null);

  // User Recipe Form States
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [recipeFormData, setRecipeFormData] = useState<any>({});

  useEffect(() => {
    if (user) loadUserData();
  }, [user]);

  async function loadUserData() {
    try {
      const [favs, list, sessions, allRecipes] = await Promise.all([
        api.getFavorites(user!.id),
        api.getShoppingList(user!.id),
        api.getCookingSessions(user!.id),
        api.getRecipes()
      ]);
      setFavorites(favs);
      setShoppingList(list);
      setActiveSessions(sessions);
      setMyRecipes(allRecipes.filter(r => r.userId === user!.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteGrocery = async (id: string) => {
    try {
      await api.deleteFromShoppingList(id);
      setShoppingList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  const handleToggleIngredient = async (itemId: string, ingredient: string) => {
    try {
      const item = shoppingList.find(s => s.id === itemId);
      if (!item) return;

      const checked = item.checked_ingredients || [];
      const newChecked = checked.includes(ingredient)
        ? checked.filter((i: string) => i !== ingredient)
        : [...checked, ingredient];

      await api.updateShoppingListItem(itemId, { checked_ingredients: newChecked });
      setShoppingList(prev => prev.map(s => s.id === itemId ? { ...s, checked_ingredients: newChecked } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBookmark = (recipeId: string) => {
    setRecipeToRemove(recipeId);
    setShowConfirmModal(true);
  };

  const confirmRemoveBookmark = async () => {
    if (!user || !recipeToRemove) return;
    try {
      await api.toggleFavorite(user.id, recipeToRemove);
      setFavorites(prev => prev.filter(f => f.recipe_id !== recipeToRemove));
      setShowConfirmModal(false);
      setRecipeToRemove(null);
    } catch (err) {
      console.error(err);
    }
  };

  // User Recipe Form Handlers
  const handleOpenRecipeModal = (item?: Recipe) => {
    if (item) {
      setEditingRecipeId(item.id);
      setRecipeFormData({
        ...item,
        ingredients: Array.isArray(item.ingredients) ? [...item.ingredients] : [''],
        steps: Array.isArray(item.steps) ? [...item.steps] : ['']
      });
    } else {
      setEditingRecipeId(null);
      setRecipeFormData({
        title: '',
        description: '',
        image_url: '',
        difficulty: 'Medium',
        category: 'Local',
        chef_name: user?.username || 'HalloCook Chef',
        ingredients: [''],
        steps: [''],
        duration: '',
        servings: 1,
        calories: 0
      });
    }
    setShowRecipeModal(true);
  };

  const handleRecipeArrayChange = (field: 'ingredients' | 'steps', index: number, value: string) => {
    const newArray = [...(recipeFormData[field] || [])];
    newArray[index] = value;
    setRecipeFormData({ ...recipeFormData, [field]: newArray });
  };

  const addRecipeArrayItem = (field: 'ingredients' | 'steps') => {
    setRecipeFormData({ ...recipeFormData, [field]: [...(recipeFormData[field] || []), ''] });
  };

  const removeRecipeArrayItem = (field: 'ingredients' | 'steps', index: number) => {
    const newArray = [...(recipeFormData[field] || [])];
    if (newArray.length <= 1) {
      newArray[0] = '';
    } else {
      newArray.splice(index, 1);
    }
    setRecipeFormData({ ...recipeFormData, [field]: newArray });
  };

  const handleRecipeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...recipeFormData,
        userId: user!.id,
        ingredients: (recipeFormData.ingredients || []).filter((i: string) => i.trim() !== ''),
        steps: (recipeFormData.steps || []).filter((s: string) => s.trim() !== ''),
      };

      if (editingRecipeId) {
        await api.updateRecipe(editingRecipeId, payload);
      } else {
        await api.createRecipe(payload);
      }
      setShowRecipeModal(false);
      loadUserData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus resep ini?')) return;
    try {
      await api.deleteRecipe(id);
      loadUserData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
       <div className="max-w-7xl mx-auto px-4 py-20">
          
          {/* Dashboard Header */}
          <div className="mb-12">
             <div className="flex items-center gap-3 text-brand-salmon font-black text-[10px] tracking-[0.4em] uppercase mb-4">
                <ChefHat size={16} />
                HalloCook Protocol
             </div>
             <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter">My Kitchen</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
             {/* Left: Saved Content & User Recipes */}
             <div className="lg:col-span-2 space-y-20">
                
                {/* Favorites Collection */}
                <div>
                   <div className="flex items-center justify-between mb-10">
                      <h3 className="text-3xl font-display font-extrabold tracking-tighter flex items-center gap-4">
                         <Heart className="text-brand-coral" fill="currentColor" />
                         Your Collection
                      </h3>
                   </div>
                   
                   {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
                         <div className="h-80 bg-white/5 rounded-[2.5rem]" />
                         <div className="h-80 bg-white/5 rounded-[2.5rem]" />
                      </div>
                   ) : favorites.length > 0 ? (
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 ${favorites.length >= 5 ? 'max-h-[850px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10' : ''}`}>
                         {favorites.filter(fav => !!fav.recipes).map((fav, idx) => (
                            <RecipeCard 
                               key={fav.recipe_id || idx} 
                               recipe={fav.recipes} 
                               isBookmarked 
                               onBookmarkToggle={() => handleRemoveBookmark(fav.recipe_id)}
                            />
                         ))}
                      </div>
                   ) : (
                      <div className="glass rounded-[3rem] p-16 text-center border-dashed border-2 border-white/5">
                         <p className="text-white/30 font-medium text-lg">Belum ada resep di koleksi Anda.</p>
                         <Link to="/search" className="inline-block mt-6 px-10 py-4 bg-white text-deep-dark rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">Mulai Berburu Resep</Link>
                      </div>
                   )}
                </div>

                {/* Resep Saya Section */}
                <div>
                   <div className="flex items-center justify-between mb-10">
                      <h3 className="text-3xl font-display font-extrabold tracking-tighter flex items-center gap-4">
                         <ChefHat className="text-brand-coral" />
                         Resep Saya
                      </h3>
                      <button 
                         onClick={() => handleOpenRecipeModal()}
                         className="bg-gradient-to-r from-brand-salmon to-brand-coral text-white px-8 py-3.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2.5 shadow-2xl shadow-brand-salmon/20 hover:scale-105 transition-all active:scale-95 cursor-pointer"
                      >
                         <Plus size={14} strokeWidth={3} />
                         Upload Resep
                      </button>
                   </div>
                   
                   {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
                         <div className="h-80 bg-white/5 rounded-[2.5rem]" />
                         <div className="h-80 bg-white/5 rounded-[2.5rem]" />
                      </div>
                   ) : myRecipes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {myRecipes.map((recipe, idx) => (
                            <div key={recipe.id || idx} className="relative group">
                               <RecipeCard 
                                  recipe={recipe} 
                               />
                               {/* Edit / Delete Buttons Overlay */}
                               <div className="absolute top-4 right-4 z-20 flex gap-2">
                                  <button 
                                     onClick={() => handleOpenRecipeModal(recipe)}
                                     className="p-3 bg-deep-dark/90 backdrop-blur-md border border-white/10 rounded-xl text-white hover:text-brand-coral hover:border-brand-coral/50 transition-all shadow-xl cursor-pointer"
                                     title="Edit Resep"
                                  >
                                     <Edit size={16} />
                                  </button>
                                  <button 
                                     onClick={() => handleDeleteRecipe(recipe.id)}
                                     className="p-3 bg-deep-dark/90 backdrop-blur-md border border-white/10 rounded-xl text-white hover:text-red-400 hover:border-red-400/50 transition-all shadow-xl cursor-pointer"
                                     title="Hapus Resep"
                                  >
                                     <Trash2 size={16} />
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="glass rounded-[3rem] p-16 text-center border-dashed border-2 border-white/5">
                         <p className="text-white/30 font-medium text-lg">Anda belum mengupload resep apapun.</p>
                         <button 
                            onClick={() => handleOpenRecipeModal()}
                            className="inline-block mt-6 px-10 py-4 bg-white text-deep-dark rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                         >
                            Mulai Upload Resep
                         </button>
                      </div>
                   )}
                </div>

             </div>

             {/* Right: Sidebar */}
             <div className="space-y-16">
                <div>
                   <h3 className="text-3xl font-display font-extrabold tracking-tighter mb-10 flex items-center gap-4">
                      <List className="text-brand-coral" />
                      Groceries
                   </h3>
                   <div className="glass rounded-[3rem] p-10 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] space-y-6">
                      {shoppingList.length > 0 ? shoppingList.filter(item => !!item.recipes).map((item, idx) => (
                        <div key={item.id || idx} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-4">
                           <div className="flex items-center justify-between">
                              <Link to={`/recipe/${item.recipe_id}`} className="font-bold text-white/70 hover:text-brand-coral uppercase tracking-widest text-[10px] transition-colors">{item.recipes?.title}</Link>
                              <button onClick={() => handleDeleteGrocery(item.id)} className="text-white/20 hover:text-red-400 transition-colors">
                                 <X size={18} />
                              </button>
                           </div>
                           <div className="space-y-2">
                              {item.recipes?.ingredients.map((ing: string, idx: number) => (
                                 <label key={`${item.id}-${idx}`} className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                       type="checkbox" 
                                       className="w-5 h-5 rounded-full border-white/10 bg-white/5 text-brand-coral focus:ring-brand-coral cursor-pointer appearance-none checked:bg-brand-coral checked:border-transparent transition-all relative after:content-[''] after:hidden checked:after:block after:absolute after:left-[5px] after:top-[2px] after:w-[6px] after:h-[10px] after:border-white after:border-r-2 after:border-b-2 after:rotate-45"
                                       checked={!!item.checked_ingredients?.includes(ing)}
                                       onChange={() => handleToggleIngredient(item.id, ing)}
                                    />
                                    <span className={`text-[11px] font-medium transition-all ${item.checked_ingredients?.includes(ing) ? 'text-white/20 line-through' : 'text-white/50 group-hover:text-white'}`}>{ing}</span>
                                 </label>
                              ))}
                           </div>
                           {item.recipes?.ingredients.every((ing: string) => item.checked_ingredients?.includes(ing)) && (
                              <div className="bg-brand-coral/10 py-2 px-4 rounded-xl border border-brand-coral/20">
                                 <p className="text-[10px] font-black text-brand-salmon uppercase tracking-wider text-center">Semua bahan sudah dibeli!</p>
                              </div>
                           )}
                        </div>
                      )) : (
                         <div className="text-center py-12 text-white/20">
                            <List size={40} className="mx-auto mb-4 opacity-50" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">List is Empty</p>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Confirmation Modal */}
       <AnimatePresence>
          {showConfirmModal && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowConfirmModal(false)}
                  className="absolute inset-0 bg-deep-dark/80 backdrop-blur-md"
                />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="glass relative w-full max-w-md p-10 rounded-[3rem] border-white/10 shadow-2xl text-center"
                >
                   <div className="w-20 h-20 bg-brand-coral/10 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Heart className="text-brand-coral" size={32} />
                   </div>
                   <h4 className="text-3xl font-display font-black tracking-tighter mb-4">Hapus Resep?</h4>
                   <p className="text-white/50 mb-10 font-medium font-sans">Apakah Anda yakin ingin menghapus resep ini dari koleksi kesukaan Anda?</p>
                   <div className="flex flex-col gap-4">
                      <button 
                         onClick={confirmRemoveBookmark}
                         className="w-full bg-brand-coral text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                      >
                         Ya, Hapus Koleksi
                      </button>
                      <button 
                         onClick={() => setShowConfirmModal(false)}
                         className="w-full bg-white/5 text-white/50 py-5 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all"
                      >
                         Batalkan
                      </button>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>

       {/* Modal System for Users to Upload / Edit Recipes */}
       <AnimatePresence>
          {showRecipeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-deep-dark/80 backdrop-blur-3xl"
                 onClick={() => setShowRecipeModal(false)}
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-2xl glass rounded-[3rem] p-12 border-white/10 shadow-[0_100px_200px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto animate-none z-50"
               >
                  <button onClick={() => setShowRecipeModal(false)} className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors cursor-pointer">
                     <X size={24} />
                  </button>

                  <div className="text-[10px] font-black text-brand-salmon uppercase tracking-[0.4em] mb-4">DATABASE PROTOCOL</div>
                  <h3 className="text-4xl font-display font-black text-white mb-10">
                    {editingRecipeId ? 'Edit Resep Anda' : 'Upload Resep Baru'}
                  </h3>

                  <form onSubmit={handleRecipeSubmit} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Recipe Title</label>
                           <input type="text" value={recipeFormData.title || ''} onChange={e => setRecipeFormData({...recipeFormData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" required />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Chef/Author</label>
                           <input type="text" value={recipeFormData.chef_name || ''} onChange={e => setRecipeFormData({...recipeFormData, chef_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Summary / Story</label>
                           <textarea value={recipeFormData.description || ''} onChange={e => setRecipeFormData({...recipeFormData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-brand-coral/50 transition-colors h-32" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Image URL</label>
                           <input type="text" value={recipeFormData.image_url || ''} onChange={e => setRecipeFormData({...recipeFormData, image_url: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Complexity</label>
                           <select value={recipeFormData.difficulty || 'Medium'} onChange={e => setRecipeFormData({...recipeFormData, difficulty: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors">
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Prep Time (e.g. 30 mins)</label>
                           <input type="text" value={recipeFormData.duration || ''} onChange={e => setRecipeFormData({...recipeFormData, duration: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Servings</label>
                           <input type="number" value={recipeFormData.servings || ''} onChange={e => setRecipeFormData({...recipeFormData, servings: parseInt(e.target.value) || 1})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Calories</label>
                           <input type="number" value={recipeFormData.calories || ''} onChange={e => setRecipeFormData({...recipeFormData, calories: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                           <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Ingredients List</label>
                              <button type="button" onClick={() => addRecipeArrayItem('ingredients')} className="text-[10px] font-black text-brand-coral uppercase tracking-widest flex items-center gap-2 hover:bg-white/5 px-4 py-2 rounded-xl transition-all cursor-pointer">
                                 <Plus size={14} /> Add Ingredient
                              </button>
                           </div>
                           <div className="space-y-3">
                              {(recipeFormData.ingredients || []).map((ing: string, i: number) => (
                                 <div key={i} className="flex gap-3">
                                    <input 
                                      type="text" 
                                      value={ing} 
                                      onChange={e => handleRecipeArrayChange('ingredients', i, e.target.value)} 
                                      placeholder={`Ingredient #${i + 1}`}
                                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-brand-coral/50 transition-colors"
                                    />
                                    <button type="button" onClick={() => removeRecipeArrayItem('ingredients', i)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/20 hover:text-red-400 hover:border-red-400/50 transition-all cursor-pointer">
                                       <Trash2 size={18} />
                                    </button>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                           <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Cooking Protocol Steps</label>
                              <button type="button" onClick={() => addRecipeArrayItem('steps')} className="text-[10px] font-black text-brand-coral uppercase tracking-widest flex items-center gap-2 hover:bg-white/5 px-4 py-2 rounded-xl transition-all cursor-pointer">
                                 <Plus size={14} /> Add Step
                              </button>
                           </div>
                           <div className="space-y-6">
                              {(recipeFormData.steps || []).map((step: string, i: number) => (
                                 <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between pl-2">
                                       <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Step {i + 1}</span>
                                       <button type="button" onClick={() => removeRecipeArrayItem('steps', i)} className="text-[10px] font-black text-red-400/40 hover:text-red-400 uppercase tracking-widest transition-colors cursor-pointer">
                                          Remove Step
                                       </button>
                                    </div>
                                    <textarea 
                                      value={step} 
                                      onChange={e => handleRecipeArrayChange('steps', i, e.target.value)} 
                                      placeholder={`Describe step ${i + 1}...`}
                                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-brand-coral/50 transition-colors h-24"
                                    />
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <button type="submit" className="w-full bg-gradient-to-r from-brand-salmon to-brand-coral text-white py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-salmon/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                        {editingRecipeId ? 'Execute Update' : 'Initialize Creation'}
                     </button>
                  </form>
               </motion.div>
            </div>
          )}
       </AnimatePresence>
    </div>
  );
}
