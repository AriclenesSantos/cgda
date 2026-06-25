import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  links: { label: string; url: string }[];
  sort_order: number;
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

export function useGames(studioId?: string) {
  const [data, setData] = useState<GameRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    let q = supabase.from("games").select("*").order("sort_order").order("title");
    if (studioId) q = q.eq("studio_id", studioId);
    q.then(({ data }) => {
      if (!alive) return;
      setData((data as GameRow[]) ?? []);
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

/** Upload to studio-assets and return a long-lived signed URL stored in the row. */
export async function uploadStudioAsset(studioId: string, file: File, kind: "logo" | "game", gameId?: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = kind === "logo"
    ? `${studioId}/logo-${Date.now()}.${ext}`
    : `${studioId}/games/${gameId}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage.from("studio-assets")
    .upload(path, file, { upsert: true, cacheControl: "3600" });
  if (upErr) throw upErr;
  const { data, error } = await supabase.storage.from("studio-assets")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 5); // 5 years
  if (error || !data) throw error ?? new Error("signed url failed");
  return data.signedUrl;
}
