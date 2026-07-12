import { supabase } from "../lib/supabase.js";
import bcrypt from "bcryptjs";

const adminEmails = ["admin@hallocook.com", "indomieseleramu1@gmail.com"];

export const authService = {
  async signup(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const role = adminEmails.includes(userData.email) ? "admin" : "user";
    const userPayload = {
      username: userData.username, 
      email: userData.email, 
      password: hashedPassword,
      role
    };
    
    if (!supabase) throw new Error("Supabase is not configured");
    
    // Check existing
    const { data: existing, error: checkError } = await supabase.from("users").select("id").eq("email", userData.email).maybeSingle();
    if (checkError) throw checkError;
    if (existing) throw new Error("Email already registered");

    const { data, error } = await supabase
      .from("users")
      .insert([userPayload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async login(email: string, password: string) {
    if (!supabase) throw new Error("Supabase is not configured");

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error || !user) throw new Error("Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const role = adminEmails.includes(user.email) ? "admin" : (user.role || "user");

    return { id: user.id, username: user.username, email: user.email, role };
  }
};
