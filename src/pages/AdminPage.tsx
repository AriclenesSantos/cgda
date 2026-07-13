import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { translateError } from "@/lib/i18n-errors";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trash2, Plus, Save, ArrowLeft } from "lucide-react";

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
      name: "Novo parceiro",
      description: "",
      sort_order: partners.length + 1,
    }).select().single();
    if (error) return toast.error(translateError(error));
    setPartners([...partners, data as Partner]);
  }

  async function updatePartner(id: string, patch: Partial<Partner>) {
    setPartners((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl pt-28 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-primary">Painel</div>
            <h1 className="mt-2 font-display text-5xl uppercase">Administração</h1>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Voltar ao site</Link>
        </div>

        <section className="border border-border bg-surface p-6">
          <h2 className="font-display text-2xl uppercase">Estatísticas do herói</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Estúdios e jogos são contados automaticamente. Aqui edita só os valores manuais.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Membros</span>
              <input
                type="text"
                value={membersCount}
                onChange={(e) => setMembersCount(e.target.value)}
                placeholder="120"
                className="border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Rótulo de jogos</span>
              <input
                type="text"
                value={gamesLabel}
                onChange={(e) => setGamesLabel(e.target.value)}
                placeholder="13+"
                className="border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>
          </div>
          <button
            onClick={saveStats}
            disabled={saving}
            className="mt-5 inline-flex items-center gap-2 bg-primary px-5 py-2 font-display text-sm uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90"
          >
            <Save className="h-4 w-4" /> Guardar
          </button>
        </section>

        <section className="mt-8 border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl uppercase">Parceiros</h2>
            <button
              onClick={addPartner}
              className="inline-flex items-center gap-2 border border-border px-3 py-2 font-display text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {partners.map((p) => (
              <div key={p.id} className="border border-border bg-background p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">Nome</span>
                    <input
                      value={p.name}
                      onChange={(e) => updatePartner(p.id, { name: e.target.value })}
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">Website</span>
                    <input
                      value={p.website ?? ""}
                      onChange={(e) => updatePartner(p.id, { website: e.target.value })}
                      placeholder="https://…"
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs md:col-span-2">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">Descrição</span>
                    <textarea
                      value={p.description}
                      onChange={(e) => updatePartner(p.id, { description: e.target.value })}
                      rows={2}
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">URL do logo</span>
                    <input
                      value={p.logo_url ?? ""}
                      onChange={(e) => updatePartner(p.id, { logo_url: e.target.value })}
                      placeholder="https://…"
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="uppercase tracking-[0.2em] text-muted-foreground">Ordem</span>
                    <input
                      type="number"
                      value={p.sort_order}
                      onChange={(e) => updatePartner(p.id, { sort_order: Number(e.target.value) })}
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground"
                    />
                  </label>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => savePartner(p)}
                    className="inline-flex items-center gap-2 bg-primary px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90"
                  >
                    <Save className="h-4 w-4" /> Guardar
                  </button>
                  <button
                    onClick={() => removePartner(p.id)}
                    className="inline-flex items-center gap-2 border border-border px-4 py-2 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground hover:border-destructive hover:text-destructive"
                  >
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
