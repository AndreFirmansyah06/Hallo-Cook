import React, { useState, useEffect } from 'react';
import { ChefHat, Plus, Trash2, Edit, TrendingUp, Users, Database, LayoutDashboard, UtensilsCrossed, ShieldCheck, X } from 'lucide-react';
import { api } from '../services/api';
import { Recipe, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

type Section = 'dashboard' | 'recipes' | 'admins';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'recipe' | 'admin'>('recipe');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'recipe' | 'admin'; id: string } | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const [recipeData, adminData] = await Promise.all([
        api.getRecipes(),
        api.getAdmins()
      ]);
      setRecipes(recipeData);
      setAdmins(adminData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const handleOpenModal = (type: 'recipe' | 'admin', item?: any) => {
    setModalType(type);
    if (item) {
      setEditingId(item.id);
      // Ensure ingredients and steps are arrays
      setFormData({
        ...item,
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
        steps: Array.isArray(item.steps) ? item.steps : [],
        required_equipment: Array.isArray(item.required_equipment) ? item.required_equipment : [],
        estimated_cost: item.estimated_cost !== undefined ? item.estimated_cost : ''
      });
    } else {
      setEditingId(null);
      setFormData(type === 'recipe' ? { 
        title: '', 
        description: '', 
        image_url: '', 
        video_url: '',
        difficulty: 'Medium', 
        category: 'Anak Kos',
        chef_name: 'HalloCook Chef',
        ingredients: [''],
        steps: [''],
        required_equipment: [''],
        duration: '',
        servings: 1,
        calories: '',
        estimated_cost: ''
      } : {
        username: '',
        email: '',
        password: ''
      });
    }
    setShowModal(true);
  };

  const handleArrayChange = (field: 'ingredients' | 'steps' | 'required_equipment', index: number, value: string) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'ingredients' | 'steps' | 'required_equipment') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeArrayItem = (field: 'ingredients' | 'steps' | 'required_equipment', index: number) => {
    const newArray = [...(formData[field] || [])];
    if (newArray.length <= 1) {
      newArray[0] = '';
    } else {
      newArray.splice(index, 1);
    }
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === 'recipe') {
        const recipePayload = {
          ...formData,
          ingredients: (formData.ingredients || []).filter((i: string) => i.trim() !== ''),
          steps: (formData.steps || []).filter((s: string) => s.trim() !== ''),
          required_equipment: (formData.required_equipment || []).filter((eq: string) => eq.trim() !== ''),
          estimated_cost: formData.estimated_cost !== '' ? Number(formData.estimated_cost) : undefined,
          calories: formData.calories !== '' ? Number(formData.calories) : undefined,
          servings: formData.servings !== '' ? Number(formData.servings) : undefined,
        };

        if (editingId) {
          await api.updateRecipe(editingId, recipePayload);
        } else {
          await api.createRecipe(recipePayload);
        }
      } else {
        if (editingId) {
          await api.updateAdmin(editingId, formData);
        } else {
          await api.createAdmin(formData);
        }
      }
      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = (type: 'recipe' | 'admin', id: string) => {
    setDeleteConfirm({ type, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    try {
      if (type === 'recipe') {
        await api.deleteRecipe(id);
      } else {
        await api.deleteAdmin(id);
      }
      setDeleteConfirm(null);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen">
       <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          
          {/* Header & Sub-Nav */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
              <div>
                  <div className="flex items-center gap-3 text-brand-salmon font-black text-[10px] tracking-[0.4em] uppercase mb-4">
                      <Database size={16} />
                      HalloCook
                  </div>
                  <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter">HalloCook Admin</h1>
              </div>
              
              <div className="glass flex p-2 rounded-[2rem] border-white/5 shadow-xl self-start lg:self-auto">
                 {[
                   { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                   { id: 'recipes', label: 'Recipes', icon: UtensilsCrossed },
                   { id: 'admins', label: 'Staff', icon: ShieldCheck }
                 ].map((nav) => (
                   <button
                     key={nav.id}
                     onClick={() => setActiveSection(nav.id as Section)}
                     className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] text-[10px] uppercase font-black tracking-widest transition-all ${
                       activeSection === nav.id 
                       ? 'bg-white text-deep-dark shadow-2xl shadow-white/20' 
                       : 'text-white/40 hover:text-white hover:bg-white/5'
                     }`}
                   >
                     <nav.icon size={16} />
                     {nav.label}
                   </button>
                 ))}
              </div>
          </div>

          {activeSection === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                  <div className="glass p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden group">
                      <UtensilsCrossed className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
                      <div className="text-white/20 font-black uppercase text-[10px] tracking-[0.2em] mb-3">Master Recipes</div>
                      <div className="text-6xl font-black text-white">{recipes.length}</div>
                      <div className="mt-4 text-[10px] font-bold text-brand-peach uppercase">Live in Database</div>
                  </div>
                  <div className="glass p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden group">
                      <Users className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
                      <div className="text-white/20 font-black uppercase text-[10px] tracking-[0.2em] mb-3">Admin Staff</div>
                      <div className="text-6xl font-black text-white">{admins.length}</div>
                      <div className="mt-4 text-[10px] font-bold text-brand-salmon uppercase">Elevated Access</div>
                  </div>
                  <div className="glass p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden group">
                      <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
                      <div className="text-white/20 font-black uppercase text-[10px] tracking-[0.2em] mb-3">System Health</div>
                      <div className="text-6xl font-black text-green-400">99.9%</div>
                      <div className="mt-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Stable Connection</div>
                  </div>
               </div>

               <div className="glass rounded-[3rem] p-16 text-center border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                  <ChefHat size={80} className="mx-auto text-brand-coral mb-8 animate-bounce" />
                  <h3 className="text-4xl font-display font-black text-white mb-4">Master Control Ready</h3>
                  <p className="text-white/40 max-w-lg mx-auto text-lg leading-relaxed mb-12">
                     Welcome back to the HalloCook protocol. You have full oversight of the recipe engine and administrative privileges. Use your power wisely.
                  </p>
                  <div className="flex justify-center gap-6">
                     <button onClick={() => setActiveSection('recipes')} className="px-10 py-5 bg-white text-deep-dark rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Manage Recipe</button>
                     <button onClick={() => setActiveSection('admins')} className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Manage Staff</button>
                  </div>
               </div>
            </motion.div>
          )}

          {activeSection === 'recipes' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="flex items-center justify-between mb-10 text-white">
                  <h2 className="text-3xl font-display font-extrabold tracking-tight">Recipe List</h2>
                  <button 
                    onClick={() => handleOpenModal('recipe')}
                    className="bg-gradient-to-r from-brand-salmon to-brand-coral text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-brand-salmon/20 hover:scale-105 transition-all active:scale-95"
                  >
                     <Plus size={16} strokeWidth={3} />
                     Add Recipe
                  </button>
               </div>

               <div className="glass rounded-[3rem] overflow-hidden border-white/10 shadow-2xl">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-white/5 text-white/20 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                           <tr>
                              <th className="px-10 py-8">Identity</th>
                              <th className="px-10 py-8">Classification</th>
                              <th className="px-10 py-8">Complexity</th>
                              <th className="px-10 py-8 text-right">Operations</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                           {recipes.map(recipe => (
                              <tr key={recipe.id} className="hover:bg-white/[0.02] transition-colors group">
                                 <td className="px-10 py-8">
                                    <div className="flex items-center gap-6">
                                       <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xl border border-white/10">
                                           <img src={recipe.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={recipe.title} referrerPolicy="no-referrer" />
                                       </div>
                                       <div>
                                          <div className="font-bold text-white text-lg tracking-tight">{recipe.title}</div>
                                          <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{recipe.chef_name}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8 text-white/40 uppercase tracking-widest text-[10px] font-black">{recipe.category || 'Standard'}</td>
                                 <td className="px-10 py-8">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border tracking-widest uppercase ${
                                       recipe.difficulty === 'Hard' ? 'border-red-500/20 text-red-400 bg-red-400/5' :
                                       recipe.difficulty === 'Medium' ? 'border-brand-peach/20 text-brand-peach bg-brand-peach/5' :
                                       'border-green-500/20 text-green-400 bg-green-400/5'
                                    }`}>
                                       {recipe.difficulty}
                                    </span>
                                 </td>
                                 <td className="px-10 py-8 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                       <button onClick={() => handleOpenModal('recipe', recipe)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:text-brand-coral hover:border-brand-coral/50 transition-all">
                                          <Edit size={18} />
                                       </button>
                                       <button onClick={() => handleDelete('recipe', recipe.id)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:text-red-400 hover:border-red-400/50 transition-all">
                                          <Trash2 size={18} />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </motion.div>
          )}

          {activeSection === 'admins' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center justify-between mb-10 text-white">
                  <h2 className="text-3xl font-display font-extrabold tracking-tight">Privileged Personnel</h2>
                  <button 
                    onClick={() => handleOpenModal('admin')}
                    className="bg-white text-deep-dark px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl hover:scale-105 transition-all active:scale-95"
                  >
                     <Plus size={16} strokeWidth={3} />
                     Authorize Admin
                  </button>
               </div>

               <div className="glass rounded-[3rem] overflow-hidden border-white/10 shadow-2xl">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-white/5 text-white/20 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                           <tr>
                              <th className="px-10 py-8">Admin Alias</th>
                              <th className="px-10 py-8">Clearance Level</th>
                              <th className="px-10 py-8">Registry Date</th>
                              <th className="px-10 py-8 text-right">Access Control</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                           {admins.map(admin => (
                              <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors group">
                                 <td className="px-10 py-8">
                                    <div className="flex items-center gap-6">
                                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-salmon to-brand-coral flex items-center justify-center text-white font-black text-sm shadow-xl shadow-brand-salmon/20">
                                          {admin.username.charAt(0).toUpperCase()}
                                       </div>
                                       <div>
                                          <div className="font-bold text-white text-lg tracking-tight">{admin.username}</div>
                                          <div className="text-[10px] text-white/30 font-bold tracking-widest">{admin.email}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8">
                                    <span className="px-4 py-1.5 bg-brand-coral/10 rounded-full text-[10px] font-black border border-brand-coral/20 text-brand-salmon tracking-widest uppercase">
                                       Global Admin
                                    </span>
                                 </td>
                                 <td className="px-10 py-8 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                    {new Date(admin.created_at).toLocaleDateString()}
                                 </td>
                                 <td className="px-10 py-8 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                       <button onClick={() => handleOpenModal('admin', admin)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:text-brand-coral hover:border-brand-coral/50 transition-all">
                                          <Edit size={18} />
                                       </button>
                                       <button onClick={() => handleDelete('admin', admin.id)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:text-red-400 hover:border-red-400/50 transition-all">
                                          <Trash2 size={18} />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </motion.div>
          )}

       </div>

       {/* Modal System */}
       <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-deep-dark/80 backdrop-blur-3xl"
                 onClick={() => setShowModal(false)}
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-2xl glass rounded-[3rem] p-12 border-white/10 shadow-[0_100px_200px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto"
               >
                  <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors">
                     <X size={24} />
                  </button>

                  <div className="text-[10px] font-black text-brand-salmon uppercase tracking-[0.4em] mb-4">THalloCook</div>
                  <h3 className="text-4xl font-display font-black text-white mb-10">
                    {editingId ? `Edit ${modalType === 'recipe' ? 'Recipe' : 'Admin'}` : `Add New ${modalType === 'recipe' ? 'Recipe' : 'Admin'}`}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-8">
                     {/* Test comment here */}
                     {modalType === 'recipe' ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Recipe Title</label>
                             <input type="text" placeholder="e.g. Indomie Carbonara Supreme" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" required />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Chef/Author</label>
                             <input type="text" placeholder="e.g. Gordon Ramsay" value={formData.chef_name} onChange={e => setFormData({...formData, chef_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Summary / Story</label>
                             <textarea placeholder="e.g. A quick, cheesy twist on instant noodles for late-night cravings..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-brand-coral/50 transition-colors h-32" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Image URL</label>
                             <input type="text" placeholder="e.g. https://images.unsplash.com/photo-..." value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Video Tutorial URL (YouTube / Direct MP4)</label>
                             <input type="text" placeholder="e.g. https://www.youtube.com/watch?v=..." value={formData.video_url || ''} onChange={e => setFormData({...formData, video_url: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Complexity</label>
                             <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors cursor-pointer">
                                <option value="Easy" className="bg-[#121214] text-white font-bold">Easy</option>
                                <option value="Medium" className="bg-[#121214] text-white font-bold">Medium</option>
                                <option value="Hard" className="bg-[#121214] text-white font-bold">Hard</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Menu Category</label>
                              <select value={formData.category || 'Anak Kos'} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors cursor-pointer">
                                 <option value="Anak Kos" className="bg-[#121214] text-white font-bold">Anak Kos (Student budget)</option>
                                 <option value="High Class" className="bg-[#121214] text-white font-bold">Mewah (Premium luxury)</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Prep Time</label>
                             <input type="text" placeholder="e.g. 15 mins" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Servings</label>
                             <input type="number" placeholder="e.g. 2" value={formData.servings || ''} onChange={e => setFormData({...formData, servings: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Calories</label>
                             <input type="number" placeholder="e.g. 450" value={formData.calories || ''} onChange={e => setFormData({...formData, calories: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Maximum Budget / Estimated Price (IDR)</label>
                             <input type="number" placeholder="e.g. 15000" value={formData.estimated_cost || ''} onChange={e => setFormData({...formData, estimated_cost: e.target.value !== '' ? parseInt(e.target.value) : ''})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" />
                          </div>
                          <div className="md:col-span-2 space-y-4">
                             <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Ingredients List</label>
                                <button type="button" onClick={() => addArrayItem('ingredients')} className="text-[10px] font-black text-brand-coral uppercase tracking-widest flex items-center gap-2 hover:bg-white/5 px-4 py-2 rounded-xl transition-all">
                                   <Plus size={14} /> Add Ingredient
                                </button>
                             </div>
                             <div className="space-y-3">
                                {(formData.ingredients || []).map((ing: string, i: number) => (
                                   <div key={i} className="flex gap-3">
                                      <input 
                                        type="text" 
                                        value={ing} 
                                        onChange={e => handleArrayChange('ingredients', i, e.target.value)} 
                                        placeholder={`e.g. Ingredient #${i + 1} (e.g. 2 eggs)`}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-brand-coral/50 transition-colors"
                                      />
                                      <button type="button" onClick={() => removeArrayItem('ingredients', i)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/20 hover:text-red-400 hover:border-red-400/50 transition-all">
                                         <Trash2 size={18} />
                                      </button>
                                   </div>
                                ))}
                             </div>
                          </div>
                          <div className="md:col-span-2 space-y-4">
                             <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Required Equipment</label>
                                <button type="button" onClick={() => addArrayItem('required_equipment')} className="text-[10px] font-black text-brand-coral uppercase tracking-widest flex items-center gap-2 hover:bg-white/5 px-4 py-2 rounded-xl transition-all">
                                   <Plus size={14} /> Add Equipment
                                </button>
                             </div>
                             <div className="space-y-3">
                                {(formData.required_equipment || []).map((eq: string, i: number) => (
                                   <div key={i} className="flex gap-3">
                                      <input 
                                        type="text" 
                                        value={eq} 
                                        onChange={e => handleArrayChange('required_equipment', i, e.target.value)} 
                                        placeholder={`e.g. Equipment #${i + 1} (e.g. Rice Cooker, Stove)`}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-brand-coral/50 transition-colors"
                                      />
                                      <button type="button" onClick={() => removeArrayItem('required_equipment', i)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/20 hover:text-red-400 hover:border-red-400/50 transition-all">
                                         <Trash2 size={18} />
                                      </button>
                                   </div>
                                ))}
                             </div>
                          </div>

                          <div className="md:col-span-2 space-y-4">
                             <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Cooking Protocol Steps</label>
                                <button type="button" onClick={() => addArrayItem('steps')} className="text-[10px] font-black text-brand-coral uppercase tracking-widest flex items-center gap-2 hover:bg-white/5 px-4 py-2 rounded-xl transition-all">
                                   <Plus size={14} /> Add Step
                                </button>
                             </div>
                             <div className="space-y-6">
                                {(formData.steps || []).map((step: string, i: number) => (
                                   <div key={i} className="space-y-2">
                                      <div className="flex items-center justify-between pl-2">
                                         <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Step {i + 1}</span>
                                         <button type="button" onClick={() => removeArrayItem('steps', i)} className="text-[10px] font-black text-red-400/40 hover:text-red-400 uppercase tracking-widest transition-colors">
                                            Remove Step
                                         </button>
                                      </div>
                                      <textarea 
                                        value={step} 
                                        onChange={e => handleArrayChange('steps', i, e.target.value)} 
                                        placeholder={`Describe step ${i + 1}...`}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-brand-coral/50 transition-colors h-24"
                                      />
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                     ) : (
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">User Alias</label>
                             <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" required />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Auth Email</label>
                             <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" required />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Secret Key {editingId && '(Leave blank to keep current)'}</label>
                             <input type="password" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-coral/50 transition-colors" required={!editingId} />
                          </div>
                       </div>
                     )}

                     <button type="submit" className="w-full bg-gradient-to-r from-brand-salmon to-brand-coral text-white py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-salmon/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        {editingId ? 'Update Recipe' : 'Add Recipe'}
                     </button>
                  </form>
               </motion.div>
            </div>
          )}

          {deleteConfirm && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDeleteConfirm(null)}
                  className="absolute inset-0 bg-deep-dark/80 backdrop-blur-md"
                />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="glass relative w-full max-w-md p-10 rounded-[3rem] border-white/10 shadow-2xl text-center"
                >
                   <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Trash2 className="text-red-400" size={32} />
                   </div>
                   <h4 className="text-3xl font-display font-black tracking-tighter mb-4">Hapus Data?</h4>
                   <p className="text-white/50 mb-10 font-medium font-sans">
                      Apakah Anda yakin ingin menghapus {deleteConfirm.type === 'recipe' ? 'resep' : 'admin'} ini secara permanen dari database?
                   </p>
                   <div className="flex flex-col gap-4">
                      <button 
                         onClick={confirmDelete}
                         className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform cursor-pointer"
                      >
                         Ya, Hapus Data
                      </button>
                      <button 
                         onClick={() => setDeleteConfirm(null)}
                         className="w-full bg-white/5 text-white/50 py-5 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      >
                         Batalkan
                      </button>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </div>
  );
}
