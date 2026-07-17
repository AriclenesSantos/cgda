import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { studioImages, gameImages } from "@/data/images";

export interface StudioRow {
  id: string;
  name: string;
  tagline: string | null;
  description: string;
  location: string | null;
  founded_year: number | null;
  website: string | null;
  logo_url: string | null;
}

export interface GameRow {
  id: string;
  studio_id: string;
  title: string;
  description: string;
  genre: string | null;
  status: string;
  platforms: string[];
  cover_url: string | null;
  trailer_url: string | null;
  screenshots: string[];
  links: { label: string; url: string }[];
  sort_order: number;
}

export interface PartnerRow {
  id: string;
  name: string;
  description: string;
  website: string | null;
  logo_url: string | null;
  sort_order: number;
}

export function usePartners() {
  const [data, setData] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    (supabase as any).from("partners").select("*").order("sort_order").then(({ data }: any) => {
      if (!alive) return;
      setData((data as PartnerRow[]) ?? []);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);
  return { partners: data, loading };
}

export function useSiteStat(key: string) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    (supabase as any).from("site_stats").select("value").eq("key", key).maybeSingle().then(({ data }: any) => {
      if (!alive) return;
      setValue(data?.value ?? null);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [key]);
  return { value, loading };
}

export function useCounts() {
  const [counts, setCounts] = useState<{ studios: number; games: number }>({ studios: 0, games: 0 });
  useEffect(() => {
    let alive = true;
    Promise.all([
      supabase.from("studios").select("id", { count: "exact", head: true }),
      supabase.from("games").select("id", { count: "exact", head: true }),
    ]).then(([s, g]) => {
      if (!alive) return;
      setCounts({ studios: s.count ?? 0, games: g.count ?? 0 });
    });
    return () => { alive = false; };
  }, []);
  return counts;
}

export function studioCover(s: Pick<StudioRow, "id" | "logo_url">): string {
  return s.logo_url || studioImages[s.id] || "";
}
export function gameCover(g: Pick<GameRow, "id" | "cover_url">): string {
  return g.cover_url || gameImages[g.id] || "";
}

export function useStudios() {
  const [data, setData] = useState<StudioRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    supabase.from("studios").select("*").order("name").then(({ data }) => {
      if (!alive) return;
      setData((data as StudioRow[]) ?? []);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);
  return { studios: data, loading };
}

export type GameLink = { label: string; url: string };

function normalizeLinks(raw: Tables<"games">["links"]): GameLink[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (l): l is GameLink =>
      !!l && typeof l === "object" && "label" in l && "url" in l &&
      typeof (l as GameLink).label === "string" && typeof (l as GameLink).url === "string"
  );
}

function toGameRow(r: Tables<"games"> & { trailer_url?: string | null; screenshots?: string[] | null }): GameRow {
  return {
    ...r,
    trailer_url: r.trailer_url ?? null,
    screenshots: Array.isArray(r.screenshots) ? r.screenshots : [],
    links: normalizeLinks(r.links),
  };
}

export function useGames(studioId?: string) {
  const [data, setData] = useState<GameRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    let q = supabase.from("games").select("*").order("sort_order").order("title");
    if (studioId) q = q.eq("studio_id", studioId);
    q.then(({ data }) => {
      if (!alive) return;
      setData((data ?? []).map(toGameRow));
      setLoading(false);
    });
    return () => { alive = false; };
  }, [studioId]);
  return { games: data, loading };
}

export function useStudio(id?: string) {
  const [data, setData] = useState<StudioRow | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let alive = true;
    supabase.from("studios").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (!alive) return;
      setData(data as StudioRow | null);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [id]);
  return { studio: data, loading };
}

export function useGame(id?: string) {
  const [game, setGame] = useState<GameRow | null>(null);
  const [studio, setStudio] = useState<StudioRow | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let alive = true;
    (async () => {
      const { data: g } = await supabase.from("games").select("*").eq("id", id).maybeSingle();
      if (!alive) return;
      if (!g) { setLoading(false); return; }
      const row = toGameRow(g as Tables<"games">);
      setGame(row);
      const { data: s } = await supabase.from("studios").select("*").eq("id", row.studio_id).maybeSingle();
      if (!alive) return;
      setStudio(s as StudioRow | null);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [id]);
  return { game, studio, loading };
}

/** Upload to studio-assets and return a long-lived signed URL stored in the row. */
export async function uploadStudioAsset(
  studioId: string,
  file: File,
  kind: "logo" | "game" | "screenshot" | "trailer",
  gameId?: string
) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const stamp = Date.now();
  const path =
    kind === "logo" ? `${studioId}/logo-${stamp}.${ext}`
    : kind === "trailer" ? `${studioId}/games/${gameId}-trailer-${stamp}.${ext}`
    : kind === "screenshot" ? `${studioId}/games/${gameId}-shot-${stamp}.${ext}`
    : `${studioId}/games/${gameId}-${stamp}.${ext}`;
  const { error: upErr } = await supabase.storage.from("studio-assets")
    .upload(path, file, { upsert: true, cacheControl: "3600" });
  if (upErr) throw upErr;
  const { data, error } = await supabase.storage.from("studio-assets")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 5); // 5 years
  if (error || !data) throw error ?? new Error("signed url failed");
  return data.signedUrl;
}
