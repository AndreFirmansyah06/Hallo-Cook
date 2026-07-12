-- SEED SCRIPT FOR SUPABASE SQL EDITOR
-- SCRIPT INI UNTUK MENDAFTARKAN USER DAN 15 RESEP MAKANAN AWAL SECARA BERSIH DAN SEDERHANA

-- 1. BERSIHKAN DATA LAMA
TRUNCATE cooking_sessions, shopping_list, favorites, recipes, users CASCADE;

-- 2. SEED USERS
INSERT INTO users (id, username, email, password, role)
VALUES ('c3b9b41a-8c9e-4c5c-9be8-f58c70fa5252', 'super_admin', 'admin@hallocook.com', '$2b$10$e.gir0xIyUPIMHhf.X.7ceU9Y7dA2.DCk1X4KAB92Mi/i.pdFZb/i', 'admin');

INSERT INTO users (id, username, email, password, role)
VALUES ('fa5da4b8-f80e-4340-9749-e33a2d7168db', 'anak_kos_sejati', 'kosan@hallocook.com', '$2b$10$rDf.d3D8h4TzSjw0FeKeyeHBn8hhNVNUf/Y6Y72ELP0WHricluVeW', 'user');

INSERT INTO users (id, username, email, password, role)
VALUES ('72dbe655-b463-4521-863a-14d9de764953', 'makan_mewah', 'mewah@hallocook.com', '$2b$10$OKTfRQdEnlKuIyIIOwHQA.KRC3akZuFSYOGLCpE5mr/YfuXQmRwtK', 'user');

