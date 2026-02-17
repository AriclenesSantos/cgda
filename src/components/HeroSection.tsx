import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const FloatingParticle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute h-1 w-1 rounded-full bg-secondary"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -30, 0],
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const GlitchText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      {isGlitching && (
        <>
          <span className="absolute inset-0 text-secondary opacity-70" style={{ transform: 'translate(-2px, -1px)', clipPath: 'inset(10% 0 60% 0)' }}>
            {children}
          </span>
          <span className="absolute inset-0 text-primary opacity-70" style={{ transform: 'translate(2px, 1px)', clipPath: 'inset(50% 0 10% 0)' }}>
            {children}
          </span>
        </>
      )}
      {children}
    </span>
  );
};

const CountUp = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / 40;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 30);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 3,
}));

const HeroSection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [0, window.innerWidth], [10, -10]);
  const bgY = useTransform(mouseY, [0, window.innerHeight], [10, -10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden scanline"
      onMouseMove={handleMouseMove}
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-[-20px]"
        style={{ x: bgX, y: bgY }}
      >
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-40" />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
      <div className="absolute inset-0 cyber-grid" />

      {/* Floating particles */}
      {particles.map((p) => (
        <FloatingParticle key={p.id} delay={p.delay} x={p.x} y={p.y} />
      ))}

      {/* Animated neon lines */}
      <motion.div
        className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute left-0 top-2/3 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        animate={{ opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Logo with neon glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="relative mx-auto mb-10"
        >
          <div className="relative mx-auto h-36 w-36">
            <motion.div
              className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <img
              src="/logo-cgda.png"
              alt="CGDA Logo"
              className="relative z-10 h-36 w-36 rounded-2xl animate-float-slow"
            />
          </div>
        </motion.div>

        {/* Title with glitch effect */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl font-black uppercase tracking-wider sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <GlitchText className="text-gradient-neon">
            Game Dev
          </GlitchText>
          <br />
          <GlitchText className="text-gradient-fire">
            Angola
          </GlitchText>
        </motion.h1>

        {/* Subtitle with typing effect */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          A maior comunidade de desenvolvedores de jogos de Angola.
          <br />
          <span className="text-secondary">Criando o futuro dos jogos africanos.</span>
        </motion.p>

        {/* Stats with neon counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {[
            { value: 120, suffix: "+", label: "Membros", color: "primary" as const },
            { value: 9, suffix: "+", label: "Estúdios", color: "secondary" as const },
            { value: 17, suffix: "+", label: "Jogos", color: "accent" as const },
          ].map((stat) => (
            <div key={stat.label} className="group text-center">
              <p className={`font-display text-4xl font-black text-${stat.color} sm:text-5xl`}>
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mx-auto h-10 w-6 rounded-full border-2 border-muted-foreground/30 p-1"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-secondary"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
