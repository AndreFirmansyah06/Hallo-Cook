import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  Flame,
  ChevronLeft,
  Bookmark,
  Share2,
  Play,
  CheckCircle2,
  BookmarkCheck,
  ChefHat,
  Star,
  MessageSquare,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { api } from "../services/api";
import { Recipe } from "../types";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Helper to extract YouTube video ID and format embed URL
  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
    return null;
  };

  // Safe helper to obtain a working video URL
  const getRecipeVideoUrl = (recipe: Recipe) => {
    if (recipe.video_url) return recipe.video_url;
    // Premium fallback B-Roll based on recipe title/ingredients
    const titleLower = recipe.title.toLowerCase();
    if (titleLower.includes('soto') || titleLower.includes('soup') || titleLower.includes('sup') || titleLower.includes('kuah')) {
      return 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c02277350c377e38ff2b18da720e5e52&profile_id=165&oauth2_token_id=57447761';
    }
    if (titleLower.includes('goreng') || titleLower.includes('fry') || titleLower.includes('tumis') || titleLower.includes('nasgor')) {
      return 'https://player.vimeo.com/external/434045526.sd.mp4?s=c1b181da2605e6082d61d10207b1a629b369c0d2&profile_id=165&oauth2_token_id=57447761';
    }
    return 'https://player.vimeo.com/external/435674703.sd.mp4?s=6f41162cd2be3e047714101e4ec8f0564551778a&profile_id=165&oauth2_token_id=57447761';
  };

  // Chat States
  const [chatMessages, setChatMessages] = useState<
    { sender: "user" | "chef"; text: string; time: string }[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Remove any stale localStorage on mount and reset chat
  useEffect(() => {
    if (id) {
      localStorage.removeItem(`hallocook_chat_${id}`);
      setChatMessages([]);
    }
  }, [id]);

  // Scroll to bottom whenever messages change or typing status changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user || !recipe) return;

    const userTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage = {
      sender: "user" as const,
      text: inputValue.trim(),
      time: userTime,
    };
    const updatedMessages = [...chatMessages, userMessage];

    setChatMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeTitle: recipe.title,
          chefName: recipe.chef_name,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          isUserRecipe: !!recipe.userId,
          messages: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reply");
      }

      const data = await response.json();
      const chefTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const chefReply = {
        sender: "chef" as const,
        text: data.text,
        time: chefTime,
      };

      const finalMessages = [...updatedMessages, chefReply];
      setChatMessages(finalMessages);
    } catch (err) {
      console.error(err);
      const chefTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const fallbackReply = {
        sender: "chef" as const,
        text: `Maaf ya, koneksi saya sedang terganggu. Ada yang bisa saya bantu lagi dengan resep ${recipe.title}?`,
        time: chefTime,
      };
      const finalMessages = [...updatedMessages, fallbackReply];
      setChatMessages(finalMessages);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus seluruh riwayat percakapan untuk resep ini?",
      )
    ) {
      setChatMessages([]);
    }
  };

  useEffect(() => {
    if (id) loadRecipe();
  }, [id, user]);

  async function loadRecipe() {
    try {
      const data = await api.getRecipeById(id!);
      setRecipe(data);
      if (user) {
        const [favs, sessions] = await Promise.all([
          api.getFavorites(user.id),
          api.getCookingSessions(user.id),
        ]);
        setIsBookmarked(favs.some((f) => f.recipe_id === id));
        const activeSession = sessions.find((s) => s.recipeId === id);
        if (activeSession) setSession(activeSession);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStartCooking = async () => {
    if (!user) return alert("Please login to start cooking");
    try {
      const newSession = await api.startCooking(user.id, recipe!.id);
      setSession(newSession);
      alert("Let's start cooking! Access progress in Your Kitchen.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStep = async (stepIndex: number) => {
    if (!session) return;

    try {
      const completed = session.completed_steps || [];
      const newCompleted = completed.includes(stepIndex)
        ? completed.filter((i: number) => i !== stepIndex)
        : [...completed, stepIndex];

      const progress = (newCompleted.length / recipe!.steps.length) * 100;
      const updated = await api.updateCookingProgress(
        session.id,
        newCompleted,
        progress,
      );
      setSession(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) return alert("Please login to save recipes");
    try {
      const res = await api.toggleFavorite(user.id, recipe!.id);
      setIsBookmarked(res.active);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToShoppingList = async () => {
    if (!user) return alert("Please login to add to shopping list");
    try {
      await api.addToShoppingList(user.id, recipe!.id);
      alert("Added to grocery list successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to grocery list");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-brand-coral border-t-transparent rounded-full animate-spin" />
        <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
          Loading Masterpiece...
        </span>
      </div>
    );

  if (!recipe)
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Recipe not found
      </div>
    );

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Back and Actions */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="glass p-3 rounded-full hover:bg-white/10 transition-colors border-white/10 text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleToggleBookmark}
              className={cn(
                "glass p-3 rounded-full transition-all border-white/10",
                isBookmarked
                  ? "text-brand-coral bg-white/10 border-brand-coral/50 shadow-[0_0_20px_rgba(255,127,80,0.2)]"
                  : "text-white/50 hover:text-brand-coral",
              )}
            >
              {isBookmarked ? (
                <BookmarkCheck size={24} fill="currentColor" />
              ) : (
                <Bookmark size={24} />
              )}
            </button>
            <button className="glass p-3 rounded-full text-white/50 hover:text-brand-coral transition-colors border-white/10">
              <Share2 size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-white/10 group bg-black">
              {isPlayingVideo ? (
                <div className="w-full h-full relative">
                  {getYoutubeEmbedUrl(getRecipeVideoUrl(recipe)) ? (
                    <iframe
                      src={getYoutubeEmbedUrl(getRecipeVideoUrl(recipe))!}
                      title={`Video Tutorial ${recipe.title}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={getRecipeVideoUrl(recipe)}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={() => setIsPlayingVideo(false)}
                    className="absolute top-6 right-6 bg-deep-dark/80 backdrop-blur-md p-3 rounded-full border border-white/10 text-white hover:bg-brand-coral hover:text-white transition-all shadow-xl z-10 cursor-pointer"
                    title="Kembali ke Poster"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    id="recipe-detail-poster-img"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-2xl p-10 rounded-full border border-white/20 hover:scale-110 transition-transform text-white shadow-2xl hover:bg-white hover:text-brand-coral flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <Play size={48} fill="currentColor" />
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-12">
              <div className="flex items-center gap-2 text-brand-salmon font-black text-[10px] tracking-[0.3em] uppercase mb-6">
                <Star size={14} fill="currentColor" />
                <span>Highly Recommended</span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-extrabold tracking-tighter mb-8 leading-[1] md:leading-[0.9]">
                {recipe.title}
              </h1>
              <p className="text-xl text-white/40 leading-relaxed font-medium italic">
                "{recipe.description}"
              </p>
            </div>

            {/* Stats Card */}
            <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-16 border-white/10 shadow-2xl">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-brand-coral shadow-lg mb-3 md:mb-4">
                  <Clock size={24} className="md:w-7 md:h-7" />
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">
                  Time
                </span>
                <span className="text-base md:text-lg font-extrabold text-white text-center">
                  {recipe.duration}
                </span>
              </div>
              <div className="flex flex-col items-center border-l border-white/5">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-blue-400 shadow-lg mb-3 md:mb-4">
                  <Users size={24} className="md:w-7 md:h-7" />
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">
                  Pax
                </span>
                <span className="text-base md:text-lg font-extrabold text-white text-center">
                  {recipe.servings} Pax
                </span>
              </div>
              <div className="flex flex-col items-center border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-orange-400 shadow-lg mb-3 md:mb-4">
                  <Flame size={24} className="md:w-7 md:h-7" />
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">
                  Kcal
                </span>
                <span className="text-base md:text-lg font-extrabold text-white text-center">
                  {recipe.calories} kcal
                </span>
              </div>
              <div className="flex flex-col items-center border-t border-l md:border-t-0 border-white/5 pt-6 md:pt-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-emerald-400 shadow-lg mb-3 md:mb-4">
                  <ChefHat size={24} className="md:w-7 md:h-7" />
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">
                  Level
                </span>
                <span className="text-base md:text-lg font-extrabold text-white text-center">
                  {recipe.difficulty}
                </span>
              </div>
            </div>

            {/* Cost & Equipment Panel */}
            {(recipe.estimated_cost !== undefined || (recipe.required_equipment && recipe.required_equipment.length > 0)) && (
              <div className="glass rounded-[3rem] p-8 md:p-10 mb-16 border border-white/10 shadow-2xl space-y-6">
                <h4 className="text-xs font-black text-brand-salmon uppercase tracking-[0.3em] flex items-center gap-2">
                  <span>💰</span> Estimasi Biaya & Alat
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recipe.estimated_cost !== undefined && (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                      <div className="text-3xl">💵</div>
                      <div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Total Harga Bahan</div>
                        <div className="text-2xl font-black text-emerald-400">
                          Rp {recipe.estimated_cost.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  )}
                  {recipe.required_equipment && recipe.required_equipment.length > 0 && (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                      <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2.5">Peralatan yang Diperlukan</div>
                      <div className="flex flex-wrap gap-2">
                        {recipe.required_equipment.map((eq, i) => (
                          <span key={i} className="bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-500/20 flex items-center gap-1.5">
                            🍳 {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sections */}
            <div className="space-y-16">
              <div>
                <h3 className="text-3xl font-display font-extrabold tracking-tighter mb-8 flex items-center gap-4">
                  <span className="w-1.5 h-10 bg-brand-coral rounded-full shadow-[0_0_15px_rgba(255,127,80,0.5)]" />
                  Ingredients
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-white/5 p-5 rounded-[1.5rem] border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-brand-coral group-hover:bg-brand-coral text-transparent group-hover:text-white transition-all shadow-inner">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-widest text-[10px]">
                        {ing}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddToShoppingList}
                  className="mt-10 bg-white/5 px-8 py-3 rounded-full text-brand-salmon font-bold uppercase tracking-[0.2em] text-[10px] border border-brand-salmon/20 hover:bg-brand-salmon/20 transition-all shadow-lg active:scale-95"
                >
                  Sync to Shopping List
                </button>
              </div>

              <div>
                <h3 className="text-3xl font-display font-extrabold tracking-tighter mb-8 flex items-center gap-4">
                  <span className="w-1.5 h-10 bg-brand-coral rounded-full shadow-[0_0_15px_rgba(255,127,80,0.5)]" />
                  Cooking Steps
                </h3>
                <div className="space-y-12 relative">
                  {recipe.steps.map((step, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-10 items-start relative group cursor-pointer",
                        session?.completed_steps?.includes(i) && "opacity-40",
                      )}
                      onClick={() => session && handleToggleStep(i)}
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 w-12 h-12 backdrop-blur-xl border border-white/10 rounded-[1.25rem] flex items-center justify-center font-black transition-all",
                          session?.completed_steps?.includes(i)
                            ? "bg-brand-coral text-white"
                            : "bg-white/5 text-brand-coral group-hover:bg-brand-coral group-hover:text-white",
                        )}
                      >
                        {session?.completed_steps?.includes(i) ? (
                          <CheckCircle2 size={24} />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <div className="pt-2">
                        <p
                          className={cn(
                            "font-medium leading-relaxed text-lg transition-colors",
                            session?.completed_steps?.includes(i)
                              ? "line-through text-white/40"
                              : "text-white/60 group-hover:text-white",
                          )}
                        >
                          {step}
                        </p>
                      </div>
                      {i < recipe.steps.length - 1 && (
                        <div className="absolute top-12 left-6 w-[1px] h-[calc(100%+32px)] bg-gradient-to-b from-white/10 to-transparent -z-10" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-12 md:mt-16 flex gap-6">
                  {!session ? (
                    <button
                      onClick={handleStartCooking}
                      className="flex-1 bg-white text-deep-dark py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Play size={18} fill="currentColor" />
                      Mulai Memasak
                    </button>
                  ) : (
                    <div className="flex-1 glass p-8 rounded-[2.5rem] border-brand-coral/20 flex flex-col items-center">
                      <div className="text-[10px] font-black text-brand-salmon uppercase tracking-[0.2em] mb-4 text-center">
                        Cooking in Progress
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full mb-4 overflow-hidden border border-white/5 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-brand-peach to-brand-coral shadow-[0_0_15px_rgba(255,127,80,0.5)]"
                          style={{ width: `${session.progress}%` }}
                        />
                      </div>
                      <span className="text-white/40 font-bold text-xs">
                        {Math.round(session.progress)}% Complete
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chat Section with Recipe Author / AI Chef */}
        <div className="mt-24 border-t border-white/5 pt-20" id="recipe-chat">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-coral/10 text-brand-coral rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  {recipe.userId ? (
                    <>
                      <Users size={12} />
                      Chat dengan Author
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} className="text-brand-salmon animate-pulse" />
                      AI Chef Assistant
                    </>
                  )}
                </div>
                <h3 className="text-4xl font-display font-extrabold tracking-tighter text-white font-black">
                  {recipe.userId ? `Tanya Jawab dengan ${recipe.chef_name || 'Author'}` : `Konsultasi Resep dengan ${recipe.chef_name || 'Asisten AI'}`}
                </h3>
                <p className="text-white/40 font-medium mt-2 text-base">
                  {recipe.userId 
                    ? `Hubungi langsung pembuat resep ini untuk menanyakan tips, modifikasi bahan, atau cara pengolahan.`
                    : `Tanyakan apa saja seputar resep ${recipe.title}, mulai dari substitusi bahan hingga tips penyajian.`}
                </p>
              </div>
            </div>

            <div className="glass rounded-3xl md:rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] flex flex-col h-[600px] md:h-[520px]">
              {/* Chat Header */}
              <div className="px-6 md:px-8 py-4 md:py-6 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-brand-coral/20 border border-brand-coral/40 flex items-center justify-center text-brand-coral font-bold font-display text-sm">
                      {recipe.chef_name ? recipe.chef_name[0].toUpperCase() : 'C'}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-deep-dark rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">{recipe.chef_name || 'Chef'}</h5>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">
                      {recipe.userId ? 'Author Resep (Online)' : 'AI Chef Expert (Sedia 24/7)'}
                    </p>
                  </div>
                </div>
                
                {chatMessages.length > 0 && (
                  <button 
                    onClick={handleClearChat}
                    className="text-[10px] font-black text-white/30 hover:text-brand-coral uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Hapus Percakapan
                  </button>
                )}
              </div>

              {/* Chat Messages */}
              <div ref={chatContainerRef} className="flex-1 p-8 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-white/5" id="chat-messages-container">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/20">
                    <MessageSquare size={48} className="mb-4 opacity-50 text-brand-coral mx-auto animate-pulse" />
                    <h6 className="font-bold text-xs text-white/40 uppercase tracking-widest">Mulai Percakapan</h6>
                    <p className="text-xs max-w-xs mx-auto mt-2 text-white/30 font-medium">
                      {recipe.userId 
                        ? `Tanyakan sesuatu ke ${recipe.chef_name} mengenai cara memasak resep rumahan ini.` 
                        : `Tanyakan rincian bahan, teknik, atau tips pengganti rasa kepada ${recipe.chef_name}.`}
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "flex gap-3 max-w-[85%] items-end",
                        msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      {msg.sender !== 'user' && (
                        <div className="w-8 h-8 rounded-full bg-brand-coral/10 border border-brand-coral/20 flex items-center justify-center text-[10px] font-black text-brand-coral flex-shrink-0">
                          {recipe.chef_name ? recipe.chef_name[0].toUpperCase() : 'C'}
                        </div>
                      )}
                      <div className={cn(
                        "p-5 rounded-[1.75rem] text-sm leading-relaxed font-medium shadow-md",
                        msg.sender === 'user' 
                          ? "bg-brand-coral text-white rounded-br-none shadow-brand-salmon/10" 
                          : "bg-white/5 text-white/80 border border-white/5 rounded-bl-none"
                      )}>
                        {msg.text}
                        <span className="block text-[9px] text-white/30 mt-2 text-right font-mono">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                
                {isTyping && (
                  <div className="flex gap-3 max-w-[85%] items-end mr-auto">
                    <div className="w-8 h-8 rounded-full bg-brand-coral/10 border border-brand-coral/20 flex items-center justify-center text-[10px] font-black text-brand-coral flex-shrink-0">
                      {recipe.chef_name ? recipe.chef_name[0].toUpperCase() : 'C'}
                    </div>
                    <div className="bg-white/5 text-white/50 border border-white/5 px-5 py-3.5 rounded-[1.75rem] rounded-bl-none flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-brand-coral rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-brand-coral rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-brand-coral rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 md:p-6 border-t border-white/5 bg-white/1 flex gap-2 md:gap-4 shrink-0 pb-safe">
                <input 
                  type="text"
                  placeholder={user ? "Ketik pesan..." : "Login untuk chat"}
                  disabled={!user || isTyping}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white font-medium text-sm outline-none focus:border-brand-coral/50 transition-colors disabled:opacity-50 min-w-0"
                />
                <button
                  type="submit"
                  disabled={!user || isTyping || !inputValue.trim()}
                  className="bg-gradient-to-r from-brand-salmon to-brand-coral text-white p-3 md:p-4 rounded-xl md:rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-brand-salmon/10 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100 cursor-pointer shrink-0"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
