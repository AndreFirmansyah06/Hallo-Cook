import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { authService } from "./server/services/authService.js";
import { recipeService } from "./server/services/recipeService.js";
import { userService } from "./server/services/userService.js";

let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", storage: "supabase", env: process.env.NODE_ENV });
  });

  // Database API Routes
  
  // Auth
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const user = await authService.signup(req.body);
      res.status(201).json({ user, message: "Account created successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to sign up" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      res.json({ user, message: "Login successful" });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid credentials" });
    }
  });

  // Recipes
  app.get("/api/recipes", async (req, res) => {
    try {
      const recipes = await recipeService.getAll();
      res.json(recipes);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch recipes" });
    }
  });

  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await recipeService.getById(req.params.id);
      res.json(recipe);
    } catch (error: any) {
      res.status(404).json({ error: error.message || "Recipe not found" });
    }
  });

  app.post("/api/recipes", async (req, res) => {
    try {
      const recipe = await recipeService.create(req.body);
      res.status(201).json(recipe);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create recipe" });
    }
  });

  app.put("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await recipeService.update(req.params.id, req.body);
      res.json(recipe);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update recipe" });
    }
  });

  app.delete("/api/recipes/:id", async (req, res) => {
    try {
      await recipeService.delete(req.params.id);
      res.json({ message: "Recipe deleted" });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete recipe" });
    }
  });

  // Admin and Users
  app.get("/api/admins", async (req, res) => {
    try {
      const admins = await userService.getAllAdmins();
      res.json(admins);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch admins" });
    }
  });

  app.post("/api/admins", async (req, res) => {
    try {
      const admin = await userService.createAdmin(req.body);
      res.status(201).json(admin);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create admin" });
    }
  });

  app.put("/api/admins/:id", async (req, res) => {
    try {
      const admin = await userService.updateAdmin(req.params.id, req.body);
      res.json(admin);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update admin" });
    }
  });

  app.delete("/api/admins/:id", async (req, res) => {
    try {
      await userService.deleteAdmin(req.params.id);
      res.json({ message: "Admin deleted" });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to delete admin" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch users" });
    }
  });

  // Favorites
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const favorites = await userService.getFavorites(req.params.userId);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites/toggle", async (req, res) => {
    try {
      const { userId, recipeId } = req.body;
      const result = await userService.toggleFavorite(userId, recipeId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to toggle favorite" });
    }
  });

  // Shopping List
  app.get("/api/shopping-list/:userId", async (req, res) => {
    try {
      const items = await userService.getShoppingList(req.params.userId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch shopping list" });
    }
  });

  app.post("/api/shopping-list", async (req, res) => {
    try {
      const { userId, recipeId } = req.body;
      const result = await userService.addToShoppingList(userId, recipeId);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to add to shopping list" });
    }
  });

  app.put("/api/shopping-list/:id", async (req, res) => {
    try {
      const item = await userService.updateShoppingListItem(req.params.id, req.body);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update shopping list item" });
    }
  });

  app.delete("/api/shopping-list/:id", async (req, res) => {
    try {
      const result = await userService.deleteFromShoppingList(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to remove from shopping list" });
    }
  });

  // Cooking Sessions
  app.get("/api/cooking-sessions/:userId", async (req, res) => {
    try {
      const sessions = await userService.getCookingSessions(req.params.userId);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch cooking sessions" });
    }
  });

  app.post("/api/cooking-sessions/start", async (req, res) => {
    try {
      const { userId, recipeId } = req.body;
      const session = await userService.startCooking(userId, recipeId);
      res.status(201).json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to start cooking session" });
    }
  });

  app.put("/api/cooking-sessions/:id/progress", async (req, res) => {
    try {
      const { completed_steps, progress } = req.body;
      const session = await userService.updateCookingProgress(req.params.id, completed_steps, progress);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update cooking progress" });
    }
  });

  app.post("/api/cooking-sessions/:id/reset", async (req, res) => {
    try {
      const session = await userService.resetCookingSession(req.params.id);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to reset cooking session" });
    }
  });

  // Smart Chat Respond Endpoint using Gemini
  app.post("/api/chat/respond", async (req, res) => {
    try {
      const { recipeTitle, chefName, ingredients, steps, isUserRecipe, messages } = req.body;
      
      // Check if Gemini API key exists
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: `Halo! Saya ${chefName || 'Chef'}. Terima kasih sudah bertanya tentang resep ${recipeTitle || 'ini'}. Untuk saat ini, asisten saya sedang offline, namun Anda bisa mencoba memasaknya sesuai dengan langkah-langkah di resep! Semoga berhasil!`
        });
      }

      const ai = getGeminiClient();

      const systemInstruction = `Anda adalah asisten obrolan interaktif untuk aplikasi resep makanan "HalloCook".
Anda akan berpura-pura menjadi ${isUserRecipe ? `pembuat resep (user author)` : `chef profesional`} bernama "${chefName || 'Chef HalloCook'}" yang menulis resep "${recipeTitle}".

Detail Resep:
- Judul: ${recipeTitle}
- Bahan-bahan: ${Array.isArray(ingredients) ? ingredients.join(', ') : ''}
- Langkah memasak: ${Array.isArray(steps) ? steps.join(' -> ') : ''}

Gaya Komunikasi:
- Berbicaralah dalam Bahasa Indonesia yang ramah, hangat, dan santai.
- Jika Anda berperan sebagai user pembuat resep (${chefName}), bersikaplah ramah dan senang membagikan tips masakan rumahan Anda.
- Jika Anda berperan sebagai chef profesional (${chefName}), berikan penjelasan teknis memasak yang singkat namun sangat mengedukasi dan menginspirasi.
- Jawablah pertanyaan pengguna dengan relevan berdasarkan bahan dan langkah resep di atas.
- Jaga agar jawaban Anda singkat, padat, dan jelas (maksimal 2-3 kalimat saja).
- Jangan sebutkan bahwa Anda adalah kecerdasan buatan atau asisten AI. Tetap konsisten dalam peran Anda sebagai ${chefName}.`;

      const formattedHistory = (messages || []).map((m: any) => {
        const role = m.sender === 'user' ? 'user' : 'model';
        return `${role === 'user' ? 'User' : chefName}: ${m.text}`;
      }).join('\n');

      const prompt = `Berikut adalah riwayat percakapan kita:\n${formattedHistory}\n\nBerikan tanggapan berikutnya sebagai ${chefName}. Pastikan tanggapan Anda langsung berupa jawaban chat yang alami, ramah, dan singkat (maksimal 3 kalimat).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // HALLA Assistant Chat Endpoint
  app.post("/api/halla/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const AI_NAME = "HALLA AI";

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: `Halo Sobat Masak! 👋 Aku ${AI_NAME}. Sayangnya aku sedang offline karena API key belum diatur, tapi aku siap membantumu memasak nanti!`
        });
      }

      const ai = getGeminiClient();

      const systemInstruction = `Kamu adalah ${AI_NAME}, asisten AI dapur pintar di aplikasi resep masakan bernama HalloCook.

Tugas utama kamu adalah membantu pengguna dalam:
1. Mencari resep makanan berdasarkan nama, bahan, atau waktu memasak
2. Memberikan rekomendasi menu berdasarkan bahan yang dimiliki pengguna
3. Memberikan langkah memasak yang jelas, sederhana, dan mudah diikuti
4. Memberikan tips memasak (daily tips)
5. Menjawab pertanyaan seputar makanan, masakan, dan dapur

Gaya komunikasi:
- Gunakan bahasa Indonesia santai, ramah, dan helpful
- Jawaban singkat tapi informatif
- Gunakan emoji secukupnya (🍳🥘🔥)
- Seperti teman masak, bukan seperti robot

Format jawaban:
- Jika user minta resep, tampilkan:
  🍽️ [Nama masakan]
  🧾 Bahan-bahan:
  - ...
  👨‍🍳 Langkah memasak (step-by-step):
  1. ...
  ⏱️ Estimasi waktu: ...

- Jika user hanya punya bahan:
  berikan beberapa opsi menu yang bisa dimasak

- Jika user bingung:
  tanyakan balik (contoh: "Kamu lagi pengen yang pedas atau simpel?")

Fitur tambahan (prioritas):
- Jika user bilang "cepat", prioritaskan resep < 20 menit
- Jika user bilang "murah" atau "anak kost", gunakan bahan sederhana & hemat
- Jika user vegetarian, jangan rekomendasikan daging
- Selalu arahkan user agar tetap engaged dan terbantu.`;

      let formattedHistory = (history || []).map((m: any) => {
        return `${m.role === 'user' ? 'User' : AI_NAME}: ${m.content}`;
      }).join('\n');

      const prompt = `Berikut adalah riwayat percakapan kita sebelumnya:\n${formattedHistory}\n\nUser: ${message}\n\nBerikan tanggapanmu sebagai ${AI_NAME}. Pastikan format dan gaya bicara sesuai dengan instruksimu.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error calling Gemini API for HALLA:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Export app for Vercel
  (app as any)._startServer = () => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Demo server running on http://localhost:${PORT} (LocalStorage Mode)`);
    });
  };

  return app;
}

const appPromise = startServer();

// For Vercel, we export the app handler
export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};

// For local/development, we start the listener
if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
  appPromise.then(app => {
    (app as any)._startServer();
  });
} else if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  // Local production test
  appPromise.then(app => {
    (app as any)._startServer();
  });
}
