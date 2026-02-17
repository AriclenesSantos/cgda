import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Gamepad2, Building2, Target, Lightbulb, Handshake, Trophy, Code } from "lucide-react";

const stats = [
  { icon: Users, value: "+120", label: "Membros", color: "primary" as const },
  { icon: Building2, value: "+9", label: "Estúdios", color: "secondary" as const },
  { icon: Gamepad2, value: "+17", label: "Jogos", color: "accent" as const },
];

const objectives = [
  { icon: Handshake, text: "Unir desenvolvedores de jogos em Angola" },
  { icon: Lightbulb, text: "Capacitar novos talentos através de eventos e formações" },
  { icon: Trophy, text: "Promover os jogos angolanos nacional e internacionalmente" },
  { icon: Target, text: "Criar parcerias com empresas e instituições" },
  { icon: Code, text: "Organizar Game Jams e competições" },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-24 scanline">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/80 to-background" />
          <div className="absolute inset-0 cyber-grid opacity-30" />
          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <motion.img
                src="/logo-cgda.png"
                alt="CGDA"
                className="mx-auto mb-8 h-28 w-28 rounded-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              />
              <h1 className="text-5xl font-black uppercase tracking-wider text-gradient-neon sm:text-6xl">
                Sobre a CGDA
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                A Comunidade Game Dev Angola foi fundada em <span className="text-secondary font-semibold">2021</span> com a missão de
                unir, capacitar e promover os desenvolvedores de jogos digitais em Angola.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`group rounded-xl border border-border/30 bg-card/60 backdrop-blur-sm p-8 text-center transition-shadow duration-500 hover:${stat.color === "primary" ? "glow-red" : stat.color === "secondary" ? "glow-cyan" : "glow-purple"}`}
                >
                  <stat.icon className={`mx-auto h-8 w-8 text-${stat.color}`} />
                  <p className={`mt-4 text-4xl font-black text-${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Objectives */}
        <section className="py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-3xl font-black uppercase tracking-wider text-gradient-fire">
                  Nossa Missão
                </h2>
                <div className="mt-1 h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full" />
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  Promover o desenvolvimento de jogos digitais em Angola, criando um
                  ecossistema sustentável que valorize a cultura e identidade angolana
                  através dos jogos.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Acreditamos que os jogos digitais são uma ferramenta poderosa para
                  contar histórias, preservar a cultura e criar oportunidades económicas
                  para os jovens angolanos.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-black uppercase tracking-wider text-gradient-cyber">
                  Objetivos
                </h2>
                <div className="mt-1 h-1 w-16 bg-gradient-to-r from-secondary to-accent rounded-full" />
                <div className="mt-6 space-y-4">
                  {objectives.map((obj, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ x: 6 }}
                      className="group flex items-center gap-4 rounded-xl border border-border/30 bg-card/40 p-4 transition-all hover:neon-border-cyan"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                        <obj.icon className="h-5 w-5 text-secondary" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {obj.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
