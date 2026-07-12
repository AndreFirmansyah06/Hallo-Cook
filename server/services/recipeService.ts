import { supabase } from "../lib/supabase.js";

export const recipeService = {
  async getAll() {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.from("recipes").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async getById(id: string) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.from("recipes").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  },
  async create(recipe: any) {
    // Sanitize input: only send fields that exist in the DB schema
    const { id, created_at, ...cleanRecipe } = recipe;
    const recipeToInsert = {
      title: cleanRecipe.title,
      description: cleanRecipe.description,
      image_url: cleanRecipe.image_url,
      difficulty: cleanRecipe.difficulty,
      category: cleanRecipe.category,
      chef_name: cleanRecipe.chef_name,
      duration: cleanRecipe.duration,
      servings: typeof cleanRecipe.servings === 'number' ? cleanRecipe.servings : parseInt(cleanRecipe.servings) || 0,
      calories: typeof cleanRecipe.calories === 'number' ? cleanRecipe.calories : parseInt(cleanRecipe.calories) || 0,
      ingredients: cleanRecipe.ingredients,
      steps: cleanRecipe.steps,
      user_id: cleanRecipe.user_id || cleanRecipe.userId || null,
      video_url: cleanRecipe.video_url || null,
      estimated_cost: typeof cleanRecipe.estimated_cost === 'number' ? cleanRecipe.estimated_cost : parseInt(cleanRecipe.estimated_cost) || null,
      required_equipment: cleanRecipe.required_equipment || null
    };

    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.from("recipes").insert([recipeToInsert]).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, recipe: any) {
    const { id: _, created_at, ...cleanRecipe } = recipe;
    
    // Only update fields that exist in the DB schema
    const updatePayload: any = {};
    if (cleanRecipe.title !== undefined) updatePayload.title = cleanRecipe.title;
    if (cleanRecipe.description !== undefined) updatePayload.description = cleanRecipe.description;
    if (cleanRecipe.image_url !== undefined) updatePayload.image_url = cleanRecipe.image_url;
    if (cleanRecipe.difficulty !== undefined) updatePayload.difficulty = cleanRecipe.difficulty;
    if (cleanRecipe.category !== undefined) updatePayload.category = cleanRecipe.category;
    if (cleanRecipe.chef_name !== undefined) updatePayload.chef_name = cleanRecipe.chef_name;
    if (cleanRecipe.duration !== undefined) updatePayload.duration = cleanRecipe.duration;
    if (cleanRecipe.servings !== undefined) updatePayload.servings = typeof cleanRecipe.servings === 'number' ? cleanRecipe.servings : parseInt(cleanRecipe.servings) || 0;
    if (cleanRecipe.calories !== undefined) updatePayload.calories = typeof cleanRecipe.calories === 'number' ? cleanRecipe.calories : parseInt(cleanRecipe.calories) || 0;
    if (cleanRecipe.ingredients !== undefined) updatePayload.ingredients = cleanRecipe.ingredients;
    if (cleanRecipe.steps !== undefined) updatePayload.steps = cleanRecipe.steps;
    if (cleanRecipe.user_id !== undefined || cleanRecipe.userId !== undefined) {
      updatePayload.user_id = cleanRecipe.user_id || cleanRecipe.userId || null;
    }
    if (cleanRecipe.video_url !== undefined) updatePayload.video_url = cleanRecipe.video_url;
    if (cleanRecipe.estimated_cost !== undefined) {
      updatePayload.estimated_cost = typeof cleanRecipe.estimated_cost === 'number' ? cleanRecipe.estimated_cost : parseInt(cleanRecipe.estimated_cost) || null;
    }
    if (cleanRecipe.required_equipment !== undefined) updatePayload.required_equipment = cleanRecipe.required_equipment;

    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.from("recipes").update(updatePayload).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
};
