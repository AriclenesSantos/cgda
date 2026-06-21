import { motion } from "framer-motion";
import { ArrowRight, Play, Users, Building2, Gamepad2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { games, studios } from "@/data/studios";

export default function HeroSection() {
  const released = games.filter((g) => g.status === "Lançado").length;

  return (
    <section className="relative isolate overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroBg}
          alt=""
          className="h-full w-full object-cover opacity-70"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-primary">
            <span className="h-1.5 w-1.5 animate-ember-pulse rounded-full bg-primary" />
            Comunidade · Desde 2021
          </div>

          <h1 className="mt-6 font-display text-6xl uppercase leading-[0.95] tracking-wide sm:text-7xl md:text-8xl">
            Os jogos de
            <br />
            <span className="text-ember">Angola</span> jogam-se aqui.
          </h1>

          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            A casa oficial dos estúdios, criadores e jogadores angolanos. Descobre
            todos os jogos feitos em Angola — lançados ou em desenvolvimento —
            num só lugar.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#jogos"
              className="clip-tab group inline-flex items-center gap-2 bg-ember px-6 py-3 font-display text-sm uppercase tracking-[0.2em] text-white shadow-ember transition-transform hover:scale-[1.03]"
            >
              <Play className="h-4 w-4 fill-white" />
              Ver catálogo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#estudios"
              className="inline-flex items-center gap-2 border border-border bg-surface/70 px-6 py-3 font-display text-sm uppercase tracking-[0.2em] text-foreground backdrop-blur-sm transition-colors hover:border-primary/60 hover:text-primary"
            >
              Conhecer estúdios
            </a>
          </div>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-16 grid max-w-3xl grid-cols-3 divide-x divide-border border border-border bg-surface/60 backdrop-blur-sm"
        >
          {[
            { icon: Users, value: "+120", label: "Membros" },
            { icon: Building2, value: `${studios.length}`, label: "Estúdios" },
            { icon: Gamepad2, value: `${released}+`, label: "Jogos" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 px-5 py-4">
              <s.icon className="h-5 w-5 text-primary" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-3xl tracking-wide text-foreground">{s.value}</span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
