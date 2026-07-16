import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Loader2 } from "lucide-react";

interface Props {
  src: string;
  poster?: string;
  autoPlay?: boolean;
}

function fmt(t: number) {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Player CGDA — controlo próprio, cores da plataforma, sem download. */
export default function VideoPlayer({ src, poster, autoPlay }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const hideTimer = useRef<number | null>(null);

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowUI(false), 2200);
  }, []);
  const ping = useCallback(() => { setShowUI(true); scheduleHide(); }, [scheduleHide]);

  const toggle = () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) v.play(); else v.pause();
  };
  const toggleMute = () => {
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current; if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * duration;
  };
  const fullscreen = () => {
    const el = wrapRef.current; if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!wrapRef.current?.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (e.key === " ") { e.preventDefault(); toggle(); }
      if (e.key === "m") toggleMute();
      if (e.key === "f") fullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="group relative aspect-video w-full overflow-hidden border border-border bg-black select-none"
      onMouseMove={ping}
      onMouseLeave={() => setShowUI(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        preload="metadata"
        controls={false}
        controlsList="nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
        onClick={toggle}
        onPlay={() => { setPlaying(true); ping(); }}
        onPause={() => { setPlaying(false); setShowUI(true); }}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onProgress={(e) => {
          const b = e.currentTarget.buffered;
          if (b.length) setBuffered(b.end(b.length - 1));
        }}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        className="h-full w-full object-contain"
      />

      {/* Big play overlay */}
      {!playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Reproduzir"
          className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/60 via-black/10 to-transparent"
        >
          <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_hsl(var(--primary)/0.6)] transition-transform hover:scale-110">
            <Play className="h-8 w-8 translate-x-0.5 fill-current" />
          </span>
        </button>
      )}

      {waiting && playing && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {/* Controls bar */}
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 pb-3 pt-8 transition-opacity duration-200 ${
          showUI || !playing ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* progress */}
        <div
          onClick={seek}
          className="group/bar relative h-1.5 cursor-pointer bg-white/15"
        >
          <div className="absolute inset-y-0 left-0 bg-white/25" style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }} />
          <div className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.9)]" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }} />
          <div className="absolute -top-1 -translate-x-1/2 opacity-0 transition-opacity group-hover/bar:opacity-100" style={{ left: `${duration ? (progress / duration) * 100 : 0}%` }}>
            <span className="block h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
          </div>
        </div>

        <div className="flex items-center gap-3 text-white">
          <button type="button" onClick={toggle} aria-label={playing ? "Pausar" : "Reproduzir"} className="transition-colors hover:text-primary">
            {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
          </button>
          <button type="button" onClick={toggleMute} aria-label={muted ? "Ativar som" : "Silenciar"} className="transition-colors hover:text-primary">
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <div className="font-display text-[11px] uppercase tracking-[0.22em] text-white/80 tabular-nums">
            {fmt(progress)} <span className="text-white/40">/ {fmt(duration)}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-display text-[10px] uppercase tracking-[0.3em] text-primary sm:inline">CGDA · Player</span>
            <button type="button" onClick={fullscreen} aria-label="Ecrã inteiro" className="transition-colors hover:text-primary">
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
