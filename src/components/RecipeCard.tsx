import React from 'react';
import { motion } from 'motion/react';
import { Clock, Star, Bookmark, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types';
import { cn } from '../lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  isBookmarked?: boolean;
  onBookmarkToggle?: (recipeId: string) => void;
  matchedIngredients?: string[];
  key?: React.Key;
}

export default function RecipeCard({ recipe, isBookmarked, onBookmarkToggle, matchedIngredients }: RecipeCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative glass rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-brand-salmon/20 transition-all border-white/10"
    >
      {/* Image Wrap */}
      <div className="relative aspect-[4/3] overflow-hidden m-3 rounded-[2rem]">
        <img 
          src={recipe.image_url} 
          alt={recipe.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-salmon flex items-center gap-1 border border-white/10">
            <Star size={10} fill="currentColor" />
            4.8
          </div>
        </div>

        {/* Bookmark Action */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            onBookmarkToggle?.(recipe.id);
          }}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/10",
            isBookmarked ? "bg-brand-coral text-white" : "bg-white/10 text-white/40 hover:text-brand-coral"
          )}
        >
          <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 pt-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-brand-peach/10 flex items-center justify-center text-brand-salmon">
            <ChefHat size={12} />
          </div>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{recipe.chef_name || 'HalloCook Chef'}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-brand-coral transition-colors">
          {recipe.title}
        </h3>
        
        <p className="text-white/40 text-sm line-clamp-2 mb-4 leading-relaxed font-medium">
          {recipe.description}
        </p>

        {/* Cost & Equipment Badges */}
        {(recipe.estimated_cost !== undefined || (recipe.required_equipment && recipe.required_equipment.length > 0)) && (
          <div className="flex flex-wrap gap-2 mb-4 text-xs font-semibold">
            {recipe.estimated_cost !== undefined && (
              <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                💰 Rp {recipe.estimated_cost.toLocaleString('id-ID')}
              </span>
            )}
            {recipe.required_equipment && recipe.required_equipment.slice(0, 2).map((eq, i) => (
              <span key={i} className="bg-white/5 text-white/60 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                🍳 {eq}
              </span>
            ))}
            {recipe.required_equipment && recipe.required_equipment.length > 2 && (
              <span className="bg-white/5 text-white/40 px-2 py-1 rounded-full text-[10px] border border-white/5 self-center">
                +{recipe.required_equipment.length - 2}
              </span>
            )}
          </div>
        )}

        {matchedIngredients && matchedIngredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="text-[9px] font-black text-brand-salmon uppercase tracking-wider block w-full">Bahan Cocok:</span>
            {matchedIngredients.map((ing, i) => (
              <span key={i} className="text-[10px] bg-brand-coral/10 text-brand-coral px-2.5 py-0.5 rounded-full font-bold">
                ✓ {ing}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/30">
              <Clock size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">{recipe.duration}</span>
            </div>
          </div>
          
          <Link 
            to={`/recipe/${recipe.id}`}
            className="text-xs font-black uppercase tracking-widest text-brand-coral hover:text-brand-salmon transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