-- 3. SEED RECIPES
INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Mie Instan Nyemek ala Kos', 
  'Mie instan goreng yang diolah kembali dengan bumbu tambahan, sayuran, telur, dan kuah yang kental gurih.', 
  '["1 bungkus mie instan goreng","1 butir telur","2 siung bawang merah iris","1 siung bawang putih iris","5 buah cabai rawit iris","1 sdm kecap manis","Sawi hijau secukupnya","200 ml air"]'::jsonb, 
  '["Tumis bawang merah, bawang putih, dan cabai rawit hingga harum.","Masukkan telur, lalu buat orak-arik.","Tuangkan air, tunggu hingga mendidih.","Masukkan mie instan beserta bumbunya, tambahkan sawi hijau dan kecap manis.","Masak hingga kuah menyusut kental and mie matang, sajikan hangat."]'::jsonb, 
  'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600&auto=format&fit=crop', 
  '10 mins', 
  'Easy', 
  420, 
  1, 
  'Anak Kos', 
  'HALLA AI', 
  'fa5da4b8-f80e-4340-9749-e33a2d7168db', 
  'https://www.youtube.com/watch?v=k5q640C3mR0', 
  8000, 
  '["Panci","Kompor"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'Nasi Gila Sederhana', 
  'Nasi putih hangat disiram dengan tumisan sosis, bakso, dan telur bumbu manis pedas yang luar biasa nikmat.', 
  '["2 piring nasi putih","3 buah sosis sapi iris serong","5 buah bakso sapi iris tipis","2 butir telur kocok lepas","2 siung bawang merah iris","2 siung bawang putih cincang","2 sdm kecap manis","1 sdm saus tiram","1 sdm saus sambal","Garam dan merica secukupnya"]'::jsonb, 
  '["Tumis bawang merah and bawang putih hingga wangi.","Masukkan sosis dan bakso, tumis sebentar.","Pinggirkan bahan, masukkan telur kocok, buat orak-arik.","Tambahkan kecap manis, saus tiram, saus sambal, garam, dan merica. Aduk rata.","Tuangkan sedikit air, masak hingga meresap. Sajikan dengan menyiramkannya di atas nasi putih hangat."]'::jsonb, 
  'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=600&auto=format&fit=crop', 
  '15 mins', 
  'Easy', 
  480, 
  2, 
  'Anak Kos', 
  'Chef Kosan', 
  'fa5da4b8-f80e-4340-9749-e33a2d7168db', 
  'https://www.youtube.com/watch?v=680BqfM8Nsw', 
  15000, 
  '["Wajan","Kompor"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'Telur Dadar Bumbu Padang', 
  'Telur dadar tebal, gurih, and bertekstur garing di luar dengan tambahan bumbu halus, cabai, dan daun bawang melimpah.', 
  '["3 butir telur ayam","2 sdm tepung beras","2 batang daun bawang iris tebal","3 siung bawang merah iris kasar","1 sdm bumbu dasar merah (cabai, bawang merah, bawang putih dihaluskan)","1/2 sdt ketumbar bubuk","Garam dan kaldu bubuk secukupnya"]'::jsonb, 
  '["Kocok telur bersama tepung beras hingga larut dan merata.","Masukkan bumbu halus, daun bawang, bawang merah iris, ketumbar bubuk, garam, dan kaldu bubuk.","Aduk rata semua bahan.","Panaskan minyak yang agak banyak dengan api sedang cenderung kecil.","Tuang adonan telur, siram-siram bagian atas dengan minyak panas, balik perlahan hingga matang merata di kedua sisi."]'::jsonb, 
  'https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=600&auto=format&fit=crop', 
  '15 mins', 
  'Easy', 
  290, 
  3, 
  'Anak Kos', 
  'Uni Lastri', 
  'fa5da4b8-f80e-4340-9749-e33a2d7168db', 
  'https://www.youtube.com/watch?v=0kFpYQ_T97A', 
  10000, 
  '["Wajan","Kompor"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'a1000000-0000-0000-0000-000000000004',
  'Tumis Kangkung Tempe Gurih', 
  'Kombinasi sayur kangkung segar yang ditumis cepat dengan potongan tempe goreng yang gurih dan berprotein tinggi.', 
  '["1 ikat kangkung siang/petik","1/2 papan tempe potong dadu kecil lalu goreng setengah matang","3 siung bawang putih iris tipis","3 siung bawang merah iris tipis","5 buah cabai rawit iris serong","1 sdm saus tiram","Garam, gula, dan air secukupnya"]'::jsonb, 
  '["Tumis bawang merah, bawang putih, dan cabai rawit hingga layu dan harum.","Masukkan tempe yang sudah digoreng setengah matang.","Masukkan kangkung, besarkan api kompor.","Tambahkan saus tiram, garam, gula, dan sedikit air.","Aduk cepat hingga kangkung layu namun masih berwarna hijau segar, angkat dan sajikan."]'::jsonb, 
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop', 
  '12 mins', 
  'Easy', 
  180, 
  2, 
  'Anak Kos', 
  'Bude Sum', 
  'fa5da4b8-f80e-4340-9749-e33a2d7168db', 
  'https://www.youtube.com/watch?v=q6Kq8n90Rtw', 
  7000, 
  '["Wajan","Kompor"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'a1000000-0000-0000-0000-000000000005',
  'Tahu Cabe Garam Krispi', 
  'Tahu sutra atau tahu putih balur tepung maizena goreng krispi, ditumis dengan bawang putih cincang garing dan cabai.', 
  '["1 kotak tahu putih besar potong dadu kecil","4 sdm tepung maizena","5 siung bawang putih cincang halus garing","5 buah cabai rawit merah iris kecil","2 batang daun bawang iris halus","1 sdt garam","1/2 sdt merica bubuk","Minyak goreng secukupnya"]'::jsonb, 
  '["Gilingkan potongan tahu dalam tepung maizena hingga tertutup rata.","Goreng tahu dalam minyak panas hingga berwarna kuning keemasan dan krispi, tiriskan.","Kurangi minyak di wajan, tumis bawang putih cincang hingga harum kekuningan.","Masukkan cabai rawit merah and daun bawang, aduk sebentar.","Masukkan tahu krispi, garam, dan merica bubuk. Aduk cepat hingga merata dan sajikan segera."]'::jsonb, 
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop', 
  '20 mins', 
  'Easy', 
  220, 
  3, 
  'Anak Kos', 
  'Acek Ameng', 
  'fa5da4b8-f80e-4340-9749-e33a2d7168db', 
  'https://www.youtube.com/watch?v=sOn86n8Yp5I', 
  12000, 
  '["Wajan","Kompor"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'a1000000-0000-0000-0000-000000000006',
  'Sarden Kaleng Masak Praktis', 
  'Sarden kalengan instan yang disulap menjadi hidangan mewah kosan dengan tambahan bawang, cabai, dan tomat segar.', 
  '["1 kaleng sarden saus tomat ukuran sedang","3 siung bawang merah iris","2 siung bawang putih iris","5 buah cabai rawit merah iris","1/2 buah tomat merah iris dadu","1 batang daun bawang iris","1 sdm minyak untuk menumis"]'::jsonb, 
  '["Panaskan minyak di wajan, tumis bawang merah, bawang putih, dan cabai rawit hingga harum.","Masukkan irisan tomat merah, tumis sebentar hingga agak layu.","Tuangkan sarden kalengan beserta seluruh sausnya ke dalam wajan.","Aduk perlahan agar ikan tidak hancur.","Masak hingga kuah mendidih and mengental, taburi daun bawang sebelum diangkat."]'::jsonb, 
  'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop', 
  '10 mins', 
  'Easy', 
  310, 
  2, 
  'Anak Kos', 
  'Mbak Sri', 
  'fa5da4b8-f80e-4340-9749-e33a2d7168db', 
  'https://www.youtube.com/watch?v=838XbAitbEg', 
  15000, 
  '["Wajan","Kompor"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'a1000000-0000-0000-0000-000000000007',
  'Orek Tempe Basah Manis Gurih', 
  'Lauk legendaris murah meriah dari tempe yang dipotong korek api, dimasak dengan kecap manis hingga meresap sempurna.', 
  '["1 papan tempe besar potong korek api","4 siung bawang merah iris tipis","3 siung bawang putih iris tipis","2 buah cabai merah besar iris serong","3 sdm kecap manis","1 lembar daun salam","1 iris lengkuas memarkan","Garam, gula merah, dan air secukupnya"]'::jsonb, 
  '["Goreng tempe hingga setengah matang atau berkulit, jangan sampai terlalu kering.","Tumis bawang merah, bawang putih, cabai merah, daun salam, dan lengkuas hingga harum.","Masukkan tempe setengah matang ke dalam tumisan.","Tambahkan kecap manis, garam, gula merah, dan tuangkan air secukupnya.","Masak dengan api sedang hingga air menyusut habis dan bumbu meresap merata."]'::jsonb, 
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop', 
  '15 mins', 
  'Easy', 
  240, 
  4, 
  'Anak Kos', 
  'Mbok Darmi', 
  'fa5da4b8-f80e-4340-9749-e33a2d7168db', 
  'https://www.youtube.com/watch?v=1F_lX8I_yxs', 
  8000, 
  '["Wajan","Kompor"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'a1000000-0000-0000-0000-000000000008',
  'Nasi Goreng Rice Cooker Praktis', 
  'Cara tercerdas membuat nasi goreng langsung di dalam rice cooker tanpa perlu wajan kotor tambahan.', 
  '["2 cup beras cuci bersih","Air secukupnya sesuai takaran masak nasi","2 buah sosis sapi iris bulat","50 gr wortel potong dudu mini","1 bungkus bumbu instan nasi goreng","1 sdm margarin","1 butir telur kocok lepas"]'::jsonb, 
  '["Masukkan beras yang telah dicuci beserta air ke dalam wadah rice cooker.","Masukkan bumbu instan nasi goreng dan margarin, aduk merata.","Tata potongan sosis dan wortel di atas permukaan beras.","Tekan tombol ''Cook'' dan tunggu hingga nasi matang.","Setelah matang, segera tuang telur kocok lepas di atas nasi panas, tutup kembali rice cooker selama 5 menit lalu aduk rata."]'::jsonb, 
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600&auto=format&fit=crop', 
  '25 mins', 
  'Easy', 
  390, 
  3, 
  'Anak Kos', 
  'Anak Kos Kreatif', 
  'fa5da4b8-f80e-4340-9749-e33a2d7168db', 
  'https://www.youtube.com/watch?v=AofX7gQv7r8', 
  12000, 
  '["Rice Cooker"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'a1000000-0000-0000-0000-000000000009',
  'Capcay Sayur Bakso Sederhana', 
  'Menu sayur campur bergizi seimbang dengan bakso sapi gurih dalam kuah kental maizena yang hangat.', 
  '["1 bonggol kecil kembang kol potong kuntum","1 buah wortel iris serong tipis","5 lembar sawi putih potong-potong","5 buah bakso sapi iris tipis","2 siung bawang putih geprek cincang","1 sdm saus tiram","1 sdt minyak wijen","1 sdt tepung maizena larutkan dengan sedikit air","Garam dan air secukupnya"]'::jsonb, 
  '["Tumis bawang putih cincang hingga harum kekuningan.","Masukkan potongan bakso sapi, aduk sebentar.","Masukkan wortel dan kembang kol yang bertekstur keras, tambahkan sedikit air, masak hingga agak empuk.","Masukkan sawi putih, saus tiram, minyak wijen, garam, dan merica.","Tuang larutan maizena, aduk cepat hingga kuah mengental meletup-letup, matikan api."]'::jsonb, 
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop', 
  '20 mins', 
  'Easy', 
  190, 
  3, 
  'Anak Kos', 
  'Mama Arka', 
  'fa5da4b8-f80e-4340-9749-e33a2d7168db', 
  'https://www.youtube.com/watch?v=FqS79f0M_eU', 
  14000, 
  '["Wajan","Kompor"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'a1000000-0000-0000-0000-000000000010',
  'Ayam Goreng Mentega Kilat', 
  'Potongan ayam goreng tepung instan garing dibalur dengan saus mentega bawang bombay gurih manis yang mengkilap.', 
  '["300 gr filet ayam potong dudu","1 bungkus tepung bumbu serbaguna instan","3 sdm margarin/mentega","1/2 buah bawang bombay iris memanjang","2 siung bawang putih geprek cincang","2 sdm kecap manis","1 sdm saus inggris","1 sdm saus tomat"]'::jsonb, 
  '["Goreng ayam fillet yang dibalur dengan tepung bumbu serbaguna hingga krispi keemasan, tiriskan.","Di wajan bersih, lelehkan margarin, lalu tumis bawang putih dan bawang bombay hingga layu harum.","Tambahkan kecap manis, saus inggris, dan saus tomat, aduk rata hingga membentuk saus karamel.","Masukkan ayam krispi yang sudah digoreng ke dalam saus mentega.","Aduk cepat agar seluruh permukaan ayam terbalur saus gurih mengkilap, sajikan."]'::jsonb, 
  'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=600&auto=format&fit=crop', 
  '20 mins', 
  'Easy', 
  410, 
  2, 
  'Anak Kos', 
  'Chef Kosan Eksotis', 
  'fa5da4b8-f80e-4340-9749-e33a2d7168db', 
  'https://www.youtube.com/watch?v=Tq_QY88l_pI', 
  25000, 
  '["Wajan","Kompor"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'Wagyu Beef Ribeye Steak with Truffle Mash', 
  'Daging sapi Wagyu A5 pilihan dengan marbling sempurna, dipanggang dengan teknik butter-basting rosemary dan bawang putih, disajikan dengan kentang tumbuk truffle.', 
  '["500 gr Daging Wagyu Ribeye A5","3 sdm butter kualitas tinggi","4 siung bawang putih memarkan","3 tangkai rosemary segar","Minyak zaitun secukupnya","Garam laut kasar (Maldon sea salt) & Lada hitam segar","200 gr kentang kukus","1 sdm minyak truffle hitam","50 ml krim segar"]'::jsonb, 
  '["Keluarkan Wagyu dari kulkas 30 menit sebelum dimasak hingga mencapai suhu ruang, taburi garam laut kasar dan lada hitam melimpah.","Panaskan wajan cast-iron dengan api sangat besar hingga sedikit berasap, beri minyak zaitun sedikit.","Letakkan Wagyu, sear selama 2 menit per sisi untuk tingkat kematangan medium rare.","Masukkan butter, bawang putih geprek, and rosemary ke wajan. Sendokkan butter leleh ke atas daging terus-menerus (butter basting) selama 1 menit.","Angkat daging, diamkan (resting) selama 10 menit agar jusnya menyebar merata.","Haluskan kentang kukus hangat bersama krim segar dan minyak truffle hingga super lembut. Sajikan bersama potongan Wagyu steak."]'::jsonb, 
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop', 
  '40 mins', 
  'Hard', 
  890, 
  2, 
  'High Class', 
  'Chef Gordon Ramsay', 
  'c3b9b41a-8c9e-4c5c-9be8-f58c70fa5252', 
  'https://www.youtube.com/watch?v=AmC9SmCBUj4', 
  450000, 
  '["Cast-Iron Skillet","Spatula","Oven"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'Pan-Seared Salmon with Lemon Herb Butter Sauce', 
  'Salmon Atlantik segar dengan kulit super renyah disajikan di atas hamparan asparagus panggang dengan siraman saus mentega lemon segar.', 
  '["2 potong fillet Salmon Atlantik berkulit","1 ikat Asparagus segar potong pangkal keras","50 gr unsalted butter dingin","1/2 buah lemon peras airnya","2 siung bawang putih cincang halus","1 sdm cincangan daun dill segar","Garam, lada hitam, dan minyak zaitun"]'::jsonb, 
  '["Keringkan kulit salmon menggunakan tisu dapur, sayat tipis kulitnya, bumbui dengan garam and lada hitam.","Panaskan wajan anti-lengket dengan minyak zaitun sedang, letakkan salmon dengan posisi kulit menghadap ke bawah.","Tekan salmon perlahan agar kulit rata menyentuh wajan, masa selama 4-5 menit hingga kulit garing kecokelatan.","Balik salmon, masak lagi selama 2 menit, lalu angkat dan tiriskan.","Tumis asparagus dengan sedikit minyak zaitun, garam, dan lada hingga matang renyah, angkat.","Saus: Panaskan bawang putih dengan sedikit butter, tambahkan air lemon, matikan api lalu masukkan butter dingin sisa bertahap sambil dikocok (emulsifikasi), beri daun dill. Siram saus di atas salmon dan asparagus."]'::jsonb, 
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600&auto=format&fit=crop', 
  '25 mins', 
  'Medium', 
  520, 
  2, 
  'High Class', 
  'Chef Arnold Poernomo', 
  'c3b9b41a-8c9e-4c5c-9be8-f58c70fa5252', 
  'https://www.youtube.com/watch?v=7X9N8EshA7E', 
  180000, 
  '["Wajan Anti-Lengket","Spatula"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'b1000000-0000-0000-0000-000000000003',
  'Classic French Lobster Thermidor', 
  'Daging lobster segar yang dimasak dengan saus putih krim cognac Cognac yang kaya rasa, jamur, lalu dipanggang dalam cangkang berbalut keju Gruyère leleh.', 
  '["2 ekor lobster utuh segar masing-masing 600 gr","50 gr keju Gruyère parut","2 sdm mentega","1 siung bawang bombay cincang halus","100 gr jamur kancing cincang","30 ml Cognac atau Brandy kualitas premium","150 ml heavy cream","1 sdt mustard Dijon","1 butir kuning telur","Garam, merica putih, peterseli cincang"]'::jsonb, 
  '["Rebus lobster dalam air asin mendidih selama 8-10 menit. Angkat dan masukkan air es.","Belah lobster menjadi dua memanjang, keluarkan daging dari ekor dan capitnya lalu potong dadu sedang. Jaga cangkang tetap utuh.","Tumis bawang bombay dan jamur dengan mentega hingga layu dan harum.","Masukkan daging lobster, tuangkan Cognac, lalu lakukan teknik flambé (nyalakan api kecil) dengan sangat hati-hati hingga alkohol menguap.","Kecilkan api, tambahkan heavy cream, mustard Dijon, garam, dan merica putih. Masak perlahan.","Matikan api, masukkan kuning telur kocok cepat agar mengental hangat tanpa menggumpal.","Masukkan kembali campuran daging lobster bersaus ke dalam cangkang lobster. Taburi keju Gruyère parut melimpah di atasnya.","Panggang dalam oven broiler bersuhu 200°C selama 5-7 menit hingga permukaan keju meleleh kecokelatan bergelembung. Taburi peterseli segar."]'::jsonb, 
  'https://images.unsplash.com/photo-1553618551-fba689030290?q=80&w=600&auto=format&fit=crop', 
  '60 mins', 
  'Hard', 
  750, 
  2, 
  'High Class', 
  'Chef Auguste Escoffier', 
  'c3b9b41a-8c9e-4c5c-9be8-f58c70fa5252', 
  'https://www.youtube.com/watch?v=EorD-mB7Hms', 
  350000, 
  '["Panci Rebus","Oven Broiler","Pisau"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'b1000000-0000-0000-0000-000000000004',
  'Gourmet Beef Wellington', 
  'Daging sapi tenderloin filet mignon berbalut bumbu mustard Inggris, duxelles jamur kancing, parma ham kering, dan adonan puff pastry panggang keemasan.', 
  '["800 gr fillet sapi tenderloin tengah (center-cut)","2 sdm mustard Inggris (English Mustard)","500 gr jamur kancing haluskan kasar dengan food processor (duxelles)","6 lembar Parma ham atau prosciutto","2 lembar puff pastry siap pakai","2 butir kuning telur kocok untuk olesan","3 siung bawang putih geprek","Garam, merica, and minyak zaitun"]'::jsonb, 
  '["Bumbui daging tenderloin dengan garam dan lada hitam. Sear cepat daging di wajan sangat panas di semua sisi selama total 4 menit hingga kecokelatan luar saja. Angkat, langsung olesi dengan English mustard hangat, sisihkan.","Masak jamur duxelles di wajan tanpa minyak bersama bawang putih geprek hingga kadar airnya benar-benar habis kering wangi. Dinginkan.","Bentangkan plastic wrap di meja, susun parma ham tumpang tindih. Oleskan jamur duxelles dingin di atas ham secara merata.","Letakkan daging di tengah, gulung dengan bantuan plastic wrap sekencang mungkin hingga membentuk silinder padat. Simpan di kulkas selama 20 menit.","Bentangkan puff pastry, letakkan gulungan daging (buka pembungkus plastiknya), gulung kembali dengan pastry hingga rapat sempurna, rapihkan ujung-ujungnya.","Olesi seluruh luar puff pastry dengan kuning telur, buat pola garis dekoratif dengan pisau tajam tanpa memotong pastry tembus.","Dinginkan kembali di kulkas selama 10 menit, lalu panggang dalam oven panas suhu 200°C selama 30-35 menit hingga pastry kuning keemasan garing. Diamkan selama 10 menit sebelum dipotong tebal."]'::jsonb, 
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop', 
  '90 mins', 
  'Hard', 
  950, 
  4, 
  'High Class', 
  'Chef Marco Pierre White', 
  'c3b9b41a-8c9e-4c5c-9be8-f58c70fa5252', 
  'https://www.youtube.com/watch?v=CykAcoS5-V4', 
  380000, 
  '["Oven","Wajan","Food Processor"]'::jsonb
);

