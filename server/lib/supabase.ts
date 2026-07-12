import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn("WARNING: Supabase environment variables are missing. API calls will fail.");
}

// Only export the client if we have a URL, otherwise provide a proxy/safe wrapper
export const supabase = supabaseUrl 
  ? createClient(supabaseUrl, supabaseKey)
  : (null as any); 
