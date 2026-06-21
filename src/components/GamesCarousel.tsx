import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import { games, getStudioById, type Game } from "@/data/studios";
import { SectionHeader } from "./StudiosSection";

const filters = ["Todos", "Lançado", "Em Desenvolvimento"] as const;

export default function GamesCarousel() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const filtered = games.filter((g) => filter === "Todos" || g.status === filter);

  return (
    <section id="jogos" className="relative py-24">
      <div className="container">
        <SectionHeader
          eyebrow="02 · Catálogo"
          title="Jogos angolanos"
          subtitle="Cada jogo abaixo foi feito por angolanos, para o mundo."
          actions={
            <div className="flex items-center gap-3">
              <div className="hidden gap-1 md:flex">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 font-display text-xs uppercase tracking-[0.18em] transition-colors ${
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={scrollPrev}
                  className="grid h-10 w-10 place-items-center border border-border bg-surface text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={scrollNext}
                  className="grid h-10 w-10 place-items-center border border-border bg-surface text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Próximo"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          }
        />

        <div ref={emblaRef} className="mt-10 overflow-hidden">
          <div className="flex gap-5">
            {filtered.map((g) => (
              <div key={g.id} className="min-w-[280px] max-w-[280px] shrink-0 sm:min-w-[320px] sm:max-w-[320px]">
                <GameCard game={g} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function GameCard({ game }: { game: Game }) {
  const studio = getStudioById(game.studioId);
  const released = game.status === "Lançado";
  return (
    <Link
      to={`/estudio/${game.studioId}`}
      className="group relative block overflow-hidden border border-border bg-surface transition-all duration-300 hover:border-primary/60 hover-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* Procedural game cover */}
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(135deg, hsl(${
              hashHue(game.id)
            } 70% 18%) 0%, hsl(${hashHue(game.id) + 30} 80% 8%) 70%, #000 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,42,61,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <Gamepad2 className="absolute right-4 top-4 h-8 w-8 text-white/15 transition-all group-hover:text-primary/70 group-hover:scale-110" />

        {/* Status pill */}
        <div
          className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
            released
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-ember-pulse" />
          {released ? "Lançado" : "Em Dev"}
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {studio?.name}
          </span>
          <h3 className="mt-1 font-display text-2xl uppercase leading-none tracking-wide text-foreground">
            {game.name}
          </h3>
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{game.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="border border-border bg-background/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-foreground/80">
              {game.genre}
            </span>
            {game.platform.slice(0, 2).map((p) => (
              <span
                key={p}
                className="border border-border bg-background/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function hashHue(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
}
