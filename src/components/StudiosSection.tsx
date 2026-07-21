import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useStudios, useGames, studioCover } from "@/lib/catalog";

export default function StudiosSection() {
  const { studios } = useStudios();
  const { games } = useGames();
  const countFor = (id: string) => games.filter((g) => g.studio_id === id).length;

  return (
    <section id="estudios" className="relative py-24">
      <div className="container">
        <SectionHeader
          eyebrow="03 · Estúdios"
          title="Quem está a construir"
          subtitle="Estúdios angolanos a fazer história — do mobile ao Steam."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {studios.map((s, i) => {
            const count = countFor(s.id);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
              >
                <Link
                  to={`/estudio/${s.id}`}
                  className="group relative flex h-full flex-col overflow-hidden border border-border bg-surface transition-all duration-300 hover:border-primary/60 hover-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-background">
                    <img
                      src={studioCover(s)}
                      alt={s.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-2 border-t border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                        Studio · {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="grid h-7 w-7 place-items-center rounded-full border border-border bg-background/50 text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    <h3 className="font-display text-base uppercase leading-tight tracking-wide text-foreground sm:text-lg">
                      {s.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {s.tagline || s.description}
                    </p>

                    <div className="mt-auto flex items-center gap-3 border-t border-border pt-2 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span>
                        <span className="text-primary font-semibold">{count}</span> projeto{count !== 1 ? "s" : ""}
                      </span>
                      <span className="h-3 w-px bg-border" />
                      <span className="text-foreground/70 group-hover:text-primary transition-colors">
                        Ver perfil →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow, title, subtitle, actions,
}: {
  eyebrow: string; title: string; subtitle?: string; actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
      <div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {eyebrow}
        </div>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-wide sm:text-5xl md:text-6xl">{title}</h2>
        {subtitle && (
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">{subtitle}</p>
        )}
      </div>
      {actions}
    </div>
  );
}
