// Seeds studios + games and creates an auth user (studio owner) per studio.
// Idempotent: safe to call multiple times. Returns the credentials for each studio.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StudioSeed {
  id: string;
  name: string;
  tagline: string;
  description: string;
  founded_year?: number;
  location?: string;
  website?: string;
}
interface GameSeed {
  id: string;
  studio_id: string;
  title: string;
  description: string;
  genre: string;
  status: string;
  platforms: string[];
  links?: { label: string; url: string }[];
}

const studios: StudioSeed[] = [
  { id: "mac-studio", name: "Mac Studio", tagline: "Jogos educativos e culturais", description: "Estúdio pioneiro no desenvolvimento de jogos educativos e culturais em Angola, com foco em criar experiências que valorizam a identidade angolana.", location: "Luanda, Angola" },
  { id: "ad-games-angola", name: "AD Games Angola", tagline: "Cultura angolana em jogos mobile", description: "Estúdio focado em jogos mobile que retratam o cotidiano e a cultura angolana, com títulos populares como Zungueira Run e Slash Boom.", location: "Luanda, Angola" },
  { id: "kiala-games", name: "Kiala Games", tagline: "Ação e tiro imersivos", description: "Estúdio especializado em jogos de ação e tiro, desenvolvendo experiências imersivas para jogadores angolanos e internacionais.", location: "Luanda, Angola" },
  { id: "hydra-games", name: "Hydra Games", tagline: "Velocidade e adrenalina", description: "Estúdio de jogos de corrida e ação, criando experiências adrenalinantes com temática angolana.", location: "Luanda, Angola" },
  { id: "robot-games", name: "Robot Games", tagline: "Tecnologia e criatividade", description: "Estúdio inovador que combina tecnologia e criatividade para desenvolver jogos únicos no mercado angolano.", location: "Luanda, Angola" },
  { id: "izizi-studios", name: "IZIZI Studios", tagline: "Pixel art e narrativa", description: "Estúdio indie angolano com foco em jogos narrativos e de plataforma com arte pixel art.", location: "Angola" },
  { id: "cgstuff-studio", name: "Cgstuff Studio", tagline: "CG art encontra game dev", description: "Estúdio que combina CG art e game development para criar experiências visuais impressionantes.", location: "Angola" },
  { id: "luk3d", name: "Luk3D", tagline: "3D indie com alcance global", description: "Desenvolvedor independente focado em jogos 3D e experiências interativas, com destaque para o Bitter Belief na Steam.", location: "Angola" },
  { id: "bantu-games", name: "Bantu Games", tagline: "Cultura Bantu, jogos modernos", description: "Estúdio que celebra a cultura Bantu através de jogos digitais envolventes e educativos.", location: "Angola" },
];

const games: GameSeed[] = [
  { id: "aventuras-da-glx", studio_id: "mac-studio", title: "Aventuras da GLX", description: "Jogo educativo onde aliens invadem Angola e o jogador deve proteger o país.", genre: "Educativo / Aventura", status: "Lançado", platforms: ["Android"], links: [{ label: "Google Play", url: "#" }] },
  { id: "sou-angolano", studio_id: "mac-studio", title: "Sou Angolano e Conheço Angola", description: "Quiz interativo sobre cultura, geografia e história de Angola.", genre: "Quiz / Educativo", status: "Lançado", platforms: ["Android"], links: [{ label: "Google Play", url: "#" }] },
  { id: "safe-driving", studio_id: "mac-studio", title: "Safe Driving", description: "Simulador de condução segura promovendo educação no trânsito.", genre: "Simulação / Educativo", status: "Lançado", platforms: ["Android"], links: [{ label: "Google Play", url: "#" }] },
  { id: "zungueira-run", studio_id: "ad-games-angola", title: "Zungueira Run", description: "Endless Runner 3D pelas ruas de Luanda com a zungueira como protagonista.", genre: "Endless Runner", status: "Lançado", platforms: ["Android"], links: [{ label: "Google Play", url: "#" }] },
  { id: "slash-boom", studio_id: "ad-games-angola", title: "Slash Boom", description: "Corte de frutas tropicais angolanas ao estilo arcade.", genre: "Arcade", status: "Lançado", platforms: ["Android"], links: [{ label: "Google Play", url: "#" }] },
  { id: "palanquinha", studio_id: "ad-games-angola", title: "Palanquinha O Jogo", description: "Runner com a mascote Palanquinha pelas ruas de Luanda.", genre: "Runner", status: "Lançado", platforms: ["Android"], links: [{ label: "Google Play", url: "#" }] },
  { id: "invasao-24-outubro", studio_id: "ad-games-angola", title: "Invasão 24 de Outubro", description: "Shoot'em up espacial com temática patriótica angolana.", genre: "Shoot'em Up", status: "Lançado", platforms: ["Android"], links: [{ label: "Google Play", url: "#" }] },
  { id: "burrinho", studio_id: "ad-games-angola", title: "Burrinho", description: "Jogo clássico de palavras com temática angolana.", genre: "Palavras", status: "Lançado", platforms: ["Android"], links: [{ label: "Google Play", url: "#" }] },
  { id: "missao-resgate", studio_id: "izizi-studios", title: "Missão Resgate", description: "Plataforma 2D em Pixel Art cheia de ação e aventura.", genre: "Plataforma 2D", status: "Lançado", platforms: ["PC", "Android"], links: [{ label: "itch.io", url: "#" }] },
  { id: "bitter-belief", studio_id: "luk3d", title: "Bitter Belief", description: "Metroidvania com ambientação sombria e narrativa profunda na Steam.", genre: "Metroidvania", status: "Lançado", platforms: ["PC"], links: [{ label: "Steam", url: "#" }] },
  { id: "mbora-acertar", studio_id: "bantu-games", title: "Mbora Acertar", description: "Quiz de cultura geral com perguntas sobre Angola, África e o mundo.", genre: "Quiz", status: "Lançado", platforms: ["Android"], links: [{ label: "Google Play", url: "#" }] },
  { id: "projeto-s36", studio_id: "kiala-games", title: "Projeto S3.6", description: "FPS com elementos de ficção científica.", genre: "FPS / Sci-Fi", status: "Em Desenvolvimento", platforms: ["PC"] },
  { id: "autospeed", studio_id: "hydra-games", title: "AutoSpeed", description: "Corrida de alta velocidade em paisagens angolanas.", genre: "Corrida", status: "Em Desenvolvimento", platforms: ["PC", "Android"] },
  { id: "tleva", studio_id: "robot-games", title: "T'Leva", description: "Gestão e corrida baseado no serviço de transporte angolano.", genre: "Simulação", status: "Lançado", platforms: ["Android"], links: [{ label: "Google Play", url: "#" }] },
  { id: "onde-esta-katutu", studio_id: "robot-games", title: "Onde Está o Katutu?", description: "Busca e descoberta em cenários angolanos.", genre: "Casual / Puzzle", status: "Lançado", platforms: ["Android"], links: [{ label: "Google Play", url: "#" }] },
  { id: "oceano-cibernetico", studio_id: "cgstuff-studio", title: "Oceano Cibernético", description: "Aventura subaquática futurista de exploração sci-fi.", genre: "Aventura / Sci-Fi", status: "Em Desenvolvimento", platforms: ["PC"] },
  { id: "cronicas-nzinga", studio_id: "bantu-games", title: "Crônicas de Nzinga", description: "Ação e aventura inspirada na história da Rainha Nzinga.", genre: "Ação / Aventura", status: "Em Desenvolvimento", platforms: ["PC"] },
];

