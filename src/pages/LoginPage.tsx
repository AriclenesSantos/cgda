import { FormEvent, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { translateError } from "@/lib/i18n-errors";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(translateError(error)); return; }
    navigate(loc.state?.from ?? "/dashboard", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-24">
        <div className="container max-w-md">
          <div className="border border-border bg-surface p-8 clip-corner">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-primary">Área do Estúdio</span>
            <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">Entrar</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Acesse o painel do seu estúdio para atualizar perfil, jogos e imagens.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Email</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu-estudio@cgda.ao"
                  className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Senha</label>
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              {error && <p className="text-xs text-primary">{error}</p>}
              <button
                disabled={loading}
                className="clip-tab inline-flex w-full items-center justify-center gap-2 bg-ember px-5 py-3 font-display text-sm uppercase tracking-[0.22em] text-white shadow-ember disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Entrar
              </button>
            </form>

            <p className="mt-6 text-xs text-muted-foreground">
              Esqueceu a senha? Contate a equipa CGDA. <Link to="/" className="text-primary hover:underline">Voltar ao site</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
