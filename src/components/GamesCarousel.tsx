import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Gamepad2 } from "lucide-react";
import { games, studios } from "@/data/studios";
import { Badge } from "@/components/ui/badge";

const gameColors = [
  "from-primary/30 via-accent/10 to-secondary/20",
  "from-secondary/30 via-primary/10 to-accent/20",
  "from-accent/30 via-secondary/10 to-primary/20",
  "from-primary/20 via-secondary/20 to-accent/30",
  "from-secondary/20 via-accent/20 to-primary/30",
];

const GamesCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section className="relative py-28">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-14 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              // catálogo
            </p>
            <h2 className="text-4xl font-black uppercase tracking-wider text-gradient-fire sm:text-5xl">
              Jogos
            </h2>
            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full" />
          </motion.div>

          <div className="flex gap-3">
            <button
              onClick={scrollPrev}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:neon-border-red hover:glow-red"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:neon-border-red hover:glow-red"
            >
              <ArrowRight className="h-5 w-5" />
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
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="min-w-[300px] max-w-[300px] shrink-0"
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group h-full overflow-hidden rounded-xl border border-border/30 bg-card/80 backdrop-blur-sm transition-shadow duration-500 hover:glow-red"
                  >
                    {/* Game thumbnail */}
                    <div className={`relative h-44 bg-gradient-to-br ${gameColors[i % gameColors.length]} overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gamepad2 className="h-12 w-12 text-foreground/10 transition-transform duration-500 group-hover:scale-125 group-hover:text-foreground/20" />
                      </div>
                      {/* Scan line effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent animate-pulse" />
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
                      {/* Bottom neon line */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-black uppercase tracking-wide text-foreground group-hover:text-gradient-neon transition-all duration-300">
                        {game.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-secondary/70">
                        {studio?.name} · {game.genre}
                      </p>
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {game.description}
                      </p>
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
                    </div>
                  </motion.div>
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