// Deterministic per-studio password (only used on first creation).
function passwordFor(id: string) {
  const map: Record<string, string> = {
    "mac-studio": "MacStudio#2024",
    "ad-games-angola": "ADGames#2024",
    "kiala-games": "KialaGames#2024",
    "hydra-games": "HydraGames#2024",
    "robot-games": "RobotGames#2024",
    "izizi-studios": "IziziStudios#2024",
    "cgstuff-studio": "CgStuff#2024",
    "luk3d": "Luk3D#2024Studio",
    "bantu-games": "BantuGames#2024",
  };
  return map[id] ?? `${id}#CGDA2024`;
}
function emailFor(id: string) {
  return `${id}@cgda.ao`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(url, serviceKey);

    // List existing users (paginated) to find ones already created.
    const existingByEmail = new Map<string, string>(); // email -> user_id
    let page = 1;
    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      for (const u of data.users) if (u.email) existingByEmail.set(u.email, u.id);
      if (data.users.length < 200) break;
      page += 1;
    }

    const credentials: { studio: string; email: string; password: string; created: boolean }[] = [];

    for (const s of studios) {
      const email = emailFor(s.id);
      const password = passwordFor(s.id);
      let userId = existingByEmail.get(email);
      let created = false;
      if (!userId) {
        const { data: cu, error: ce } = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { studio_id: s.id, studio_name: s.name },
        });
        if (ce) throw ce;
        userId = cu.user!.id;
        created = true;
      }

      // Upsert role
      await admin.from("user_roles").upsert(
        { user_id: userId, role: "studio_owner" },
        { onConflict: "user_id,role" },
      );

      // Upsert studio (preserve existing edits if row already exists – only set owner_id if missing)
      const { data: existingStudio } = await admin
        .from("studios").select("id,owner_id").eq("id", s.id).maybeSingle();

      if (!existingStudio) {
        await admin.from("studios").insert({
          id: s.id, name: s.name, tagline: s.tagline, description: s.description,
          location: s.location, founded_year: s.founded_year ?? null,
          website: s.website ?? null, owner_id: userId,
        });
      } else if (!existingStudio.owner_id) {
        await admin.from("studios").update({ owner_id: userId }).eq("id", s.id);
      }

      credentials.push({ studio: s.name, email, password, created });
    }

    // Seed games (only if not already present, so studio edits aren't overwritten)
    for (const g of games) {
      const { data: ex } = await admin.from("games").select("id").eq("id", g.id).maybeSingle();
      if (!ex) {
        await admin.from("games").insert({
          id: g.id, studio_id: g.studio_id, title: g.title, description: g.description,
          genre: g.genre, status: g.status, platforms: g.platforms,
          links: g.links ?? [],
        });
      }
    }

    return new Response(JSON.stringify({ ok: true, credentials }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
