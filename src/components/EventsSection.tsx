import { Calendar, Globe2, Trophy } from "lucide-react";
import { events } from "@/data/studios";
import { SectionHeader } from "./StudiosSection";

export default function EventsSection() {
  return (
    <section id="eventos" className="relative py-24">
      <div className="container">
        <SectionHeader
          eyebrow="03 · Eventos"
          title="Onde a comunidade encontra-se"
          subtitle="Game Jams, competições e encontros que movimentam a cena angolana."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {events.map((ev, i) => {
            const intl = ev.type === "internacional";
            const Icon = intl ? Globe2 : i === 0 ? Trophy : Calendar;
            return (
              <div
                key={ev.name}
                className="group relative flex items-start gap-5 border border-border bg-surface p-6 transition-colors hover:border-primary/60"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center border border-border bg-background text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {intl ? "Internacional" : "Nacional"}
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="mt-2 font-display text-2xl uppercase tracking-wide text-foreground">
                    {ev.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{ev.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
