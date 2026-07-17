import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Loader2, Upload, Plus, Trash2, Save, LogOut, KeyRound, Mail, Gamepad2, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { uploadStudioAsset, studioCover, gameCover, type GameRow, type StudioRow } from "@/lib/catalog";
import { toast } from "sonner";
import { translateError } from "@/lib/i18n-errors";

export default function DashboardPage() {
  const { user, studioId, loading, signOut } = useAuth();

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!studioId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container pt-32 pb-24 text-center">
          <h1 className="font-display text-3xl uppercase">Sem estúdio associado</h1>
          <p className="mt-3 text-muted-foreground">Esta conta não está ligada a nenhum estúdio.</p>
          <button onClick={signOut} className="mt-6 border border-border px-4 py-2 text-sm">Sair</button>
        </div>
        <Footer />
      </div>
    );
  }

  return <DashboardInner studioId={studioId} email={user.email ?? ""} />;
}

function DashboardInner({ studioId, email }: { studioId: string; email: string }) {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<"profile" | "games" | "account">("profile");
  const [studio, setStudio] = useState<StudioRow | null>(null);
  const [games, setGames] = useState<GameRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    const [{ data: s }, { data: g }] = await Promise.all([
      supabase.from("studios").select("*").eq("id", studioId).maybeSingle(),
      supabase.from("games").select("*").eq("studio_id", studioId).order("sort_order").order("title"),
    ]);
    setStudio(s as StudioRow | null);
    setGames((g as unknown as GameRow[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { reload(); }, [studioId]);

  if (loading || !studio) return <FullPageLoader />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-24">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="font-display text-xs uppercase tracking-[0.3em] text-primary">Painel</span>
              <h1 className="mt-1 font-display text-4xl uppercase tracking-wide md:text-5xl">{studio.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{email}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/estudio/${studio.id}`} className="border border-border bg-surface px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-primary hover:text-primary">
                Ver perfil público
              </Link>
              <button onClick={signOut} className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-primary hover:text-primary">
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-1">
            {[
              { k: "profile", l: "Perfil do Estúdio" },
              { k: "games", l: "Jogos" },
              { k: "account", l: "Conta" },
            ].map((t) => (
              <button key={t.k} onClick={() => setTab(t.k as typeof tab)}
                className={`px-4 py-2 font-display text-xs uppercase tracking-[0.22em] transition-colors ${
                  tab === t.k ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}>{t.l}</button>
            ))}
          </div>

          <div className="mt-8">
            {tab === "profile" && <ProfileTab studio={studio} onSaved={reload} />}
            {tab === "games" && <GamesTab studioId={studioId} games={games} onChange={reload} />}
            {tab === "account" && <AccountTab currentEmail={email} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- Profile tab ---------------- */
function ProfileTab({ studio, onSaved }: { studio: StudioRow; onSaved: () => void }) {
  const [form, setForm] = useState(studio);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("studios").update({
      name: form.name, tagline: form.tagline, description: form.description,
      location: form.location, founded_year: form.founded_year, website: form.website,
      logo_url: form.logo_url,
    }).eq("id", studio.id);
    setSaving(false);
    if (error) { toast.error("Erro ao salvar: " + translateError(error)); return; }
    toast.success("Perfil atualizado.");
    onSaved();
  }

  async function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    try {
      const url = await uploadStudioAsset(studio.id, f, "logo");
      setForm((s) => ({ ...s, logo_url: url }));
      toast.success("Imagem enviada. Lembre-se de salvar.");
    } catch (err: any) { toast.error("Falha no upload: " + translateError(err)); }
    finally { setUploading(false); }
  }

  return (
    <form onSubmit={save} className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="space-y-3">
        <div className="aspect-square overflow-hidden border border-border bg-surface">
          <img src={studioCover({ id: studio.id, logo_url: form.logo_url })} alt="" className="h-full w-full object-cover" />
        </div>
        <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 border border-border bg-surface px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-primary hover:text-primary">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Trocar imagem
          <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
        </label>
      </div>

      <div className="space-y-4">
        <Field label="Nome">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} required />
        </Field>
        <Field label="Tagline">
          <input value={form.tagline ?? ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Descrição">
          <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
        </Field>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Localização">
            <input value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Fundado em">
            <input type="number" value={form.founded_year ?? ""} onChange={(e) => setForm({ ...form, founded_year: e.target.value ? Number(e.target.value) : null })} className={inputCls} />
          </Field>
          <Field label="Website">
            <input value={form.website ?? ""} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputCls} placeholder="https://..." />
          </Field>
        </div>
        <button disabled={saving} className="inline-flex items-center gap-2 bg-ember px-5 py-2.5 font-display text-sm uppercase tracking-[0.22em] text-white shadow-ember disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
        </button>
      </div>
    </form>
  );
}

