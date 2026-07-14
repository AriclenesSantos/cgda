import { useCallback, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGames, useStudios, gameCover, type GameRow, type StudioRow } from "@/lib/catalog";
import { SectionHeader } from "./StudiosSection";

const filters = ["Todos", "Lançado", "Em Desenvolvimento"] as const;

export default function GamesCarousel() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const { games } = useGames();
  const { studios } = useStudios();
  const studioMap = useMemo(() => Object.fromEntries(studios.map((s) => [s.id, s])), [studios]);

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
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 font-display text-xs uppercase tracking-[0.18em] transition-colors ${
                      filter === f ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}>{f}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={scrollPrev} className="grid h-10 w-10 place-items-center border border-border bg-surface text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Anterior">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={scrollNext} className="grid h-10 w-10 place-items-center border border-border bg-surface text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Próximo">
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
                <GameCard game={g} studio={studioMap[g.studio_id]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function GameCard({ game, studio }: { game: GameRow; studio?: StudioRow }) {
  const released = game.status === "Lançado";
  return (
    <Link
      to={`/estudio/${game.studio_id}`}
      className="group relative flex h-full flex-col overflow-hidden border border-border bg-surface transition-all duration-300 hover:border-primary/60 hover-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-background">
        <img
          src={gameCover(game)} alt={game.title} loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-border p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground truncate">{studio?.name}</span>
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] ${
            released ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
          }`}>
            <span className="h-1 w-1 rounded-full bg-current" />
            {released ? "Lançado" : "Em Dev"}
          </span>
        </div>
        <h3 className="font-display text-lg uppercase leading-tight tracking-wide text-foreground line-clamp-1">{game.title}</h3>
        <div className="mt-auto flex flex-wrap gap-1 pt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          {game.genre && <span>{game.genre}</span>}
          {game.genre && game.platforms.length > 0 && <span className="opacity-40">·</span>}
          <span className="truncate">{game.platforms.slice(0, 2).join(" · ")}</span>
        </div>
      </div>
    </Link>
  );
}
