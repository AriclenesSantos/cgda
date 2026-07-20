import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNewsItem } from "@/lib/catalog";

export default function NewsPage() {
  const { id } = useParams();
  const { item, loading } = useNewsItem(id);

  if (loading) return <div className="min-h-screen bg-background" />;

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container pt-32 pb-20">
          <h1 className="font-display text-4xl uppercase">Notícia não encontrada</h1>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-primary">
            <ArrowLeft className="h-4 w-4" /> Voltar ao início
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const date = new Date(item.created_at).toLocaleDateString("pt-PT", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        {item.cover_url && (
          <div className="relative w-full bg-surface">
            <img
              src={item.cover_url}
              alt={item.title}
              className="mx-auto max-h-[70vh] w-full object-cover"
            />
          </div>
        )}
        <article className="container max-w-3xl pt-10">
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-3 w-3" /> Voltar
          </Link>
          <div className="mt-6 text-xs uppercase tracking-[0.3em] text-primary">{date}</div>
          <h1 className="mt-3 font-display text-4xl uppercase leading-tight md:text-6xl">
            {item.title}
          </h1>
          <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
            {item.content}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
