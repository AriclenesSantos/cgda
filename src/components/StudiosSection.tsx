import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { studios } from "@/data/studios";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

const neonColors = [
  "from-primary/30 to-accent/20",
  "from-secondary/30 to-primary/20",
  "from-accent/30 to-secondary/20",
  "from-secondary/30 to-accent/20",
  "from-primary/30 to-secondary/20",
  "from-accent/30 to-primary/20",
  "from-secondary/30 to-primary/20",
  "from-primary/30 to-accent/20",
  "from-accent/30 to-secondary/20",
];

const borderGlows = [
  "hover:glow-red",
  "hover:glow-cyan",
  "hover:glow-purple",
  "hover:glow-cyan",
  "hover:glow-red",
  "hover:glow-purple",
  "hover:glow-cyan",
  "hover:glow-red",
  "hover:glow-purple",
];

function TiltCard({ children, className, glow }: { children: React.ReactNode; className?: string; glow: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`${className} ${glow} transition-shadow duration-500`}
    >
      {children}
    </motion.div>
  );
}

const StudiosSection = () => {
  return (
    <section className="relative py-28 noise-overlay">
      <div className="absolute inset-0 cyber-grid opacity-50" />
      <div className="container relative z-10 mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-secondary">
            // os criadores
          </p>
          <h2 className="text-4xl font-black uppercase tracking-wider text-gradient-neon sm:text-5xl">
            Estúdios
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-neon rounded-full" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio, i) => (
            <motion.div
              key={studio.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <TiltCard glow={borderGlows[i % borderGlows.length]} className="h-full">
                <Link
                  to={`/estudio/${studio.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/30 bg-card/80 backdrop-blur-sm"
                >
                  {/* Gradient header */}
                  <div className={`h-32 bg-gradient-to-br ${neonColors[i % neonColors.length]} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className="text-6xl"
                        whileHover={{ scale: 1.3, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {studio.emoji}
                      </motion.span>
                    </div>
                    {/* Corner accent */}
                    <div className="absolute right-0 top-0 h-12 w-12 bg-gradient-to-bl from-secondary/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-black uppercase tracking-wide text-foreground group-hover:text-gradient-neon transition-all duration-300">
                        {studio.name}
                      </h3>
                      <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {studio.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse-neon" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                        Ver projetos
                      </span>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudiosSection;
