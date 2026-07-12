import { Recipe } from '../types';

const fetchJSON = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Auth
  async login(credentials: any) {
    return fetchJSON('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    });
  },

  async signup(userData: any) {
    return fetchJSON('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Recipes
  async getRecipes(): Promise<Recipe[]> {
    const recipes = await fetchJSON('/api/recipes');
    if (Array.isArray(recipes)) {
      return recipes;
    }
    return [];
  },

  async getRecipeById(id: string): Promise<Recipe> {
    return fetchJSON(`/api/recipes/${id}`);
  },

  // Admin Recipe CRUD
  async createRecipe(recipe: Partial<Recipe>) {
    return fetchJSON('/api/recipes', {
      method: 'POST',
      body: JSON.stringify(recipe)
    });
  },

  async updateRecipe(id: string, recipeData: Partial<Recipe>) {
    return fetchJSON(`/api/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recipeData)
    });
  },

  async deleteRecipe(id: string) {
    return fetchJSON(`/api/recipes/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Management (Users)
  async getAdmins() {
    return fetchJSON('/api/admins');
  },

  async createAdmin(adminData: any) {
    return fetchJSON('/api/admins', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  },

  async updateAdmin(id: string, adminData: any) {
    return fetchJSON(`/api/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(adminData)
    });
  },

  async deleteAdmin(id: string) {
    return fetchJSON(`/api/admins/${id}`, {
      method: 'DELETE'
    });
  },

  // Favorites
  async getFavorites(userId: string): Promise<any[]> {
    const serverFavorites = await fetchJSON(`/api/favorites/${userId}`);
    if (Array.isArray(serverFavorites)) {
      return serverFavorites;
    }
    return [];
  },

  async toggleFavorite(userId: string, recipeId: string) {
    return fetchJSON('/api/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ userId, recipeId })
    });
  },

  // Shopping List
  async getShoppingList(userId: string): Promise<any[]> {
    const list = await fetchJSON(`/api/shopping-list/${userId}`);
    if (Array.isArray(list)) {
      return list;
    }
    return [];
  },

  async addToShoppingList(userId: string, recipeId: string) {
    return fetchJSON('/api/shopping-list', {
      method: 'POST',
      body: JSON.stringify({ userId, recipeId })
    });
  },

  async updateShoppingListItem(id: string, data: any) {
    return fetchJSON(`/api/shopping-list/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteFromShoppingList(id: string) {
    return fetchJSON(`/api/shopping-list/${id}`, {
      method: 'DELETE'
    });
  },

  // Cooking Sessions (Active Kitchen)
  async getCookingSessions(userId: string): Promise<any[]> {
    const list = await fetchJSON(`/api/cooking-sessions/${userId}`);
    if (Array.isArray(list)) {
      return list;
    }
    return [];
  },

  async startCooking(userId: string, recipeId: string) {
    return fetchJSON('/api/cooking-sessions/start', {
      method: 'POST',
      body: JSON.stringify({ userId, recipeId })
    });
  },

  async updateCookingProgress(sessionId: string, completed_steps: number[], progress: number) {
    return fetchJSON(`/api/cooking-sessions/${sessionId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ completed_steps, progress })
    });
  },

  async resetCookingSession(sessionId: string) {
    return fetchJSON(`/api/cooking-sessions/${sessionId}/reset`, {
      method: 'POST'
    });
  }
};
