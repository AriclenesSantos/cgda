import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, ArrowLeft, Loader2, Play, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SectionHeader } from "@/components/StudiosSection";
import { GameCard } from "@/components/GamesCarousel";
import VideoPlayer from "@/components/VideoPlayer";
import { useStudio, useGames, studioCover, gameCover, type GameRow } from "@/lib/catalog";

const StudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const { studio, loading } = useStudio(id);
  const { games: studioGames } = useGames(id);

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-4xl uppercase tracking-wide">Estúdio não encontrado</h1>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">Voltar ao início</Link>
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
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10">
            <img src={studioCover(studio)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,hsl(354_100%_50%_/_0.35),transparent_60%)]" />
          </div>
          <div className="container py-16">
            <Link to="/#estudios" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Todos os estúdios
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mt-8 flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="font-display text-xs uppercase tracking-[0.3em] text-primary">Estúdio</span>
                <h1 className="mt-3 font-display text-6xl uppercase leading-none tracking-wide md:text-8xl">{studio.name}</h1>
                {studio.tagline && <p className="mt-3 font-display text-lg uppercase tracking-[0.22em] text-accent">{studio.tagline}</p>}
                <p className="mt-5 max-w-2xl text-muted-foreground">{studio.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {studio.location && <span>📍 {studio.location}</span>}
                  {studio.founded_year && <span>Fundado · {studio.founded_year}</span>}
                  {studio.website && (
                    <a href={studio.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                      Website <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-px border border-border bg-border md:w-auto">
                {[
                  { label: "Projetos", value: studioGames.length },
                  { label: "Lançados", value: launched.length },
                  { label: "Em Dev", value: inDev.length },
                ].map((s) => (
                  <div key={s.label} className="bg-surface px-5 py-4 text-center md:min-w-[110px]">
                    <div className="font-display text-3xl text-primary">{s.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {studioGames.length > 0 && (
          <section className="py-20">
            <div className="container">
              <SectionHeader
                eyebrow="Galeria"
                title="Projetos do estúdio"
                actions={
                  <div className="flex gap-2">
                    <button onClick={scrollPrev} className="grid h-10 w-10 place-items-center border border-border bg-surface hover:border-primary hover:text-primary" aria-label="Anterior">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={scrollNext} className="grid h-10 w-10 place-items-center border border-border bg-surface hover:border-primary hover:text-primary" aria-label="Próximo">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                }
              />
              <div ref={emblaRef} className="mt-10 overflow-hidden">
                <div className="flex gap-5">
                  {studioGames.map((g) => (
                    <div key={g.id} className="min-w-[280px] max-w-[280px] shrink-0 sm:min-w-[320px] sm:max-w-[320px]">
                      <GameCard game={g} studio={studio} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {launched.length > 0 && (
          <section className="py-12">
            <div className="container">
              <h2 className="font-display text-3xl uppercase tracking-wide"><span className="text-primary">▸</span> Lançados</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {launched.map((g) => <GameDetailCard key={g.id} game={g} />)}
              </div>
            </div>
          </section>
        )}

        {inDev.length > 0 && (
          <section className="py-12 pb-24">
            <div className="container">
              <h2 className="font-display text-3xl uppercase tracking-wide"><span className="text-accent">▸</span> Em Desenvolvimento</h2>
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

function GameDetailCard({ game }: { game: GameRow }) {
  const released = game.status === "Lançado";
  const [modal, setModal] = useState<{ kind: "trailer" | "shot"; index: number } | null>(null);
  const shots = game.screenshots ?? [];
  const hasTrailer = !!game.trailer_url;

  return (
    <div className="group flex flex-col border border-border bg-surface transition-colors hover:border-primary/60">
      <div className="relative aspect-video overflow-hidden border-b border-border bg-background">
        <img src={gameCover(game)} alt={game.title} loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {hasTrailer && (
          <button
            type="button"
            onClick={() => setModal({ kind: "trailer", index: 0 })}
            className="absolute inset-0 grid place-items-center bg-black/0 transition-colors hover:bg-black/40"
            aria-label="Ver trailer"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/90 text-primary-foreground opacity-0 shadow-[0_0_30px_hsl(var(--primary)/0.7)] transition-opacity group-hover:opacity-100">
              <Play className="h-6 w-6 translate-x-0.5 fill-current" />
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          {game.genre ? (
            <span className="text-[10px] uppercase tracking-[0.22em] text-primary">{game.genre}</span>
          ) : <span />}
          <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${
            released ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
          }`}>{game.status}</span>
        </div>
        <h3 className="mt-1 font-display text-xl uppercase tracking-wide">{game.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{game.description}</p>

        {shots.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {shots.slice(0, 4).map((url, i) => (
              <button key={url} type="button" onClick={() => setModal({ kind: "shot", index: i })}
                className="relative aspect-video overflow-hidden border border-border bg-background transition-colors hover:border-primary">
                <img src={url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform hover:scale-110" />
                {i === 3 && shots.length > 4 && (
                  <span className="absolute inset-0 grid place-items-center bg-background/70 font-display text-xs uppercase tracking-[0.2em] text-primary">
                    +{shots.length - 4}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {game.platforms.map((p) => (
            <span key={p} className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{p}</span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {hasTrailer && (
            <button type="button" onClick={() => setModal({ kind: "trailer", index: 0 })}
              className="inline-flex items-center gap-1.5 bg-primary px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90">
              <Play className="h-3 w-3 fill-current" /> Ver trailer
            </button>
          )}
          {game.links?.length > 0 && game.links.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              {l.label} <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>

      {modal && (
        <MediaModal
          title={game.title}
          initial={modal}
          trailerUrl={game.trailer_url}
          poster={gameCover(game)}
          screenshots={shots}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function MediaModal({
  title, initial, trailerUrl, poster, screenshots, onClose,
}: {
  title: string;
  initial: { kind: "trailer" | "shot"; index: number };
  trailerUrl: string | null;
  poster?: string;
  screenshots: string[];
  onClose: () => void;
}) {
  const [view, setView] = useState(initial);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="relative w-full max-w-5xl border border-border bg-surface" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <span className="font-display text-[10px] uppercase tracking-[0.3em] text-primary">
              {view.kind === "trailer" ? "Trailer" : `Screenshot ${view.index + 1}/${screenshots.length}`}
            </span>
            <h4 className="font-display text-lg uppercase tracking-wide">{title}</h4>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="grid h-9 w-9 place-items-center border border-border text-muted-foreground hover:border-primary hover:text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-black">
          {view.kind === "trailer" && trailerUrl ? (
            <VideoPlayer src={trailerUrl} poster={poster} autoPlay />
          ) : (
            <div className="relative aspect-video select-none" onContextMenu={(e) => e.preventDefault()}>
              <img src={screenshots[view.index]} alt="" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
              {screenshots.length > 1 && (
                <>
                  <button type="button" onClick={() => setView({ kind: "shot", index: (view.index - 1 + screenshots.length) % screenshots.length })}
                    className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center bg-background/70 hover:text-primary" aria-label="Anterior">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => setView({ kind: "shot", index: (view.index + 1) % screenshots.length })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center bg-background/70 hover:text-primary" aria-label="Próximo">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {(trailerUrl || screenshots.length > 0) && (
          <div className="flex gap-2 overflow-x-auto border-t border-border p-3">
            {trailerUrl && (
              <button type="button" onClick={() => setView({ kind: "trailer", index: 0 })}
                className={`relative aspect-video w-32 shrink-0 overflow-hidden border ${view.kind === "trailer" ? "border-primary" : "border-border"} bg-background`}>
                {poster && <img src={poster} alt="" className="h-full w-full object-cover opacity-70" />}
                <span className="absolute inset-0 grid place-items-center">
                  <Play className="h-6 w-6 fill-primary text-primary" />
                </span>
              </button>
            )}
            {screenshots.map((url, i) => (
              <button key={url} type="button" onClick={() => setView({ kind: "shot", index: i })}
                className={`aspect-video w-32 shrink-0 overflow-hidden border ${view.kind === "shot" && view.index === i ? "border-primary" : "border-border"} bg-background`}>
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudioPage;