/* ---------------- Games tab ---------------- */
function GamesTab({ studioId, games, onChange }: { studioId: string; games: GameRow[]; onChange: () => void }) {
  const [editing, setEditing] = useState<GameRow | null>(null);
  const [creating, setCreating] = useState(false);

  async function remove(id: string) {
    if (!confirm("Apagar este jogo?")) return;
    const { error } = await supabase.from("games").delete().eq("id", id);
    if (error) { toast.error(translateError(error)); return; }
    toast.success("Jogo apagado.");
    onChange();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl uppercase tracking-wide">Jogos ({games.length})</h2>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 bg-ember px-4 py-2 font-display text-xs uppercase tracking-[0.22em] text-white shadow-ember">
          <Plus className="h-4 w-4" /> Novo jogo
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {games.map((g) => (
          <div key={g.id} className="flex gap-3 border border-border bg-surface p-3">
            <img src={gameCover(g)} alt="" className="h-24 w-24 shrink-0 object-cover" />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="truncate font-display text-base uppercase">{g.title}</h3>
                <span className={`shrink-0 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] ${g.status === "Lançado" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>{g.status}</span>
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">{g.description}</p>
              <div className="mt-auto flex gap-2 pt-2">
                <button onClick={() => setEditing(g)} className="border border-border px-3 py-1 text-[10px] uppercase tracking-[0.18em] hover:border-primary hover:text-primary">Editar</button>
                <button onClick={() => remove(g.id)} className="inline-flex items-center gap-1 border border-border px-3 py-1 text-[10px] uppercase tracking-[0.18em] hover:border-primary hover:text-primary">
                  <Trash2 className="h-3 w-3" /> Remover
                </button>
              </div>
            </div>
          </div>
        ))}
        {games.length === 0 && <p className="text-sm text-muted-foreground">Ainda sem jogos. Adicione o primeiro!</p>}
      </div>

      {(editing || creating) && (
        <GameEditor
          studioId={studioId}
          game={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); onChange(); }}
        />
      )}
    </div>
  );
}

function GameEditor({ studioId, game, onClose, onSaved }: { studioId: string; game: GameRow | null; onClose: () => void; onSaved: () => void }) {
  const blank: GameRow = {
    id: "", studio_id: studioId, title: "", description: "", genre: "", status: "Lançado",
    platforms: [], cover_url: null, trailer_url: null, screenshots: [], links: [], sort_order: 0,
  };
  const [form, setForm] = useState<GameRow>(game ?? blank);
  const [platformsText, setPlatformsText] = useState((game?.platforms ?? []).join(", "));
  const [linksText, setLinksText] = useState(
    (game?.links ?? []).map((l) => `${l.label}|${l.url}`).join("\n")
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingTrailer, setUploadingTrailer] = useState(false);
  const [uploadingShot, setUploadingShot] = useState(false);

  async function onCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    try {
      const id = form.id || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60) || crypto.randomUUID();
      const url = await uploadStudioAsset(studioId, f, "game", id);
      setForm((s) => ({ ...s, cover_url: url }));
      toast.success("Imagem enviada.");
    } catch (err: any) { toast.error("Falha: " + translateError(err)); }
    finally { setUploading(false); }
  }

  async function onTrailer(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 200 * 1024 * 1024) { toast.error("Vídeo demasiado grande (máx 200MB)."); return; }
    setUploadingTrailer(true);
    try {
      const id = form.id || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60) || crypto.randomUUID();
      const url = await uploadStudioAsset(studioId, f, "trailer", id);
      setForm((s) => ({ ...s, trailer_url: url }));
      toast.success("Trailer enviado. Lembre-se de salvar.");
    } catch (err: any) { toast.error("Falha: " + translateError(err)); }
    finally { setUploadingTrailer(false); }
  }

  async function onScreenshots(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []); if (!files.length) return;
    setUploadingShot(true);
    try {
      const id = form.id || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60) || crypto.randomUUID();
      const urls: string[] = [];
      for (const f of files) urls.push(await uploadStudioAsset(studioId, f, "screenshot", id));
      setForm((s) => ({ ...s, screenshots: [...(s.screenshots ?? []), ...urls] }));
      toast.success(`${urls.length} imagem(ns) adicionada(s).`);
    } catch (err: any) { toast.error("Falha: " + translateError(err)); }
    finally { setUploadingShot(false); e.target.value = ""; }
  }

  function removeScreenshot(url: string) {
    setForm((s) => ({ ...s, screenshots: (s.screenshots ?? []).filter((u) => u !== url) }));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const platforms = platformsText.split(",").map((s) => s.trim()).filter(Boolean);
    const links = linksText.split("\n").map((l) => {
      const [label, url] = l.split("|").map((s) => s?.trim());
      return label && url ? { label, url } : null;
    }).filter(Boolean) as { label: string; url: string }[];

    const payload = {
      title: form.title, description: form.description, genre: form.genre,
      status: form.status, platforms, cover_url: form.cover_url,
      trailer_url: form.trailer_url, screenshots: form.screenshots ?? [],
      links: links as any,
    };
    let error;
    if (game) {
      ({ error } = await (supabase.from("games") as any).update(payload).eq("id", game.id));
    } else {
      const id = (form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60) || crypto.randomUUID());
      ({ error } = await (supabase.from("games") as any).insert({ id, studio_id: studioId, ...payload }));
    }
    setSaving(false);
    if (error) { toast.error(translateError(error)); return; }
    toast.success(game ? "Jogo atualizado." : "Jogo criado.");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm">
      <form onSubmit={save} className="my-10 w-full max-w-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-display text-xl uppercase">{game ? "Editar jogo" : "Novo jogo"}</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-primary">✕</button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[200px_1fr]">
          <div className="space-y-2">
            <div className="aspect-[4/5] overflow-hidden border border-border bg-background">
              {form.cover_url || gameCover(form) ? (
                <img src={gameCover(form)} alt="" className="h-full w-full object-cover" />
              ) : <div className="grid h-full place-items-center text-muted-foreground"><Gamepad2 className="h-10 w-10" /></div>}
            </div>
            <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 border border-border px-3 py-2 text-[10px] uppercase tracking-[0.22em] hover:border-primary hover:text-primary">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Capa
              <input type="file" accept="image/*" className="hidden" onChange={onCover} />
            </label>
          </div>

          <div className="space-y-3">
            <Field label="Título"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} /></Field>
            <Field label="Descrição"><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} /></Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Género"><input value={form.genre ?? ""} onChange={(e) => setForm({ ...form, genre: e.target.value })} className={inputCls} /></Field>
              <Field label="Status">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                  <option>Lançado</option><option>Em Desenvolvimento</option>
                </select>
              </Field>
            </div>
            <Field label="Plataformas (separe por vírgula)">
              <input value={platformsText} onChange={(e) => setPlatformsText(e.target.value)} className={inputCls} placeholder="Android, PC, Steam" />
            </Field>
            <Field label="Links (uma por linha, formato: Rótulo|URL)">
              <textarea rows={3} value={linksText} onChange={(e) => setLinksText(e.target.value)} className={inputCls} placeholder="Google Play|https://play.google.com/..." />
            </Field>
          </div>
        </div>

        {/* Trailer & screenshots */}
        <div className="mt-6 grid gap-5 border-t border-border pt-5 md:grid-cols-2">
          <div>
            <div className="font-display text-xs uppercase tracking-[0.22em] text-primary">Trailer</div>
            <p className="mt-1 text-[11px] text-muted-foreground">MP4/WebM até 200MB. Ou cole um URL directo.</p>
            {form.trailer_url && (
              <video src={form.trailer_url} controls className="mt-3 aspect-video w-full border border-border bg-black" />
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-3 py-2 text-[10px] uppercase tracking-[0.22em] hover:border-primary hover:text-primary">
                {uploadingTrailer ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {form.trailer_url ? "Trocar trailer" : "Enviar trailer"}
                <input type="file" accept="video/*" className="hidden" onChange={onTrailer} />
              </label>
              {form.trailer_url && (
                <button type="button" onClick={() => setForm({ ...form, trailer_url: null })}
                  className="inline-flex items-center gap-1 border border-border px-3 py-2 text-[10px] uppercase tracking-[0.22em] hover:border-primary hover:text-primary">
                  <Trash2 className="h-3 w-3" /> Remover
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="font-display text-xs uppercase tracking-[0.22em] text-primary">Capturas de jogabilidade</div>
            <p className="mt-1 text-[11px] text-muted-foreground">Adicione várias imagens da gameplay.</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(form.screenshots ?? []).map((url) => (
                <div key={url} className="group relative aspect-video overflow-hidden border border-border bg-background">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeScreenshot(url)}
                    aria-label="Remover"
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center bg-background/80 opacity-0 transition-opacity hover:text-primary group-hover:opacity-100">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="grid aspect-video cursor-pointer place-items-center border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary">
                {uploadingShot ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                <input type="file" accept="image/*" multiple className="hidden" onChange={onScreenshots} />
              </label>
            </div>
          </div>
        </div>


        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="border border-border px-4 py-2 text-xs uppercase tracking-[0.22em]">Cancelar</button>
          <button disabled={saving} className="inline-flex items-center gap-2 bg-ember px-5 py-2 font-display text-xs uppercase tracking-[0.22em] text-white shadow-ember disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Account tab ---------------- */
function AccountTab({ currentEmail }: { currentEmail: string }) {
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busyE, setBusyE] = useState(false);
  const [busyP, setBusyP] = useState(false);

  async function updateEmail(e: FormEvent) {
    e.preventDefault();
    if (email === currentEmail) return;
    setBusyE(true);
    const { error } = await supabase.auth.updateUser({ email });
    setBusyE(false);
    if (error) { toast.error(translateError(error)); return; }
    toast.success("Email atualizado. Verifique a caixa de entrada para confirmar.");
  }
  async function updatePassword(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) { toast.error("Mínimo 8 caracteres."); return; }
    if (password !== confirm) { toast.error("As senhas não coincidem."); return; }
    setBusyP(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusyP(false);
    if (error) { toast.error(translateError(error)); return; }
    setPassword(""); setConfirm("");
    toast.success("Senha atualizada.");
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={updateEmail} className="border border-border bg-surface p-6">
        <div className="flex items-center gap-2 text-primary"><Mail className="h-4 w-4" /><span className="font-display text-xs uppercase tracking-[0.22em]">Alterar email</span></div>
        <Field label="Novo email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} mt-1`} required /></Field>
        <button disabled={busyE} className="mt-4 inline-flex items-center gap-2 bg-ember px-4 py-2 font-display text-xs uppercase tracking-[0.22em] text-white shadow-ember disabled:opacity-60">
          {busyE ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Atualizar email
        </button>
      </form>

      <form onSubmit={updatePassword} className="border border-border bg-surface p-6">
        <div className="flex items-center gap-2 text-primary"><KeyRound className="h-4 w-4" /><span className="font-display text-xs uppercase tracking-[0.22em]">Alterar senha</span></div>
        <Field label="Nova senha"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} mt-1`} required minLength={8} /></Field>
        <Field label="Confirmar senha"><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`${inputCls} mt-1`} required minLength={8} /></Field>
        <button disabled={busyP} className="mt-4 inline-flex items-center gap-2 bg-ember px-4 py-2 font-display text-xs uppercase tracking-[0.22em] text-white shadow-ember disabled:opacity-60">
          {busyP ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Atualizar senha
        </button>
      </form>
    </div>
  );
}

/* ---------------- helpers ---------------- */
const inputCls = "w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
function FullPageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
