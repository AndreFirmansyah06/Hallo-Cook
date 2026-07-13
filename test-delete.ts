import { supabase } from "./server/lib/supabase.js";

async function test() {
  console.log("Supabase configured:", !!supabase);
  if (!supabase) return;

  const { data: recipes, error: fetchErr } = await supabase.from("recipes").select("id, title");
  if (fetchErr) {
    console.error("Error fetching recipes:", fetchErr);
    return;
  }

  console.log("Found recipes count:", recipes?.length);
  if (!recipes || recipes.length === 0) {
    console.log("No recipes found to delete.");
    return;
  }

  const recipe = recipes[0];
  console.log("Attempting to delete recipe:", recipe.title, "ID:", recipe.id);

  try {
    // Attempt deleting references manually first as per recipeService:
    const favRes = await supabase.from("favorites").delete().eq("recipe_id", recipe.id);
    console.log("Favorites delete response:", favRes);

    const shopRes = await supabase.from("shopping_list").delete().eq("recipe_id", recipe.id);
    console.log("Shopping list delete response:", shopRes);

    const cookRes = await supabase.from("cooking_sessions").delete().eq("recipe_id", recipe.id);
    console.log("Cooking sessions delete response:", cookRes);

    const recipeRes = await supabase.from("recipes").delete().eq("id", recipe.id);
    console.log("Recipes delete response:", recipeRes);
  } catch (err) {
    console.error("Caught exception:", err);
  }
}

test();
