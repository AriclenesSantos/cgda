import { motion } from "framer-motion";
import { events } from "@/data/studios";
import { Calendar, Globe } from "lucide-react";

const EventsSection = () => {
  const nacionais = events.filter((e) => e.type === "nacional");
  const internacionais = events.filter((e) => e.type === "internacional");

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight text-gradient">
          Eventos
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Nacionais */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              Nacionais
            </h3>
            <div className="space-y-4">
              {nacionais.map((event, i) => (
                <motion.div
                  key={event.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <h4 className="font-display text-sm font-bold text-foreground">
                    {event.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {event.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Internacionais */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <Globe className="h-5 w-5 text-secondary" />
              Internacionais
            </h3>
            <div className="space-y-4">
              {internacionais.map((event, i) => (
                <motion.div
                  key={event.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-secondary/30"
                >
                  <h4 className="font-display text-sm font-bold text-foreground">
                    {event.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {event.description}
                  </p>
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
