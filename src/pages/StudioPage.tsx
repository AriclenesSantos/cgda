import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, ChevronLeft, Gamepad2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { getStudioById, getGamesByStudio } from "@/data/studios";
import type { Game } from "@/data/studios";

const StudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const studio = getStudioById(id || "");
  const studioGames = getGamesByStudio(id || "");

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!studio) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-black uppercase text-foreground">
              Estúdio não encontrado
            </h1>
            <Link to="/" className="mt-4 inline-block text-secondary hover:underline">
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
      <main>
        {/* Studio Header */}
        <section className="relative overflow-hidden py-24 scanline">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/80 to-background" />
          <div className="absolute inset-0 cyber-grid opacity-30" />
          <div className="container relative z-10 mx-auto px-4">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-secondary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-5">
                <motion.div
                  className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-gaming text-4xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {studio.emoji}
                </motion.div>
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-wider text-gradient-neon sm:text-5xl">
                    {studio.name}
                  </h1>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-secondary">
                    {studioGames.length} projeto{studioGames.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
                {studio.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Games Gallery Carousel */}
        {studioGames.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-wider text-foreground">
                  Galeria de Projetos
                </h2>
                {studioGames.length > 1 && (
                  <div className="flex gap-3">
                    <button
                      onClick={scrollPrev}
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card/80 transition-all hover:neon-border-red hover:glow-red"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={scrollNext}
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card/80 transition-all hover:neon-border-red hover:glow-red"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div ref={emblaRef} className="overflow-hidden">
                <div className="flex gap-6">
                  {studioGames.map((game) => (
                    <div key={game.id} className="min-w-[340px] max-w-[340px] shrink-0">
                      <motion.div
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="overflow-hidden rounded-xl border border-border/30 bg-card/80 transition-shadow duration-500 hover:glow-red"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Gamepad2 className="h-16 w-16 text-foreground/10" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Launched Games */}
        {launched.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="mb-8 text-2xl font-black uppercase tracking-wider text-foreground">
                <span className="text-primary">▸</span> Jogos Lançados
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {launched.map((game, i) => (
                  <GameCard key={game.id} game={game} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* In Development */}
        {inDev.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="mb-8 text-2xl font-black uppercase tracking-wider text-foreground">
                <span className="text-secondary">▸</span> Em Desenvolvimento
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {inDev.map((game, i) => (
                  <GameCard key={game.id} game={game} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

function GameCard({ game, index }: { game: Game; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-xl border border-border/30 bg-card/80 backdrop-blur-sm transition-shadow duration-500 hover:glow-red"
    >
      <div className="relative h-44 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Gamepad2 className="h-12 w-12 text-foreground/10 transition-transform duration-500 group-hover:scale-125" />
        </div>
        <div className="absolute right-3 top-3">
          <Badge
            className={
              game.status === "Lançado"
                ? "border-0 bg-primary/90 text-primary-foreground font-bold uppercase text-[10px] tracking-wider"
                : "border-0 bg-secondary/90 text-secondary-foreground font-bold uppercase text-[10px] tracking-wider"
            }
          >
            {game.status}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-5">
        <h3 className="text-base font-black uppercase tracking-wide text-foreground group-hover:text-gradient-neon transition-all">
          {game.name}
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-secondary/70">{game.genre}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{game.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {game.platform.map((p) => (
            <span
              key={p}
              className="rounded-md border border-border/50 bg-muted/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              {p}
            </span>
          ))}
        </div>
        {game.links && game.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {game.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary/20 hover:glow-red"
              >
                {link.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default StudioPage;
