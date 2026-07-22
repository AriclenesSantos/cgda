import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useHeroSlides, useGames, useNews, gameCover, type HeroSlideRow, type GameRow, type NewsRow } from "@/lib/catalog";

type Resolved =
  | { kind: "game"; slide: HeroSlideRow; game: GameRow }
  | { kind: "news"; slide: HeroSlideRow; news: NewsRow }
  | { kind: "ad"; slide: HeroSlideRow };

export default function HeroSection() {
  const { slides } = useHeroSlides(true);
  const { games } = useGames();
  const { news } = useNews();

  const resolved = useMemo<Resolved[]>(() => {
    const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));
    const newsMap = Object.fromEntries(news.map((n) => [n.id, n]));
    return slides.flatMap<Resolved>((s) => {
      if (s.type === "game") {
        const g = s.game_id ? gameMap[s.game_id] : undefined;
        return g ? [{ kind: "game", slide: s, game: g }] : [];
      }
      if (s.type === "news") {
        const n = s.news_id ? newsMap[s.news_id] : undefined;
        return n ? [{ kind: "news", slide: s, news: n }] : [];
      }
      return s.image_url ? [{ kind: "ad", slide: s }] : [];
    });
  }, [slides, games, news]);

  const autoplay = useRef(Autoplay({ delay: 10000, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    onSelect();
  }, [emblaApi, resolved.length]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!resolved.length) return <FallbackHero />;

  return (
    <section className="relative w-full">
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {resolved.map((r, i) => (
            <div key={r.slide.id} className="relative min-w-0 flex-[0_0_100%]">
              <Slide item={r} isActive={i === selected} />
            </div>
          ))}
        </div>

        {resolved.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 p-3 text-white backdrop-blur transition hover:bg-black/60 md:inline-flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Próximo"
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 p-3 text-white backdrop-blur transition hover:bg-black/60 md:inline-flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {snaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === selected ? "w-8 bg-primary" : "w-4 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Slide({ item, isActive }: { item: Resolved; isActive: boolean }) {
  return (
    <div className="relative h-[80vh] min-h-[520px] w-full overflow-hidden bg-black">
      <Media item={item} isActive={isActive} />
      {item.kind !== "ad" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 pb-16 md:pb-20">
            <div className="container">
              {item.kind === "game" && <GameOverlay item={item} />}
              {item.kind === "news" && <NewsOverlay item={item} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Media({ item, isActive }: { item: Resolved; isActive: boolean }) {
  const src = mediaSrc(item);
  const isVideoFile = !!src && /\.(mp4|webm|mov)(\?|$)/i.test(src);
  
  // Detecção de YouTube/Vimeo para o Hero
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const ytId = src ? getYoutubeId(src) : null;
  const vmId = src ? getVimeoId(src) : null;
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isVideoFile) return;
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive, isVideoFile]);

  if (!src) return <div className="absolute inset-0 bg-surface" />;

  if (ytId && isActive) {
    return (
      <div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&autohide=1`}
          className="absolute h-[115%] w-[115%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.2]"
          allow="autoplay; encrypted-media"
          title="Hero Video"
          style={{ border: 'none' }}
        />
      </div>
    );
  }

  if (vmId && isActive) {
    return (
      <div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden">
        <iframe
          src={`https://player.vimeo.com/video/${vmId}?autoplay=1&muted=1&background=1&loop=1`}
          className="absolute h-[150%] w-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          allow="autoplay; fullscreen"
          title="Hero Video"
        />
      </div>
    );
  }

  if (isVideoFile) {
    return (
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        controls={false}
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
      loading="eager"
    />
  );
}

function mediaSrc(item: Resolved): string {
  if (item.kind === "game") {
    // Prioridade: Imagem do slide (override) > Link externo (YouTube/Vimeo) > Trailer local > Capa do jogo
    return item.slide.image_url || item.game.trailer_external_url || item.game.trailer_url || gameCover(item.game);
  }
  if (item.kind === "news") return item.slide.image_url || item.news.cover_url || "";
  return item.slide.image_url || "";
}

function GameOverlay({ item }: { item: Extract<Resolved, { kind: "game" }> }) {
  const title = item.slide.title || item.game.title;
  const subtitle = item.slide.subtitle || item.game.genre || "";
  return (
    <div className="max-w-2xl text-white">
      <div className="mb-3 inline-flex items-center gap-2 border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.24em] backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Destaque
      </div>
      <h2 className="font-display text-4xl uppercase leading-[0.95] tracking-wide sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">{subtitle}</p>}
      <Link
        to={`/jogo/${item.game.id}`}
        className="clip-tab group mt-6 inline-flex items-center gap-2 bg-ember px-6 py-3 font-display text-sm uppercase tracking-[0.2em] text-primary-foreground shadow-ember"
      >
        Ver mais <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function NewsOverlay({ item }: { item: Extract<Resolved, { kind: "news" }> }) {
  const title = item.slide.title || item.news.title;
  const subtitle = item.slide.subtitle || "";
  return (
    <div className="max-w-2xl text-white">
      <div className="mb-3 inline-flex items-center gap-2 border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.24em] backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Notícia
      </div>
      <h2 className="font-display text-4xl uppercase leading-[0.95] tracking-wide sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">{subtitle}</p>}
      <Link
        to={`/noticia/${item.news.id}`}
        className="clip-tab group mt-6 inline-flex items-center gap-2 bg-ember px-6 py-3 font-display text-sm uppercase tracking-[0.2em] text-primary-foreground shadow-ember"
      >
        Ver mais <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function FallbackHero() {
  return (
    <section className="relative isolate overflow-hidden bg-background pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="container">
        <h1 className="font-display text-6xl uppercase leading-[0.95] tracking-wide sm:text-7xl md:text-8xl">
          Os jogos de <span className="text-ember">Angola</span> jogam-se aqui.
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
          A casa oficial dos estúdios, criadores e jogadores angolanos.
        </p>
      </div>
    </section>
  );
}
