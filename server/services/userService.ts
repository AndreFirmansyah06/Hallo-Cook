import { supabase } from "../lib/supabase.js";
import bcrypt from "bcryptjs";

export const userService = {
  async getAllAdmins() {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.from("users").select("*").eq("role", "admin");
    if (error) throw error;
    return data || [];
  },
  async getAllUsers() {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data || [];
  },
  async createAdmin(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const adminPayload = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: "admin"
    };

    if (!supabase) throw new Error("Supabase is not configured");
    const { data: existing, error: checkError } = await supabase.from("users").select("id").eq("email", userData.email).maybeSingle();
    if (checkError) throw checkError;
    if (existing) throw new Error("Email already registered");

    const { data, error } = await supabase.from("users").insert([adminPayload]).select().single();
    if (error) throw error;
    return data;
  },
  async updateAdmin(id: string, userData: any) {
    const updateData: any = { ...userData };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }
    
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.from("users").update(updateData).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
  async deleteAdmin(id: string) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  // Favorites
  async getFavorites(userId: string) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("favorites")
      .select("recipe_id, recipes(*)")
      .eq("user_id", userId);
    if (error) throw error;
    return data || [];
  },

  async toggleFavorite(userId: string, recipeId: string) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: existing, error: checkError } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("recipe_id", recipeId)
      .maybeSingle();
    if (checkError) throw checkError;
      
    if (existing) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("recipe_id", recipeId);
      if (error) throw error;
      return { message: "Removed from favorites", active: false };
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert([{ user_id: userId, recipe_id: recipeId }]);
      if (error) throw error;
      return { message: "Added to favorites", active: true };
    }
  },

  // Shopping List
  async getShoppingList(userId: string) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("shopping_list")
      .select("id, user_id, recipe_id, checked_ingredients, recipes(*)")
      .eq("user_id", userId);
    if (error) throw error;
    return data || [];
  },

  async addToShoppingList(userId: string, recipeId: string) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: existing, error: checkError } = await supabase
      .from("shopping_list")
      .select("id")
      .eq("user_id", userId)
      .eq("recipe_id", recipeId)
      .maybeSingle();
    if (checkError) throw checkError;

    if (!existing) {
      const { error } = await supabase
        .from("shopping_list")
        .insert([{ user_id: userId, recipe_id: recipeId, checked_ingredients: [] }]);
      if (error) throw error;
    }
    return { message: "Added to shopping list" };
  },

  async updateShoppingListItem(id: string, updateData: any) {
    const payload: any = {};
    if (updateData.checked_ingredients !== undefined) {
      payload.checked_ingredients = updateData.checked_ingredients;
    }

    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("shopping_list")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteFromShoppingList(id: string) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase
      .from("shopping_list")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { message: "Item removed" };
  },

  // Cooking Sessions
  async getCookingSessions(userId: string) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("cooking_sessions")
      .select("id, user_id, recipe_id, completed_steps, progress, updated_at, recipe:recipes(*)")
      .eq("user_id", userId);
    if (error) throw error;
    return data || [];
  },

  async startCooking(userId: string, recipeId: string) {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data: existing, error: checkError } = await supabase
      .from("cooking_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("recipe_id", recipeId)
      .maybeSingle();
    if (checkError) throw checkError;
      
    if (existing) {
      return existing;
    }
    
    const { data, error } = await supabase
      .from("cooking_sessions")
      .insert([{
        user_id: userId,
        recipe_id: recipeId,
        completed_steps: [],
        progress: 0
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCookingProgress(sessionId: string, completed_steps: number[], progress: number) {
    const updatePayload = {
      completed_steps,
      progress,
      updated_at: new Date().toISOString()
    };

    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("cooking_sessions")
      .update(updatePayload)
      .eq("id", sessionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async resetCookingSession(sessionId: string) {
    const updatePayload = {
      completed_steps: [],
      progress: 0,
      updated_at: new Date().toISOString()
    };

    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("cooking_sessions")
      .update(updatePayload)
      .eq("id", sessionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
