import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Gamepad2, Building2 } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <img
                src="/logo-cgda.png"
                alt="CGDA"
                className="mx-auto mb-8 h-24 w-24 rounded-2xl"
              />
              <h1 className="font-display text-4xl font-black text-gradient">
                Sobre a CGDA
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                A Comunidade Game Dev Angola (CGDA) foi fundada em 2021 com a missão de
                unir, capacitar e promover os desenvolvedores de jogos digitais em Angola.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Users,
                  label: "+120 Membros",
                  desc: "Desenvolvedores, artistas, designers e entusiastas de jogos em Angola.",
                },
                {
                  icon: Building2,
                  label: "+9 Estúdios",
                  desc: "Estúdios independentes que criam jogos com identidade angolana.",
                },
                {
                  icon: Gamepad2,
                  label: "+17 Jogos",
                  desc: "Jogos lançados e em desenvolvimento pela comunidade.",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-border/50 bg-card p-6 text-center"
                >
                  <stat.icon className="mx-auto h-8 w-8 text-primary" />
                  <p className="mt-4 font-display text-2xl font-bold text-gradient">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6 text-muted-foreground"
            >
              <h2 className="font-display text-2xl font-bold text-foreground">
                Nossa Missão
              </h2>
              <p>
                Promover o desenvolvimento de jogos digitais em Angola, criando um
                ecossistema sustentável que valorize a cultura e identidade angolana
                através dos jogos.
              </p>
              <p>
                Acreditamos que os jogos digitais são uma ferramenta poderosa para
                contar histórias, preservar a cultura e criar oportunidades económicas
                para os jovens angolanos.
              </p>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Objetivos
              </h2>
              <ul className="list-inside list-disc space-y-2">
                <li>Unir desenvolvedores de jogos em Angola</li>
                <li>Capacitar novos talentos através de eventos e formações</li>
                <li>Promover os jogos angolanos nacional e internacionalmente</li>
                <li>Criar parcerias com empresas e instituições</li>
                <li>Organizar Game Jams e competições</li>
              </ul>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
