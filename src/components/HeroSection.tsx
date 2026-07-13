import { motion } from "framer-motion";
import { ArrowRight, Play, Users, Building2, Gamepad2 } from "lucide-react";
import { useCounts, useSiteStat } from "@/lib/catalog";

export default function HeroSection() {
  const { studios: studioCount, games: gameCount } = useCounts();
  const { value: membersRaw } = useSiteStat("members_count");
  const { value: gamesLabelRaw } = useSiteStat("games_label");

  const members = membersRaw ? `+${membersRaw}` : "+120";
  const gamesLabel = gamesLabelRaw || `${gameCount}+`;

  return (
    <section className="relative isolate overflow-hidden bg-background pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Fundo sólido — pronto para receber ilustrações depois */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="font-display text-6xl uppercase leading-[0.95] tracking-wide sm:text-7xl md:text-8xl">
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
              className="clip-tab group inline-flex items-center gap-2 bg-ember px-6 py-3 font-display text-sm uppercase tracking-[0.2em] text-primary-foreground shadow-ember transition-transform hover:scale-[1.03]"
            >
              <Play className="h-4 w-4 fill-current" />
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-16 grid max-w-3xl grid-cols-3 divide-x divide-border border border-border bg-surface/60 backdrop-blur-sm"
        >
          {[
            { icon: Users, value: members, label: "Membros" },
            { icon: Building2, value: `${studioCount || 0}`, label: "Estúdios" },
            { icon: Gamepad2, value: gamesLabel, label: "Jogos" },
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
