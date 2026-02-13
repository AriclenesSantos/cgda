import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { getStudioById, getGamesByStudio } from "@/data/studios";

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
            <h1 className="font-display text-2xl font-bold text-foreground">
              Estúdio não encontrado
            </h1>
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
      <main>
        {/* Studio Header */}
        <section className="relative overflow-hidden border-b border-border/50 py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
          <div className="container relative z-10 mx-auto px-4">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gaming text-3xl">
                  {studio.emoji}
                </div>
                <div>
                  <h1 className="font-display text-3xl font-black text-gradient sm:text-4xl">
                    {studio.name}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {studioGames.length} projeto{studioGames.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-2xl text-muted-foreground">
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
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Galeria de Projetos
                </h2>
                {studioGames.length > 1 && (
                  <div className="flex gap-2">
                    <button
                      onClick={scrollPrev}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-primary hover:bg-primary/10"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={scrollNext}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-primary hover:bg-primary/10"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div ref={emblaRef} className="overflow-hidden">
                <div className="flex gap-6">
                  {studioGames.map((game) => (
                    <div key={game.id} className="min-w-[340px] max-w-[340px] shrink-0">
                      <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
                        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-6xl font-bold text-foreground/10">
                              {game.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                      </div>
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
              <h2 className="mb-8 font-display text-2xl font-bold text-foreground">
                Jogos Lançados
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
              <h2 className="mb-8 font-display text-2xl font-bold text-foreground">
                Em Desenvolvimento
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

function GameCard({ game, index }: { game: ReturnType<typeof getGamesByStudio>[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:glow-red"
    >
      <div className="relative h-44 bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-5xl font-bold text-foreground/10">
            {game.name.charAt(0)}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <Badge
            className={
              game.status === "Lançado"
                ? "bg-primary/90 text-primary-foreground"
                : "bg-secondary/90 text-secondary-foreground"
            }
          >
            {game.status}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-base font-bold text-foreground">
          {game.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-muted-foreground">{game.genre}</p>
        <p className="mt-3 text-sm text-muted-foreground/80">{game.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {game.platform.map((p) => (
            <span
              key={p}
              className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
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
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
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