INSERT INTO recipes (id, title, description, ingredients, steps, image_url, duration, difficulty, calories, servings, category, chef_name, user_id, video_url, estimated_cost, required_equipment)
VALUES (
  'b1000000-0000-0000-0000-000000000005',
  'Creamy Black Truffle Mushroom Risotto', 
  'Beras Arborio Italia premium yang dimasak lambat dengan kaldu jamur pekat, keju Parmigiano-Reggiano, disempurnakan dengan pasta truffle hitam murni.', 
  '["200 gr beras Arborio khusus risotto","1 liter kaldu sayur/jamur hangat pekat","1 buah bawang bombay cincang sangat halus","2 siung bawang putih cincang","100 ml dry white wine (bisa diganti kaldu jamur ditambah sedikit cuka apel)","50 gr unsalted butter","60 gr keju Parmigiano-Reggiano parut segar","2 sdm pasta truffle hitam murni (black truffle paste)","Minyak truffle untuk finishing, garam dan lada putih"]'::jsonb, 
  '["Tumis bawang bombay dan bawang putih dengan sedikit butter dan minyak zaitun hingga transparan lambat.","Masukkan beras Arborio, tumis beras selama 2 menit hingga butirannya mengkilap hangat.","Tuangkan white wine (atau alternatifnya), aduk konstan hingga cairan terserap habis oleh beras.","Mulai masukkan kaldu hangat satu sendok sayur demi satu sendok sayur, aduk terus perlahan. Tunggu cairan terserap sebelum menambahkan sendok berikutnya. Lakukan proses ini selama 18-20 menit hingga nasi bertekstur al dente.","Matikan api kompor. Masukkan sisa mentega dingin, keju parmesan parut, dan pasta truffle hitam.","Aduk dengan cepat dan penuh semangat (proses mantecatura) agar tercipta emulsi saus risotto yang super creamy layaknya gelombang.","Sajikan risotto hangat di piring datar, beri gerimis minyak truffle di atasnya."]'::jsonb, 
  'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600&auto=format&fit=crop', 
  '35 mins', 
  'Hard', 
  610, 
  2, 
  'High Class', 
  'Chef Massimo Bottura', 
  'c3b9b41a-8c9e-4c5c-9be8-f58c70fa5252', 
  'https://www.youtube.com/watch?v=pSAnLp7vOOk', 
  220000, 
  '["Wajan Dalam","Spatula Kayu"]'::jsonb
);

