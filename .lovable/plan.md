## Correções CGDA — 13/07/2026

Aplicar os 7 pontos do PDF. Divido por área para ficar fácil de rever.

### 1. Backup / rollback
Cada versão do código já fica no histórico do Lovable — dá para reverter a qualquer ponto pela linha do tempo do editor. Não é preciso alterar nada; só confirmar antes de publicar.

### 2. Tema claro por padrão + botão de alternar
- Adicionar um `ThemeProvider` (contexto) que guarda `light | dark` em `localStorage` e aplica a classe `dark` no `<html>`.
- Padrão inicial: `light`.
- Botão sol/lua no header (desktop e mobile), ao lado do "Entrar".
- Reescrever `src/index.css`: acrescentar bloco `:root` (tema claro) com paleta clara equivalente e manter `.dark` com a paleta actual ultra-dark. Todos os tokens semânticos (`--background`, `--foreground`, `--surface`, `--border`, `--primary`, `--ember`, gradientes, sombras) ganham valor para cada tema.
- Passar a limpo qualquer classe hardcoded (`text-white`, `bg-black`) que apareça em componentes chave e substituir por tokens.

### 3. Logo adaptável (versão em linhas)
- Criar `src/components/BrandLogo.tsx`: SVG monocromático em linhas derivado do logo actual, usando `stroke="currentColor"` — fica branco no escuro, preto no claro.
- Header e Footer passam a usar `<BrandLogo />` em vez de `/logo-cgda.png`.
- Corrigir alinhamento do bloco direito do header (Entrar + Explorar): unificar altura (`h-10`), remover `py` divergente, alinhar verticalmente com o logo (`items-center` no container já existe — o botão `clip-tab` tem padding diferente, vamos igualar).

### 4. Fundo do herói
- Remover a imagem/gradiente actual do `HeroSection` e trocar por cor sólida do tema (`bg-background` com uma faixa subtil `bg-surface`), preservando o texto. Fica pronto para receber ilustrações depois — deixo um comentário no ficheiro a indicar o ponto de troca.

### 5. Remover "IA look" do herói
- Apagar a chip "● COMUNIDADE · DESDE 2021" do `HeroSection`.
- Manter apenas no `Footer` (já existe lá).

### 6. Editabilidade das estatísticas + Parceiros
Cálculo automático + painel admin para o resto.

**Base de dados (migração única):**
- `site_stats` (key/value): membros (número editável), rótulo de jogos ("13+"), rótulo de estúdios opcional. Estúdios e jogos passam a ser contados via `count()` das tabelas existentes.
- `partners` (nome, logo_url, website, descrição, ordem).
- `site_settings` opcional para textos globais (título do herói, subtítulo) — deixo preparado mas só ligo membros/parceiros agora para não inchar.
- Leitura pública (`GRANT SELECT ... TO anon`); escrita só para `admin` via `has_role`.

**Painel admin:**
- Nova rota `/admin` (protegida por `has_role(auth.uid(), 'admin')`) com:
  - edição do número de membros e rótulos globais,
  - CRUD de parceiros (nome, logo upload para `studio-assets/partners/`, website, ordem),
  - lista dos estúdios para gestão rápida (opcional, reaproveita o dashboard).
- Item "Admin" no header só aparece se o utilizador tiver o papel `admin`.
- **Nota:** para atribuir o papel `admin` à sua conta, precisa dizer-me qual é o email — insiro directamente via migração ou dá para o fazer numa acção admin depois. Por agora vou preparar a migração pronta a receber esse email.

**Componente `StatsBar`:**
- Passa a ler `site_stats.members`, `count(studios)`, `count(games)` — reflectindo automaticamente novos estúdios/jogos criados no dashboard.

### 7. Nova secção "Parceiros"
- Novo componente `PartnersSection.tsx` inserido em `Index.tsx` entre `EventsSection` e `Footer`.
- Grelha simples com logos (grayscale por defeito, cor no hover), nome e link para o site do parceiro.
- Lê da tabela `partners` (semear com AIGH e Centro de Talento na migração).
- Link "Parceiros" adicionado ao menu do header (âncora `/#parceiros`).

### Detalhes técnicos
- Migração SQL: cria `site_stats`, `partners`; GRANTs; RLS (leitura pública, escrita `admin`); trigger `touch_updated_at`; seeds iniciais (`members=120`, AIGH, Centro de Talento com placeholders de logo até você enviar).
- `src/lib/catalog.ts`: hooks `useSiteStats()`, `usePartners()`, `useCounts()` (studios/games).
- `src/lib/theme.tsx`: contexto novo; envolve `<App />` em `main.tsx`.
- Todos os `toast`/mensagens novos passam por `translateError`.

### Ordem de execução
1. Migração (site_stats + partners + seeds) — precisa aprovação.
2. `ThemeProvider`, `BrandLogo`, ajustes de `index.css`.
3. Refactor `HeroSection` (remover badge, fundo sólido, StatsBar dinâmico).
4. `PartnersSection` + item no menu.
5. Rota `/admin` + guarda de rota.
6. Alinhamento dos botões do header e swap do logo.

### O que ainda preciso de si
- **Email da sua conta** para eu atribuir papel `admin` na migração (ou confirma se prefere que crie uma conta admin separada).
- **Logos oficiais** da AIGH e Centro de Talento (opcional — coloco placeholders e você edita depois no painel).
