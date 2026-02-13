import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { studios } from "@/data/studios";

const StudiosSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center font-display text-3xl font-bold tracking-tight text-gradient">
          Estúdios Angolanos
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio, i) => (
            <motion.div
              key={studio.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                to={`/estudio/${studio.id}`}
                className="group block rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:glow-red"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-gaming text-2xl">
                  {studio.emoji}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                  {studio.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {studio.description}
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-semibold text-primary">
                  Ver projetos →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudiosSection;
