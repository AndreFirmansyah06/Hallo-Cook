-- CREATE TABLES
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB, -- Array of strings
  steps JSONB, -- Array of steps
  image_url TEXT,
  duration TEXT,
  difficulty TEXT,
  calories INTEGER,
  servings INTEGER,
  category TEXT,
  chef_name TEXT DEFAULT 'HalloCook Chef',
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Owner of custom user recipe
  video_url TEXT,
  estimated_cost INTEGER,
  required_equipment JSONB, -- Array of strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, recipe_id)
);

CREATE TABLE shopping_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  checked_ingredients JSONB DEFAULT '[]'::jsonb, -- Array of ingredient names that have been checked/bought
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE cooking_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  completed_steps JSONB DEFAULT '[]'::jsonb, -- Array of step indices
  progress INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, recipe_id)
);

-- RLS POLICIES (Simple version for Anon access if server handles auth)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooking_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Public Write Recipes" ON recipes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Recipes" ON recipes FOR UPDATE USING (true);
CREATE POLICY "Public Delete Recipes" ON recipes FOR DELETE USING (true);

CREATE POLICY "Users can manage own data" ON users FOR ALL USING (true);
CREATE POLICY "Users can manage favorites" ON favorites FOR ALL USING (true);
CREATE POLICY "Users can manage shopping list" ON shopping_list FOR ALL USING (true);
CREATE POLICY "Users can manage cooking sessions" ON cooking_sessions FOR ALL USING (true);
