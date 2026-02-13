import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
      <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/logo-cgda.png"
            alt="CGDA Logo"
            className="mx-auto mb-8 h-32 w-32 animate-float rounded-2xl"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl font-black tracking-tight text-gradient sm:text-5xl md:text-6xl"
        >
          Comunidade Game Dev Angola
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Criada em 2021, a CGDA reúne mais de 120 membros apaixonados pelo
          desenvolvimento de jogos em Angola.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <span className="rounded-full bg-primary/20 px-4 py-1.5 text-sm font-semibold text-primary">
            +120 Membros
          </span>
          <span className="rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-semibold text-secondary">
            +9 Estúdios
          </span>
          <span className="rounded-full bg-primary/20 px-4 py-1.5 text-sm font-semibold text-primary">
            +17 Jogos
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
