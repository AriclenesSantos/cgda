import { motion } from "framer-motion";
import { Users, Gamepad2, Sparkles, Target } from "lucide-react";
import { SectionHeader } from "./StudiosSection";
import { useCounts } from "@/lib/catalog";

const pillars = [
  {
    icon: Users,
    title: "Comunidade",
    text: "Reunimos estúdios, programadores, artistas e jogadores num só espaço para partilhar, aprender e crescer.",
  },
  {
    icon: Gamepad2,
    title: "Indústria",
    text: "Impulsionamos a produção de jogos angolanos com identidade própria, do mobile ao PC e consolas.",
  },
  {
    icon: Sparkles,
    title: "Criatividade",
    text: "Valorizamos histórias, personagens e estéticas que nascem de Angola e falam ao mundo.",
  },
  {
    icon: Target,
    title: "Formação",
    text: "Promovemos game jams, workshops e encontros que formam a próxima geração de criadores.",
  },
];

export default function AboutCgdaSection() {
  const { studios, games } = useCounts();
  return (
    <section id="sobre-cgda" className="relative py-24">
      <div className="container">
        <SectionHeader
          eyebrow="01 · Sobre"
          title="Comunidade Game Dev Angola"
          subtitle="A CGDA existe para dar voz, estrutura e visibilidade aos criadores de jogos de Angola — conectando talento local a um mercado global."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative flex flex-col gap-3 border border-border bg-surface p-5 transition-colors hover:border-primary/60"
            >
              <div className="grid h-11 w-11 place-items-center border border-border bg-background text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg uppercase tracking-wide text-foreground">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 border border-border bg-surface/40 p-6 sm:grid-cols-3">
          <Stat value={studios} label="Estúdios" />
          <Stat value={games} label="Jogos no catálogo" />
          <Stat value="2021" label="Fundada em" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="font-display text-4xl text-primary md:text-5xl">{value}</span>
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
