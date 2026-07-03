import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Gamepad2, LogIn, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/", label: "Início" },
  { to: "/#estudios", label: "Estúdios" },
  { to: "/#jogos", label: "Jogos" },
  { to: "/#eventos", label: "Eventos" },
  { to: "/sobre", label: "Sobre" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md bg-surface ring-1 ring-border">
            <img src="/logo-cgda.png" alt="CGDA" className="h-full w-full object-contain p-1" />
            <span className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-primary/0 transition-all group-hover:ring-primary/60" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-widest text-foreground">CGDA</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Game Dev Angola
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const base =
              "relative px-4 py-2 font-display text-sm uppercase tracking-[0.18em] transition-colors";
            if (item.to.includes("#")) {
              return (
                <a
                  key={item.to}
                  href={item.to}
                  className={`${base} text-muted-foreground hover:text-foreground`}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `${base} ${
                    isActive
                      ? "text-foreground after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-2 font-display text-xs uppercase tracking-[0.22em] text-foreground hover:border-primary hover:text-primary"
            >
              <LayoutDashboard className="h-4 w-4" /> Painel
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-2 font-display text-xs uppercase tracking-[0.22em] text-foreground hover:border-primary hover:text-primary"
            >
              <LogIn className="h-4 w-4" /> Entrar
            </Link>
          )}
          <a
            href="/#jogos"
            className="clip-tab inline-flex items-center gap-2 bg-ember px-5 py-2.5 font-display text-sm uppercase tracking-[0.18em] text-white shadow-ember transition-transform hover:scale-[1.03]"
          >
            <Gamepad2 className="h-4 w-4" />
            Explorar
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md border border-border bg-surface md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container flex flex-col py-4">
            {nav.map((item) =>
              item.to.includes("#") ? (
                <a
                  key={item.to}
                  href={item.to}
                  className="px-2 py-3 font-display text-base uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `px-2 py-3 font-display text-base uppercase tracking-[0.18em] ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 border border-border bg-surface px-4 py-3 font-display text-xs uppercase tracking-[0.22em] text-foreground"
                >
                  <LayoutDashboard className="h-4 w-4" /> Painel
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 border border-border bg-surface px-4 py-3 font-display text-xs uppercase tracking-[0.22em] text-foreground"
                >
                  <LogIn className="h-4 w-4" /> Entrar
                </Link>
              )}
              <a
                href="/#jogos"
                className="clip-tab inline-flex items-center justify-center gap-2 bg-ember px-5 py-3 font-display text-sm uppercase tracking-[0.18em] text-white shadow-ember"
              >
                <Gamepad2 className="h-4 w-4" /> Explorar
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
