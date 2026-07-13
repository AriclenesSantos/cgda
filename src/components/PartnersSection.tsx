import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePartners } from "@/lib/catalog";
import { SectionHeader } from "./StudiosSection";

export default function PartnersSection() {
  const { partners, loading } = usePartners();
  if (!loading && partners.length === 0) return null;

  return (
    <section id="parceiros" className="relative py-24">
      <div className="container">
        <SectionHeader
          eyebrow="04 · Parceiros"
          title="Quem caminha connosco"
          subtitle="Instituições e organizações que apoiam a construção da indústria angolana de jogos."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.website || "#"}
              target={p.website ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="clip-corner group relative flex flex-col gap-4 border border-border bg-surface p-6 transition-all hover:border-primary/60"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-md border border-border bg-background">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} className="h-full w-full object-contain p-2 grayscale transition-all group-hover:grayscale-0" />
                  ) : (
                    <span className="font-display text-2xl text-muted-foreground">{p.name.charAt(0)}</span>
                  )}
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-foreground">{p.name}</h3>
                {p.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
