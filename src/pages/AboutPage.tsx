import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Gamepad2, Building2, Target, Lightbulb, Handshake, Trophy, Code } from "lucide-react";
import { studios, games } from "@/data/studios";
import cgdaFull from "@/assets/brand/cgda-full.png.asset.json";
import cgdaWhite from "@/assets/brand/cgda-white.png.asset.json";
import { useTheme } from "@/lib/theme";

const objectives = [
  { icon: Handshake, text: "Unir desenvolvedores de jogos em Angola" },
  { icon: Lightbulb, text: "Capacitar novos talentos com eventos e formações" },
  { icon: Trophy, text: "Promover os jogos angolanos nacional e internacionalmente" },
  { icon: Target, text: "Criar parcerias com empresas e instituições" },
  { icon: Code, text: "Organizar Game Jams e competições" },
];

export default function AboutPage() {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? cgdaWhite.url : cgdaFull.url;
  const stats = [
    { icon: Users, value: "+120", label: "Membros" },
    { icon: Building2, value: `${studios.length}`, label: "Estúdios" },
    { icon: Gamepad2, value: `${games.length}+`, label: "Jogos" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,hsl(354_100%_50%_/_0.18),transparent_60%)]" />
          <div className="container py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src="/logo-cgda.png" alt="CGDA" className="mx-auto h-20 w-20" />
              <span className="mt-6 inline-block font-display text-xs uppercase tracking-[0.3em] text-primary">
                Sobre nós
              </span>
              <h1 className="mt-3 font-display text-6xl uppercase tracking-wide md:text-8xl">
                Comunidade <span className="text-ember">Game Dev</span> Angola
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
                Fundada em 2021, a CGDA reúne estúdios, programadores, artistas e
                jogadores com uma missão: construir uma indústria de jogos angolana
                forte, criativa e reconhecida globalmente.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid gap-px border border-border bg-border md:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="bg-surface p-8 text-center">
                  <s.icon className="mx-auto h-6 w-6 text-primary" />
                  <div className="mt-4 font-display text-5xl text-foreground">{s.value}</div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="container grid gap-12 md:grid-cols-2">
            <div>
              <span className="font-display text-xs uppercase tracking-[0.3em] text-primary">Missão</span>
              <h2 className="mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">
                Construir um ecossistema sustentável.
              </h2>
              <p className="mt-5 text-muted-foreground">
                Promover o desenvolvimento de jogos digitais em Angola, valorizando a
                cultura e identidade angolana através de experiências interativas.
              </p>
              <p className="mt-4 text-muted-foreground">
                Os jogos são uma ferramenta poderosa para contar histórias, preservar a
                cultura e gerar oportunidades económicas para a juventude angolana.
              </p>
            </div>

            <div>
              <span className="font-display text-xs uppercase tracking-[0.3em] text-primary">Objetivos</span>
              <h2 className="mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">
                O que perseguimos.
              </h2>
              <ul className="mt-6 space-y-3">
                {objectives.map((o, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 border border-border bg-surface p-4 transition-colors hover:border-primary/60"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center border border-border bg-background text-primary">
                      <o.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-foreground">{o.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
