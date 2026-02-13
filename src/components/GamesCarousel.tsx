import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { games, studios } from "@/data/studios";
import { Badge } from "@/components/ui/badge";

const GamesCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gradient">
            Catálogo de Jogos
          </h2>
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
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-6">
            {games.map((game, i) => {
              const studio = studios.find((s) => s.id === game.studioId);
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="min-w-[280px] max-w-[280px] shrink-0"
                >
                  <div className="group overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:glow-red">
                    {/* Game thumbnail placeholder */}
                    <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-4xl font-bold text-foreground/10">
                          {game.name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute right-2 top-2">
                        <Badge
                          variant={game.status === "Lançado" ? "default" : "secondary"}
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
                    <div className="p-4">
                      <h3 className="font-display text-sm font-bold text-foreground">
                        {game.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {studio?.name}
                      </p>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground/80">
                        {game.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {game.platform.map((p) => (
                          <span
                            key={p}
                            className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamesCarousel;
