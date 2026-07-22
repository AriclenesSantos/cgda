import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Loader2, X, Gamepad2, Info, Image as ImageIcon, PlayCircle } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"about" | "media">("about");

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="grid min-h-[60vh] place-items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center text-center px-4">
          <div>
            <Gamepad2 className="mx-auto h-16 w-16 text-muted-foreground/20 mb-4" />
            <h1 className="font-display text-4xl uppercase tracking-wider">Jogo não encontrado</h1>
            <p className="mt-2 text-muted-foreground">O projeto que procura pode ter sido movido ou removido.</p>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-all">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Início
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const released = game.status === "Lançado";
  const shots = game.screenshots ?? [];
  const others = siblings.filter((g) => g.id !== game.id).slice(0, 4);
  const hasTrailer = !!(game.trailer_external_url || game.trailer_url);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      
      <main className="pt-20">
        {/* Immersive Hero Section */}
        <section className="relative min-h-[70vh] w-full flex items-end overflow-hidden">
          {/* Background Background */}
          <div className="absolute inset-0 -z-10">
            <img 
              src={gameCover(game)} 
              alt="" 
              className="absolute inset-0 h-full w-full object-cover scale-110 blur-xl opacity-30" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="container relative z-10 pb-12">
            <div className="grid gap-8 lg:grid-cols-[300px_1fr] items-end">
              {/* Game Cover Art */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-[3/4] w-full max-w-[280px] lg:max-w-none mx-auto lg:mx-0 overflow-hidden border-4 border-white/5 bg-black shadow-2xl shadow-black/50"
              >
                <img 
                  src={gameCover(game)} 
                  alt={game.title} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </motion.div>

              {/* Game Basic Info */}
              <div className="flex flex-col items-start text-left">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-wrap items-center gap-3 mb-4"
                >
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full ${
                    released ? "bg-primary text-primary-foreground" : "bg-ember text-white"
                  }`}>
                    {game.status}
                  </span>
                  {game.genre && (
                    <span className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white rounded-full">
                      {game.genre}
                    </span>
                  )}
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-none tracking-tighter text-white mb-4 drop-shadow-2xl"
                >
                  {game.title}
                </motion.h1>

                {studio && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link 
                      to={`/estudio/${studio.id}`} 
                      className="group flex items-center gap-3 text-white/80 hover:text-primary transition-colors"
                    >
                      <div className="h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-sm">
                        <img src={studio.logo_url || "/placeholder.svg"} alt={studio.name} className="h-full w-full object-contain" />
                      </div>
                      <span className="text-sm uppercase tracking-widest">Desenvolvido por <b className="text-white group-hover:text-primary transition-colors">{studio.name}</b></span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Navigation (Tabs) */}
        <nav className="sticky top-[72px] z-40 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="container flex gap-8">
            <button 
              onClick={() => setActiveTab("about")}
              className={`relative py-4 text-xs uppercase tracking-widest font-bold transition-colors ${activeTab === "about" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <span className="flex items-center gap-2"><Info className="h-4 w-4" /> Sobre</span>
              {activeTab === "about" && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button 
              onClick={() => setActiveTab("media")}
              className={`relative py-4 text-xs uppercase tracking-widest font-bold transition-colors ${activeTab === "media" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <span className="flex items-center gap-2"><PlayCircle className="h-4 w-4" /> Media {(shots.length > 0 || hasTrailer) && `(${shots.length + (hasTrailer ? 1 : 0)})`}</span>
              {activeTab === "media" && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          </div>
        </nav>

        <div className="container py-12">
          <AnimatePresence mode="wait">
            {activeTab === "about" ? (
              <motion.div 
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid gap-12 lg:grid-cols-[1fr_350px]"
              >
                {/* Description and Links */}
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-wide mb-6 flex items-center gap-3">
                    <span className="h-8 w-1 bg-primary" />
                    Descrição do Projeto
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                    {game.description}
                  </p>

                  {game.links?.length > 0 && (
                    <div className="mt-10">
                      <h4 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Onde Jogar / Comprar</h4>
                      <div className="flex flex-wrap gap-3">
                        {game.links.map((l) => (
                          <a 
                            key={l.label} 
                            href={l.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 border border-border bg-surface px-6 py-4 text-sm font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all group"
                          >
                            {l.label} <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Info Card */}
                <aside className="space-y-8">
                  <div className="bg-surface border border-border p-8 rounded-sm">
                    <h3 className="font-display text-lg uppercase tracking-widest mb-6 border-b border-border pb-4">Detalhes Técnicos</h3>
                    <dl className="space-y-6">
                      <InfoRow label="Plataformas" value={game.platforms.join(", ") || "Não especificado"} />
                      <InfoRow label="Género" value={game.genre || "N/A"} />
                      <InfoRow label="Estúdio" value={studio?.name || "N/A"} />
                      <InfoRow label="Localização" value={studio?.location || "Angola"} />
                      <InfoRow label="Lançamento" value={game.status} />
                    </dl>
                  </div>

                  {studio && (
                    <div className="bg-primary/5 border border-primary/10 p-8 rounded-sm">
                      <h3 className="font-display text-sm uppercase tracking-widest text-primary mb-4">Sobre o Estúdio</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{studio.description}</p>
                      <Link to={`/estudio/${studio.id}`} className="text-xs uppercase tracking-widest font-bold text-primary hover:underline">
                        Ver perfil completo →
                      </Link>
                    </div>
                  )}
                </aside>
              </motion.div>
            ) : (
              <motion.div 
                key="media"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-16"
              >
                {/* Trailer Section */}
                {(game.trailer_external_url || game.trailer_url) && (
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-wide mb-8 flex items-center gap-3">
                      <span className="h-8 w-1 bg-primary" />
                      Trailer Oficial
                    </h3>
                    <div className="aspect-video w-full max-w-5xl mx-auto border border-border bg-black shadow-2xl overflow-hidden">
                      {game.trailer_external_url ? (
                        <VideoEmbed url={game.trailer_external_url} poster={gameCover(game)} />
                      ) : (
                        <VideoPlayer src={game.trailer_url!} poster={gameCover(game)} />
                      )}
                    </div>
                  </div>
                )}

                {/* Screenshots Gallery */}
                {shots.length > 0 && (
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-wide mb-8 flex items-center gap-3">
                      <span className="h-8 w-1 bg-primary" />
                      Galeria de Imagens
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {shots.map((url, i) => (
                        <motion.button 
                          key={url} 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setLightbox(i)}
                          className="group relative aspect-video overflow-hidden border border-border bg-surface"
                        >
                          <img 
                            src={url} 
                            alt={`${game.title} screenshot ${i + 1}`} 
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-white" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {(!hasTrailer && shots.length === 0) && (
                  <div className="text-center py-20 bg-surface border border-dashed border-border">
                    <PlayCircle className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground uppercase tracking-widest text-xs">Nenhuma media disponível para este jogo.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related Games */}
        {others.length > 0 && (
          <section className="py-24 border-t border-border bg-surface/30">
            <div className="container">
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-display text-3xl uppercase tracking-tight">Mais de {studio?.name}</h2>
                <Link to={`/estudio/${studio?.id}`} className="text-xs uppercase tracking-widest font-bold text-primary hover:underline">Ver Todos</Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {others.map((g) => <GameCard key={g.id} game={g} studio={studio ?? undefined} />)}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Lightbox Overlay */}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">{label}</dt>
      <dd className="text-sm text-foreground/90 font-medium">{value}</dd>
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 backdrop-blur-xl" onClick={onClose}>
      <button 
        onClick={onClose} 
        className="absolute right-6 top-6 z-50 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary transition-colors"
      >
        <X className="h-6 w-6" />
      </button>
      
      <div className="relative w-full max-w-6xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <motion.img 
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          src={images[index]} 
          alt="" 
          className="max-h-[85vh] w-auto object-contain shadow-2xl" 
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={() => onIndex((index - 1 + images.length) % images.length)}
              className="absolute left-0 h-16 w-16 flex items-center justify-center rounded-full bg-black/50 text-white hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
            <button 
              onClick={() => onIndex((index + 1) % images.length)}
              className="absolute right-0 h-16 w-16 flex items-center justify-center rounded-full bg-black/50 text-white hover:text-primary transition-colors"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/60 text-xs uppercase tracking-widest font-bold">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GamePage;
