import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { studios, getGamesByStudio } from "@/data/studios";

export default function StudiosSection() {
  return (
    <section id="estudios" className="relative py-24">
      <div className="container">
        <SectionHeader
          eyebrow="01 · Estúdios"
          title="Quem está a construir"
          subtitle="Estúdios angolanos a fazer história — do mobile ao Steam."
        />

        {/* Bento grid: 1 destaque grande + restantes em grelha */}
        <div className="mt-12 grid auto-rows-[minmax(180px,_auto)] grid-cols-1 gap-4 md:grid-cols-6">
          {studios.map((s, i) => {
            const count = getGamesByStudio(s.id).length;
            const featured = i === 0;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
                className={`group relative ${featured ? "md:col-span-3 md:row-span-2" : "md:col-span-2"}`}
              >
                <Link
                  to={`/estudio/${s.id}`}
                  className="clip-corner relative flex h-full flex-col overflow-hidden border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/60"
                >
                  {/* Glow on hover */}
                  <div className="pointer-events-none absolute -inset-px -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10" />
                  </div>
                  {/* Index ribbon */}
                  <div className="flex items-start justify-between">
                    <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Studio · {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background/50 text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="mt-auto pt-6">
                    <h3
                      className={`font-display uppercase leading-none text-foreground ${
                        featured ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl"
                      }`}
                    >
                      {s.name}
                    </h3>
                    <p
                      className={`mt-3 text-muted-foreground ${
                        featured ? "max-w-md text-base" : "text-sm line-clamp-2"
                      }`}
                    >
                      {s.description}
                    </p>

                    <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      <span>
                        <span className="text-primary font-semibold">{count}</span> projeto{count !== 1 ? "s" : ""}
                      </span>
                      <span className="h-3 w-px bg-border" />
                      <span className="text-foreground/70 group-hover:text-primary transition-colors">
                        Ver perfil →
                      </span>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute right-0 top-0 h-12 w-12 stripes opacity-60" />
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
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
      <div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {eyebrow}
        </div>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-wide sm:text-5xl md:text-6xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">{subtitle}</p>
        )}
      </div>
      {actions}
    </div>
  );
}
