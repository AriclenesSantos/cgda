
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin','studio_owner');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Studios
CREATE TABLE public.studios (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL DEFAULT '',
  location TEXT,
  founded_year INT,
  website TEXT,
  logo_url TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.studios TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.studios TO authenticated;
GRANT ALL ON public.studios TO service_role;
ALTER TABLE public.studios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "studios public read" ON public.studios FOR SELECT USING (true);
CREATE POLICY "studios owner update" ON public.studios FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "studios admin insert" ON public.studios FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "studios admin delete" ON public.studios FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- Games
CREATE TABLE public.games (
  id TEXT PRIMARY KEY,
  studio_id TEXT NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  genre TEXT,
  status TEXT NOT NULL DEFAULT 'Lançado',
  platforms TEXT[] NOT NULL DEFAULT '{}',
  cover_url TEXT,
  links JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX games_studio_idx ON public.games(studio_id);
GRANT SELECT ON public.games TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.games TO authenticated;
GRANT ALL ON public.games TO service_role;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.owns_studio(_studio_id text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.studios WHERE id = _studio_id AND owner_id = auth.uid())
$$;

CREATE POLICY "games public read" ON public.games FOR SELECT USING (true);
CREATE POLICY "games owner insert" ON public.games FOR INSERT TO authenticated
  WITH CHECK (public.owns_studio(studio_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "games owner update" ON public.games FOR UPDATE TO authenticated
  USING (public.owns_studio(studio_id) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.owns_studio(studio_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "games owner delete" ON public.games FOR DELETE TO authenticated
  USING (public.owns_studio(studio_id) OR public.has_role(auth.uid(),'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER studios_touch BEFORE UPDATE ON public.studios FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER games_touch BEFORE UPDATE ON public.games FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Storage policies for studio-assets bucket
-- Path convention: <studio_id>/<filename>
CREATE POLICY "studio-assets public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'studio-assets');
CREATE POLICY "studio-assets owner write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'studio-assets' AND public.owns_studio((storage.foldername(name))[1]));
CREATE POLICY "studio-assets owner update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'studio-assets' AND public.owns_studio((storage.foldername(name))[1]));
CREATE POLICY "studio-assets owner delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'studio-assets' AND public.owns_studio((storage.foldername(name))[1]));
