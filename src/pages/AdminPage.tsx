import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { translateError } from "@/lib/i18n-errors";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useGames, useNews, useHeroSlides, type HeroSlideRow, type NewsRow, type HeroSlideType } from "@/lib/catalog";
import { Trash2, Plus, Save, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  description: string;
  website: string | null;
  logo_url: string | null;
  sort_order: number;
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [membersCount, setMembersCount] = useState("");
  const [gamesLabel, setGamesLabel] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [saving, setSaving] = useState(false);

  // Hero + news
  const { slides, loading: slidesLoading } = useHeroSlides(false);
  const [heroSlides, setHeroSlides] = useState<HeroSlideRow[]>([]);
  const { news, loading: newsLoading } = useNews();
  const [newsList, setNewsList] = useState<NewsRow[]>([]);
  const { games } = useGames();

  useEffect(() => { if (!slidesLoading) setHeroSlides(slides); }, [slidesLoading, slides]);
  useEffect(() => { if (!newsLoading) setNewsList(news); }, [newsLoading, news]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const { data: stats } = await (supabase as any).from("site_stats").select("*");
      if (stats) {
        setMembersCount(stats.find((s: any) => s.key === "members_count")?.value ?? "");
        setGamesLabel(stats.find((s: any) => s.key === "games_label")?.value ?? "");
      }
      const { data: p } = await (supabase as any).from("partners").select("*").order("sort_order");
      setPartners((p as Partner[]) ?? []);
    })();
  }, [isAdmin]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container pt-32">
          <h1 className="font-display text-4xl uppercase">Acesso restrito</h1>
          <p className="mt-2 text-muted-foreground">Esta área é apenas para administradores.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-primary"><ArrowLeft className="h-4 w-4" /> Voltar ao início</Link>
        </main>
        <Footer />
      </div>
    );
  }

  async function saveStats() {
    setSaving(true);
    try {
      const rows = [
        { key: "members_count", value: membersCount },
        { key: "games_label", value: gamesLabel },
      ];
      const { error } = await (supabase as any).from("site_stats").upsert(rows, { onConflict: "key" });
      if (error) throw error;
      toast.success("Estatísticas atualizadas");
    } catch (e) {
      toast.error(translateError(e));
    } finally {
      setSaving(false);
    }
  }

  async function addPartner() {
    const { data, error } = await (supabase as any).from("partners").insert({
      name: "Novo parceiro", description: "", sort_order: partners.length + 1,
    }).select().single();
    if (error) return toast.error(translateError(error));
    setPartners([...partners, data as Partner]);
  }
  async function savePartner(p: Partner) {
    const { error } = await (supabase as any).from("partners").update({
      name: p.name, description: p.description, website: p.website, logo_url: p.logo_url, sort_order: p.sort_order,
    }).eq("id", p.id);
    if (error) return toast.error(translateError(error));
    toast.success("Parceiro guardado");
  }
  async function removePartner(id: string) {
    if (!confirm("Remover este parceiro?")) return;
    const { error } = await (supabase as any).from("partners").delete().eq("id", id);
    if (error) return toast.error(translateError(error));
    setPartners((ps) => ps.filter((p) => p.id !== id));
  }

  // ===== Hero slides =====
  async function addSlide(type: HeroSlideType) {
    const { data, error } = await (supabase as any).from("hero_slides").insert({
      type, sort_order: heroSlides.length + 1, active: true,
    }).select().single();
    if (error) return toast.error(translateError(error));
    setHeroSlides([...heroSlides, data as HeroSlideRow]);
  }
  async function saveSlide(s: HeroSlideRow) {
    const { error } = await (supabase as any).from("hero_slides").update({
      type: s.type, game_id: s.game_id, news_id: s.news_id, title: s.title, subtitle: s.subtitle,
      image_url: s.image_url, link_url: s.link_url, sort_order: s.sort_order, active: s.active,
    }).eq("id", s.id);
    if (error) return toast.error(translateError(error));
    toast.success("Slide guardado");
  }
  async function removeSlide(id: string) {
    if (!confirm("Remover este slide?")) return;
    const { error } = await (supabase as any).from("hero_slides").delete().eq("id", id);
    if (error) return toast.error(translateError(error));
    setHeroSlides((ss) => ss.filter((s) => s.id !== id));
  }
  function patchSlide(id: string, patch: Partial<HeroSlideRow>) {
    setHeroSlides((ss) => ss.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  // ===== News =====
  async function addNews() {
    const { data, error } = await (supabase as any).from("news").insert({
      title: "Nova notícia", content: "", published: true,
    }).select().single();
    if (error) return toast.error(translateError(error));
    setNewsList([data as NewsRow, ...newsList]);
  }
  async function saveNews(n: NewsRow) {
    const { error } = await (supabase as any).from("news").update({
      title: n.title, cover_url: n.cover_url, content: n.content, published: n.published,
    }).eq("id", n.id);
    if (error) return toast.error(translateError(error));
    toast.success("Notícia guardada");
  }
  async function removeNews(id: string) {
    if (!confirm("Remover esta notícia?")) return;
    const { error } = await (supabase as any).from("news").delete().eq("id", id);
    if (error) return toast.error(translateError(error));
    setNewsList((ns) => ns.filter((n) => n.id !== id));
  }
  function patchNews(id: string, patch: Partial<NewsRow>) {
    setNewsList((ns) => ns.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl pt-28 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary">Painel</div>
            <h1 className="mt-2 font-display text-5xl uppercase">Administração</h1>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Voltar ao site</Link>
        </div>

        {/* Hero slides */}
        <section className="border border-border bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl uppercase">Hero — carrossel</h2>
              <p className="mt-1 text-sm text-muted-foreground">Jogos em destaque, notícias e publicidade rotativa (auto 5s).</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => addSlide("game")} className="inline-flex items-center gap-2 border border-border px-3 py-2 font-display text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary"><Plus className="h-4 w-4" /> Jogo</button>
              <button onClick={() => addSlide("news")} className="inline-flex items-center gap-2 border border-border px-3 py-2 font-display text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary"><Plus className="h-4 w-4" /> Notícia</button>
              <button onClick={() => addSlide("ad")} className="inline-flex items-center gap-2 border border-border px-3 py-2 font-display text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary"><Plus className="h-4 w-4" /> Publicidade</button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {heroSlides.sort((a, b) => a.sort_order - b.sort_order).map((s) => (
              <div key={s.id} className="border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 border border-border px-2 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-primary">
                    {s.type === "game" ? "Jogo" : s.type === "news" ? "Notícia" : "Publicidade"}
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      Ordem
                      <input type="number" value={s.sort_order} onChange={(e) => patchSlide(s.id, { sort_order: Number(e.target.value) })}
                        className="w-16 border border-border bg-surface px-2 py-1 text-foreground" />
                    </label>
                    <button onClick={() => patchSlide(s.id, { active: !s.active })} className="inline-flex items-center gap-1 border border-border px-2 py-1 text-xs">
                      {s.active ? <><Eye className="h-3 w-3" /> Activo</> : <><EyeOff className="h-3 w-3" /> Oculto</>}
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {s.type === "game" && (
                    <label className="flex flex-col gap-1 text-xs md:col-span-2">
                      <span className="uppercase tracking-[0.2em] text-muted-foreground">Jogo em destaque</span>
                      <select value={s.game_id ?? ""} onChange={(e) => patchSlide(s.id, { game_id: e.target.value || null })}
                        className="border border-border bg-surface px-3 py-2 text-sm text-foreground">
                        <option value="">— seleccionar —</option>
                        {games.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
                      </select>
                    </label>
                  )}
                  {s.type === "news" && (
                    <label className="flex flex-col gap-1 text-xs md:col-span-2">
                      <span className="uppercase tracking-[0.2em] text-muted-foreground">Notícia</span>
                      <select value={s.news_id ?? ""} onChange={(e) => patchSlide(s.id, { news_id: e.target.value || null })}
                        className="border border-border bg-surface px-3 py-2 text-sm text-foreground">
                        <option value="">— seleccionar —</option>
                        {newsList.map((n) => <option key={n.id} value={n.id}>{n.title}</option>)}
                      </select>
                    </label>
                  )}

                  <label className="flex flex-col gap-1 text-xs md:col-span-2">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">
                      {s.type === "ad" ? "URL da imagem (obrigatório)" : "Media (opcional — sobrepõe o conteúdo automático)"}
                    </span>
                    <input value={s.image_url ?? ""} onChange={(e) => patchSlide(s.id, { image_url: e.target.value })}
                      placeholder={s.type === "game" ? "Deixe vazio para usar o trailer/capa do jogo automaticamente" : "https://…/imagem.jpg  ou  https://…/trailer.mp4"}
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                  </label>

                  {s.type !== "ad" && (
                    <>
                      <label className="flex flex-col gap-1 text-xs">
                        <span className="uppercase tracking-[0.2em] text-muted-foreground">Título {s.type === "game" ? "(opcional — sobrepõe o título do jogo)" : "(opcional)"}</span>
                        <input value={s.title ?? ""} onChange={(e) => patchSlide(s.id, { title: e.target.value })}
                          className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                      </label>
                      <label className="flex flex-col gap-1 text-xs">
                        <span className="uppercase tracking-[0.2em] text-muted-foreground">Subtítulo {s.type === "game" ? "(opcional — sobrepõe o género do jogo)" : "(opcional)"}</span>
                        <input value={s.subtitle ?? ""} onChange={(e) => patchSlide(s.id, { subtitle: e.target.value })}
                          className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                      </label>
                    </>
                  )}

                  {s.type === "ad" && (
                    <label className="flex flex-col gap-1 text-xs md:col-span-2">
                      <span className="uppercase tracking-[0.2em] text-muted-foreground">Link externo (opcional)</span>
                      <input value={s.link_url ?? ""} onChange={(e) => patchSlide(s.id, { link_url: e.target.value })}
                        placeholder="https://patrocinador.com"
                        className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                    </label>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => saveSlide(s)} className="inline-flex items-center gap-2 bg-primary px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90">
                    <Save className="h-4 w-4" /> Guardar
                  </button>
                  <button onClick={() => removeSlide(s.id)} className="inline-flex items-center gap-2 border border-border px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground hover:border-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" /> Remover
                  </button>
                </div>
              </div>
            ))}
            {!heroSlides.length && <p className="text-sm text-muted-foreground">Ainda não há slides. Adicione o primeiro acima.</p>}
          </div>
        </section>

        {/* News */}
        <section className="mt-8 border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl uppercase">Notícias</h2>
              <p className="mt-1 text-sm text-muted-foreground">Publique matérias com página própria (`/noticia/:id`).</p>
            </div>
            <button onClick={addNews} className="inline-flex items-center gap-2 border border-border px-3 py-2 font-display text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary">
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {newsList.map((n) => (
              <div key={n.id} className="border border-border bg-background p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs md:col-span-2">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">Título</span>
                    <input value={n.title} onChange={(e) => patchNews(n.id, { title: e.target.value })}
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs md:col-span-2">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">URL da imagem de capa</span>
                    <input value={n.cover_url ?? ""} onChange={(e) => patchNews(n.id, { cover_url: e.target.value })}
                      placeholder="https://…/capa.jpg"
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs md:col-span-2">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">Conteúdo</span>
                    <textarea value={n.content} onChange={(e) => patchNews(n.id, { content: e.target.value })} rows={6}
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <input type="checkbox" checked={n.published} onChange={(e) => patchNews(n.id, { published: e.target.checked })} />
                    Publicada
                  </label>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => saveNews(n)} className="inline-flex items-center gap-2 bg-primary px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90">
                    <Save className="h-4 w-4" /> Guardar
                  </button>
                  <Link to={`/noticia/${n.id}`} className="inline-flex items-center gap-2 border border-border px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary">
                    Pré-visualizar
                  </Link>
                  <button onClick={() => removeNews(n.id)} className="inline-flex items-center gap-2 border border-border px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground hover:border-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" /> Remover
                  </button>
                </div>
              </div>
            ))}
            {!newsList.length && <p className="text-sm text-muted-foreground">Nenhuma notícia ainda.</p>}
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 border border-border bg-surface p-6">
          <h2 className="font-display text-2xl uppercase">Estatísticas do herói</h2>
          <p className="mt-1 text-sm text-muted-foreground">Estúdios e jogos são contados automaticamente.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Membros</span>
              <input type="text" value={membersCount} onChange={(e) => setMembersCount(e.target.value)} placeholder="120"
                className="border border-border bg-background px-3 py-2 text-foreground" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Rótulo de jogos</span>
              <input type="text" value={gamesLabel} onChange={(e) => setGamesLabel(e.target.value)} placeholder="13+"
                className="border border-border bg-background px-3 py-2 text-foreground" />
            </label>
          </div>
          <button onClick={saveStats} disabled={saving} className="mt-5 inline-flex items-center gap-2 bg-primary px-5 py-2 font-display text-sm uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90">
            <Save className="h-4 w-4" /> Guardar
          </button>
        </section>

        {/* Partners */}
        <section className="mt-8 border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl uppercase">Parceiros</h2>
            <button onClick={addPartner} className="inline-flex items-center gap-2 border border-border px-3 py-2 font-display text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary">
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {partners.map((p) => (
              <div key={p.id} className="border border-border bg-background p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">Nome</span>
                    <input value={p.name} onChange={(e) => setPartners(ps => ps.map(x => x.id === p.id ? { ...x, name: e.target.value } : x))}
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">Website</span>
                    <input value={p.website ?? ""} onChange={(e) => setPartners(ps => ps.map(x => x.id === p.id ? { ...x, website: e.target.value } : x))}
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs md:col-span-2">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">Descrição</span>
                    <textarea value={p.description} rows={2} onChange={(e) => setPartners(ps => ps.map(x => x.id === p.id ? { ...x, description: e.target.value } : x))}
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">URL do logo</span>
                    <input value={p.logo_url ?? ""} onChange={(e) => setPartners(ps => ps.map(x => x.id === p.id ? { ...x, logo_url: e.target.value } : x))}
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">Ordem</span>
                    <input type="number" value={p.sort_order} onChange={(e) => setPartners(ps => ps.map(x => x.id === p.id ? { ...x, sort_order: Number(e.target.value) } : x))}
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground" />
                  </label>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => savePartner(p)} className="inline-flex items-center gap-2 bg-primary px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90">
                    <Save className="h-4 w-4" /> Guardar
                  </button>
                  <button onClick={() => removePartner(p.id)} className="inline-flex items-center gap-2 border border-border px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground hover:border-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" /> Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
