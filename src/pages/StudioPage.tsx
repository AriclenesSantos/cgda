import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, ArrowLeft, Loader2, Building2, MapPin, Calendar, Globe, Trophy, Gamepad2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GameCard } from "@/components/GamesCarousel";
import { useStudio, useGames, studioCover } from "@/lib/catalog";

const StudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const { studio, loading } = useStudio(id);
  const { games: studioGames } = useGames(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="grid min-h-[60vh] place-items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center text-center px-4">
          <div>
            <Building2 className="mx-auto h-16 w-16 text-muted-foreground/20 mb-4" />
            <h1 className="font-display text-4xl uppercase tracking-wider">Estúdio não encontrado</h1>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-all">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Início
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const launched = studioGames.filter((g) => g.status === "Lançado");
  const inDev = studioGames.filter((g) => g.status === "Em Desenvolvimento");

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      
      <main className="pt-20">
        {/* Immersive Studio Hero */}
        <section className="relative min-h-[50vh] flex items-center overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10">
            <img 
              src={studioCover(studio)} 
              alt="" 
              className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-20 dark:opacity-30 scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 dark:via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-grid opacity-10 dark:opacity-20" />
          </div>

          <div className="container relative z-10 py-20">
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-10">
              {/* Studio Logo */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-48 w-48 shrink-0 overflow-hidden rounded-full border-4 border-white/10 dark:border-white/20 bg-white shadow-2xl shadow-black/50"
              >
                <img src={studio.logo_url || "/placeholder.svg"} alt={studio.name} className="h-full w-full object-cover rounded-full" />
              </motion.div>

              {/* Studio Info */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-4">
                    Estúdio de Desenvolvimento
                  </span>
                  <h1 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-none tracking-tighter mb-4 text-foreground dark:text-white">
                    {studio.name}
                  </h1>
                  {studio.tagline && (
                    <p className="font-display text-xl md:text-2xl uppercase tracking-[0.2em] text-accent mb-6">
                      {studio.tagline}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-muted-foreground uppercase tracking-widest font-medium">
                    {studio.location && (
                      <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {studio.location}</span>
                    )}
                    {studio.founded_year && (
                      <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Desde {studio.founded_year}</span>
                    )}
                    {studio.website && (
                      <a href={studio.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                        <Globe className="h-4 w-4 text-primary" /> Website Oficial <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Stats Cards */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full lg:w-auto"
              >
                <StatCard label="Projetos" value={studioGames.length} icon={<Trophy className="h-4 w-4" />} />
                <StatCard label="Lançados" value={launched.length} />
                <StatCard label="Em Dev" value={inDev.length} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Studio Description Section */}
        <section className="py-20 bg-surface/30">
          <div className="container max-w-4xl text-center">
            <h2 className="text-xs uppercase tracking-[0.4em] text-primary font-bold mb-8">Nossa História</h2>
            <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-light italic">
              "{studio.description}"
            </p>
          </div>
        </section>

        {/* Games Sections */}
        <div className="container py-20 space-y-32">
          {launched.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-12">
                <div className="h-px flex-1 bg-border" />
                <h2 className="font-display text-3xl uppercase tracking-tight px-4">
                  Jogos <span className="text-primary">Lançados</span>
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {launched.map((g) => <GameCard key={g.id} game={g} studio={studio} />)}
              </div>
            </section>
          )}

          {inDev.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-12">
                <div className="h-px flex-1 bg-border" />
                <h2 className="font-display text-3xl uppercase tracking-tight px-4 text-muted-foreground">
                  Em <span className="text-accent">Desenvolvimento</span>
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {inDev.map((g) => <GameCard key={g.id} game={g} studio={studio} />)}
              </div>
            </section>
          )}

          {studioGames.length === 0 && (
            <div className="text-center py-20 bg-surface border border-dashed border-border rounded-lg">
              <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground uppercase tracking-widest text-xs">Este estúdio ainda não publicou projetos.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

function StatCard({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border p-6 rounded-sm text-center lg:min-w-[120px] group hover:border-primary transition-colors">
      <div className="flex items-center justify-center gap-2 mb-1">
        {icon && <span className="text-primary">{icon}</span>}
        <span className="font-display text-4xl text-primary group-hover:scale-110 transition-transform inline-block">{value}</span>
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{label}</div>
    </div>
  );
}

export default StudioPage;
