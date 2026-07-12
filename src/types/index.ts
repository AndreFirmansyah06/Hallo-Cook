export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image_url: string;
  duration: string;
  difficulty: string;
  calories: number;
  servings: number;
  category?: string;
  chef_name?: string;
  userId?: string;
  video_url?: string;
  created_at: string;
  estimated_cost?: number;
  required_equipment?: string[];
}

export interface Favorite {
  id: string;
  user_id: string;
  recipe_id: string;
  recipes?: Recipe; // Normalized to recipes (plural) as used in some places or recipe
}

export interface ShoppingItem {
  id: string;
  user_id: string;
  recipe_id: string;
  recipes?: Recipe;
  checked_ingredients?: string[]; // Array of ingredient names that have been "bought"
}

export interface CookingSession {
  id: string;
  user_id: string;
  recipe_id: string;
  recipe?: Recipe;
  completed_steps: number[]; // Indices of completed steps
  progress: number; // 0 to 100
  updated_at: string;
}
