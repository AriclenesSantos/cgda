import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Gamepad2, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SectionHeader } from "@/components/StudiosSection";
import { GameCard } from "@/components/GamesCarousel";
import { getStudioById, getGamesByStudio, type Game } from "@/data/studios";
import { studioImages, gameImages } from "@/data/images";

const StudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const studio = getStudioById(id || "");
  const studioGames = getGamesByStudio(id || "");

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!studio) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-4xl uppercase tracking-wide">Estúdio não encontrado</h1>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">
              Voltar ao início
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10">
            <img
              src={studioImages[studio.id]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,hsl(354_100%_50%_/_0.35),transparent_60%)]" />
          </div>
          <div className="container py-16">
            <Link
              to="/#estudios"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Todos os estúdios
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <span className="font-display text-xs uppercase tracking-[0.3em] text-primary">
                  Estúdio
                </span>
                <h1 className="mt-3 font-display text-6xl uppercase leading-none tracking-wide md:text-8xl">
                  {studio.name}
                </h1>
                <p className="mt-5 max-w-2xl text-muted-foreground">{studio.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-px border border-border bg-border md:w-auto">
                {[
                  { label: "Projetos", value: studioGames.length },
                  { label: "Lançados", value: launched.length },
                  { label: "Em Dev", value: inDev.length },
                ].map((s) => (
                  <div key={s.label} className="bg-surface px-5 py-4 text-center md:min-w-[110px]">
                    <div className="font-display text-3xl text-primary">{s.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gallery carousel */}
        {studioGames.length > 0 && (
          <section className="py-20">
            <div className="container">
              <SectionHeader
                eyebrow="Galeria"
                title="Projetos do estúdio"
                actions={
                  <div className="flex gap-2">
                    <button
                      onClick={scrollPrev}
                      className="grid h-10 w-10 place-items-center border border-border bg-surface hover:border-primary hover:text-primary"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={scrollNext}
                      className="grid h-10 w-10 place-items-center border border-border bg-surface hover:border-primary hover:text-primary"
                      aria-label="Próximo"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                }
              />
              <div ref={emblaRef} className="mt-10 overflow-hidden">
                <div className="flex gap-5">
                  {studioGames.map((g) => (
                    <div key={g.id} className="min-w-[280px] max-w-[280px] shrink-0 sm:min-w-[320px] sm:max-w-[320px]">
                      <GameCard game={g} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Detailed grids */}
        {launched.length > 0 && (
          <section className="py-12">
            <div className="container">
              <h2 className="font-display text-3xl uppercase tracking-wide">
                <span className="text-primary">▸</span> Lançados
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {launched.map((g) => <GameDetailCard key={g.id} game={g} />)}
              </div>
            </div>
          </section>
        )}

        {inDev.length > 0 && (
          <section className="py-12 pb-24">
            <div className="container">
              <h2 className="font-display text-3xl uppercase tracking-wide">
                <span className="text-accent">▸</span> Em Desenvolvimento
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {inDev.map((g) => <GameDetailCard key={g.id} game={g} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

function GameDetailCard({ game }: { game: Game }) {
  const released = game.status === "Lançado";
  return (
    <div className="group flex flex-col border border-border bg-surface transition-colors hover:border-primary/60">
      <div className="relative aspect-video overflow-hidden border-b border-border">
        <img
          src={gameImages[game.id]}
          alt={game.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
        <span
          className={`absolute left-3 top-3 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${
            released ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
          }`}
        >
          {game.status}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[10px] uppercase tracking-[0.22em] text-primary">{game.genre}</span>
        <h3 className="mt-1 font-display text-xl uppercase tracking-wide">{game.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{game.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {game.platform.map((p) => (
            <span key={p} className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              {p}
            </span>
          ))}
        </div>
        {game.links && (
          <div className="mt-4 flex flex-wrap gap-2">
            {game.links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {l.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudioPage;
