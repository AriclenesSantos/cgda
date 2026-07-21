import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Loader2, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import VideoEmbed from "@/components/VideoEmbed";
import { useGame, useGames, gameCover } from "@/lib/catalog";
import { GameCard } from "@/components/GamesCarousel";


const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const { game, studio, loading } = useGame(id);
  const { games: siblings } = useGames(studio?.id);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center text-center">
          <div>
            <h1 className="font-display text-4xl uppercase tracking-wide">Jogo não encontrado</h1>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">Voltar ao início</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const released = game.status === "Lançado";
  const shots = game.screenshots ?? [];
  const others = siblings.filter((g) => g.id !== game.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero: capa + info */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10">
            <img src={gameCover(game)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
            <div className="absolute inset-0 bg-grid opacity-20" />
          </div>

          <div className="container py-10">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <Link to="/#jogos" className="inline-flex items-center gap-2 transition-colors hover:text-primary">
                <ArrowLeft className="h-4 w-4" /> Catálogo
              </Link>
              {studio && (
                <>
                  <span className="opacity-40">/</span>
                  <Link to={`/estudio/${studio.id}`} className="transition-colors hover:text-primary">{studio.name}</Link>
                </>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mt-6 flex justify-center"
            >
              {/* Capa responsiva ao formato da imagem original */}
              <div className="flex max-w-full items-center justify-center border border-border bg-black">
                <img
                  src={gameCover(game)}
                  alt={game.title}
                  className="block h-auto max-h-[75vh] w-auto max-w-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Informações */}
        <section className="py-12">
          <div className="container grid gap-10 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.22em] ${
                  released ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                }`}>{game.status}</span>
                {game.genre && (
                  <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{game.genre}</span>
                )}
              </div>
              <h1 className="mt-4 font-display text-4xl uppercase leading-none tracking-wide md:text-6xl">{game.title}</h1>
              {studio && (
                <Link to={`/estudio/${studio.id}`} className="mt-3 inline-block text-sm uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary">
                  por <span className="text-foreground">{studio.name}</span>
                </Link>
              )}

              <div className="mt-6 flex items-center gap-3 border-b border-border pb-3">
                <span className="h-px w-8 bg-primary" />
                <h2 className="font-display text-xs uppercase tracking-[0.3em] text-primary">Sobre o jogo</h2>
              </div>
              <p className="mt-5 whitespace-pre-line leading-relaxed text-muted-foreground">{game.description}</p>

              {game.links?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {game.links.map((l) => (
                    <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-primary px-4 py-2 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90">
                      {l.label} <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <aside className="border border-border bg-surface p-5 md:self-start">
              <h3 className="font-display text-sm uppercase tracking-[0.22em] text-muted-foreground">Ficha</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Estado" value={game.status} />
                {game.genre && <Row label="Género" value={game.genre} />}
                {studio && <Row label="Estúdio" value={studio.name} />}
                {studio?.location && <Row label="Origem" value={studio.location} />}
                {game.platforms.length > 0 && <Row label="Plataformas" value={game.platforms.join(" · ")} />}
              </dl>
            </aside>
          </div>
        </section>

        {/* Screenshots */}
        {shots.length > 0 && (
          <section className="py-12">
            <div className="container">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="h-px w-8 bg-primary" />
                <h2 className="font-display text-xs uppercase tracking-[0.3em] text-primary">Galeria</h2>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {shots.map((url, i) => (
                  <button key={url} type="button" onClick={() => setLightbox(i)}
                    className="group relative aspect-video overflow-hidden border border-border bg-background transition-colors hover:border-primary">
                    <img src={url} alt={`${game.title} screenshot ${i + 1}`} loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trailer */}
        {(game.trailer_external_url || game.trailer_url) && (
          <section className="py-12 pb-24">
            <div className="container">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="h-px w-8 bg-primary" />
                <h2 className="font-display text-xs uppercase tracking-[0.3em] text-primary">Trailer</h2>
              </div>
              <div className="mt-8 border border-border bg-black overflow-hidden">
                {game.trailer_external_url ? (
                  <VideoEmbed url={game.trailer_external_url} poster={gameCover(game)} />
                ) : (
                  <VideoPlayer src={game.trailer_url!} poster={gameCover(game)} />
                )}
              </div>
            </div>
          </section>
        )}


        {/* Outros do estúdio */}
        {others.length > 0 && (
          <section className="py-12 pb-24">
            <div className="container">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="h-px w-8 bg-primary" />
                <h2 className="font-display text-xs uppercase tracking-[0.3em] text-primary">Mais de {studio?.name}</h2>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {others.map((g) => <GameCard key={g.id} game={g} studio={studio ?? undefined} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />

      {lightbox !== null && (
        <Lightbox
          images={shots}
          index={lightbox}
          onIndex={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-2">
      <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm text-foreground">{value}</dd>
    </div>
  );
}

function Lightbox({ images, index, onIndex, onClose }: {
  images: string[]; index: number; onIndex: (i: number) => void; onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [index, images.length, onIndex, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-md" onClick={onClose}>
      <button onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 grid h-10 w-10 place-items-center border border-border bg-surface text-muted-foreground hover:border-primary hover:text-primary">
        <X className="h-4 w-4" />
      </button>
      <div className="relative max-h-full max-w-6xl" onClick={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
        <img src={images[index]} alt="" draggable={false} className="max-h-[85vh] w-auto select-none object-contain" />
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => onIndex((index - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center bg-background/70 text-foreground hover:text-primary" aria-label="Anterior">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button type="button" onClick={() => onIndex((index + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center bg-background/70 text-foreground hover:text-primary" aria-label="Próximo">
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 border border-border bg-background/80 px-3 py-1 font-display text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GamePage;
