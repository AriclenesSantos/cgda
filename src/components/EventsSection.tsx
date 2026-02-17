import { motion } from "framer-motion";
import { events } from "@/data/studios";
import { Calendar, Globe, Zap } from "lucide-react";

const EventsSection = () => {
  const nacionais = events.filter((e) => e.type === "nacional");
  const internacionais = events.filter((e) => e.type === "internacional");

  return (
    <section className="relative py-28 noise-overlay">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
            // participe
          </p>
          <h2 className="text-4xl font-black uppercase tracking-wider text-gradient-cyber sm:text-5xl">
            Eventos
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-secondary to-accent rounded-full" />
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Nacionais */}
          <div>
            <h3 className="mb-6 flex items-center gap-3 text-lg font-black uppercase tracking-wider text-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 neon-border-red">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              Nacionais
            </h3>
            <div className="space-y-4">
              {nacionais.map((event, i) => (
                <motion.div
                  key={event.name}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 hover:neon-border-red"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/50 group-hover:bg-primary transition-colors" />
                  <div className="flex items-start gap-3">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary transition-colors">
                        {event.name}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Internacionais */}
          <div>
            <h3 className="mb-6 flex items-center gap-3 text-lg font-black uppercase tracking-wider text-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 neon-border-cyan">
                <Globe className="h-5 w-5 text-secondary" />
              </div>
              Internacionais
            </h3>
            <div className="space-y-4">
              {internacionais.map((event, i) => (
                <motion.div
                  key={event.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 hover:neon-border-cyan"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary/50 group-hover:bg-secondary transition-colors" />
                  <div className="flex items-start gap-3">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-secondary transition-colors">
                        {event.name}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
