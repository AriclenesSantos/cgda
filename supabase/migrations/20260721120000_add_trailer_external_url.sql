
-- Adicionar coluna para trailer externo (YouTube, Vimeo, etc)
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS trailer_external_url text;

-- Comentário para documentação
COMMENT ON COLUMN public.games.trailer_external_url IS 'URL externa para o trailer do jogo (ex: YouTube, Vimeo)';
