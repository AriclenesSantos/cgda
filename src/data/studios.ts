export interface Game {
  id: string;
  name: string;
  description: string;
  genre: string;
  platform: string[];
  status: "Lançado" | "Em Desenvolvimento";
  links?: { label: string; url: string }[];
  studioId: string;
}

export interface Studio {
  id: string;
  name: string;
  description: string;
  foundedYear?: number;
  emoji: string;
}

export interface GameEvent {
  name: string;
  description: string;
  type: "nacional" | "internacional";
}

export const studios: Studio[] = [
  {
    id: "mac-studio",
    name: "Mac Studio",
    description: "Estúdio pioneiro no desenvolvimento de jogos educativos e culturais em Angola, com foco em criar experiências que valorizam a identidade angolana.",
    emoji: "🎮",
  },
  {
    id: "ad-games-angola",
    name: "AD Games Angola",
    description: "Estúdio focado em jogos mobile que retratam o cotidiano e a cultura angolana, com títulos populares como Zungueira Run e Slash Boom.",
    emoji: "🕹️",
  },
  {
    id: "kiala-games",
    name: "Kiala Games",
    description: "Estúdio especializado em jogos de ação e tiro, desenvolvendo experiências imersivas para jogadores angolanos e internacionais.",
    emoji: "🎯",
  },
  {
    id: "hydra-games",
    name: "Hydra Games",
    description: "Estúdio de jogos de corrida e ação, criando experiências adrenalinantes com temática angolana.",
    emoji: "🏎️",
  },
  {
    id: "robot-games",
    name: "Robot Games",
    description: "Estúdio inovador que combina tecnologia e criatividade para desenvolver jogos únicos no mercado angolano.",
    emoji: "🤖",
  },
  {
    id: "izizi-studios",
    name: "IZIZI Studios",
    description: "Estúdio indie angolano com foco em jogos narrativos e de plataforma com arte pixel art.",
    emoji: "✨",
  },
  {
    id: "cgstuff-studio",
    name: "Cgstuff Studio",
    description: "Estúdio que combina CG art e game development para criar experiências visuais impressionantes.",
    emoji: "🎨",
  },
  {
    id: "luk3d",
    name: "Luk3D",
    description: "Desenvolvedor independente focado em jogos 3D e experiências interativas, com destaque para o Bitter Belief na Steam.",
    emoji: "💎",
  },
  {
    id: "bantu-games",
    name: "Bantu Games",
    description: "Estúdio que celebra a cultura Bantu através de jogos digitais envolventes e educativos.",
    emoji: "🌍",
  },
];

