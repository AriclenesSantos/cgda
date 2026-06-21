import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Gamepad2 } from "lucide-react";

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
            const isHash = item.to.includes("#");
            const Comp: any = isHash ? "a" : NavLink;
            const props: any = isHash
              ? { href: item.to }
              : { to: item.to, end: item.to === "/" };
            return (
              <Comp
                key={item.to}
                {...props}
                className={({ isActive }: { isActive?: boolean }) =>
                  `relative px-4 py-2 font-display text-sm uppercase tracking-[0.18em] transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </Comp>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <a
            href="#jogos"
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
          </div>
        </div>
      )}
    </header>
  );
}
