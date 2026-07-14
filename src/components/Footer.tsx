import { Link } from "react-router-dom";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border bg-surface/40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <BrandLogo className="h-28 w-28 object-contain" />
          <div className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Fundada em 2021 · Luanda
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Unindo estúdios, desenvolvedores, artistas e jogadores para construir uma
            indústria de jogos forte, criativa e profundamente angolana.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.2em] text-foreground">Navegar</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Início</Link></li>
            <li><a href="/#estudios" className="hover:text-primary">Estúdios</a></li>
            <li><a href="/#jogos" className="hover:text-primary">Jogos</a></li>
            <li><Link to="/sobre" className="hover:text-primary">Sobre</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.2em] text-foreground">Comunidade</h4>
          <div className="mt-4 flex gap-2">
            {[Instagram, Github, Linkedin, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} CGDA — Todos os direitos reservados.</span>
          <span className="font-display tracking-[0.2em] uppercase">Made in Angola 🇦🇴</span>
        </div>
      </div>
    </footer>
  );
}
