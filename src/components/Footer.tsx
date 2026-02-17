import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/20 bg-card/30">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <motion.img
            src="/logo-cgda.png"
            alt="CGDA"
            className="h-12 w-12 rounded-lg opacity-60"
            whileHover={{ opacity: 1, scale: 1.1 }}
          />
          <p className="text-lg font-black uppercase tracking-[0.2em] text-gradient-neon">
            Game Dev Angola
          </p>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Comunidade Game Dev Angola. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