export const games: Game[] = [
  {
    id: "aventuras-da-glx",
    name: "Aventuras da GLX",
    description: "Jogo educativo onde aliens invadem Angola e o jogador deve proteger o país usando conhecimentos sobre a cultura e história angolana.",
    genre: "Educativo / Aventura",
    platform: ["Android"],
    status: "Lançado",
    links: [{ label: "Google Play", url: "#" }],
    studioId: "mac-studio",
  },
  {
    id: "sou-angolano",
    name: "Sou Angolano e Conheço Angola",
    description: "Quiz interativo sobre a cultura, geografia e história de Angola. Teste os seus conhecimentos sobre o país!",
    genre: "Quiz / Educativo",
    platform: ["Android"],
    status: "Lançado",
    links: [{ label: "Google Play", url: "#" }],
    studioId: "mac-studio",
  },
  {
    id: "zungueira-run",
    name: "Zungueira Run",
    description: "Endless Runner 3D onde a protagonista é uma zungueira que corre pelas ruas de Luanda, desviando de obstáculos e recolhendo itens.",
    genre: "Endless Runner",
    platform: ["Android"],
    status: "Lançado",
    links: [{ label: "Google Play", url: "#" }],
    studioId: "ad-games-angola",
  },
  {
    id: "slash-boom",
    name: "Slash Boom",
    description: "Jogo de corte de frutas tropicais angolanas ao estilo Fruit Ninja, com frutas como ginguba, manga e goiaba.",
    genre: "Arcade",
    platform: ["Android"],
    status: "Lançado",
    links: [{ label: "Google Play", url: "#" }],
    studioId: "ad-games-angola",
  },
  {
    id: "palanquinha",
    name: "Palanquinha O Jogo",
    description: "Runner pelas ruas de Luanda com a mascote Palanquinha, desviando de obstáculos e recolhendo moedas.",
    genre: "Runner",
    platform: ["Android"],
    status: "Lançado",
    links: [{ label: "Google Play", url: "#" }],
    studioId: "ad-games-angola",
  },
  {
    id: "invasao-24-outubro",
    name: "Invasão 24 de Outubro",
    description: "Jogo de tiro espacial inspirado nos clássicos arcades, com temática patriótica angolana.",
    genre: "Shoot'em Up",
    platform: ["Android"],
    status: "Lançado",
    links: [{ label: "Google Play", url: "#" }],
    studioId: "ad-games-angola",
  },
  {
    id: "burrinho",
    name: "Burrinho",
    description: "Jogo clássico de palavras onde o jogador adivinha letras para completar palavras em português, com temática angolana.",
    genre: "Palavras",
    platform: ["Android"],
    status: "Lançado",
    links: [{ label: "Google Play", url: "#" }],
    studioId: "ad-games-angola",
  },
  {
    id: "missao-resgate",
    name: "Missão Resgate",
    description: "Plataforma 2D em Pixel Art onde o jogador embarca numa missão de resgate cheia de ação e aventura.",
    genre: "Plataforma 2D",
    platform: ["PC", "Android"],
    status: "Lançado",
    links: [{ label: "itch.io", url: "#" }],
    studioId: "izizi-studios",
  },
  {
    id: "bitter-belief",
    name: "Bitter Belief",
    description: "Metroidvania com ambientação sombria e narrativa profunda. Um dos primeiros jogos angolanos lançados na Steam.",
    genre: "Metroidvania",
    platform: ["PC"],
    status: "Lançado",
    links: [{ label: "Steam", url: "#" }],
    studioId: "luk3d",
  },
  {
    id: "mbora-acertar",
    name: "Mbora Acertar",
    description: "Quiz de cultura geral com perguntas sobre Angola, África e o mundo. Desafie os seus amigos!",
    genre: "Quiz",
    platform: ["Android"],
    status: "Lançado",
    links: [{ label: "Google Play", url: "#" }],
    studioId: "bantu-games",
  },
  {
    id: "projeto-s36",
    name: "Projeto S3.6",
    description: "Jogo de tiro em primeira pessoa com elementos de ficção científica, desenvolvido pela Kiala Games.",
    genre: "FPS / Sci-Fi",
    platform: ["PC"],
    status: "Em Desenvolvimento",
    studioId: "kiala-games",
  },
  {
    id: "autospeed",
    name: "AutoSpeed",
    description: "Jogo de corrida de alta velocidade com pistas inspiradas em paisagens angolanas.",
    genre: "Corrida",
    platform: ["PC", "Android"],
    status: "Em Desenvolvimento",
    studioId: "hydra-games",
  },
  {
    id: "tleva",
    name: "T'Leva",
    description: "Jogo baseado no famoso serviço de transporte angolano, com mecânicas de gestão e corrida.",
    genre: "Simulação",
    platform: ["Android"],
    status: "Lançado",
    links: [{ label: "Google Play", url: "#" }],
    studioId: "robot-games",
  },
  {
    id: "onde-esta-katutu",
    name: "Onde Está o Katutu?",
    description: "Jogo de busca e descoberta onde o jogador procura o Katutu escondido em cenários angolanos.",
    genre: "Casual / Puzzle",
    platform: ["Android"],
    status: "Lançado",
    links: [{ label: "Google Play", url: "#" }],
    studioId: "robot-games",
  },
  {
    id: "oceano-cibernetico",
    name: "Oceano Cibernético",
    description: "Aventura subaquática em um oceano futurista com elementos de ficção científica e exploração.",
    genre: "Aventura / Sci-Fi",
    platform: ["PC"],
    status: "Em Desenvolvimento",
    studioId: "cgstuff-studio",
  },
  {
    id: "cronicas-nzinga",
    name: "Crônicas de Nzinga",
    description: "Jogo de ação e aventura inspirado na história da Rainha Nzinga, uma das figuras mais importantes da história de Angola.",
    genre: "Ação / Aventura",
    platform: ["PC"],
    status: "Em Desenvolvimento",
    studioId: "bantu-games",
  },
  {
    id: "safe-driving",
    name: "Safe Driving",
    description: "Simulador de condução segura com cenários das estradas angolanas, promovendo a educação no trânsito.",
    genre: "Simulação / Educativo",
    platform: ["Android"],
    status: "Lançado",
    links: [{ label: "Google Play", url: "#" }],
    studioId: "mac-studio",
  },
];

export const events: GameEvent[] = [
  {
    name: "Concurso Nacional de Jogos Digitais",
    description: "Competição anual que incentiva o desenvolvimento de jogos digitais em Angola.",
    type: "nacional",
  },
  {
    name: "AD Game JAM",
    description: "Game Jam organizada pela AD Games Angola para desenvolvedores angolanos.",
    type: "nacional",
  },
  {
    name: "Global Game Jam",
    description: "Maior Game Jam do mundo com participação de desenvolvedores angolanos.",
    type: "internacional",
  },
  {
    name: "UMA Game JAM",
    description: "Game Jam organizada pela Universidade Metodista de Angola.",
    type: "nacional",
  },
  {
    name: "Angola Game Show",
    description: "Maior evento de gaming em Angola, reunindo desenvolvedores, jogadores e entusiastas.",
    type: "nacional",
  },
];

export function getStudioById(id: string): Studio | undefined {
  return studios.find((s) => s.id === id);
}

export function getGamesByStudio(studioId: string): Game[] {
  return games.filter((g) => g.studioId === studioId);
}
