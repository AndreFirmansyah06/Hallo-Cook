import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://nimihppvvpfepbgzewwu.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseKey) {
  console.error("Error: VITE_SUPABASE_ANON_KEY is not defined in the environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Starting database seeding...");

  try {
    // 1. Hash passwords for users
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const user1PasswordHash = await bcrypt.hash("kos123", 10);
    const user2PasswordHash = await bcrypt.hash("mewah123", 10);

    const seedUsers = [
      {
        username: "super_admin",
        email: "admin@hallocook.com",
        password: adminPasswordHash,
        role: "admin"
      },
      {
        username: "anak_kos_sejati",
        email: "kosan@hallocook.com",
        password: user1PasswordHash,
        role: "user"
      },
      {
        username: "makan_mewah",
        email: "mewah@hallocook.com",
        password: user2PasswordHash,
        role: "user"
      }
    ];

    console.log("Seeding users...");
    const createdUsers: any[] = [];

    for (const u of seedUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", u.email)
        .maybeSingle();

      if (existingUser) {
        console.log(`User ${u.email} already exists, skipping.`);
        createdUsers.push({ email: u.email, id: existingUser.id });
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from("users")
          .insert([u])
          .select()
          .single();

        if (insertErr) {
          console.error(`Failed to insert user ${u.email}:`, insertErr);
        } else {
          console.log(`User ${u.email} created successfully.`);
          createdUsers.push(inserted);
        }
      }
    }

    const adminUser = createdUsers.find(u => u.email === "admin@hallocook.com") || createdUsers[0];
    const kosUser = createdUsers.find(u => u.email === "kosan@hallocook.com") || createdUsers[1] || adminUser;

    // 2. Prepare recipe seed data (10 Anak Kos recipes, 5 High Class recipes)
    const seedRecipes = [
      // 10 Anak Kos Recipes
      {
        title: "Mie Instan Nyemek ala Kos",
        description: "Mie instan goreng yang diolah kembali dengan bumbu tambahan, sayuran, telur, dan kuah yang kental gurih.",
        image_url: "https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600&auto=format&fit=crop",
        difficulty: "Easy",
        category: "Anak Kos",
        chef_name: "HALLA AI",
        duration: "10 mins",
        servings: 1,
        calories: 420,
        ingredients: ["1 bungkus mie instan goreng", "1 butir telur", "2 siung bawang merah iris", "1 siung bawang putih iris", "5 buah cabai rawit iris", "1 sdm kecap manis", "Sawi hijau secukupnya", "200 ml air"],
        steps: ["Tumis bawang merah, bawang putih, dan cabai rawit hingga harum.", "Masukkan telur, lalu buat orak-arik.", "Tuangkan air, tunggu hingga mendidih.", "Masukkan mie instan beserta bumbunya, tambahkan sawi hijau dan kecap manis.", "Masak hingga kuah menyusut kental dan mie matang, sajikan hangat."],
        video_url: "https://www.youtube.com/watch?v=k5q640C3mR0",
        estimated_cost: 8000,
        required_equipment: ["Panci", "Kompor"],
        user_id: kosUser?.id || null
      },
      {
        title: "Nasi Gila Sederhana",
        description: "Nasi putih hangat disiram dengan tumisan sosis, bakso, dan telur bumbu manis pedas yang luar biasa nikmat.",
        image_url: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=600&auto=format&fit=crop",
        difficulty: "Easy",
        category: "Anak Kos",
        chef_name: "Chef Kosan",
        duration: "15 mins",
        servings: 2,
        calories: 480,
        ingredients: ["2 piring nasi putih", "3 buah sosis sapi iris serong", "5 buah bakso sapi iris tipis", "2 butir telur kocok lepas", "2 siung bawang merah iris", "2 siung bawang putih cincang", "2 sdm kecap manis", "1 sdm saus tiram", "1 sdm saus sambal", "Garam dan merica secukupnya"],
        steps: ["Tumis bawang merah and bawang putih hingga wangi.", "Masukkan sosis dan bakso, tumis sebentar.", "Pinggirkan bahan, masukkan telur kocok, buat orak-arik.", "Tambahkan kecap manis, saus tiram, saus sambal, garam, dan merica. Aduk rata.", "Tuangkan sedikit air, masak hingga meresap. Sajikan dengan menyiramkannya di atas nasi putih hangat."],
        video_url: "https://www.youtube.com/watch?v=680BqfM8Nsw",
        estimated_cost: 15000,
        required_equipment: ["Wajan", "Kompor"],
        user_id: kosUser?.id || null
      },
      {
        title: "Telur Dadar Bumbu Padang",
        description: "Telur dadar tebal, gurih, dan bertekstur garing di luar dengan tambahan bumbu halus, cabai, dan daun bawang melimpah.",
        image_url: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=600&auto=format&fit=crop",
        difficulty: "Easy",
        category: "Anak Kos",
        chef_name: "Uni Lastri",
        duration: "15 mins",
        servings: 3,
        calories: 290,
        ingredients: ["3 butir telur ayam", "2 sdm tepung beras", "2 batang daun bawang iris tebal", "3 siung bawang merah iris kasar", "1 sdm bumbu dasar merah (cabai, bawang merah, bawang putih dihaluskan)", "1/2 sdt ketumbar bubuk", "Garam dan kaldu bubuk secukupnya"],
        steps: ["Kocok telur bersama tepung beras hingga larut dan merata.", "Masukkan bumbu halus, daun bawang, bawang merah iris, ketumbar bubuk, garam, dan kaldu bubuk.", "Aduk rata semua bahan.", "Panaskan minyak yang agak banyak dengan api sedang cenderung kecil.", "Tuang adonan telur, siram-siram bagian atas dengan minyak panas, balik perlahan hingga matang merata di kedua sisi."],
        video_url: "https://www.youtube.com/watch?v=0kFpYQ_T97A",
        estimated_cost: 10000,
        required_equipment: ["Wajan", "Kompor"],
        user_id: kosUser?.id || null
      },
      {
        title: "Tumis Kangkung Tempe Gurih",
        description: "Kombinasi sayur kangkung segar yang ditumis cepat dengan potongan tempe goreng yang gurih dan berprotein tinggi.",
        image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop",
        difficulty: "Easy",
        category: "Anak Kos",
        chef_name: "Bude Sum",
        duration: "12 mins",
        servings: 2,
        calories: 180,
        ingredients: ["1 ikat kangkung siang/petik", "1/2 papan tempe potong dadu kecil lalu goreng setengah matang", "3 siung bawang putih iris tipis", "3 siung bawang merah iris tipis", "5 buah cabai rawit iris serong", "1 sdm saus tiram", "Garam, gula, dan air secukupnya"],
        steps: ["Tumis bawang merah, bawang putih, dan cabai rawit hingga layu dan harum.", "Masukkan tempe yang sudah digoreng setengah matang.", "Masukkan kangkung, besarkan api kompor.", "Tambahkan saus tiram, garam, gula, dan sedikit air.", "Aduk cepat hingga kangkung layu namun masih berwarna hijau segar, angkat dan sajikan."],
        video_url: "https://www.youtube.com/watch?v=q6Kq8n90Rtw",
        estimated_cost: 7000,
        required_equipment: ["Wajan", "Kompor"],
        user_id: kosUser?.id || null
      },
      {
        title: "Tahu Cabe Garam Krispi",
        description: "Tahu sutra atau tahu putih balur tepung maizena goreng krispi, ditumis dengan bawang putih cincang garing dan cabai.",
        image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
        difficulty: "Easy",
        category: "Anak Kos",
        chef_name: "Acek Ameng",
        duration: "20 mins",
        servings: 3,
        calories: 220,
        ingredients: ["1 kotak tahu putih besar potong dadu kecil", "4 sdm tepung maizena", "5 siung bawang putih cincang halus garing", "5 buah cabai rawit merah iris kecil", "2 batang daun bawang iris halus", "1 sdt garam", "1/2 sdt merica bubuk", "Minyak goreng secukupnya"],
        steps: ["Gulingkan potongan tahu dalam tepung maizena hingga tertutup rata.", "Goreng tahu dalam minyak panas hingga berwarna kuning keemasan dan krispi, tiriskan.", "Kurangi minyak di wajan, tumis bawang putih cincang hingga harum kekuningan.", "Masukkan cabai rawit merah and daun bawang, aduk sebentar.", "Masukkan tahu krispi, garam, dan merica bubuk. Aduk cepat hingga merata dan sajikan segera."],
        video_url: "https://www.youtube.com/watch?v=sOn86n8Yp5I",
        estimated_cost: 12000,
        required_equipment: ["Wajan", "Kompor"],
        user_id: kosUser?.id || null
      },
      {
        title: "Sarden Kaleng Masak Praktis",
        description: "Sarden kalengan instan yang disulap menjadi hidangan mewah kosan dengan tambahan bawang, cabai, dan tomat segar.",
        image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop",
        difficulty: "Easy",
        category: "Anak Kos",
        chef_name: "Mbak Sri",
        duration: "10 mins",
        servings: 2,
        calories: 310,
        ingredients: ["1 kaleng sarden saus tomat ukuran sedang", "3 siung bawang merah iris", "2 siung bawang putih iris", "5 buah cabai rawit merah iris", "1/2 buah tomat merah iris dadu", "1 batang daun bawang iris", "1 sdm minyak untuk menumis"],
        steps: ["Panaskan minyak di wajan, tumis bawang merah, bawang putih, dan cabai rawit hingga harum.", "Masukkan irisan tomat merah, tumis sebentar hingga agak layu.", "Tuangkan sarden kalengan beserta seluruh sausnya ke dalam wajan.", "Aduk perlahan agar ikan tidak hancur.", "Masak hingga kuah mendidih dan mengental, taburi daun bawang sebelum diangkat."],
        video_url: "https://www.youtube.com/watch?v=838XbAitbEg",
        estimated_cost: 15000,
        required_equipment: ["Wajan", "Kompor"],
        user_id: kosUser?.id || null
      },
      {
        title: "Orek Tempe Basah Manis Gurih",
        description: "Lauk legendaris murah meriah dari tempe yang dipotong korek api, dimasak dengan kecap manis hingga meresap sempurna.",
        image_url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop",
        difficulty: "Easy",
        category: "Anak Kos",
        chef_name: "Mbok Darmi",
        duration: "15 mins",
        servings: 4,
        calories: 240,
        ingredients: ["1 papan tempe besar potong korek api", "4 siung bawang merah iris tipis", "3 siung bawang putih iris tipis", "2 buah cabai merah besar iris serong", "3 sdm kecap manis", "1 lembar daun salam", "1 iris lengkuas memarkan", "Garam, gula merah, dan air secukupnya"],
        steps: ["Goreng tempe hingga setengah matang atau berkulit, jangan sampai terlalu kering.", "Tumis bawang merah, bawang putih, cabai merah, daun salam, dan lengkuas hingga harum.", "Masukkan tempe setengah matang ke dalam tumisan.", "Tambahkan kecap manis, garam, gula merah, dan tuangkan air secukupnya.", "Masak dengan api sedang hingga air menyusut habis dan bumbu meresap merata."],
        video_url: "https://www.youtube.com/watch?v=1F_lX8I_yxs",
        estimated_cost: 8000,
        required_equipment: ["Wajan", "Kompor"],
        user_id: kosUser?.id || null
      },
      {
        title: "Nasi Goreng Rice Cooker Praktis",
        description: "Cara tercerdas membuat nasi goreng langsung di dalam rice cooker tanpa perlu wajan kotor tambahan.",
        image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600&auto=format&fit=crop",
        difficulty: "Easy",
        category: "Anak Kos",
        chef_name: "Anak Kos Kreatif",
        duration: "25 mins",
        servings: 3,
        calories: 390,
        ingredients: ["2 cup beras cuci bersih", "Air secukupnya sesuai takaran masak nasi", "2 buah sosis sapi iris bulat", "50 gr wortel potong dudu mini", "1 bungkus bumbu instan nasi goreng", "1 sdm margarin", "1 butir telur kocok lepas"],
        steps: ["Masukkan beras yang telah dicuci beserta air ke dalam wadah rice cooker.", "Masukkan bumbu instan nasi goreng dan margarin, aduk merata.", "Tata potongan sosis dan wortel di atas permukaan beras.", "Tekan tombol 'Cook' dan tunggu hingga nasi matang.", "Setelah matang, segera tuang telur kocok lepas di atas nasi panas, tutup kembali rice cooker selama 5 menit lalu aduk rata."],
        video_url: "https://www.youtube.com/watch?v=AofX7gQv7r8",
        estimated_cost: 12000,
        required_equipment: ["Rice Cooker"],
        user_id: kosUser?.id || null
      },
      {
        title: "Capcay Sayur Bakso Sederhana",
        description: "Menu sayur campur bergizi seimbang dengan bakso sapi gurih dalam kuah kental maizena yang hangat.",
        image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop",
        difficulty: "Easy",
        category: "Anak Kos",
        chef_name: "Mama Arka",
        duration: "20 mins",
        servings: 3,
        calories: 190,
        ingredients: ["1 bonggol kecil kembang kol potong kuntum", "1 buah wortel iris serong tipis", "5 lembar sawi putih potong-potong", "5 buah bakso sapi iris tipis", "2 siung bawang putih geprek cincang", "1 sdm saus tiram", "1 sdt minyak wijen", "1 sdt tepung maizena larutkan dengan sedikit air", "Garam dan air secukupnya"],
        steps: ["Tumis bawang putih cincang hingga harum kekuningan.", "Masukkan potongan bakso sapi, aduk sebentar.", "Masukkan wortel dan kembang kol yang bertekstur keras, tambahkan sedikit air, masak hingga agak empuk.", "Masukkan sawi putih, saus tiram, minyak wijen, garam, dan merica.", "Tuang larutan maizena, aduk cepat hingga kuah mengental meletup-letup, matikan api."],
        video_url: "https://www.youtube.com/watch?v=FqS79f0M_eU",
        estimated_cost: 14000,
        required_equipment: ["Wajan", "Kompor"],
        user_id: kosUser?.id || null
      },
      {
        title: "Ayam Goreng Mentega Kilat",
        description: "Potongan ayam goreng tepung instan garing dibalur dengan saus mentega bawang bombay gurih manis yang mengkilap.",
        image_url: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=600&auto=format&fit=crop",
        difficulty: "Easy",
        category: "Anak Kos",
        chef_name: "Chef Kosan Eksotis",
        duration: "20 mins",
        servings: 2,
        calories: 410,
        ingredients: ["300 gr filet ayam potong dudu", "1 bungkus tepung bumbu serbaguna instan", "3 sdm margarin/mentega", "1/2 buah bawang bombay iris memanjang", "2 siung bawang putih geprek cincang", "2 sdm kecap manis", "1 sdm saus inggris", "1 sdm saus tomat"],
        steps: ["Goreng ayam fillet yang dibalur dengan tepung bumbu serbaguna hingga krispi keemasan, tiriskan.", "Di wajan bersih, lelehkan margarin, lalu tumis bawang putih dan bawang bombay hingga layu harum.", "Tambahkan kecap manis, saus inggris, dan saus tomat, aduk rata hingga membentuk saus karamel.", "Masukkan ayam krispi yang sudah digoreng ke dalam saus mentega.", "Aduk cepat agar seluruh permukaan ayam terbalur saus gurih mengkilap, sajikan."],
        video_url: "https://www.youtube.com/watch?v=Tq_QY88l_pI",
        estimated_cost: 25000,
        required_equipment: ["Wajan", "Kompor"],
        user_id: kosUser?.id || null
      },

      // 5 High Class Recipes
      {
        title: "Wagyu Beef Ribeye Steak with Truffle Mash",
        description: "Daging sapi Wagyu A5 pilihan dengan marbling sempurna, dipanggang dengan teknik butter-basting rosemary dan bawang putih, disajikan dengan kentang tumbuk truffle.",
        image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
        difficulty: "Hard",
        category: "High Class",
        chef_name: "Chef Gordon Ramsay",
        duration: "40 mins",
        servings: 2,
        calories: 890,
        ingredients: ["500 gr Daging Wagyu Ribeye A5", "3 sdm butter kualitas tinggi", "4 siung bawang putih memarkan", "3 tangkai rosemary segar", "Minyak zaitun secukupnya", "Garam laut kasar (Maldon sea salt) & Lada hitam segar", "200 gr kentang kukus", "1 sdm minyak truffle hitam", "50 ml krim segar"],
        steps: ["Keluarkan Wagyu dari kulkas 30 menit sebelum dimasak hingga mencapai suhu ruang, taburi garam laut kasar dan lada hitam melimpah.", "Panaskan wajan cast-iron dengan api sangat besar hingga sedikit berasap, beri minyak zaitun sedikit.", "Letakkan Wagyu, sear selama 2 menit per sisi untuk tingkat kematangan medium rare.", "Masukkan butter, bawang putih geprek, and rosemary ke wajan. Sendokkan butter leleh ke atas daging terus-menerus (butter basting) selama 1 menit.", "Angkat daging, diamkan (resting) selama 10 menit agar jusnya menyebar merata.", "Haluskan kentang kukus hangat bersama krim segar dan minyak truffle hingga super lembut. Sajikan bersama potongan Wagyu steak."],
        video_url: "https://www.youtube.com/watch?v=AmC9SmCBUj4",
        estimated_cost: 450000,
        required_equipment: ["Cast-Iron Skillet", "Spatula", "Oven"],
        user_id: adminUser?.id || null
      },
      {
        title: "Pan-Seared Salmon with Lemon Herb Butter Sauce",
        description: "Salmon Atlantik segar dengan kulit super renyah disajikan di atas hamparan asparagus panggang dengan siraman saus mentega lemon segar.",
        image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600&auto=format&fit=crop",
        difficulty: "Medium",
        category: "High Class",
        chef_name: "Chef Arnold Poernomo",
        duration: "25 mins",
        servings: 2,
        calories: 520,
        ingredients: ["2 potong fillet Salmon Atlantik berkulit", "1 ikat Asparagus segar potong pangkal keras", "50 gr unsalted butter dingin", "1/2 buah lemon peras airnya", "2 siung bawang putih cincang halus", "1 sdm cincangan daun dill segar", "Garam, lada hitam, dan minyak zaitun"],
        steps: ["Keringkan kulit salmon menggunakan tisu dapur, sayat tipis kulitnya, bumbui dengan garam and lada hitam.", "Panaskan wajan anti-lengket dengan minyak zaitun sedang, letakkan salmon dengan posisi kulit menghadap ke bawah.", "Tekan salmon perlahan agar kulit rata menyentuh wajan, masak selama 4-5 menit hingga kulit garing kecokelatan.", "Balik salmon, masak lagi selama 2 menit, lalu angkat dan tiriskan.", "Tumis asparagus dengan sedikit minyak zaitun, garam, dan lada hingga matang renyah, angkat.", "Saus: Panaskan bawang putih dengan sedikit butter, tambahkan air lemon, matikan api lalu masukkan butter dingin sisa bertahap sambil dikocok (emulsifikasi), beri daun dill. Siram saus di atas salmon dan asparagus."],
        video_url: "https://www.youtube.com/watch?v=7X9N8EshA7E",
        estimated_cost: 180000,
        required_equipment: ["Wajan Anti-Lengket", "Spatula"],
        user_id: adminUser?.id || null
      },
      {
        title: "Classic French Lobster Thermidor",
        description: "Daging lobster segar yang dimasak dengan saus putih krim cognac Cognac yang kaya rasa, jamur, lalu dipanggang dalam cangkang berbalut keju Gruyère leleh.",
        image_url: "https://images.unsplash.com/photo-1553618551-fba689030290?q=80&w=600&auto=format&fit=crop",
        difficulty: "Hard",
        category: "High Class",
        chef_name: "Chef Auguste Escoffier",
        duration: "60 mins",
        servings: 2,
        calories: 750,
        ingredients: ["2 ekor lobster utuh segar masing-masing 600 gr", "50 gr keju Gruyère parut", "2 sdm mentega", "1 siung bawang bombay cincang halus", "100 gr jamur kancing cincang", "30 ml Cognac atau Brandy kualitas premium", "150 ml heavy cream", "1 sdt mustard Dijon", "1 butir kuning telur", "Garam, merica putih, peterseli cincang"],
        steps: ["Rebus lobster dalam air asin mendidih selama 8-10 menit. Angkat dan masukkan air es.", "Belah lobster menjadi dua memanjang, keluarkan daging dari ekor dan capitnya lalu potong dadu sedang. Jaga cangkang tetap utuh.", "Tumis bawang bombay dan jamur dengan mentega hingga layu dan harum.", "Masukkan daging lobster, tuangkan Cognac, lalu lakukan teknik flambé (nyalakan api kecil) dengan sangat hati-hati hingga alkohol menguap.", "Kecilkan api, tambahkan heavy cream, mustard Dijon, garam, dan merica putih. Masak perlahan.", "Matikan api, masukkan kuning telur kocok cepat agar mengental hangat tanpa menggumpal.", "Masukkan kembali campuran daging lobster bersaus ke dalam cangkang lobster. Taburi keju Gruyère parut melimpah di atasnya.", "Panggang dalam oven broiler bersuhu 200°C selama 5-7 menit hingga permukaan keju meleleh kecokelatan bergelembung. Taburi peterseli segar."],
        video_url: "https://www.youtube.com/watch?v=EorD-mB7Hms",
        estimated_cost: 350000,
        required_equipment: ["Panci Rebus", "Oven Broiler", "Pisau"],
        user_id: adminUser?.id || null
      },
      {
        title: "Gourmet Beef Wellington",
        description: "Daging sapi tenderloin filet mignon berbalut bumbu mustard Inggris, duxelles jamur kancing, parma ham kering, dan adonan puff pastry panggang keemasan.",
        image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
        difficulty: "Hard",
        category: "High Class",
        chef_name: "Chef Marco Pierre White",
        duration: "90 mins",
        servings: 4,
        calories: 950,
        ingredients: ["800 gr fillet sapi tenderloin tengah (center-cut)", "2 sdm mustard Inggris (English Mustard)", "500 gr jamur kancing haluskan kasar dengan food processor (duxelles)", "6 lembar Parma ham atau prosciutto", "2 lembar puff pastry siap pakai", "2 butir kuning telur kocok untuk olesan", "3 siung bawang putih geprek", "Garam, merica, and minyak zaitun"],
        steps: ["Bumbui daging tenderloin dengan garam dan lada hitam. Sear cepat daging di wajan sangat panas di semua sisi selama total 4 menit hingga kecokelatan luar saja. Angkat, langsung olesi dengan English mustard hangat, sisihkan.", "Masak jamur duxelles di wajan tanpa minyak bersama bawang putih geprek hingga kadar airnya benar-benar habis kering wangi. Dinginkan.", "Bentangkan plastic wrap di meja, susun parma ham tumpang tindih. Oleskan jamur duxelles dingin di atas ham secara merata.", "Letakkan daging di tengah, gulung dengan bantuan plastic wrap sekencang mungkin hingga membentuk silinder padat. Simpan di kulkas selama 20 menit.", "Bentangkan puff pastry, letakkan gulungan daging (buka pembungkus plastiknya), gulung kembali dengan pastry hingga rapat sempurna, rapihkan ujung-ujungnya.", "Olesi seluruh luar puff pastry dengan kuning telur, buat pola garis dekoratif dengan pisau tajam tanpa memotong pastry tembus.", "Dinginkan kembali di kulkas selama 10 menit, lalu panggang dalam oven panas suhu 200°C selama 30-35 menit hingga pastry kuning keemasan garing. Diamkan selama 10 menit sebelum dipotong tebal."],
        video_url: "https://www.youtube.com/watch?v=CykAcoS5-V4",
        estimated_cost: 380000,
        required_equipment: ["Oven", "Wajan", "Food Processor"],
        user_id: adminUser?.id || null
      },
      {
        title: "Creamy Black Truffle Mushroom Risotto",
        description: "Beras Arborio Italia premium yang dimasak lambat dengan kaldu jamur pekat, keju Parmigiano-Reggiano, disempurnakan dengan pasta truffle hitam murni.",
        image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600&auto=format&fit=crop",
        difficulty: "Hard",
        category: "High Class",
        chef_name: "Chef Massimo Bottura",
        duration: "35 mins",
        servings: 2,
        calories: 610,
        ingredients: ["200 gr beras Arborio khusus risotto", "1 liter kaldu sayur/jamur hangat pekat", "1 buah bawang bombay cincang sangat halus", "2 siung bawang putih cincang", "100 ml dry white wine (bisa diganti kaldu jamur ditambah sedikit cuka apel)", "50 gr unsalted butter", "60 gr keju Parmigiano-Reggiano parut segar", "2 sdm pasta truffle hitam murni (black truffle paste)", "Minyak truffle untuk finishing, garam dan lada putih"],
        steps: ["Tumis bawang bombay dan bawang putih dengan sedikit butter dan minyak zaitun hingga transparan lambat.", "Masukkan beras Arborio, tumis beras selama 2 menit hingga butirannya mengkilap hangat.", "Tuangkan white wine (atau alternatifnya), aduk konstan hingga cairan terserap habis oleh beras.", "Mulai masukkan kaldu hangat satu sendok sayur demi satu sendok sayur, aduk terus perlahan. Tunggu cairan terserap sebelum menambahkan sendok berikutnya. Lakukan proses ini selama 18-20 menit hingga nasi bertekstur al dente.", "Matikan api kompor. Masukkan sisa mentega dingin, keju parmesan parut, dan pasta truffle hitam.", "Aduk dengan cepat dan penuh semangat (proses mantecatura) agar tercipta emulsi saus risotto yang super creamy layaknya gelombang.", "Sajikan risotto hangat di piring datar, beri gerimis minyak truffle di atasnya."],
        video_url: "https://www.youtube.com/watch?v=pSAnLp7vOOk",
        estimated_cost: 220000,
        required_equipment: ["Wajan Dalam", "Spatula Kayu"],
        user_id: adminUser?.id || null
      }
    ];

    console.log("Seeding recipes...");
    for (const r of seedRecipes) {
      // Check if recipe already exists
      const { data: existingRecipe } = await supabase
        .from("recipes")
        .select("id")
        .eq("title", r.title)
        .maybeSingle();

      if (existingRecipe) {
        console.log(`Recipe "${r.title}" already exists, skipping.`);
      } else {
        const { error: insertErr } = await supabase
          .from("recipes")
          .insert([r]);

        if (insertErr) {
          console.error(`Failed to insert recipe "${r.title}":`, insertErr);
        } else {
          console.log(`Recipe "${r.title}" created successfully.`);
        }
      }
    }

    console.log("Seeding process completed successfully!");
  } catch (error: any) {
    console.error("Critical error during seeding:", error);
    process.exit(1);
  }
}

seed();
